import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

# The production chatbot's instructions and knowledge base (helplines, challan procedures, tone and
# formatting), shared with app/api/constitution-chat so the two systems differ only in retrieval.
_BASE_PROMPT_PATH = Path(__file__).resolve().parents[1] / "prompts" / "base_prompt.json"
BASE_PROMPT = "\n".join(json.loads(_BASE_PROMPT_PATH.read_text(encoding="utf-8"))["lines"])

AUDIENCE_INSTRUCTIONS = {
    "school": "Explain in very simple language suitable for a school student, using everyday examples.",
    "citizen": "Explain in clear, everyday language suitable for a general adult citizen.",
    "law_student": "Explain with precise legal terminology suitable for a law student, including relevant nuances.",
}


def number_sources(retrieved_chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Group retrieved chunks by corpus item, in retrieval order, and label them S1, S2, ...

    One label per item rather than per chunk, so an article split over three chunks is one
    citable source.
    """
    sources: Dict[str, Dict[str, Any]] = {}
    for chunk in retrieved_chunks:
        item_id = chunk.get("item_id") or chunk["chunk_id"]
        if item_id not in sources:
            sources[item_id] = {"label": f"S{len(sources) + 1}", "item_id": item_id, "meta": chunk, "chunks": []}
        sources[item_id]["chunks"].append(chunk)
    return list(sources.values())


def _source_block(source: Dict[str, Any], show_simplified: bool) -> str:
    # Every chunk's text starts with the item's identifying header line (see chunking.chunk_header),
    # which also carries "[OMITTED — not current law]", "(formerly IPC 302)" and "(text as on <date>)".
    header, _, first_body = source["chunks"][0]["text"].partition("\n")
    bodies = [first_body] + [c["text"].partition("\n")[2] for c in source["chunks"][1:]]
    block = f"[{source['label']}] {header}\n" + "\n".join(b for b in bodies if b)
    simplified = source["meta"].get("simplified_text")
    if show_simplified and simplified:
        block += f"\nPlain-language summary: {simplified}"
    return block


def build_grounded_prompt(
    question: str,
    retrieved_chunks: List[Dict[str, Any]],
    audience_level: str = "citizen",
    personal_situation: bool = False,
    practical_tips: bool = True,
) -> Tuple[str, List[Dict[str, Any]]]:
    """The shared base prompt plus the retrieved official sources and the rules for using them.
    Returns the prompt with the numbered sources, so the answer's [S#] tags can be mapped back."""
    sources = number_sources(retrieved_chunks)
    if not sources:
        context_block = "No relevant official source was found for this question."
    else:
        # Non-specialist audiences also get the plain-language summary.
        show_simplified = audience_level != "law_student"
        context_block = "\n\n".join(_source_block(s, show_simplified) for s in sources)

    audience_note = AUDIENCE_INSTRUCTIONS.get(audience_level, AUDIENCE_INSTRUCTIONS["citizen"])
    situation_note = (
        "\n- The user is asking about their own situation. Explain the law and the rights that apply in general "
        "terms. Do not tell them what to do, whether to take legal action, or how their case will turn out: say "
        "that this depends on the full facts and needs a lawyer."
        if personal_situation
        else ""
    )
    # Tips are untagged and may come from the model's own knowledge, so they can be wrong (e.g. an
    # outdated helpline). Switching them off (System E-strict) measures what they add and cost.
    if practical_tips:
        tips_rule = (
            "- Practical tips (helplines, where to go, what to carry, online portals) may come from the knowledge "
            'base above or general knowledge. Put them in their own "Practical tips" section, without tags, and '
            "never let them contradict the sources."
        )
        tips_fallback = "; practical tips may still help"
        tips_section = '\n4. "Practical tips", only if useful (no tags).'
        last_step = 5
    else:
        tips_rule = (
            "- Do not add practical tips, helplines, portals or anything else from the knowledge base or general "
            "knowledge: say only what the sources support, with tags."
        )
        tips_fallback = ""
        tips_section = ""
        last_step = 4

    prompt = f"""{BASE_PROMPT}

## OFFICIAL LEGAL SOURCES FOR THIS QUESTION
These are official, current legal texts retrieved for the question below. Each has a tag such as [S1].

{context_block}

## HOW TO USE THE SOURCES
- The sources are official and current. Where they disagree with the knowledge base or list of Acts above, follow the sources. The Bharatiya Nyaya Sanhita, 2023 (BNS) replaced the Indian Penal Code (IPC), the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) replaced the Code of Criminal Procedure (CrPC), and the Bharatiya Sakshya Adhiniyam, 2023 (BSA) replaced the Indian Evidence Act, from 1 July 2024; the four Labour Codes replaced the older labour Acts from 21 November 2025.
- Current law first: name the current provision first and the old one after it in brackets, e.g. "BNS Section 103 (formerly IPC Section 302)". Give an old section number only when a source states it (source headings show "formerly IPC ..."); never guess one.
- Legal statements (what the law says, section numbers, punishments, time limits, rights) must come from the sources. Put the tag once at the end of each bullet or paragraph, e.g. [S1] or [S1][S3], not after every sentence. Use only the tags listed above.
{tips_rule}
- A source marked OMITTED or REPEALED is not current law: say so, and point to its replacement if a source names one.
- Mention the date a text is current to ("as on ...") where the source gives one.
- If the sources do not answer the question, say so plainly instead of guessing{tips_fallback}.
- {audience_note}{situation_note}

## ANSWER STRUCTURE
1. A direct answer in one or two plain sentences.
2. The steps or key points, if the question is about doing something.
3. "What the law says": the relevant provisions, current law first, with tags.{tips_section}
{last_step}. Last line: "This is legal information for awareness, not legal advice."

User Question: {question}"""
    return prompt, sources
