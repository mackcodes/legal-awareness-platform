import re
from typing import Literal

Intent = Literal["DEFINE", "EXPLAIN", "WHY", "EXAMPLE", "CASE", "FUN", "LAW", "KIDS", "UNKNOWN"]

_INTENT_KEYWORDS: dict[Intent, list[str]] = {
    "DEFINE": ["what is", "define", "meaning of"],
    "WHY": ["why", "importance", "purpose"],
    "EXAMPLE": ["example", "instance", "case study"],
    "CASE": ["judgment", "judgement", "case law", "supreme court", "verdict", "ruling"],
    "KIDS": ["simple", "kid", "child", "easy explanation"],
    "LAW": ["law student", "legal analysis", "provision", "section"],
    "EXPLAIN": ["explain", "how does", "describe"],
}


def classify_intent(query: str) -> Intent:
    """Lightweight keyword-based intent classifier.

    NOTE: Placeholder for the exemplar-embedding classifier described in the
    publication plan (Step 4.2). Swap this for embedding similarity against
    exemplar queries per intent once the corpus/eval pipeline is stable.
    """
    lowered = query.lower()
    for intent, keywords in _INTENT_KEYWORDS.items():
        if any(re.search(rf"\b{re.escape(kw)}\b", lowered) for kw in keywords):
            return intent
    return "UNKNOWN"
