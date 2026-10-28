from functools import lru_cache
from typing import Any, Dict, List

from sentence_transformers import CrossEncoder

from .config import settings


@lru_cache(maxsize=1)
def get_reranker() -> CrossEncoder:
    # Loaded on first use only: the model needs ~2 GB of RAM, and only System D/E requests use it.
    return CrossEncoder(settings.reranker_model_name, max_length=512)


def rerank(query: str, hits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Hits re-ordered by cross-encoder relevance, each scored 0-1 by the reranker."""
    if not hits:
        return []
    scores = get_reranker().predict([(query, h["text"]) for h in hits], show_progress_bar=False)
    ranked = sorted(zip(hits, scores), key=lambda x: x[1], reverse=True)
    return [{**hit, "score": float(score)} for hit, score in ranked]
