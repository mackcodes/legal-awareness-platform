"""Paired significance tests (RAG_IMPLEMENTATION_GUIDE.md Phase 10, step 3) and rater agreement.

Every system answers the same questions, so systems are compared question by question on run 1
(the rated run):
- McNemar's exact test for binary outcomes: the expected source retrieved, all expected sources
  cited, over-refusal, and from the ratings correct (4-5 of 5) and hallucination.
- Wilcoxon signed-rank for the 1-5 ratings.
- Cohen's kappa between the human and the judge on the rows both rated (quadratic-weighted for
  1-5 ratings), which says whether the judge's ratings can be trusted.

Writes eval/significance.csv and eval/agreement.csv.

Usage (from rag-service/):
    python scripts/eval/significance.py [--eval-dir eval] [--rater judge]
"""
import argparse
import csv
from pathlib import Path
from typing import Callable, Dict, List, Optional

from scipy.stats import binomtest, wilcoxon
from sklearn.metrics import cohen_kappa_score

from build_master_table import ROOT, Scores, load_automatic, load_ratings

PAIRS = [("A", "E"), ("A", "A0"), ("A0", "E"), ("E-strict", "E"),
         ("B", "C"), ("C", "D"), ("D", "E"), ("E-links", "E")]
BINARY: Dict[str, Callable[[Dict[str, float]], Optional[bool]]] = {
    "retrieved_expected": lambda m: m["recall_at_k"] > 0 if "recall_at_k" in m else None,
    "cited_all_expected": lambda m: m["citation_recall"] == 1 if "citation_recall" in m else None,
    "over_refusal": lambda m: m["over_refusal"] == 1 if "over_refusal" in m else None,
    "correct": lambda m: m["correctness_1to5"] >= 4 if "correctness_1to5" in m else None,
    "hallucination": lambda m: m["hallucination_flag"] == 1 if "hallucination_flag" in m else None,
}
ORDINAL = ["correctness_1to5", "faithfulness_1to5", "clarity_1to5"]


def compare(scores: Scores, first: str, second: str) -> List[dict]:
    queries = sorted({q for s, q in scores if s == first} & {q for s, q in scores if s == second})
    pairs = [(scores[(first, q)], scores[(second, q)]) for q in queries]
    rows = []
    for name, outcome in BINARY.items():
        paired = [(outcome(a), outcome(b)) for a, b in pairs]
        paired = [(a, b) for a, b in paired if a is not None and b is not None]
        if not paired:
            continue
        only_first = sum(a and not b for a, b in paired)
        only_second = sum(b and not a for a, b in paired)
        discordant = only_first + only_second
        p = binomtest(only_first, discordant, 0.5).pvalue if discordant else 1.0
        rows.append({"first": first, "second": second, "outcome": name, "test": "McNemar exact", "n": len(paired),
                     "first_rate": round(sum(a for a, _ in paired) / len(paired), 4),
                     "second_rate": round(sum(b for _, b in paired) / len(paired), 4),
                     "only_first": only_first, "only_second": only_second, "p_value": round(p, 5)})
    for field in ORDINAL:
        paired = [(a[field], b[field]) for a, b in pairs if field in a and field in b]
        if not paired:
            continue
        differences = [b - a for a, b in paired]
        p = wilcoxon(differences).pvalue if any(differences) else 1.0
        rows.append({"first": first, "second": second, "outcome": field, "test": "Wilcoxon signed-rank",
                     "n": len(paired), "first_rate": round(sum(a for a, _ in paired) / len(paired), 4),
                     "second_rate": round(sum(b for _, b in paired) / len(paired), 4), "p_value": round(float(p), 5)})
    return rows


def agreement(human: Scores, judge: Scores) -> List[dict]:
    rows = []
    for field, weights in [("hallucination_flag", None), ("refused_flag", None),
                           *[(f, "quadratic") for f in ORDINAL]]:
        paired = [(human[k][field], judge[k][field]) for k in human.keys() & judge.keys()
                  if field in human[k] and field in judge[k]]
        if len(paired) < 2:
            continue
        kappa = cohen_kappa_score([a for a, _ in paired], [b for _, b in paired], weights=weights)
        rows.append({"field": field, "weights": weights or "none", "n": len(paired), "kappa": round(float(kappa), 4)})
    return rows


def write(path: Path, rows: List[dict]) -> None:
    fields = list(dict.fromkeys(k for row in rows for k in row))
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--eval-dir", type=Path, default=ROOT / "eval")
    parser.add_argument("--rater", default="judge", help="whose ratings the tests use")
    args = parser.parse_args()

    scores, _ = load_automatic(args.eval_dir, run=1)
    for key, metrics in load_ratings(args.eval_dir, args.rater).items():
        scores.setdefault(key, {}).update(metrics)
    systems = {s for s, _ in scores}
    tests = [row for first, second in PAIRS if {first, second} <= systems for row in compare(scores, first, second)]
    if tests:
        write(args.eval_dir / "significance.csv", tests)
        for row in tests:
            print(f"{row['first']:>8} vs {row['second']:<8} {row['outcome']:<20} n={row['n']:<4} "
                  f"{row['first_rate']:.3f} vs {row['second_rate']:.3f}  p={row['p_value']}")
    else:
        print("No system pairs to compare yet.")

    kappas = agreement(load_ratings(args.eval_dir, "human"), load_ratings(args.eval_dir, "judge"))
    if kappas:
        write(args.eval_dir / "agreement.csv", kappas)
        for row in kappas:
            print(f"kappa {row['field']:<20} n={row['n']:<4} {row['kappa']}")


if __name__ == "__main__":
    main()
