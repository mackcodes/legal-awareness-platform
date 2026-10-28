"""Evaluation runner (RAG_IMPLEMENTATION_GUIDE.md Phase 10, step 1): send every gold question to
every system, then score retrieval, citations, refusals, latency and tokens.

System A (the production chatbot) is rebuilt here rather than called through the Next.js route,
which needs a signed-in Clerk session: the same base prompt and the same Gemini request body
(Gemini's default sampling), on the evaluation model, so every system runs on one model.
All other systems go through the running RAG service's /chat with the Phase 9 switches.

Results are appended to eval/results_raw.jsonl (or --raw), one line per call. A rerun skips calls that
already succeeded, so a run stopped by a quota limit resumes where it stopped.

Usage (from rag-service/, with the service running: python run.py):
    python scripts/eval/run_evaluation.py [--systems A0 E] [--runs 3] [--limit 5 | --per-category 1] [--delay 13]
    python scripts/eval/run_evaluation.py --score-only
"""
import argparse
import csv
import json
import math
import re
import sys
import time
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Set

import requests

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402
from app.llm_client import LlmGenerationError, generate_answer  # noqa: E402
from app.prompt_builder import BASE_PROMPT  # noqa: E402

GOLD_PATH = ROOT / "eval" / "gold_queries.json"

# Systems B-D leave out the layers that E adds on top of D.
_NO_E_LAYERS = {"use_case_links": False, "use_audience": False, "use_safety": False}
SYSTEMS: Dict[str, Optional[Dict[str, bool]]] = {
    "A": None,
    "A0": {"use_retrieval": False},
    "B": {**_NO_E_LAYERS, "use_sparse": False},
    "C": _NO_E_LAYERS,
    "D": {**_NO_E_LAYERS, "use_reranker": True},
    "E": {"use_reranker": True},
    "E-links": {"use_reranker": True, "use_case_links": False},
    "E-strict": {"use_reranker": True, "practical_tips": False},
}
K = 5
# Categories with a legal answer; refusing one of these is an over-refusal.
ANSWERABLE = {"direct_lookup", "amendment", "case_link", "old_vs_new", "landmark_judgment", "paraphrase", "bilingual"}
# Errors worth retrying; a used-up daily quota is waited out; anything else (e.g. a bad key) stops the run.
TRANSIENT = re.compile(r"503|high demand|overloaded|did not respond|per-minute|Could not reach|500|502|504", re.I)
RETRY_WAITS_S = (30, 60, 120, 300)
DAILY_QUOTA = re.compile(r"daily quota used up; it resets in about (\d+(?:\.\d+)?) hours|Gemini quota exceeded")
# Heuristic only: the rated sample and the judge check refusals properly. Only the opening is searched:
# System A ends normal answers with "I can only answer questions about ...".
REFUSAL_WINDOW = 300
REFUSAL = re.compile(
    r"can only (?:help|answer)|outside (?:the |my )?scope|out of scope|not (?:related|able) to"
    r"|I can't help with|I cannot help with|(?:sources|information) (?:provided |available )?(?:do|does) not"
    r"|No relevant official source|I (?:do not|don't) have (?:any )?(?:information|details)",
    re.I,
)
REFERRAL = re.compile(r"15100|legal aid|legal services authority|consult (?:a|an) (?:lawyer|advocate)", re.I)


# ---------------------------------------------------------------- calling the systems

def call_system_a(question: str) -> Dict[str, Any]:
    start = time.perf_counter()
    try:
        generation = generate_answer(f"{BASE_PROMPT}\n\nUser Question: {question}", deterministic=False)
    except LlmGenerationError as exc:
        return {"success": False, "error": str(exc), "latency_ms": int((time.perf_counter() - start) * 1000)}
    return {
        "success": True,
        "answer": generation.text,
        "latency_ms": int((time.perf_counter() - start) * 1000),
        "model_version": generation.model_version,
        "prompt_tokens": generation.prompt_tokens,
        "output_tokens": generation.output_tokens,
    }


def call_rag(url: str, question: str, switches: Dict[str, bool]) -> Dict[str, Any]:
    headers = {"X-RAG-Secret": settings.rag_shared_secret} if settings.rag_shared_secret else {}
    try:
        reply = requests.post(f"{url}/chat", json={"question": question, **switches}, headers=headers, timeout=300)
        reply.raise_for_status()
        return reply.json()
    except requests.RequestException as exc:
        return {"success": False, "error": f"Could not reach the RAG service: {exc}"}


