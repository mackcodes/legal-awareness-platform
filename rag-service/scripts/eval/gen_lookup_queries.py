"""Generate the template categories of the gold evaluation set (RAG_IMPLEMENTATION_GUIDE.md Phase 8)
from corpus metadata, into eval/gold_queries.json.

Categories: direct_lookup (article and section numbers), amendment (articles inserted or omitted by
one amendment), case_link (provisions linked to a judgment, scored by recall) and old_vs_new (the BNS
section that replaced an IPC section). Hand-written entries in the file are kept; generated ones
(`"generated": true`) are replaced on every run. Sampling is seeded, so a rerun on the same corpus
gives the same questions. Spot-check the output before use.

Items the smoke test cites are excluded: those questions were used during development.

Usage (from rag-service/):
    python scripts/eval/gen_lookup_queries.py
"""
import json
import random
import re
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List

from smoke_test import CASES

SERVICE_DIR = Path(__file__).resolve().parents[2]
CORPUS_PATH = SERVICE_DIR / "data" / "corpus" / "full_corpus.json"
GOLD_PATH = SERVICE_DIR / "eval" / "gold_queries.json"

SEED = 8
N_ARTICLES = 14
# One section per Act, plus one more from each Act with over 100 sections: 17 + 9 = 26.
LARGE_ACT = 100
N_AMEND_INSERTED = 8
N_AMEND_OMITTED = 7
N_CASE_LINK = 10
N_OLD_VS_NEW = 15
IPC_ACT = "The Indian Penal Code, 1860"

ARTICLE_TEMPLATES = [
    "What does Article {n} of the Constitution say?",
    "Explain Article {n} of the Indian Constitution.",
    "What is Article {n} about?",
]
SECTION_TEMPLATES = [
    "What does Section {n} of the {act} say?",
    "Explain Section {n} of the {act}.",
    "What is provided in Section {n} of the {act}?",
]
OLD_VS_NEW_TEMPLATES = [
    "Which section of the BNS replaced Section {n} of the IPC?",
    "Section {n} of the IPC is now which section of the Bharatiya Nyaya Sanhita?",
    "What is the new law for IPC Section {n}?",
]
# Lettered articles whose only footnote is not the one that inserted them (that footnote sits on the
# heading of a Part inserted as a whole, so it is not in the article's metadata).
NOT_INSERTED_BY_FOOTNOTE = {
    "const-art-51A": "Part IVA inserted by the 42nd Amendment, 1976; the 86th only added clause (k)",
}
_OMITTED_BY = re.compile(r"Omitted by the (Constitution \([^)]+\) Act, \d{4})")
_INSERTED_BY = re.compile(r"^Ins\. by the (Constitution \([^)]+\) Act, \d{4})")


def _entry(query: str, category: str, expected_ids: List[str], summary: str, match: str = "any") -> Dict[str, Any]:
    return {
        "query": query,
        "category": category,
        "expected_ids": expected_ids,
        "match": match,
        "expected_answer_summary": summary,
        "language": "en",
        "generated": True,
    }


def _short_name(item: Dict[str, Any]) -> str:
    """The first alias that differs from the full name ("IT Act" style), else the full name. A bare
    acronym of an Act gets " Act" ("POCSO" -> "POCSO Act"); Codes and Sanhitas keep theirs ("CPC")."""
    full = item["act_or_case_name"]
    alias = next((a for a in item.get("act_aliases", []) if a.lower() != full.lower()), full)
    return f"{alias} Act" if alias.isupper() and " Act" in full else alias


def _numbered(item: Dict[str, Any]) -> bool:
    return item.get("number") is not None and item.get("status") == "active"


def direct_lookup(corpus: List[Dict[str, Any]], excluded: set, rng: random.Random) -> List[Dict[str, Any]]:
    articles = [i for i in corpus if i["source_type"] == "article" and _numbered(i) and i["id"] not in excluded]
    entries = [
        _entry(ARTICLE_TEMPLATES[k % len(ARTICLE_TEMPLATES)].format(n=a["number"]), "direct_lookup", [a["id"]],
               f"Article {a['number']}: {a['title']}")
        for k, a in enumerate(rng.sample(articles, N_ARTICLES))
    ]

    by_act: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for i in corpus:
        if i["source_type"] == "act_section" and i["act_or_case_name"] != IPC_ACT and _numbered(i) \
                and i["id"] not in excluded:
            by_act[i["act_or_case_name"]].append(i)
    sections = []
    for act in sorted(by_act):
        sections += rng.sample(by_act[act], 2 if len(by_act[act]) > LARGE_ACT else 1)
    for k, s in enumerate(sections):
        query = SECTION_TEMPLATES[k % len(SECTION_TEMPLATES)].format(n=s["number"], act=_short_name(s))
        entries.append(_entry(query, "direct_lookup", [s["id"]], f"{s['act_or_case_name']}, Section {s['number']}: {s['title']}"))
    return entries


