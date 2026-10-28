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
# aws-sc (the Supreme Court's own records) outranks the PyPI case list, which has wrong parties and
# years for some cases; PyPI still supplies each case's plain-language holding (`simplified_text`).
PRECEDENCE = ["coi-official", "indiacode", "gazette", "bprd-handbook", "aws-sc", "indianconstitution-pypi", "driti", "app-data"]
_DEVANAGARI = re.compile(r"[ऀ-ॿ]")
# Must equal the IPC's act_or_case_name in app-data (acts.ts fullName) so retrieval can match it.
IPC_ACT = "The Indian Penal Code, 1860"


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


def apply_lay_terms(corpus: List[Dict[str, Any]]) -> int:
    """Attach the everyday terms in data/corpus/lay_terms.json ("FIR" for BNSS s. 173) as
    `lay_terms`. An unknown item ID is an error, so a renamed section cannot silently lose its terms."""
    path = CORPUS_DIR / "lay_terms.json"
    if not path.exists():
        return 0
    with path.open(encoding="utf-8") as f:
        terms = json.load(f)["terms"]
    by_id = {item["id"]: item for item in corpus}
    unknown = sorted(set(terms) - set(by_id))
    if unknown:
        raise ValueError(f"lay_terms.json names items not in the corpus: {unknown}")
    for item_id, words in terms.items():
        by_id[item_id]["lay_terms"] = words
    return len(terms)


def apply_case_links(corpus: List[Dict[str, Any]]) -> int:
    """Apply data/corpus/case_links.json both ways: each judgment's `related_articles` (replacing
    any from the PyPI data) and each linked provision's `related_cases`. Unknown IDs are an error."""
    path = CORPUS_DIR / "case_links.json"
    if not path.exists():
        return 0
    with path.open(encoding="utf-8") as f:
        links = json.load(f)["links"]
    by_id = {item["id"]: item for item in corpus}
    unknown = sorted({i for case, targets in links.items() for i in [case, *targets]} - set(by_id))
    if unknown:
        raise ValueError(f"case_links.json names items not in the corpus: {unknown}")
    for item in corpus:
        if item["source_type"] == "judgment":
            item["related_articles"] = links.get(item["id"], [])
    for case, targets in links.items():
        for target in targets:
            by_id[target].setdefault("related_cases", []).append(case)
    return len(links)


def apply_ipc_mapping(corpus: List[Dict[str, Any]]) -> int:
    """Apply ingest_ipc_bns_mapping.py's output. BNS items get `replaces` and IPC items
    `replaced_by`; IPC sections the BPR&D table lists as deleted get an item saying the BNS has no
    equivalent (or a note, if the IPC section is already in the corpus)."""
    path = CORPUS_DIR / "ipc_bns_mapping.json"
    if not path.exists():
        return 0
    with path.open(encoding="utf-8") as f:
        data = json.load(f)
    mapping = data["mapping"]
    by_id = {item["id"]: item for item in corpus}

    for entry in data["ipc_deleted"]:
        note = (
            f"Section {entry['ipc']} of the Indian Penal Code, 1860 ({entry['title']}) has no corresponding "
            "provision in the Bharatiya Nyaya Sanhita, 2023: the BPR&D Handbook on the Bharatiya Nyaya Sanhita "
            "lists it as deleted in its IPC-BNS comparison table. The IPC itself was repealed by section 358 of "
            "the BNS with effect from 1 July 2024."
        )
        existing = by_id.get(f"ipc-s{entry['ipc']}")
        if existing:
            existing.setdefault("amendment_notes", []).append(note)
            continue
        item = {
            "id": f"ipc-s{entry['ipc']}",
            "source_type": "act_section",
            "title": entry["title"],
            "act_or_case_name": IPC_ACT,
            "act_aliases": ["IPC", "Indian Penal Code", IPC_ACT],
            "number": entry["ipc"],
            "year": "1860",
            "original_text": note,
            "audience_level": "citizen",
            "language": "en",
            "status": "repealed",
            "source_dataset": "bprd-handbook",
        }
        corpus.append(item)
        by_id[item["id"]] = item

    linked = 0
    for entry in mapping:
        bns = by_id.get(f"bns-s{entry['bns']}")
        if not bns:
            continue
        bns["replaces"] = [{"act": IPC_ACT, "number": n} for n in entry["ipc"]]
        linked += 1
        for number in entry["ipc"]:
            ipc = by_id.get(f"ipc-s{number}")
            if ipc:
                ipc.setdefault("replaced_by", []).append(bns["id"])
    return linked


def main() -> None:
    part_files = sorted(PARTS_DIR.glob("*.json"))
    if not part_files:
        raise SystemExit(f"No parts in {PARTS_DIR}. Run the ingest_*.py adapters first.")

    items = []
    for path in part_files:
        with path.open(encoding="utf-8") as f:
            items.extend(json.load(f))

    corpus = merge(items)
    linked = apply_ipc_mapping(corpus)
    with_terms = apply_lay_terms(corpus)
    cases_linked = apply_case_links(corpus)
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
        "bns_sections_linked_to_ipc": linked,
        "items_with_lay_terms": with_terms,
        "judgments_with_links": cases_linked,
        "counts": dict(sorted(counts.items())),
    }

    with (CORPUS_DIR / "full_corpus.json").open("w", encoding="utf-8") as f:
        json.dump(corpus, f, ensure_ascii=False, indent=1)
    with (CORPUS_DIR / "manifest.json").open("w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(json.dumps(manifest, indent=1))


if __name__ == "__main__":
    main()
