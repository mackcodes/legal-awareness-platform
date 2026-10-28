"""Ingest landmark Supreme Court judgments from the AWS Open Data bucket (RAG_IMPLEMENTATION_GUIDE.md
Phase 2.5).

The bucket (public, no AWS account needed) holds, per year:
  metadata/tar/year=<Y>/metadata.tar   one JSON per judgment: parties, citations, date, headnote
  data/pdf/year=<Y>/english/<path>_EN.pdf

`path` is the Supreme Court Reports citation, e.g. 1978_2_621_776 = [1978] 2 S.C.R. 621-776.

Only the cases in data/corpus/landmark_cases.csv are downloaded. Each case's `parties` regex is
matched against "<petitioner> versus <respondent>" in its year and the years either side; a case must
match exactly one judgment, or the CSV must give its `path`.

The judgment's text in the corpus is the official S.C.R. headnote (catchwords, facts and what was
held), which is everything before the judgment proper begins, capped at _MAX_HEADNOTE characters.
The full judgments run to hundreds of pages of OCR text each and would swamp retrieval; the PDFs stay
in data/raw/judgments/ for later use.

Usage (from rag-service/):
    python scripts/ingest/ingest_landmark_cases.py
"""
import csv
import html
import io
import json
import re
import tarfile
from pathlib import Path
from typing import Any, Dict, List, Optional

import fitz
import requests

from common import CORPUS_DIR, RAW_DIR, join_lines, write_part

BUCKET = "https://indian-supreme-court-judgments.s3.amazonaws.com"
JUDGMENTS_DIR = RAW_DIR / "judgments"

# The headnote ends where the report turns to the proceedings: the jurisdiction line ("ORIGINAL
# JURISDICTION: Writ Petition ..."), the counsel list ("... with him) for the petitioner") or the
# judgment itself. Old reports are OCR text, so the earliest of these is taken.
_JUDGMENT_START = re.compile(
    r"\b(?:[A-Z]+ ){0,2}JURISDICTION ?[:;.,]"
    r"|\bJUDGMENT\b"
    r"|Judgments? (?:of the Court )?(?:was|were) delivered"
    r"|with (?:him|them)\)?[.,]? for the (?:petitioners?|appellants?)\b"
)
# Large benches have headnotes of 100-300k characters (Kesavananda: about 325k), which would swamp
# retrieval. The opening (catchwords, facts and the lead holding) is kept.
_MAX_HEADNOTE = 30_000
_MARGIN_LETTER = re.compile(r"^\s*[A-H]\s*$")  # S.C.R. margin letters, one per line
_RUNNING_HEAD = re.compile(r"(?:S\. ?C\. ?R\. )?SUPREME COURT REPORTS ?(?:[\[(]\d{4}[\])]|\d{1,4})?")
_MIN_HEADNOTE = 400


def _get(url: str, dest: Path) -> Path:
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        response = requests.get(url, timeout=120)
        response.raise_for_status()
        dest.write_bytes(response.content)
    return dest


def _cells(raw_html: str) -> List[str]:
    text = html.unescape(re.sub(r"<[^>]+>", "\x00", raw_html))
    return [c for c in (re.sub(r"\s+", " ", c).strip() for c in text.split("\x00")) if c]


