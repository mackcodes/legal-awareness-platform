"""Extract the IPC -> BNS section correspondence from BPR&D's "Handbook on the Bharatiya Nyaya
Sanhita, 2023" (Bureau of Police Research & Development, Ministry of Home Affairs), stored in
data/raw/acts/ipc_bns_mapping/.

The handbook ends each chapter with a two-column comparison table, IPC on the left and BNS on
the right, one provision per row:

    304B. Dowry death              80. Dowry death
    499. Defamation.               356(1).
    309. Attempt to commit suicide Deleted
    New Section                    111. Organised crime

A row is a numbered IPC entry (or "New Section") in the left column with a BNS number,
"Deleted" or "Repealed" in the right column, between the top of the IPC cell and the next IPC
entry (BNS cells are sometimes vertically centred against a wrapped IPC cell). The handbook's
footnotes also cite IPC sources, but their numbering is offset on some pages, so only the tables
are used.

The columns drift out of line in a few places, so a pair is kept only if the IPC title in the
table are found in the official BNS section's title and text (data/corpus/parts/bns.json; run
ingest_acts.py first). Rejected pairs are written to the review list, not the corpus: a missing
mapping is harmless, a wrong one would cite the wrong law.

Writes data/corpus/ipc_bns_mapping.json, which merge_corpus.py applies to the BNS sections.

Usage (from rag-service/):
    python scripts/ingest/ingest_ipc_bns_mapping.py
"""
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

import fitz

from common import CORPUS_DIR, PARTS_DIR, RAW_DIR

PDF_DIR = RAW_DIR / "acts" / "ipc_bns_mapping"
OUTPUT = CORPUS_DIR / "ipc_bns_mapping.json"

LEFT_MAX_X = 200  # IPC column starts at x~75
RIGHT_MIN_X = 230  # BNS column starts at x~245
ROW_TOLERANCE = 6  # a BNS cell may start this far above its IPC cell (never above the previous row)
MAX_ROW_HEIGHT = 40  # no row is taller than this
MIN_TITLE_SIMILARITY = 0.6

_IPC_ENTRY = re.compile(r"^(\d{1,3}[A-Z]{0,2})\.\s*(.*)$|^(New Section)")
_BNS_ENTRY = re.compile(r"^(\d{1,3}(?:\([^)]*\))*(?:\s*(?:,|and)\s*\d{1,3}(?:\([^)]*\))*)*)|^(Deleted|Repealed)")


def find_pdf() -> Path:
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if len(pdfs) != 1:
        raise SystemExit(f"Expected exactly one PDF in {PDF_DIR}, found {len(pdfs)}.")
    return pdfs[0]


def _cells(page: fitz.Page) -> Tuple[List[Tuple[float, str]], List[Tuple[float, str]]]:
    """(y, text) of every line in the left and right columns."""
    left, right = [], []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            text = "".join(s["text"] for s in line["spans"]).replace("\xa0", " ").strip()
            if not text:
                continue
            x0, y0 = line["bbox"][0], line["bbox"][1]
            if x0 < LEFT_MAX_X:
                left.append((y0, text))
            elif x0 >= RIGHT_MIN_X:
                right.append((y0, text))
    return left, right


def _bns_numbers(cell: str) -> List[str]:
    """Section numbers in a BNS cell such as "351(2) and 351(3)." (sub-sections dropped)."""
    numbers = []
    for number in re.findall(r"\d{1,3}", re.sub(r"\([^)]*\)", "", cell)):
        if number not in numbers:
            numbers.append(number)
    return numbers


def extract_rows(pdf: Path) -> List[Tuple[str, str]]:
    """(IPC cell, BNS cell) first lines for every comparison-table row in the handbook."""
    rows = []
    for page in fitz.open(pdf):
        left, right = _cells(page)
        entries = sorted((y, text) for y, text in left if _IPC_ENTRY.match(text))
        for index, (y, ipc) in enumerate(entries):
            prev_y = entries[index - 1][0] if index else y - MAX_ROW_HEIGHT
            next_y = entries[index + 1][0] if index + 1 < len(entries) else y + MAX_ROW_HEIGHT
            top = max(prev_y + 1, y - ROW_TOLERANCE)
            bottom = min(next_y - ROW_TOLERANCE, y + MAX_ROW_HEIGHT)
            cell = next(
                (bns for ry, bns in sorted(right) if top <= ry < bottom and _BNS_ENTRY.match(bns)),
                None,
            )
            if cell:
                rows.append((ipc, cell))
    return rows


_STOPWORDS = set(
    "a an and any as at be by for from has his her in is it its of on or other than that the their "
    "to under which who whom with".split()
)