def amendment(corpus: List[Dict[str, Any]], excluded: set, rng: random.Random) -> List[Dict[str, Any]]:
    """Inserted: a lettered article (21A style) whose footnotes all name the same inserting amendment,
    so the article itself came from it. Omitted: the article's text is its "Omitted by ..." note."""
    inserted, omitted = [], []
    for i in corpus:
        if i["source_type"] != "article" or i["id"] in excluded:
            continue
        if i.get("status") == "omitted":
            found = _OMITTED_BY.search(i["original_text"])
            if found:
                omitted.append((i, found.group(1)))
        elif re.search(r"[A-Z]$", i.get("number") or "") and i["id"] not in NOT_INSERTED_BY_FOOTNOTE:
            acts = {m.group(1) for n in i.get("amendment_notes", []) if (m := _INSERTED_BY.match(n))}
            if len(acts) == 1 and len(i.get("amended_by", [])) == 1:
                inserted.append((i, acts.pop()))

    entries = [
        _entry(f"Which amendment added Article {a['number']} to the Constitution?", "amendment", [a["id"]],
               f"Article {a['number']} ({a['title']}) was inserted by the {act}")
        for a, act in rng.sample(inserted, N_AMEND_INSERTED)
    ]
    entries += [
        _entry(f"Is Article {a['number']} still part of the Constitution?", "amendment", [a["id"]],
               f"No. Article {a['number']} ({a['title']}) was omitted by the {act}")
        for a, act in rng.sample(omitted, N_AMEND_OMITTED)
    ]
    return entries


def case_link(corpus: List[Dict[str, Any]], excluded: set, rng: random.Random) -> List[Dict[str, Any]]:
    judgments = [i for i in corpus if i["source_type"] == "judgment" and i.get("related_articles")
                 and i["id"] not in excluded]
    return [
        _entry(f"Which provisions did the Supreme Court interpret in {j['title']}?", "case_link",
               j["related_articles"], f"{j['title']}: {', '.join(j['related_articles'])}", match="all")
        for j in rng.sample(judgments, N_CASE_LINK)
    ]


def old_vs_new(corpus: List[Dict[str, Any]], excluded: set, rng: random.Random) -> List[Dict[str, Any]]:
    """IPC sections that exactly one BNS section replaced, so the expected answer is unambiguous."""
    successors: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for i in corpus:
        for r in i.get("replaces", []):
            if r["act"] == IPC_ACT:
                successors[r["number"]].append(i)
    candidates = sorted(
        (n, s[0]) for n, s in successors.items() if len(s) == 1 and s[0]["id"] not in excluded
    )
    return [
        _entry(OLD_VS_NEW_TEMPLATES[k % len(OLD_VS_NEW_TEMPLATES)].format(n=n), "old_vs_new", [bns["id"]],
               f"IPC Section {n} is now BNS Section {bns['number']} ({bns['title']})")
        for k, (n, bns) in enumerate(rng.sample(candidates, N_OLD_VS_NEW))
    ]


def main() -> None:
    corpus = json.loads(CORPUS_PATH.read_text(encoding="utf-8"))
    excluded = {i for case in CASES for i in case.get("cites", []) + case.get("not_cites", [])}
    rng = random.Random(SEED)
    generated = (
        direct_lookup(corpus, excluded, rng) + amendment(corpus, excluded, rng)
        + case_link(corpus, excluded, rng) + old_vs_new(corpus, excluded, rng)
    )

    kept = []
    if GOLD_PATH.exists():
        kept = [e for e in json.loads(GOLD_PATH.read_text(encoding="utf-8")) if not e.get("generated")]
    GOLD_PATH.parent.mkdir(parents=True, exist_ok=True)
    GOLD_PATH.write_text(json.dumps(kept + generated, ensure_ascii=False, indent=1), encoding="utf-8")

    counts: Dict[str, int] = defaultdict(int)
    for e in generated:
        counts[e["category"]] += 1
    print(f"Wrote {len(generated)} generated + {len(kept)} hand-written entries to {GOLD_PATH}")
    for category, n in counts.items():
        print(f"  {category}: {n}")


if __name__ == "__main__":
    main()
