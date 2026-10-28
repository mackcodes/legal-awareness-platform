"""Rating sheets (RAG_IMPLEMENTATION_GUIDE.md Phase 10, step 2) from eval/results_raw.jsonl, run 1.

Writes to eval/review/ (the review/ folder next to --raw):
- rating_sheet_all.csv: every run-1 answer of the rated systems, for the LLM judge.
- rating_sheet_human.csv: a blinded sample of the same rows for the human rater, spread evenly over
  categories and systems, so judge-vs-human agreement (Cohen's kappa) can be measured.
- review_key.csv: which system and question each row_id is. Keep it away from the rater.

Rows are shuffled and system names hidden. Raters fill the rating columns and save the file as
eval/review/ratings_<rater>.csv (e.g. ratings_human.csv, ratings_judge.csv), keeping row_id.
Faithfulness is rated only for systems with sources; E-strict only on hallucination and clarity.

Usage (from rag-service/):
    python scripts/eval/make_rating_sheet.py [--sample 120] [--seed 7]
"""
import argparse
import csv
import json
import random
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from app.prompt_builder import number_sources  # noqa: E402

RATED_SYSTEMS = ["A", "A0", "C", "E", "E-strict"]
# The human sample compares the headline systems; E-strict is judged only.
HUMAN_SYSTEMS = ["A", "A0", "C", "E"]
NO_SOURCES = {"A", "A0"}
RATING_FIELDS = ["correctness_1to5", "faithfulness_1to5", "clarity_1to5", "hallucination_flag", "refused_flag", "notes"]
NOT_RATED = "-"


def sheet_row(row_id: str, record: dict, summary: str) -> dict:
    # Numbered as in the RAG prompt, so the answer's [S#] tags point at the right source.
    numbered = number_sources([{**c, "chunk_id": c["item_id"]} for c in record["retrieved_chunks"]])
    sources = "\n\n".join(f"[{s['label']}] " + "\n".join(c["text"] for c in s["chunks"]) for s in numbered)
    row = {
        "row_id": row_id,
        "category": record["category"],
        "query": record["query"],
        "expected_answer_summary": summary,
        "answer": record["answer"],
        "sources": sources if record["system"] not in NO_SOURCES else NOT_RATED,
        **{field: "" for field in RATING_FIELDS},
    }
    if record["system"] in NO_SOURCES:
        row["faithfulness_1to5"] = NOT_RATED
    if record["system"] == "E-strict":
        row["correctness_1to5"] = row["faithfulness_1to5"] = row["refused_flag"] = NOT_RATED
    return row


def write_csv(path: Path, rows: list) -> None:
    with path.open("w", newline="", encoding="utf-8-sig") as f:  # BOM: Excel opens Hindi text correctly
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", type=Path, default=ROOT / "eval" / "results_raw.jsonl")
    parser.add_argument("--sample", type=int, default=120, help="rows in the human sheet")
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()

    summaries = {q["query"]: q["expected_answer_summary"]
                 for q in json.loads((ROOT / "eval" / "gold_queries.json").read_text(encoding="utf-8"))}
    with args.raw.open(encoding="utf-8") as f:
        records = [json.loads(line) for line in f if line.strip()]
    records = [r for r in records if r["success"] and r["run"] == 1 and r["system"] in RATED_SYSTEMS]
    if not records:
        raise SystemExit(f"No successful run-1 answers in {args.raw}.")

    rng = random.Random(args.seed)
    rng.shuffle(records)
    key, rows = [], []
    for index, record in enumerate(records, 1):
        row_id = f"R{index:04d}"
        key.append({"row_id": row_id, "system": record["system"], "run": record["run"], "query": record["query"]})
        rows.append(sheet_row(row_id, record, summaries.get(record["query"], "")))

    # Human sample: round-robin over (category, system) cells so every category and system is covered.
    cells = defaultdict(list)
    for k, row in zip(key, rows):
        if k["system"] in HUMAN_SYSTEMS:
            cells[(row["category"], k["system"])].append(row)
    human = []
    while len(human) < args.sample and any(cells.values()):
        for cell in sorted(cells):
            if cells[cell] and len(human) < args.sample:
                human.append(cells[cell].pop())
    rng.shuffle(human)

    review_dir = args.raw.parent / "review"
    review_dir.mkdir(parents=True, exist_ok=True)
    write_csv(review_dir / "rating_sheet_all.csv", rows)
    write_csv(review_dir / "rating_sheet_human.csv", human)
    write_csv(review_dir / "review_key.csv", key)
    print(f"{len(rows)} rows for the judge, {len(human)} for the human rater, in {review_dir}")


if __name__ == "__main__":
    main()
