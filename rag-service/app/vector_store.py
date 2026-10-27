import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

import faiss
import numpy as np

from .config import settings


class FaissVectorStore:
    """Thin wrapper around a FAISS inner-product index with side-loaded metadata."""

    def __init__(self, dim: int | None = None):
        self.dim = dim
        self.index: faiss.Index | None = None
        self.metadata: List[Dict[str, Any]] = []

    def build(self, embeddings: np.ndarray, metadata: List[Dict[str, Any]]) -> None:
        self.dim = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(self.dim)
        self.index.add(embeddings)
        self.metadata = metadata

    def search(self, query_embedding: np.ndarray, top_k: int) -> List[Tuple[Dict[str, Any], float]]:
        if self.index is None:
            raise RuntimeError("Vector store not built or loaded.")
        scores, indices = self.index.search(query_embedding.reshape(1, -1), top_k)
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            results.append((self.metadata[idx], float(score)))
        return results

    def save(self, index_dir: str | None = None) -> None:
        out_dir = Path(index_dir or settings.index_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        faiss.write_index(self.index, str(out_dir / "faiss.index"))
        with (out_dir / "metadata.json").open("w", encoding="utf-8") as f:
            json.dump(self.metadata, f, ensure_ascii=False)

    def load(self, index_dir: str | None = None) -> None:
        in_dir = Path(index_dir or settings.index_dir)
        self.index = faiss.read_index(str(in_dir / "faiss.index"))
        with (in_dir / "metadata.json").open("r", encoding="utf-8") as f:
            self.metadata = json.load(f)
        self.dim = self.index.d
