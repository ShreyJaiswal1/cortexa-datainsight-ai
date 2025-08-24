from fastapi import APIRouter, UploadFile, File, Body
from typing import Annotated
import pandas as pd
import io
import os
from dotenv import load_dotenv

# ✅ Groq client
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter()
df_in_memory = None

@router.post("/upload-data/")
async def upload_data_file(file: Annotated[UploadFile, File(...)]):
    global df_in_memory
    try:
        file_content = await file.read()
        file_stream = io.BytesIO(file_content)
        filename = file.filename.lower()

        # Detect file type and load with pandas
        if filename.endswith(".csv"):
            df = pd.read_csv(file_stream)
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file_stream)
        elif filename.endswith(".json"):
            df = pd.read_json(file_stream)
        elif filename.endswith(".parquet"):
            df = pd.read_parquet(file_stream)
        else:
            return {"message": "Unsupported file type."}

        df_in_memory = df
        analysis = df.describe().fillna("N/A").to_dict()

        return {
            "message": "File processed successfully!",
            "filename": file.filename,
            "analysis_result": analysis
        }
    except Exception as e:
        return {"message": f"An error occurred: {str(e)}"}

@router.post("/chat/")
async def chat_with_data(payload: dict = Body(...)):
    global df_in_memory
    user_question = payload.get("text")

    if not user_question:
        return {"response": "No question provided."}
    if df_in_memory is None:
        return {"response": "Please upload a data file first."}

    try:
        data_string = df_in_memory.to_string()
        prompt = f"""
You are a data analysis assistant. A user has uploaded a dataset and has a question about it.

Dataset:
---
{data_string}
---

User's question:
"{user_question}"

Please provide a clear and concise answer based only on the dataset.
"""

        # ✅ Use Groq’s OpenAI-compatible API
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",  # or another Groq-supported model
            messages=[
                {"role": "system", "content": "You are a helpful data analysis assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        print(f"Chat Error: {e}")
        return {"response": "Sorry, I encountered an error trying to answer your question."}
