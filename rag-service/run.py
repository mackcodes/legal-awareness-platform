"""Entry point to run the RAG FastAPI microservice.

Usage:
    python run.py
"""
import uvicorn
from app.config import settings

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.rag_service_port, reload=True)
