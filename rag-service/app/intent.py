import re
from typing import Literal

Intent = Literal["HARMFUL", "ADVICE", "DEFINE", "EXPLAIN", "WHY", "EXAMPLE", "CASE", "FUN", "LAW", "KIDS", "UNKNOWN"]

# Requests for help breaking the law. Asking *about* an offence ("is bribery a crime?") is fine;
# asking how to commit or evade one is not.
_HARMFUL_PATTERNS = [
    r"\bhow (?:to|can i|do i|could i)\s+(?:evade|avoid|escape|dodge)\s+(?:arrest|police|the police|a warrant)",
    r"\bhow (?:to|can i|do i|could i)\s+(?:hide|destroy|tamper with|get rid of|fake)\s+(?:the\s+)?evidence",
    r"\bhow (?:to|can i|do i|could i)\s+(?:forge|fake)\s+(?:a\s+)?(?:document|signature|certificate|id)",
    r"\bhow (?:to|can i|do i|could i)\s+bribe\b",
]

_INTENT_KEYWORDS: dict[Intent, list[str]] = {
    # Requests about the user's own situation. Answered with general law plus a referral, never a
    # prediction or recommendation. Rights questions such as "can police arrest me without telling
    # me why?" are plain legal information and must not match.
    "ADVICE": [
        "should i", "should we", "can i sue", "should i sue", "my case", "do i have a case",
        "what should i do", "what will happen to me", "will i go to jail", "will i be arrested",
        "how do i win", "help me win",
    ],
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
    if any(re.search(p, lowered) for p in _HARMFUL_PATTERNS):
        return "HARMFUL"
    for intent, keywords in _INTENT_KEYWORDS.items():
        if any(re.search(rf"\b{re.escape(kw)}\b", lowered) for kw in keywords):
            return intent
    return "UNKNOWN"
