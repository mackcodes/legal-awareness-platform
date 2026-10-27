from typing import List, Literal, Optional
from pydantic import BaseModel


AudienceLevel = Literal["school", "citizen", "law_student"]
Intent = Literal["DEFINE", "EXPLAIN", "WHY", "EXAMPLE", "CASE", "FUN", "LAW", "KIDS", "UNKNOWN"]


class ChatRequest(BaseModel):
    question: str
    language: str = "en"
    audience_level: AudienceLevel = "citizen"
    tenant_id: Optional[str] = None
    top_k: Optional[int] = None


class Citation(BaseModel):
    source_type: str
    title: str
    number: Optional[str] = None
    act_or_case_name: Optional[str] = None


class RetrievedChunk(BaseModel):
    chunk_id: str
    text: str
    score: float
    citation: Citation


class ChatResponse(BaseModel):
    success: bool
    answer: str
    citations: List[Citation] = []
    retrieved_chunks: List[RetrievedChunk] = []
    intent: Intent = "UNKNOWN"
    latency_ms: int = 0
    error: Optional[str] = None