def with_retries(call: Callable[[], Dict[str, Any]]) -> Dict[str, Any]:
    """call() until it succeeds: transient errors are retried with backoff, and a used-up daily quota is
    waited out, so an unattended run carries on after the reset. Any other error is returned."""
    waits = iter(RETRY_WAITS_S)
    while True:
        reply = call()
        error = reply.get("error") or ""
        if reply.get("success"):
            return reply
        quota = DAILY_QUOTA.search(error)
        if quota:
            # No reset time in the reply: try again in an hour.
            wait = float(quota.group(1)) * 3600 + 300 if quota.group(1) else 3600
            print(f"      daily quota used up; waiting {wait / 3600:.1f} h", flush=True)
            time.sleep(wait)
            continue
        wait = next(waits, None)
        if wait is None or not TRANSIENT.search(error):
            return reply
        print(f"      {error[:80]}; retrying in {wait} s", flush=True)
        time.sleep(wait)


def call_system(system: str, url: str, question: str) -> Dict[str, Any]:
    switches = SYSTEMS[system]
    return with_retries(lambda: call_system_a(question) if switches is None else call_rag(url, question, switches))


def record_for(system: str, run: int, query: Dict[str, Any], reply: Dict[str, Any]) -> Dict[str, Any]:
    chunks = reply.get("retrieved_chunks", [])
    return {
        "system": system,
        "run": run,
        "query": query["query"],
        "category": query["category"],
        "language": query.get("language", "en"),
        "expected_ids": query["expected_ids"],
        "match": query.get("match", "any"),
        "success": bool(reply.get("success")),
        "error": reply.get("error"),
        "answer": reply.get("answer", ""),
        "intent": reply.get("intent"),
        "cited_ids": [c["item_id"] for c in reply.get("citations", [])],
        "retrieved_ids": list(dict.fromkeys(c["citation"]["item_id"] for c in chunks)),
        "retrieved_chunks": [{"item_id": c["citation"]["item_id"], "text": c["text"]} for c in chunks],
        "latency_ms": reply.get("latency_ms"),
        "model_version": reply.get("model_version"),
        "prompt_tokens": reply.get("prompt_tokens"),
        "output_tokens": reply.get("output_tokens"),
    }


