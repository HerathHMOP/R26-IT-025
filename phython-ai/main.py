from fastapi import FastAPI
from core_sinhala.router import router as sinhala_router

app = FastAPI(
    title="LearnAI - Python Microservices",
    description="AI backend for Sinhala Learning and Handwriting Recognition",
    version="1.0.0"
)

app.include_router(sinhala_router)