from functools import lru_cache
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

from .config import settings


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(settings.embedding_model_name)


def _encode(texts: List[str]) -> np.ndarray:
    model = get_embedding_model()
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    return np.asarray(embeddings, dtype="float32")


# The e5 model family is trained with "passage: " / "query: " prefixes and degrades without them.
def embed_passages(texts: List[str]) -> np.ndarray:
    return _encode([f"passage: {t}" for t in texts])


def embed_query(query: str) -> np.ndarray:
    return _encode([f"query: {query}"])[0]
