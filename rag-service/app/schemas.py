from typing import List, Literal, Optional
from pydantic import BaseModel

from .intent import Intent

AudienceLevel = Literal["school", "citizen", "law_student"]


class ChatRequest(BaseModel):
    question: str
    language: str = "en"
    audience_level: AudienceLevel = "citizen"
    tenant_id: Optional[str] = None
    top_k: Optional[int] = None
    use_safety: bool = True  # False: answer advice-seeking questions instead of refusing
    use_retrieval: bool = True  # False: System A0, the same prompt with no sources
    practical_tips: bool = True  # False: System E-strict, no untagged tips from the model's own knowledge


class Citation(BaseModel):
    source_type: str
    title: str
    number: Optional[str] = None
    act_or_case_name: Optional[str] = None
    label: Optional[str] = None  # "S1": the tag used in the answer text
    item_id: Optional[str] = None
    source_edition: Optional[str] = None  # e.g. "As on 1st May, 2024"
    status: Optional[str] = None  # "active" | "omitted" | "repealed"


class RetrievedChunk(BaseModel):
    chunk_id: str
    text: str
    score: float
    citation: Citation


class ChatResponse(BaseModel):
    success: bool
    answer: str
    citations: List[Citation] = []  # only the sources the answer cites
    retrieved_chunks: List[RetrievedChunk] = []
    intent: Intent = "UNKNOWN"
    latency_ms: int = 0
    error: Optional[str] = None