def title_overlap(ipc_title: str, bns_text: str, stem: bool = True) -> float:
    """Share of the IPC title's content words found in the BNS section's title and text. The
    tables truncate long titles ("Act of a person incapable of") and BNS titles are often umbrella
    titles ("Cheating" for IPC 420's "Cheating and dishonestly inducing delivery of property"),
    so word containment works where comparing titles fails."""
    def words(text: str) -> set:
        # First five letters as a crude stem: "punishment" in an IPC title matches "punished".
        found = [w for w in re.findall(r"[a-z]+", text.lower()) if w not in _STOPWORDS]
        return {w[:5] for w in found} if stem else set(found)

    ipc_words = words(ipc_title)
    if not ipc_words:
        return 0.0
    return len(ipc_words & words(bns_text)) / len(ipc_words)


def build_mapping(
    rows: List[Tuple[str, str]], bns_texts: Dict[str, str]
) -> Tuple[List[Dict], List[Dict[str, str]], List[Dict]]:
    """BNS section -> IPC sections it replaces, the IPC sections deleted outright, and the pairs
    rejected because the IPC title's words are not found in the BNS section's title and text."""
    by_bns: Dict[str, List[str]] = {}
    deleted: List[Dict[str, str]] = []
    rejected: List[Dict] = []
    for ipc_cell, bns_cell in rows:
        ipc_match = _IPC_ENTRY.match(ipc_cell)
        ipc = ipc_match.group(1)  # None for "New Section"
        bns = _BNS_ENTRY.match(bns_cell)
        if bns.group(2):  # Deleted / Repealed
            if ipc and all(d["ipc"] != ipc for d in deleted):
                deleted.append({"ipc": ipc, "title": ipc_match.group(2).strip(" .")})
            continue
        if not ipc:
            continue
        for number in _bns_numbers(bns.group(1)):
            similarity = title_overlap(ipc_match.group(2), bns_texts.get(number, ""))
            # Definitions (BNS s. 2) and general explanations (s. 3) gather many differently
            # titled IPC sections, so titles cannot confirm those rows.
            if number not in ("2", "3") and similarity < MIN_TITLE_SIMILARITY:
                rejected.append({"ipc": ipc_cell, "bns_cell": bns_cell, "bns": number,
                                 "bns_text": bns_texts.get(number, "")[:120], "similarity": round(similarity, 2)})
                continue
            sections = by_bns.setdefault(number, [])
            if ipc not in sections:
                sections.append(ipc)
    mapping = [{"bns": bns, "ipc": ipc} for bns, ipc in sorted(by_bns.items(), key=lambda kv: int(kv[0]))]
    return mapping, deleted, rejected


def load_bns() -> List[Dict]:
    path = PARTS_DIR / "bns.json"
    if not path.exists():
        raise SystemExit(f"{path} not found; run ingest_acts.py first.")
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def check_deleted(deleted: List[Dict[str, str]], bns_titles: Dict[str, str]) -> Tuple[List[Dict], List[Dict]]:
    """Split "deleted" IPC sections into confirmed ones and ones whose title matches a BNS section
    title, which suggests a misaligned row (the handbook prints "Deleted" against IPC 376E, whose
    offence is BNS 71). Entries titled just "Repealed" were repealed before the BNS and are dropped."""
    confirmed, suspicious = [], []
    for entry in deleted:
        if entry["title"].lower().startswith("repealed"):
            continue
        # Whole words: a stem would match "Adultery" to "Adulteration".
        match = next(
            (n for n, t in bns_titles.items() if title_overlap(entry["title"], t, stem=False) >= 0.8), None
        )
        if match:
            suspicious.append({**entry, "reason": f"title matches BNS {match} ({bns_titles[match]})"})
        else:
            confirmed.append(entry)
    return confirmed, suspicious


def main() -> None:
    rows = extract_rows(find_pdf())
    bns = load_bns()
    texts = {item["number"]: f'{item["title"]} {item["original_text"]}' for item in bns}
    mapping, deleted, rejected = build_mapping(rows, texts)
    deleted, suspicious = check_deleted(deleted, {item["number"]: item["title"] for item in bns})
    rejected.extend({"deleted_row": entry} for entry in suspicious)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump({"mapping": mapping, "ipc_deleted": deleted, "rejected_for_review": rejected},
                  f, ensure_ascii=False, indent=1)
    print(
        f"{len(rows)} table rows; {len(mapping)} BNS sections mapped to IPC; "
        f"{len(deleted)} IPC sections deleted; {len(rejected)} pairs rejected for review. Wrote {OUTPUT}"
    )


if __name__ == "__main__":
    main()
