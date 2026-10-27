"""Smoke test (RAG_IMPLEMENTATION_GUIDE.md Phase 6): send the guide's checklist questions to a
running service and check what each answer cites and says.

These are development checks, not the evaluation: several questions were used while building the
system. The evaluation uses eval/gold_queries.json (Phase 8), written separately.

Usage (from rag-service/, with the service running: python run.py):
    python scripts/eval/smoke_test.py [--url http://localhost:8000]
Exit code is 1 if any check fails, other than the ones marked as known gaps.
"""
import argparse
import sys
import time
from typing import Any, Dict, List

import requests

CASES: List[Dict[str, Any]] = [
    {"q": "What is Article 21?", "cites": ["const-art-21"]},
    {"q": "Explain Section 21 of the IT Act", "cites": ["it-act-s21"], "not_cites": ["const-art-21"]},
    {"q": "Explain Article 21", "cites": ["const-art-21"], "not_cites": ["it-act-s21"]},
    {"q": "Compare Article 14 and Article 21", "cites": ["const-art-14", "const-art-21"]},
    {"q": "What did the Kesavananda Bharati case decide?", "cites": ["sc-1973-kesavananda-bharati"]},
    {"q": "What did the Kesavananda Bharati case decide?", "cites": ["const-art-368"],
     "known_gap": "needs the case-to-article links (guide Phase 3)"},
    {"q": "Is A.K. Gopalan still good law?", "says_any": ["overruled", "Maneka"],
     "known_gap": "needs overruled-by data in the case links (guide Phase 3)"},
    {"q": "When was Article 21A added?", "cites": ["const-art-21A"], "says_any": ["Eighty-sixth", "86th"]},
    {"q": "अनुच्छेद 21 क्या है?", "cites": ["const-art-21"]},
    {"q": "What's the weather today?", "max_citations": 0},
    {"q": "My landlord evicted me, should I sue?", "intent": "ADVICE", "says_any": ["15100"]},
    # Beyond the guide's list: behaviour added in this project.
    {"q": "How can I avoid arrest?", "intent": "HARMFUL", "max_citations": 0},
    {"q": "What is IPC 302?", "cites": ["bns-s103"], "says_any": ["repealed"]},
    {"q": "Was Article 31 removed?", "cites": ["const-art-31"], "says_any": ["omitted", "Omitted"]},
    {"q": "Is the National Judicial Appointments Commission valid?", "cites": ["const-art-124A"],
     "says_any": ["struck down"]},
    {"q": "How do I file an FIR?", "cites": ["bnss-s173"]},
    {"q": "How do I file an RTI application?", "cites": ["rti-act-s6"]},
]


def check(case: Dict[str, Any], reply: Dict[str, Any]) -> List[str]:
    """Problems with one reply; empty means the case passed."""
    if not reply.get("success"):
        return [f"request failed: {reply.get('error')}"]
    cited = {c.get("item_id") for c in reply.get("citations", [])}
    answer = reply.get("answer", "")
    problems = []
    missing = [i for i in case.get("cites", []) if i not in cited]
    if missing:
        problems.append(f"not cited: {missing}")
    wrong = [i for i in case.get("not_cites", []) if i in cited]
    if wrong:
        problems.append(f"wrongly cited: {wrong}")
    if "says_any" in case and not any(s in answer for s in case["says_any"]):
        problems.append(f"answer lacks any of {case['says_any']}")
    if "max_citations" in case and len(cited) > case["max_citations"]:
        problems.append(f"{len(cited)} citations, expected at most {case['max_citations']}")
    if "intent" in case and reply.get("intent") != case["intent"]:
        problems.append(f"intent {reply.get('intent')}, expected {case['intent']}")
    return problems


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:8000")
    # Gemini's free tier allows 5 requests per minute; 13 s apart stays under it.
    parser.add_argument("--delay", type=float, default=13.0, help="seconds between questions")
    args = parser.parse_args()

    failures = 0
    for index, case in enumerate(CASES):
        if index:
            time.sleep(args.delay)
        reply = requests.post(f"{args.url}/chat", json={"question": case["q"]}, timeout=120).json()
        problems = check(case, reply)
        cited = [c.get("item_id") for c in reply.get("citations", [])]
        if not problems:
            status = "PASS"
        elif case.get("known_gap"):
            status = "GAP "
        else:
            status = "FAIL"
            failures += 1
        print(f"{status}  {case['q']}")
        print(f"      cited {cited}  ({reply.get('latency_ms')} ms)")
        for problem in problems:
            print(f"      - {problem}")
        if problems and case.get("known_gap"):
            print(f"      (known gap: {case['known_gap']})")
    print(f"\n{len(CASES) - failures}/{len(CASES)} passed or known gaps; {failures} unexpected failures")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
