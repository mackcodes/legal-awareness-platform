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
        return f"{name}, Article {number}: {title}"
    if source_type == "act_section" and number:
        return f"{name}, Section {number}: {title}"
    if source_type == "judgment":
        header = f"{name} ({item.get('decision_year', '')})"
        if item.get("citation"):
            header += f", {item['citation']}"
        if item.get("related_articles"):
            numbers = [a.removeprefix("const-art-") for a in item["related_articles"]]
            header += f". Articles: {', '.join(numbers)}"
        return header + "."
    return f"{name}: {title}" if title else name


def chunk_corpus_item(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Turn one corpus item into one or more chunk records carrying metadata."""
    base_text = item.get("original_text") or item.get("simplified_text") or ""
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
                "number": item.get("number"),
                "year": item.get("year"),
                "status": item.get("status", "active"),
                "audience_level": item.get("audience_level"),
                "topic_tags": item.get("topic_tags", []),
                "language": item.get("language", "en"),
                "source_dataset": item.get("source_dataset"),
                "corpus_version": item.get("corpus_version"),
            }
        )
    return chunk_records
