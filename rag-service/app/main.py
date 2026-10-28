import hmac
import re
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Header, HTTPException

from .bm25_index import Bm25Index
from .config import settings
from .intent import classify_intent
from .llm_client import LlmGenerationError, generate_answer
from .logging_store import log_query
from .prompt_builder import build_grounded_prompt
from .retrieval import HybridRetriever
from .schemas import ChatRequest, ChatResponse, Citation, RetrievedChunk
from .vector_store import FaissVectorStore

_vector_store = FaissVectorStore()
_bm25_index = Bm25Index()
_retriever: HybridRetriever | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Load prebuilt FAISS + BM25 indexes created by scripts/build_index.py."""
    global _retriever
    try:
        _vector_store.load()
        _bm25_index.load()
        _retriever = HybridRetriever(_vector_store, _bm25_index)
    except FileNotFoundError:
        # Indexes not built yet; /chat will return a clear error until
        # `python scripts/build_index.py` has been run.
        _retriever = None
    yield


# No CORS middleware: browsers never call this service directly. The Next.js server route
# (app/api/rag-chat) calls it and authenticates with the shared secret.
app = FastAPI(title="Legal Awareness RAG Service", version="0.1.0", lifespan=lifespan)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "index_loaded": _retriever is not None}


_TAG = re.compile(r"\[(S\d+(?:\s*,\s*S?\d+)*)\]")

LEGAL_AID_NOTE = """

---
**This is general legal information, not advice on your case.** What applies to you depends on the full facts. For free legal help:
- **NALSA legal aid helpline: 15100** (National Legal Services Authority)
- Your **District Legal Services Authority (DLSA)** offers free legal aid, including a lawyer, to eligible people such as women, children, SC/ST members, and people with low income."""

HARMFUL_REFUSAL = """## I can't help with that

I can't help with avoiding the law, hiding or destroying evidence, forging documents, or bribery.

I can explain what the law says, for example your rights if you are arrested, or what the offence and its punishment are. If you are in legal trouble, free legal aid is available: **NALSA helpline 15100**, or your **District Legal Services Authority**.

*This is legal information for awareness purposes, not legal advice.*"""


def _citation(meta: dict, label: str | None = None) -> Citation:
    return Citation(
        source_type=meta.get("source_type", "unknown"),
        title=meta.get("title", ""),
        number=meta.get("number"),
        act_or_case_name=meta.get("act_or_case_name"),
        label=label,
        item_id=meta.get("item_id"),
        source_edition=meta.get("source_edition"),
        status=meta.get("status"),
    )


def cited_labels(answer: str) -> list[str]:
    """Source labels tagged in the answer ("[S1]", "[S1][S3]", "[S1, S3]"), in first-use order."""
    labels: list[str] = []
    for group in _TAG.findall(answer):
        for number in re.findall(r"\d+", group):
            if f"S{number}" not in labels:
                labels.append(f"S{number}")
    return labels


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, x_rag_secret: str | None = Header(default=None)) -> ChatResponse:
    # Once RAG_SHARED_SECRET is set (always in deployment), only callers holding it may use the
    # service, so nobody else can spend the Gemini quota. Unset, e.g. for local development, it is open.
    if settings.rag_shared_secret and not hmac.compare_digest(x_rag_secret or "", settings.rag_shared_secret):
        raise HTTPException(status_code=401, detail="Missing or invalid X-RAG-Secret header.")
    start = time.perf_counter()

    if _retriever is None:
        return ChatResponse(
            success=False,
            answer="",
            error="RAG index not built yet. Run scripts/build_index.py first.",
        )

    intent = classify_intent(request.question)
    top_k = request.top_k or settings.top_k
    record = {
        "question": request.question,
        "tenant_id": request.tenant_id,
        "audience_level": request.audience_level,
        "intent": intent,
        "top_k": top_k,
        "use_safety": request.use_safety,
        "use_retrieval": request.use_retrieval,
        "use_dense": request.use_dense,
        "use_sparse": request.use_sparse,
        "use_reranker": request.use_reranker,
        "use_case_links": request.use_case_links,
        "practical_tips": request.practical_tips,
        "corpus_version": settings.corpus_version,
    }

    # Requests for help breaking the law are refused outright.
    if request.use_safety and intent == "HARMFUL":
        latency_ms = int((time.perf_counter() - start) * 1000)
        log_query({**record, "answer": HARMFUL_REFUSAL, "refused": True, "success": True, "latency_ms": latency_ms})
        return ChatResponse(success=True, answer=HARMFUL_REFUSAL, intent=intent, latency_ms=latency_ms)

    # Questions about the user's own situation get the general law, never a recommendation or a
    # prediction, followed by a fixed legal-aid referral (appended here, not left to the model).
    personal_situation = request.use_safety and intent == "ADVICE"
    record["personal_situation"] = personal_situation

    retrieved = (
        _retriever.retrieve(
            request.question,
            top_k=top_k,
            use_case_links=request.use_case_links,
            use_dense=request.use_dense,
            use_sparse=request.use_sparse,
            use_reranker=request.use_reranker,
        )
        if request.use_retrieval
        else []
    )
    prompt, sources = build_grounded_prompt(
        question=request.question,
        retrieved_chunks=retrieved,
        audience_level=request.audience_level,
        personal_situation=personal_situation,
        practical_tips=request.practical_tips,
    )

    generation = None
    error = None
    try:
        generation = generate_answer(prompt)
    except LlmGenerationError as exc:
        error = str(exc)
    answer = generation.text if generation else ""
    if generation and personal_situation:
        answer += LEGAL_AID_NOTE

    # Citations are only the sources the answer actually tags; tags naming no source are logged,
    # since they are fabricated citations.
    by_label = {s["label"]: s for s in sources}
    labels = cited_labels(answer)
    cited = [by_label[label] for label in labels if label in by_label]
    citations = [_citation(s["meta"], s["label"]) for s in cited]
    retrieved_chunks = [
        RetrievedChunk(chunk_id=c["chunk_id"], text=c["text"], score=c["score"], citation=_citation(c))
        for c in retrieved
    ]

    latency_ms = int((time.perf_counter() - start) * 1000)
    log_query(
        {
            **record,
            "answer": answer,
            "refused": False,
            "success": generation is not None,
            "error": error,
            "latency_ms": latency_ms,
            "retrieved_chunk_ids": [c["chunk_id"] for c in retrieved],
            "retrieved_item_ids": [s["item_id"] for s in sources],
            "cited_item_ids": [s["item_id"] for s in cited],
            "invalid_citation_labels": [label for label in labels if label not in by_label],
            "model_version": generation.model_version if generation else None,
            "prompt_tokens": generation.prompt_tokens if generation else None,
            "output_tokens": generation.output_tokens if generation else None,
        }
    )

    return ChatResponse(
        success=generation is not None,
        answer=answer,
        citations=citations,
        retrieved_chunks=retrieved_chunks,
        intent=intent,
        latency_ms=latency_ms,
        error=error,
    )
