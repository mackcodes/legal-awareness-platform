"""Diff the official-PDF articles against the PyPI articles (RAG_IMPLEMENTATION_GUIDE.md Phase 2.3).

Writes data/logs/constitution_mismatches.json with `missing_in_pypi`, `missing_in_official` and
`text_differs` (similarity ratio below THRESHOLD). The official text wins in merge_corpus.py;
this report is for reviewing parser misses and for the paper's dataset section.

Usage (from rag-service/), after both ingest scripts have run:
    python scripts/ingest/validate_constitution.py
"""
import difflib
import json
import re
from typing import Dict

from common import PARTS_DIR, SERVICE_DIR

THRESHOLD = 0.9
REPORT = SERVICE_DIR / "data" / "logs" / "constitution_mismatches.json"


def _normalise(text: str) -> str:
    # Insertion brackets and footnote markers are rendering, not content.
    text = re.sub(r"[\[\]*]", " ", text.replace("\xa0", " "))
    return re.sub(r"\s+", " ", text).strip().lower()


def _articles(source: str) -> Dict[str, str]:
    with (PARTS_DIR / f"{source}.json").open(encoding="utf-8") as f:
        items = json.load(f)
    return {i["number"]: i["original_text"] for i in items if i["source_type"] == "article"}


def _sort_key(number: str):
    match = re.match(r"(\d+)(.*)", number)
    return int(match.group(1)), match.group(2)


def main() -> None:
    official = _articles("coi-official")
    pypi = _articles("indianconstitution-pypi")

    differs = []
    for number in sorted(official.keys() & pypi.keys(), key=_sort_key):
        ratio = difflib.SequenceMatcher(None, _normalise(official[number]), _normalise(pypi[number])).ratio()
        if ratio < THRESHOLD:
            differs.append({"article": number, "similarity": round(ratio, 3)})

    report = {
        "official_count": len(official),
        "pypi_count": len(pypi),
        "missing_in_pypi": sorted(official.keys() - pypi.keys(), key=_sort_key),
        "missing_in_official": sorted(pypi.keys() - official.keys(), key=_sort_key),
        "text_differs": sorted(differs, key=lambda d: d["similarity"]),
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    with REPORT.open("w", encoding="utf-8") as f:
        json.dump(report, f, indent=1)
    print(
        f"official {report['official_count']}, pypi {report['pypi_count']}; "
        f"missing in pypi {len(report['missing_in_pypi'])}, missing in official {len(report['missing_in_official'])}, "
        f"text differs {len(differs)} (< {THRESHOLD})\nReport: {REPORT}"
    )


if __name__ == "__main__":
    main()
