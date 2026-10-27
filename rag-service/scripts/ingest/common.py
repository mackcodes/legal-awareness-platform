"""Shared paths and helpers for the corpus ingestion adapters (RAG_IMPLEMENTATION_GUIDE.md Phase 2)."""
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

SERVICE_DIR = Path(__file__).resolve().parents[2]
REPO_DIR = SERVICE_DIR.parent
RAW_DIR = SERVICE_DIR / "data" / "raw"
CORPUS_DIR = SERVICE_DIR / "data" / "corpus"
PARTS_DIR = CORPUS_DIR / "parts"


def visual_lines(block: Dict[str, Any], min_size: float = 0.0) -> List[Tuple[float, str]]:
    """(x0, text) per visual line of a PyMuPDF "dict" block, skipping spans smaller than min_size.

    Justified lines come out of PyMuPDF as one "line" per word, so lines sharing a vertical
    position are merged back together. The private-use U+F02A glyph some PDFs use is mapped to "*".
    """
    rows: List[Tuple[float, List[Tuple[float, str]]]] = []
    for line in block.get("lines", []):
        x0, y0 = line["bbox"][0], line["bbox"][1]
        text = "".join(span["text"] for span in line["spans"] if span["size"] >= min_size)
        if rows and abs(rows[-1][0] - y0) < 2:
            rows[-1][1].append((x0, text))
        else:
            rows.append((y0, [(x0, text)]))
    result = []
    for _, words in rows:
        words.sort()
        result.append((words[0][0], " ".join(t.strip() for _, t in words).replace("", "*")))
    return result


def join_lines(lines: List[str]) -> str:
    """Join hard-wrapped lines into one paragraph; a line ending in "-" continues without a space."""
    text = ""
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if not text:
            text = line
        elif text.endswith("-"):
            text += line
        else:
            text += " " + line
    return re.sub(r"\s+", " ", text)


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
