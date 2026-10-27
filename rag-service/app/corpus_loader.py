import json
from pathlib import Path
from typing import Any, Dict, List

from .config import settings


def load_corpus(corpus_path: str | None = None) -> List[Dict[str, Any]]:
    """Load the unified corpus JSON.

    Expected item schema (see RAG_PUBLICATION_PLAN.md Step 2.2):
    {
      id, source_type ("article" | "judgment" | "act_section" | "qa_pair"),
      title, act_or_case_name, number, year,
      original_text, simplified_text, audience_level,
      topic_tags[], language, source_dataset
    }
    """
    path = Path(corpus_path or settings.corpus_path)
    if not path.exists():
        raise FileNotFoundError(
            f"Corpus file not found at {path}. Run scripts/build_index.py after adding corpus data."
        )
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("Corpus file must contain a JSON array of items.")
    return data
