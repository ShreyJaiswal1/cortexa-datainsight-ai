from fastapi import APIRouter, UploadFile, File, Body, Query, Header, HTTPException
from typing import Optional, Annotated
import pandas as pd
import numpy as np
import io, os
from dotenv import load_dotenv

from groq import Groq

load_dotenv()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter()

# ---- In-memory storage ----

df_in_memory: Optional[pd.DataFrame] = None

SESSION_DATA: dict[str, pd.DataFrame] = {}


def _get_df_for_session(session_id: Optional[str]) -> Optional[pd.DataFrame]:
    if session_id and session_id in SESSION_DATA:
        return SESSION_DATA[session_id]
    return globals().get("df_in_memory")


def _set_df_for_session(session_id: Optional[str], df: pd.DataFrame) -> None:
    global df_in_memory
    if session_id:
        SESSION_DATA[session_id] = df
    else:
        df_in_memory = df


@router.post("/upload-data/")
async def upload_data_file(
    file: UploadFile = File(...),
    x_session_id: Optional[str] = Header(None, alias="X-Session-Id"),
):
    try:
        content = await file.read()
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(content))
        elif file.filename.endswith(".json"):
            df = pd.read_json(io.BytesIO(content))
        else:
            raise ValueError("Unsupported file type")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {e}")

    _set_df_for_session(x_session_id, df)

    analysis = df.describe(include="all").fillna("N/A").to_dict()
    return {
        "message": "File processed successfully!",
        "filename": file.filename,
        "analysis_result": analysis,
    }


@router.post("/chat/")
async def chat_with_data(
    payload: dict = Body(...),
    x_session_id: Optional[str] = Header(None, alias="X-Session-Id"),
):
    df = _get_df_for_session(x_session_id)
    if df is None:
        raise HTTPException(status_code=404, detail="No dataset available. Upload a file first.")

    user_text = payload.get("text", "")

    # compact dataset context to guide the model (keeps your flow intact)
    try:
        try:
            desc = df.describe(include=[np.number]).to_string()
        except Exception:
            desc = df.describe(include="all").to_string()

        cols = ", ".join(map(str, df.columns.tolist()[:30]))
        head_preview = df.head(5).to_csv(index=False)

        prompt = (
            "You are a helpful data analysis assistant. "
            "Answer the user's question using ONLY the dataset context provided. "
            "If the answer is not derivable, say you don't have enough information.\n\n"
            f"Columns: {cols}\n"
            f"Describe:\n{desc}\n\n"
            f"Preview (first 5 rows):\n{head_preview}\n\n"
            f"User question: {user_text}"
        )

        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You are a helpful data analysis assistant."},
                {"role": "user", "content": prompt},
            ],
        )

        return {"response": response.choices[0].message.content}
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"response": "Sorry, I encountered an error trying to answer your question."}


@router.get("/histogram/")
async def histogram(
    col: Optional[str] = None,
    bins: int = Query(20, ge=2, le=200),
    x_session_id: Optional[str] = Header(None, alias="X-Session-Id"),
):
    df = _get_df_for_session(x_session_id)
    if df is None:
        raise HTTPException(status_code=404, detail="No dataset in memory. Upload a file first.")

    num = df.select_dtypes(include=[np.number])
    if num.empty:
        raise HTTPException(status_code=400, detail="No numeric columns to plot.")

    numeric_cols = num.columns.tolist()
    column = col if (col and col in numeric_cols) else numeric_cols[0]

    series = num[column].dropna().to_numpy()
    if series.size == 0:
        raise HTTPException(status_code=400, detail=f"No numeric values in column '{column}'.")

    counts, edges = np.histogram(series, bins=bins)
    return {
        "column": str(column),
        "bins": edges.tolist(),
        "counts": counts.tolist(),
        "columns": numeric_cols,
    }