def parse_record(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Parties, citations, date, bench and case number from one metadata JSON."""
    cells = _cells(record["raw_html"])
    if "versus" not in cells:
        return None
    v = cells.index("versus")

    def after(label: str) -> Optional[str]:
        # Labels sometimes carry a leading "| " from the page's markup.
        index = next((i for i, c in enumerate(cells[:-1]) if c.lstrip("| ") == label), None)
        return cells[index + 1] if index is not None else None

    scr = next((c for c in cells[v:v + 6] if "S.C.R." in c), None)
    return {
        "path": record["path"],
        "year": record["citation_year"],
        "parties": f"{cells[v - 1]} versus {cells[v + 1]}",
        "scr_citation": scr,
        "neutral_citation": record.get("nc_display"),
        "decision_date": after("Decision Date :"),
        "case_number": after("Case No :"),
        "bench": after("Bench :"),
    }


def year_records(year: int) -> List[Dict[str, Any]]:
    if not 1950 <= year <= 2025:  # the years the bucket covers
        return []
    tar_path = _get(f"{BUCKET}/metadata/tar/year={year}/metadata.tar", JUDGMENTS_DIR / "metadata" / f"{year}.tar")
    records = []
    with tarfile.open(tar_path) as tar:
        for member in tar.getmembers():
            if member.isfile() and member.name.endswith(".json"):
                parsed = parse_record(json.load(io.TextIOWrapper(tar.extractfile(member), encoding="utf-8")))
                if parsed:
                    records.append(parsed)
    return records


def headnote(pdf: Path) -> str:
    lines = [
        line for page in fitz.open(pdf) for line in page.get_text().splitlines() if not _MARGIN_LETTER.match(line)
    ]
    text = _RUNNING_HEAD.sub(" ", join_lines(lines))
    match = _JUDGMENT_START.search(text, _MIN_HEADNOTE)
    if not match:
        raise ValueError(f"{pdf.name}: no start of judgment found")
    note = re.sub(r"\s+", " ", text[: match.start()]).strip()
    if len(note) > _MAX_HEADNOTE:
        note = note[:_MAX_HEADNOTE].rsplit(". ", 1)[0] + ". [Headnote continues in the full report.]"
    return note


def main() -> None:
    with (CORPUS_DIR / "landmark_cases.csv").open(encoding="utf-8") as f:
        cases = list(csv.DictReader(f))

    by_year: Dict[int, List[Dict[str, Any]]] = {}
    items, problems = [], []
    for case in cases:
        year = int(case["year"])
        candidates = []
        for y in (year - 1, year, year + 1):
            if y not in by_year:
                by_year[y] = year_records(y)
            if case["path"]:
                candidates += [r for r in by_year[y] if r["path"] == case["path"]]
            else:
                candidates += [r for r in by_year[y] if re.search(case["parties"], r["parties"], re.I)]
        # A judgment is listed under both its decision year and its report year.
        candidates = list({r["path"]: r for r in candidates}.values())
        if len(candidates) != 1:
            lines = [f"   {r['path']} | {r['decision_date']} | {r['parties']} | {r['scr_citation']}" for r in candidates[:15]]
            problems.append("\n".join([f"{case['case_id']}: {len(candidates)} matches; set `path` in landmark_cases.csv"] + lines))
            continue
        record = candidates[0]
        pdf = _get(
            f"{BUCKET}/data/pdf/year={record['year']}/english/{record['path']}_EN.pdf",
            JUDGMENTS_DIR / "pdf" / f"{record['path']}_EN.pdf",
        )
        try:
            text = headnote(pdf)
        except ValueError as exc:
            problems.append(f"{case['case_id']}: {exc}")
            continue
        items.append({
            "id": case["case_id"],
            "source_type": "judgment",
            "title": case["case_name"],
            "act_or_case_name": case["case_name"],
            "number": None,
            "decision_year": (record["decision_date"] or record["year"])[-4:],
            "citation": record["scr_citation"] or record["neutral_citation"],
            "scr_citation": record["scr_citation"],
            "neutral_citation": record["neutral_citation"],
            "decision_date": record["decision_date"],
            "case_number": record["case_number"],
            "bench": record["bench"],
            "original_text": text,
            "audience_level": "citizen",
            "language": "en",
            "status": "active",
            "source_dataset": "aws-sc",
            "source_edition": "Supreme Court Reports headnote",
            "source_file": record["path"],
        })
        print(f"{case['case_id']}: {record['parties']} | {record['scr_citation']} | {len(items[-1]['original_text'])} chars")

    for problem in problems:
        print("\n" + problem)
    if problems:
        raise SystemExit(f"{len(problems)} case(s) unresolved; nothing written")
    write_part("aws-sc", items)


if __name__ == "__main__":
    main()
