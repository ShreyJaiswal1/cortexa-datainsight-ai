from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import the CORS middleware
from app.api import data, image

# Initialize the FastAPI app
app = FastAPI()

# --- Add the CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:3000", # The origin of your Next.js app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)
# -----------------------------

# Include the routers from your API files
app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(image.router, prefix="/api/image", tags=["image"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Data Bot API"}