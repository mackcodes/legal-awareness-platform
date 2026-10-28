from typing import Any, Dict, List


def chunk_text(text: str, chunk_size: int = 650, overlap: int = 80) -> List[str]:
    """Split text into overlapping chunks by character count."""
    text = text.strip()
    if len(text) <= chunk_size:
        return [text] if text else []

    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end].strip())
        if end == len(text):
            break
        start = end - overlap
    return [c for c in chunks if c]


def chunk_header(item: Dict[str, Any]) -> str:
    """Identifying header prepended to every chunk, since source text rarely names itself
    (the text of Article 21 never says "Article 21")."""
    source_type = item.get("source_type")
    name = item.get("act_or_case_name") or ""
    title = item.get("title") or ""
    number = item.get("number")

    if source_type == "article":
        header = f"{name}, Article {number}: {title}"
    elif source_type == "act_section" and number:
        header = f"{name}, Section {number}: {title}"
    else:
        header = None
    if header:
        if item.get("status") == "omitted":
            header += " [OMITTED — not current law]"
        elif item.get("status") == "repealed":
            header += " [REPEALED — not current law]"
        if item.get("replaces"):
            header += f" (formerly IPC {', '.join(r['number'] for r in item['replaces'])})"
        if item.get("replaced_by"):
            header += f" (now {', '.join(i.replace('bns-s', 'BNS ') for i in item['replaced_by'])})"
        if item.get("source_edition"):
            # "As on 1st May, 2024" / "As enacted (25th December, 2023)" / "As amended up to 2017"
            edition = item["source_edition"]
            header += f" (text {edition[0].lower()}{edition[1:]})"
        # Everyday words the statute never uses ("FIR"), so search can match how people ask.
        if item.get("lay_terms"):
            header += f" [also called: {'; '.join(item['lay_terms'])}]"
        return header
    if source_type == "judgment":
        header = f"{name} ({item.get('decision_year', '')})"
        if item.get("citation"):
            header += f", {item['citation']}"
        if item.get("related_articles"):
            names = [
                f"Article {a.removeprefix('const-art-')}" if a.startswith("const-art-") else a.replace("-s", " ").upper()
                for a in item["related_articles"]
            ]
            header += f". Provisions: {', '.join(names)}"
        return header + "."
    return f"{name}: {title}" if title else name


def chunk_corpus_item(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Turn one corpus item into one or more chunk records carrying metadata."""
    base_text = item.get("original_text") or item.get("simplified_text") or ""
    # Amendment footnotes answer "when/why was this added" questions and carry facts such as
    # "struck down by the Supreme Court", so they are indexed with the text.
    if item.get("amendment_notes"):
        base_text += "\nAmendment notes:\n" + "\n".join(f"- {n}" for n in item["amendment_notes"])
    header = chunk_header(item)

    chunk_records = []
    for idx, chunk in enumerate(chunk_text(base_text)):
        chunk_records.append(
            {
                "chunk_id": f"{item.get('id')}::{idx}",
                "item_id": item.get("id"),
                "text": f"{header}\n{chunk}",
                "simplified_text": item.get("simplified_text"),
                "source_type": item.get("source_type"),
                "title": item.get("title"),
                "act_or_case_name": item.get("act_or_case_name"),
                "act_aliases": item.get("act_aliases", []),
                "replaces": item.get("replaces", []),
                "related_articles": item.get("related_articles", []),
                "number": item.get("number"),
                "year": item.get("year"),
                "status": item.get("status", "active"),
                "audience_level": item.get("audience_level"),
                "topic_tags": item.get("topic_tags", []),
                "language": item.get("language", "en"),
                "source_dataset": item.get("source_dataset"),
                "source_edition": item.get("source_edition"),
                "corpus_version": item.get("corpus_version"),
            }
        )
    return chunk_records
