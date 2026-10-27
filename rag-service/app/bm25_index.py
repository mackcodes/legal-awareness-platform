import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

from rank_bm25 import BM25Okapi

from .config import settings


def _tokenize(text: str) -> List[str]:
    # \w alone splits Devanagari words at vowel signs (they are not alphanumeric), so add the block.
    return re.findall(r"[\wऀ-ॿ]+", text.lower())


class Bm25Index:
    """Sparse keyword index used for exact matches (e.g. 'Article 21', 'Section 420')."""

    def __init__(self):
        self.bm25: BM25Okapi | None = None
        self.metadata: List[Dict[str, Any]] = []

    def build(self, chunk_records: List[Dict[str, Any]]) -> None:
        self.metadata = chunk_records
        tokenized = [_tokenize(c["text"]) for c in chunk_records]
        self.bm25 = BM25Okapi(tokenized)

    def search(self, query: str, top_k: int) -> List[Tuple[Dict[str, Any], float]]:
        if self.bm25 is None:
            raise RuntimeError("BM25 index not built or loaded.")
        scores = self.bm25.get_scores(_tokenize(query))
        ranked = sorted(zip(self.metadata, scores), key=lambda x: x[1], reverse=True)
        return [(m, float(s)) for m, s in ranked[:top_k]]

    def save(self, index_dir: str | None = None) -> None:
        out_dir = Path(index_dir or settings.index_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        with (out_dir / "bm25_metadata.json").open("w", encoding="utf-8") as f:
            json.dump(self.metadata, f, ensure_ascii=False)

    def load(self, index_dir: str | None = None) -> None:
        in_dir = Path(index_dir or settings.index_dir)
        with (in_dir / "bm25_metadata.json").open("r", encoding="utf-8") as f:
            self.metadata = json.load(f)
        tokenized = [_tokenize(c["text"]) for c in self.metadata]
        self.bm25 = BM25Okapi(tokenized)
