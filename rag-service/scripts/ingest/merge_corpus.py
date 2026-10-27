"""Merge data/corpus/parts/*.json into data/corpus/full_corpus.json and manifest.json.

For items sharing an ID, the highest-precedence source supplies every field it has; lower sources
only fill fields it lacks (e.g. app-data's plain-language `simplified_text` on a PyPI article).

Usage (from rag-service/):
    python scripts/ingest/merge_corpus.py
"""
import json
import re
import sys
from collections import Counter
from typing import Any, Dict, List

from common import CORPUS_DIR, PARTS_DIR, SERVICE_DIR

sys.path.append(str(SERVICE_DIR))
from app.config import settings  # noqa: E402

# Most authoritative first.
PRECEDENCE = ["coi-official", "indianconstitution-pypi", "aws-sc", "driti", "app-data"]
_DEVANAGARI = re.compile(r"[ऀ-ॿ]")


def _rank(item: Dict[str, Any]) -> int:
    dataset = item.get("source_dataset")
    if dataset not in PRECEDENCE:
        raise ValueError(f"{item['id']}: unknown source_dataset {dataset!r}")
    return PRECEDENCE.index(dataset)


def merge(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    merged: Dict[str, Dict[str, Any]] = {}
    for item in sorted(items, key=_rank):
        current = merged.setdefault(item["id"], {})
        for key, value in item.items():
            if current.get(key) in (None, "", []):
                current[key] = value
    return list(merged.values())


def check(items: List[Dict[str, Any]]) -> None:
    for item in items:
        if not (item.get("original_text") or item.get("simplified_text")):
            raise ValueError(f"{item['id']}: no text")
        # Legacy-font PDFs yield Latin garbage in place of Hindi; never index it.
        if item.get("language") == "hi" and not _DEVANAGARI.search(item.get("original_text", "")):
            raise ValueError(f"{item['id']}: language 'hi' but no Devanagari characters")


def main() -> None:
    part_files = sorted(PARTS_DIR.glob("*.json"))
    if not part_files:
        raise SystemExit(f"No parts in {PARTS_DIR}. Run the ingest_*.py adapters first.")

    items = []
    for path in part_files:
        with path.open(encoding="utf-8") as f:
            items.extend(json.load(f))

    corpus = merge(items)
    check(corpus)
    for item in corpus:
        item["corpus_version"] = settings.corpus_version

    counts = Counter(
        f"{i['source_dataset']} | {i['source_type']} | {i.get('language', 'en')}" for i in corpus
    )
    manifest = {
        "corpus_version": settings.corpus_version,
        "parts": [p.name for p in part_files],
        "total_items": len(corpus),
        "counts": dict(sorted(counts.items())),
    }

    with (CORPUS_DIR / "full_corpus.json").open("w", encoding="utf-8") as f:
        json.dump(corpus, f, ensure_ascii=False, indent=1)
    with (CORPUS_DIR / "manifest.json").open("w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(json.dumps(manifest, indent=1))


if __name__ == "__main__":
    main()
