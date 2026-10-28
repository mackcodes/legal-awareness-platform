"""Master results table (RAG_IMPLEMENTATION_GUIDE.md Phase 10, step 4): every metric for every
system, overall and per category, with a bootstrap 95% confidence interval over questions.

Reads results_<system>.csv (written by run_evaluation.py) and, if present, the ratings in
review/ratings_<rater>.csv matched through review/review_key.csv (make_rating_sheet.py).
Each question's runs are averaged first, so questions, not runs, are resampled.

Usage (from rag-service/):
    python scripts/eval/build_master_table.py [--eval-dir eval] [--rater judge]
"""
import argparse
import csv
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from run_evaluation import ANSWERABLE, SYSTEMS  # noqa: E402

RESAMPLES = 10_000
AUTOMATIC = ["precision_at_k", "recall_at_k", "mrr", "ndcg_at_k", "citation_precision", "citation_recall",
             "correct_refusal", "over_refusal", "referral", "latency_ms", "prompt_tokens", "output_tokens"]
RATINGS = ["correctness_1to5", "faithfulness_1to5", "clarity_1to5", "hallucination_flag", "refused_flag"]
FLAG_VALUES = {"1": 1.0, "y": 1.0, "yes": 1.0, "true": 1.0, "0": 0.0, "n": 0.0, "no": 0.0, "false": 0.0}

# (system, query) -> metric -> value
Scores = Dict[Tuple[str, str], Dict[str, Optional[float]]]


def _number(value: str) -> Optional[float]:
    value = (value or "").strip().lower()
    if value in FLAG_VALUES:
        return FLAG_VALUES[value]
    try:
        return float(value)
    except ValueError:
        return None  # blank, "-" (not rated) or "None"


def load_automatic(eval_dir: Path, run: Optional[int] = None) -> Tuple[Scores, Dict[str, str]]:
    """Per-question automatic scores, averaged over runs (or one run), and each question's category.
    Refusal and referral only count in the categories where they mean something."""
    values: Dict[Tuple[str, str], Dict[str, List[float]]] = defaultdict(lambda: defaultdict(list))
    categories: Dict[str, str] = {}
    for path in [eval_dir / f"results_{system}.csv" for system in SYSTEMS]:
        if not path.exists():
            continue
        with path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if run is not None and int(row["run"]) != run:
                    continue
                categories[row["query"]] = category = row["category"]
                refused, referral = _number(row["refused"]), _number(row["referral"])
                derived = {
                    "correct_refusal": refused if category == "out_of_scope" else None,
                    "over_refusal": refused if category in ANSWERABLE else None,
                    "referral": referral if category == "advice" else None,
                }
                cell = values[(row["system"], row["query"])]
                for metric in AUTOMATIC:
                    value = derived[metric] if metric in derived else _number(row.get(metric, ""))
                    if value is not None:
                        cell[metric].append(value)
    scores = {key: {m: float(np.mean(v)) for m, v in cell.items()} for key, cell in values.items()}
    return scores, categories


def load_ratings(eval_dir: Path, rater: str) -> Scores:
    """One rater's ratings by (system, query); empty if that rater's file does not exist yet."""
    review = eval_dir / "review"
    path = review / f"ratings_{rater}.csv"
    if not path.exists():
        return {}
    with (review / "review_key.csv").open(encoding="utf-8-sig") as f:
        key = {row["row_id"]: (row["system"], row["query"]) for row in csv.DictReader(f)}
    scores: Scores = {}
    with path.open(encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            values = {field: _number(row.get(field, "")) for field in RATINGS}
            scores[key[row["row_id"]]] = {k: v for k, v in values.items() if v is not None}
    return scores


def bootstrap_ci(values: List[float], rng: np.random.Generator) -> Tuple[float, float]:
    data = np.asarray(values)
    means = data[rng.integers(0, len(data), size=(RESAMPLES, len(data)))].mean(axis=1)
    return float(np.percentile(means, 2.5)), float(np.percentile(means, 97.5))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--eval-dir", type=Path, default=ROOT / "eval")
    parser.add_argument("--rater", default="judge", help="whose ratings go in the table")
    args = parser.parse_args()

    automatic, categories = load_automatic(args.eval_dir)
    ratings = load_ratings(args.eval_dir, args.rater)
    merged: Scores = defaultdict(dict)
    for source in (automatic, ratings):
        for key, metrics in source.items():
            merged[key].update(metrics)

    rng = np.random.default_rng(0)
    rows = []
    for system in [s for s in SYSTEMS if any(k[0] == s for k in merged)]:
        for category in ["all", *sorted(set(categories.values()))]:
            cells = [m for (s, q), m in merged.items() if s == system and category in ("all", categories.get(q))]
            for metric in AUTOMATIC + RATINGS:
                values = [m[metric] for m in cells if metric in m]
                if not values:
                    continue
                low, high = bootstrap_ci(values, rng)
                rows.append({"system": system, "category": category, "metric": metric, "n": len(values),
                             "mean": round(float(np.mean(values)), 4), "ci_low": round(low, 4), "ci_high": round(high, 4)})

    out = args.eval_dir / "results_table.csv"
    with out.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"{len(rows)} rows in {out}" + ("" if ratings else f" (no ratings_{args.rater}.csv yet: automatic metrics only)"))
    draw_charts(rows, args.eval_dir / "figures")


