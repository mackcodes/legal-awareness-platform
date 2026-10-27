"""Shared paths and helpers for the corpus ingestion adapters (RAG_IMPLEMENTATION_GUIDE.md Phase 2)."""
import json
from pathlib import Path
from typing import Any, Dict, List

SERVICE_DIR = Path(__file__).resolve().parents[2]
REPO_DIR = SERVICE_DIR.parent
RAW_DIR = SERVICE_DIR / "data" / "raw"
CORPUS_DIR = SERVICE_DIR / "data" / "corpus"
PARTS_DIR = CORPUS_DIR / "parts"


def write_part(source: str, items: List[Dict[str, Any]]) -> None:
    """Write one adapter's output to data/corpus/parts/<source>.json, refusing duplicate IDs."""
    ids = [item["id"] for item in items]
    duplicates = {i for i in ids if ids.count(i) > 1}
    if duplicates:
        raise ValueError(f"{source}: duplicate ids {sorted(duplicates)[:10]}")

    PARTS_DIR.mkdir(parents=True, exist_ok=True)
    path = PARTS_DIR / f"{source}.json"
    with path.open("w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    print(f"{source}: wrote {len(items)} items to {path}")
