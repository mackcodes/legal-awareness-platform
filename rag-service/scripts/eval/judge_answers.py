"""LLM judge (RAG_IMPLEMENTATION_GUIDE.md Phase 10, step 2): rate every row of
eval/review/rating_sheet_all.csv on the human rubric and write eval/review/ratings_judge.csv.

The judge is the evaluation model itself (Gemini, through app.llm_client at temperature 0). The guide
asks for a non-Gemini judge, since models favour their own outputs; with only a Gemini key that bias is
measured instead, as the judge's kappa against the human ratings (significance.py), and reported.

Rows already in ratings_judge.csv are skipped, so a stopped run resumes.

Usage (from rag-service/, after make_rating_sheet.py):
    python scripts/eval/judge_answers.py [--review-dir eval/review] [--delay 13]
"""
import argparse
import csv
import json
import re
import sys
import time
from pathlib import Path

from run_evaluation import ROOT, with_retries
from make_rating_sheet import NOT_RATED, RATING_FIELDS

from app.llm_client import LlmGenerationError, generate_answer

PROMPT = """You are rating an answer from a legal-information chatbot about Indian law, for a research evaluation.

QUESTION ({category}): {query}

WHAT A GOOD ANSWER DOES: {summary}

SOURCES THE CHATBOT WAS GIVEN (its [S#] tags refer to these, in order; "-" means it had none):
{sources}

ANSWER TO RATE:
{answer}

Rate the answer. Reply with JSON only, no other text:
{{"correctness": 1-5, "faithfulness": 1-5 or null, "clarity": 1-5, "hallucination": true/false, "refused": true/false, "notes": "one short sentence"}}

- correctness: how well it does what a good answer does (5 = fully right, 1 = wrong or misleading).
- faithfulness: only if sources were given. Are the tagged legal statements supported by the sources? Ignore the
  untagged "Practical tips" section. 5 = all supported, 1 = mostly unsupported. null if there are no sources.
- clarity: how clear and well organised it is for an ordinary citizen (5 = very clear).
- hallucination: true if any part, practical tips included, states something false or invented: a wrong section
  or article number, a case that does not exist, a wrong date, punishment or helpline, or a provision that does
  not exist presented as real.
- refused: true if it declines to answer the question (saying it is out of scope, or giving no answer)."""

JSON_OBJECT = re.compile(r"\{.*\}", re.S)


def judge(row: dict) -> dict:
    """The judge's ratings for one row, as rating-sheet values; fields marked "-" in the sheet stay "-"."""
    prompt = PROMPT.format(category=row["category"], query=row["query"], summary=row["expected_answer_summary"],
                           sources=row["sources"], answer=row["answer"])

    def call() -> dict:
        try:
            text = generate_answer(prompt).text
        except LlmGenerationError as exc:
            return {"success": False, "error": str(exc)}
        match = JSON_OBJECT.search(text)
        try:
            return {"success": True, "ratings": json.loads(match.group(0)) if match else None, "raw": text}
        except json.JSONDecodeError:
            return {"success": True, "ratings": None, "raw": text}

    reply = with_retries(call)
    if not reply.get("success"):
        raise LlmGenerationError(reply["error"])
    ratings = reply["ratings"]
    if not isinstance(ratings, dict):
        return {**{f: "" for f in RATING_FIELDS}, "notes": f"UNPARSED: {reply['raw'][:200]}"}
    values = {
        "correctness_1to5": ratings.get("correctness"),
        "faithfulness_1to5": ratings.get("faithfulness"),
        "clarity_1to5": ratings.get("clarity"),
        "hallucination_flag": {True: "yes", False: "no"}.get(ratings.get("hallucination"), ""),
        "refused_flag": {True: "yes", False: "no"}.get(ratings.get("refused"), ""),
        "notes": ratings.get("notes") or "",
    }
    return {f: NOT_RATED if row[f] == NOT_RATED else ("" if values[f] is None else values[f]) for f in RATING_FIELDS}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-dir", type=Path, default=ROOT / "eval" / "review")
    parser.add_argument("--delay", type=float, default=0.0, help="seconds between calls (13 on the free tier)")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    with (args.review_dir / "rating_sheet_all.csv").open(encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    out_path = args.review_dir / "ratings_judge.csv"
    done = set()
    if out_path.exists():
        with out_path.open(encoding="utf-8-sig") as f:
            done = {r["row_id"] for r in csv.DictReader(f)}
    todo = [r for r in rows if r["row_id"] not in done]
    print(f"{len(todo)} rows to judge ({len(done)} already done)", flush=True)

    fields = ["row_id", *RATING_FIELDS]
    with out_path.open("a", newline="", encoding="utf-8-sig" if not done else "utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        if not done:
            writer.writeheader()
        for index, row in enumerate(todo, 1):
            try:
                ratings = judge(row)
            except LlmGenerationError as exc:
                sys.exit(f"Stopped: {exc}. Rerun the same command to resume.")
            writer.writerow({"row_id": row["row_id"], **ratings})
            f.flush()
            print(f"[{index}/{len(todo)}] {row['row_id']} {ratings['correctness_1to5']}/{ratings['clarity_1to5']} "
                  f"halluc={ratings['hallucination_flag']} {row['query'][:50]}", flush=True)
            time.sleep(args.delay)


if __name__ == "__main__":
    main()
