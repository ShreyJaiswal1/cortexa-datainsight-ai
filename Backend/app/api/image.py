from fastapi import APIRouter, UploadFile, File
from typing import Annotated
from PIL import Image
import io
import os
from dotenv import load_dotenv

# ✅ New Google GenAI SDK
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Instantiate client with API key
genai_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter()

@router.post("/detect-object/")
async def detect_object(file: Annotated[UploadFile, File(...)]):
    try:
        # Read the image file into memory
        file_content = await file.read()
        image = Image.open(io.BytesIO(file_content))

        # Convert PIL image -> bytes (since client expects raw bytes or path)
        img_bytes_io = io.BytesIO()
        image.save(img_bytes_io, format="PNG")
        img_bytes = img_bytes_io.getvalue()

        # Call Gemini Vision model (2.5 flash is newer and faster)
        response = genai_client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                "Describe this image in summary.",
                types.Part.from_bytes(data=img_bytes, mime_type="image/png")
            ]
        )

        return {
            "message": "Image analyzed successfully!",
            "detection_result": response.text
        }

    except Exception as e:
        print(f"!!! AN ERROR OCCURRED: {e} !!!")
        return {
            "message": f"An error occurred: {str(e)}",
            "detection_result": "Sorry, I couldn't process the image with the AI model."
        }
