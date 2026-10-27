from typing import Any, Dict, List

AUDIENCE_INSTRUCTIONS = {
    "school": "Explain in very simple language suitable for a school student, using everyday examples.",
    "citizen": "Explain in clear, everyday language suitable for a general adult citizen.",
    "law_student": "Explain with precise legal terminology suitable for a law student, including relevant nuances.",
}


def build_grounded_prompt(
    question: str,
    retrieved_chunks: List[Dict[str, Any]],
    audience_level: str = "citizen",
) -> str:
    """Builds a citation-forcing, grounded prompt for the generation model.

    Mirrors the formatting style already used in the Next.js baseline route
    (app/api/constitution-chat/route.ts) so the two systems are otherwise
    identical, isolating retrieval grounding as the only variable.
    """
    if not retrieved_chunks:
        context_block = "No relevant context was retrieved from the legal corpus."
    else:
        # Chunk text starts with its identifying header (see chunking.chunk_header).
        # Non-specialist audiences also get the plain-language summary, once per corpus item.
        show_simplified = audience_level != "law_student"
        entries = []
        summarised = set()
        for chunk in retrieved_chunks:
            entry = chunk["text"]
            simplified = chunk.get("simplified_text")
            if show_simplified and simplified and chunk.get("item_id") not in summarised:
                summarised.add(chunk.get("item_id"))
                entry += f"\nPlain-language summary: {simplified}"
            entries.append(entry)
        context_block = "\n\n".join(entries)

    audience_note = AUDIENCE_INSTRUCTIONS.get(audience_level, AUDIENCE_INSTRUCTIONS["citizen"])

    return f"""You are a knowledgeable AI assistant specializing in the Indian Constitution, key Indian Acts, and landmark judgments.

## RETRIEVED LEGAL CONTEXT (use ONLY this information to answer):
{context_block}

## INSTRUCTIONS:
- Answer strictly using the retrieved context above. Do not invent facts, articles, or case names.
- {audience_note}
- Always cite the article number, section number, or case name you used in your answer.
- If the retrieved context does not contain enough information to answer, say so explicitly and avoid speculation.
- This is legal information for awareness purposes, not legal advice.

**Response Formatting Guidelines:**
- Use ## for main headings
- Use ** for bold/important text
- Use bullet points with - for lists
- Include relevant article/section/case citations

User Question: {question}
"""
