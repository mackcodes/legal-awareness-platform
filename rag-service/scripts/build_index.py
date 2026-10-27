"""Builds the FAISS + BM25 indexes from the unified corpus file.

Usage (from rag-service/ directory):
    python scripts/build_index.py
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.bm25_index import Bm25Index  # noqa: E402
from app.chunking import chunk_corpus_item  # noqa: E402
from app.config import settings  # noqa: E402
from app.corpus_loader import load_corpus  # noqa: E402
from app.embeddings import embed_passages  # noqa: E402
from app.vector_store import FaissVectorStore  # noqa: E402


def main() -> None:
    print(f"Loading corpus from {settings.corpus_path} ...")
    corpus = load_corpus()

    chunk_records = []
    for item in corpus:
        chunk_records.extend(chunk_corpus_item(item))

    print(f"Produced {len(chunk_records)} chunks from {len(corpus)} corpus items.")

    texts = [c["text"] for c in chunk_records]
    print("Computing embeddings ...")
    embeddings = embed_passages(texts)

    print("Building FAISS index ...")
    vector_store = FaissVectorStore()
    vector_store.build(embeddings, chunk_records)
    vector_store.save()

    print("Building BM25 index ...")
    bm25_index = Bm25Index()
    bm25_index.build(chunk_records)
    bm25_index.save()

    print(f"Indexes saved to {settings.index_dir}")


if __name__ == "__main__":
    main()