# (file, title, [(panel title, category, systems or None for all, [(metric, label, scale)])])
CHARTS = [
    ("retrieval.png", "Retrieval (all questions with an expected source)", [
        ("", "all", None, [("recall_at_k", "Recall@5", 1), ("mrr", "MRR", 1), ("ndcg_at_k", "nDCG@5", 1)])]),
    ("citations.png", "Citations", [
        ("", "all", None, [("citation_precision", "Citation precision", 1), ("citation_recall", "Citation recall", 1)])]),
    ("answers.png", "Answer quality (rated run 1)", [
        ("Correctness (1-5)", "all", None, [("correctness_1to5", "Correctness", 1)]),
        ("Hallucination rate", "all", None, [("hallucination_flag", "Hallucination", 1)]),
        ("Refusals", "all", None, [("correct_refusal", "Correct refusal (out of scope)", 1),
                                   ("over_refusal", "Over-refusal (answerable)", 1)])]),
    ("cost.png", "Latency and tokens per question", [
        ("Latency (s)", "all", None, [("latency_ms", "Latency", 0.001)]),
        ("Tokens", "all", None, [("prompt_tokens", "Prompt", 1), ("output_tokens", "Output", 1)])]),
    ("case_links.png", "Effect of the case-link layer", [
        ("Landmark judgments", "landmark_judgment", ["E-links", "E"],
         [("recall_at_k", "Recall@5", 1), ("citation_recall", "Citation recall", 1)]),
        ("Case-to-provision", "case_link", ["E-links", "E"],
         [("recall_at_k", "Recall@5", 1), ("citation_recall", "Citation recall", 1)])]),
]


def draw_charts(rows: List[dict], out_dir: Path) -> None:
    """Grouped bar charts with 95% CI error bars from the master table; panels with no data are skipped."""
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    table = {(r["system"], r["category"], r["metric"]): r for r in rows}
    out_dir.mkdir(parents=True, exist_ok=True)
    for filename, title, panels in CHARTS:
        panels = [p for p in panels if any((s, p[1], m) in table for s in SYSTEMS for m, _, _ in p[3])]
        if not panels:
            continue
        fig, axes = plt.subplots(1, len(panels), figsize=(6 * len(panels), 4), squeeze=False)
        for ax, (panel_title, category, systems, metrics) in zip(axes[0], panels):
            systems = [s for s in (systems or SYSTEMS) if any((s, category, m) in table for m, _, _ in metrics)]
            width = 0.8 / len(metrics)
            for i, (metric, label, scale) in enumerate(metrics):
                cells = [table.get((s, category, metric)) for s in systems]
                means = [c["mean"] * scale if c else 0 for c in cells]
                errors = [[(c["mean"] - c["ci_low"]) * scale if c else 0 for c in cells],
                          [(c["ci_high"] - c["mean"]) * scale if c else 0 for c in cells]]
                x = np.arange(len(systems)) + (i - (len(metrics) - 1) / 2) * width
                ax.bar(x, means, width, yerr=errors, capsize=3, label=label)
            ax.set_xticks(np.arange(len(systems)), systems)
            ax.set_title(panel_title)
            if len(metrics) > 1:
                ax.legend(fontsize=8, loc="upper center", bbox_to_anchor=(0.5, -0.08), ncol=len(metrics))
        fig.suptitle(title)
        fig.tight_layout()
        fig.savefig(out_dir / filename, dpi=150)
        plt.close(fig)
    print(f"Charts in {out_dir}")


if __name__ == "__main__":
    main()
