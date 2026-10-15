from fastapi import FastAPI
from core_english.router import router as english_router

app = FastAPI(
    title="LearnAI - Python Microservices",
    description="AI backend for Multimodal Math, Speech, Vision, and Motor Skills",
    version="1.0.0"
)
app.include_router(english_router)
