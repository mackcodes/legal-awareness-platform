from typing import Any, Dict, List, Tuple

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
    # which also carries "[OMITTED — not current law]" / "(text as on <date>)" markers.
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
) -> Tuple[str, List[Dict[str, Any]]]:
    """Builds a citation-forcing, grounded prompt, and returns it with the numbered sources so the
    answer's [S#] tags can be mapped back to corpus items.

    Mirrors the formatting style already used in the Next.js baseline route
    (app/api/constitution-chat/route.ts) so the two systems are otherwise
    identical, isolating retrieval grounding as the only variable.
    """
    sources = number_sources(retrieved_chunks)
    if not sources:
        context_block = "No relevant context was retrieved from the legal corpus."
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

    prompt = f"""You are a knowledgeable AI assistant specializing in the Indian Constitution, key Indian Acts, and landmark judgments.

## RETRIEVED LEGAL SOURCES (use ONLY these to answer):
{context_block}

## INSTRUCTIONS:
- Answer strictly using the sources above. Do not invent facts, articles, sections, or case names.
- After every statement that relies on a source, add its tag, e.g. [S1] or [S1][S3]. Only use tags listed above.
- {audience_note}
- Name the article, section, or case you rely on, and mention the date the text is current to ("as on ...") where the source gives one.
- A source marked OMITTED or REPEALED is not current law: say so, and point to its replacement if the sources name one.
- If the sources do not contain enough information to answer, say so plainly instead of guessing, and do not add tags.
- This is legal information for awareness purposes, not legal advice.{situation_note}

**Response Formatting Guidelines:**
- Use ## for main headings
- Use ** for bold/important text
- Use bullet points with - for lists

User Question: {question}
"""
    return prompt, sources
