"""Ingest the `indianconstitution` PyPI package (RAG_IMPLEMENTATION_GUIDE.md Phase 2.2).

Emits the 465 articles (article 0 -> the Preamble) and the 17 landmark cases in case_law.json.
Case holdings go in `simplified_text` only, so full judgment text from a later source can supply
`original_text` without a precedence clash in merge_corpus.py.

Usage (from rag-service/):
    python scripts/ingest/ingest_constitution_pypi.py
"""
import json
import re
from importlib.resources import files
from typing import Any, Dict, List

from common import write_part

SOURCE = "indianconstitution-pypi"
_OMITTED = re.compile(r"^(\[[^\]]*\]\s*)?(Rep\.|Omitted) by\b")
_AMENDMENT_ACT = re.compile(r"Constitution \([^)]+\) Act, \d{4}")


def clean_text(text: str) -> str:
    """Undo the package's extraction noise: U+FFFD in place of em dashes, NBSP-only blank lines."""
    text = text.replace("�", "—").replace("\xa0", " ")
    text = re.sub(r"\s*\n\s*", "\n", text)
    return re.sub(r"[ \t]+", " ", text).strip()


def _load(name: str) -> List[Dict[str, Any]]:
    return json.loads(files("indianconstitution").joinpath("data", name).read_text(encoding="utf-8"))


def article_items() -> List[Dict[str, Any]]:
    items = []
    for record in _load("constitution.json"):
        number = str(record["article"]).replace(" ", "")  # "239 A A" -> "239AA"
        text = clean_text(record["description"])
        base = {
            "act_or_case_name": "Constitution of India",
            "year": "1950",
            "original_text": text,
            "audience_level": "citizen",
            "language": "en",
            "source_dataset": SOURCE,
        }
        if number == "0":
            items.append({**base, "id": "const-preamble", "source_type": "preamble", "title": "Preamble", "number": None})
            continue

        omitted = bool(_OMITTED.match(text))
        items.append(
            {
                **base,
                "id": f"const-art-{number}",
                "source_type": "article",
                "title": record["title"],
                "number": number,
                "status": "omitted" if omitted else "active",
                "amended_by": _AMENDMENT_ACT.findall(text) if omitted else [],
            }
        )
    return items


def case_id(case: Dict[str, Any]) -> str:
    first_party = case["case_name"].split(" v. ")[0]
    slug = re.sub(r"[^a-z0-9]+", "-", first_party.lower()).strip("-")
    return f"sc-{case['year']}-{slug}"


def judgment_items() -> List[Dict[str, Any]]:
    return [
        {
            "id": case_id(case),
            "source_type": "judgment",
            "title": case["case_name"],
            "act_or_case_name": case["case_name"],
            "number": None,
            "decision_year": str(case["year"]),
            "citation": case.get("citation"),
            "simplified_text": f"{case['holding']} Bench: {case['bench']}." if case.get("bench") else case["holding"],
            "related_articles": [f"const-art-{case['article_number']}"],
            "audience_level": "citizen",
            "language": "en",
            "status": "active",
            "source_dataset": SOURCE,
        }
        for case in _load("case_law.json")
    ]


def main() -> None:
    write_part(SOURCE, article_items() + judgment_items())


if __name__ == "__main__":
    main()