def load_raw(raw_path: Path) -> List[Dict[str, Any]]:
    if not raw_path.exists():
        return []
    with raw_path.open(encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def run(args: argparse.Namespace, queries: List[Dict[str, Any]]) -> None:
    done = {(r["system"], r["run"], r["query"]) for r in load_raw(args.raw) if r["success"]}
    todo = [
        (run_no, system, q)
        for run_no in range(1, args.runs + 1)
        for q in queries
        for system in args.systems
        if (system, run_no, q["query"]) not in done
    ]
    print(f"{len(todo)} calls to make ({len(done)} already done)", flush=True)
    args.raw.parent.mkdir(parents=True, exist_ok=True)
    with args.raw.open("a", encoding="utf-8") as out:
        for index, (run_no, system, q) in enumerate(todo, 1):
            reply = call_system(system, args.url, q["query"])
            out.write(json.dumps(record_for(system, run_no, q, reply), ensure_ascii=False) + "\n")
            out.flush()
            status = "ok " if reply.get("success") else "ERR"
            print(f"[{index}/{len(todo)}] {status} run {run_no} {system:8} {q['query'][:60]}", flush=True)
            if not reply.get("success"):
                print(f"      {reply.get('error')}", flush=True)
                if not TRANSIENT.search(reply.get("error") or ""):
                    sys.exit("Stopped: fix the error above, then rerun the same command to resume.")
            time.sleep(args.delay)


# ---------------------------------------------------------------- scoring

class MentionFinder:
    """Corpus items an answer names in plain text: Systems A and A0 have no sources to tag, so their
    citations are the articles, sections (with their Act named next to them) and judgments they mention."""

    # Slugs that are also the name of a body the answers mention for other reasons (the NALSA helpline).
    AMBIGUOUS_SLUGS = {"nalsa"}

    def __init__(self) -> None:
        from app.bm25_index import Bm25Index
        from app.retrieval import _NUMBER, _NUMBER_LIST, ARTICLE_PATTERN, HybridRetriever, _numbers
        from app.vector_store import FaissVectorStore

        store, bm25 = FaissVectorStore(), Bm25Index()
        store.load()
        bm25.load()
        self.retriever = HybridRetriever(store, bm25)
        self.numbers, self.number = _numbers, _NUMBER
        self.article_pattern = ARTICLE_PATTERN
        # A section number goes with the Act named right next to it: "Section 302 of the IPC", "BNS
        # Section 103". On a line naming two Acts, pairing every number with both would invent citations.
        aliases = "|".join(re.escape(a) for a in sorted(self.retriever.act_aliases, key=len, reverse=True))
        self.paired_sections = [
            re.compile(rf"\b(?:sections?|secs?\.)\s*(?P<nums>{_NUMBER_LIST})\s+(?:of\s+)?(?:the\s+)?(?P<act>{aliases})\b", re.I),
            re.compile(rf"\b(?P<act>{aliases})\s*(?:sections?|secs?\.|s\.)?\s*(?P<nums>{_NUMBER_LIST})", re.I),
        ]
        self.case_patterns = {}
        for item_id, m in self.retriever.first_chunks.items():
            if m.get("source_type") != "judgment":
                continue
            name = m["act_or_case_name"]
            party = _normalise(name.split(" v. ")[0])
            # "Kesavananda Bharati v." / "the Kesavananda Bharati case" / "(Sabarimala case)".
            keys = [rf"\b{re.escape(party)}\s+vs?\b"]
            slug = " ".join(w for w in item_id.split("-")[2:] if len(w) > 1)
            if slug not in self.AMBIGUOUS_SLUGS:
                keys.append(rf"\b{re.escape(slug)}\b")
            keys += [rf"\b{re.escape(_normalise(p).removesuffix(' case'))}\b" for p in re.findall(r"\(([^)]+)\)", name)]
            self.case_patterns[item_id] = re.compile("|".join(keys))

    def find(self, answer: str) -> List[str]:
        found: List[str] = []
        for line in answer.splitlines():
            articles = self.numbers(self.article_pattern, line)
            sections = self._act_sections(line)
            plain = _normalise(line)
            for item_id, m in self.retriever.first_chunks.items():
                number = str(m.get("number") or "").lower()
                kind = m.get("source_type")
                if (
                    (kind == "article" and number in articles)
                    or (kind == "act_section" and (m["act_or_case_name"], number) in sections)
                    or (kind == "judgment" and self.case_patterns[item_id].search(plain))
                ):
                    found.append(item_id)
        return list(dict.fromkeys(found))

    def _act_sections(self, line: str) -> Set[tuple]:
        """(Act, section number) pairs in a line. A number with no Act next to it is left out: "Section
        154 CrPC" must not count as BNSS 154 because BNSS is named elsewhere on the line."""
        return {
            (self.retriever.act_aliases[match["act"].lower()], n.lower())
            for pattern in self.paired_sections
            for match in pattern.finditer(line)
            for n in self.number.findall(match["nums"])
        }


def _normalise(text: str) -> str:
    # "A.D.M. Jabalpur" -> "adm jabalpur", matching the item slug.
    return re.sub(r"\s+", " ", text.lower().replace(".", "")).strip()


def _ranking_metrics(ranked: List[str], relevant: Set[str]) -> Dict[str, float]:
    top = ranked[:K]
    hits = [i for i, item in enumerate(top) if item in relevant]
    ideal = sum(1 / math.log2(i + 2) for i in range(min(len(relevant), K)))
    first = next((i for i, item in enumerate(ranked) if item in relevant), None)
    return {
        "precision_at_k": len(hits) / K,
        "recall_at_k": len(hits) / len(relevant),
        "mrr": 1 / (first + 1) if first is not None else 0.0,
        "ndcg_at_k": sum(1 / math.log2(i + 2) for i in hits) / ideal,
    }


def score_record(record: Dict[str, Any], mentions: Optional["MentionFinder"]) -> Dict[str, Any]:
    relevant = set(record["expected_ids"])
    switches = SYSTEMS[record["system"]]
    retrieval_on = switches is not None and switches.get("use_retrieval", True)
    cited = record["cited_ids"] if retrieval_on else mentions.find(record["answer"])
    correct = len(set(cited) & relevant)
    row: Dict[str, Any] = {
        "system": record["system"],
        "run": record["run"],
        "category": record["category"],
        "language": record["language"],
        "query": record["query"],
        "expected_ids": " ".join(record["expected_ids"]),
        "cited_ids": " ".join(cited),
        "citation_precision": correct / len(cited) if cited else None,
        "citation_recall": correct / len(relevant) if relevant else None,
        "refused": bool(REFUSAL.search(record["answer"][:REFUSAL_WINDOW])),
        "referral": bool(REFERRAL.search(record["answer"])),
        "latency_ms": record["latency_ms"],
        "prompt_tokens": record["prompt_tokens"],
        "output_tokens": record["output_tokens"],
    }
    if relevant and retrieval_on:
        row.update(_ranking_metrics(record["retrieved_ids"], relevant))
    return row


def _mean(values: List[Any]) -> Optional[float]:
    values = [v for v in values if v is not None]
    return sum(values) / len(values) if values else None


def _percentile(values: List[float], p: float) -> Optional[float]:
    values = sorted(v for v in values if v is not None)
    return values[min(len(values) - 1, int(p * len(values)))] if values else None


def score(raw_path: Path) -> None:
    """Per-query scores to results_<system>.csv next to the raw file, and a summary table."""
    records = [r for r in load_raw(raw_path) if r["success"]]
    if not records:
        sys.exit(f"No successful results in {raw_path}.")
    no_retrieval = [s for s, sw in SYSTEMS.items() if sw is None or not sw.get("use_retrieval", True)]
    mentions = MentionFinder() if any(r["system"] in no_retrieval for r in records) else None
    rows = [score_record(r, mentions) for r in records]

    by_system: Dict[str, List[Dict[str, Any]]] = {}
    for row in rows:
        by_system.setdefault(row["system"], []).append(row)
    fields = list(dict.fromkeys(k for row in rows for k in row))
    for system, system_rows in by_system.items():
        with (raw_path.parent / f"results_{system}.csv").open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(system_rows)

    header = ["system", "n", "P@5", "R@5", "MRR", "nDCG@5", "cit_P", "cit_R",
              "refuse_oos", "referral_adv", "over_refuse", "p50_ms", "p95_ms", "in_tok", "out_tok"]
    print("  ".join(f"{h:>8}" for h in header))
    for system in [s for s in SYSTEMS if s in by_system]:
        rs = by_system[system]
        oos = [r["refused"] for r in rs if r["category"] == "out_of_scope"]
        adv = [r["referral"] for r in rs if r["category"] == "advice"]
        answerable = [r["refused"] for r in rs if r["category"] in ANSWERABLE]
        values = [
            system, len(rs),
            _mean([r.get("precision_at_k") for r in rs]), _mean([r.get("recall_at_k") for r in rs]),
            _mean([r.get("mrr") for r in rs]), _mean([r.get("ndcg_at_k") for r in rs]),
            _mean([r["citation_precision"] for r in rs]), _mean([r["citation_recall"] for r in rs]),
            _mean(oos), _mean(adv), _mean(answerable),
            _percentile([r["latency_ms"] for r in rs], 0.5), _percentile([r["latency_ms"] for r in rs], 0.95),
            _mean([r["prompt_tokens"] for r in rs]), _mean([r["output_tokens"] for r in rs]),
        ]
        print("  ".join(f"{v:>8.3f}" if isinstance(v, float) else f"{'-' if v is None else v:>8}" for v in values))
    print(f"\nPer-query scores: {raw_path.parent}/results_<system>.csv. Refusal and referral are heuristic.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:8000")
    parser.add_argument("--systems", nargs="+", default=list(SYSTEMS), choices=list(SYSTEMS))
    parser.add_argument("--runs", type=int, default=3)
    parser.add_argument("--limit", type=int, help="first N gold questions only, for a trial run")
    parser.add_argument("--categories", nargs="+", help="only these gold categories")
    parser.add_argument("--per-category", type=int, help="first N questions of each category, for a trial run")
    # 0 on a billed key; Gemini's free tier allows about 5 requests per minute, so 13 s there.
    parser.add_argument("--delay", type=float, default=0.0, help="seconds between calls")
    parser.add_argument("--raw", type=Path, default=ROOT / "eval" / "results_raw.jsonl")
    parser.add_argument("--score-only", action="store_true")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")  # Hindi questions on the Windows console

    if not args.score_only:
        queries = json.loads(GOLD_PATH.read_text(encoding="utf-8"))
        if args.categories:
            queries = [q for q in queries if q["category"] in args.categories]
        if args.per_category:
            by_category: Dict[str, List[Dict[str, Any]]] = {}
            for q in queries:
                by_category.setdefault(q["category"], []).append(q)
            queries = [q for group in by_category.values() for q in group[: args.per_category]]
        run(args, queries[: args.limit])
    score(args.raw)


if __name__ == "__main__":
    main()
