import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

from .config import settings


def log_query(record: Dict[str, Any]) -> None:
    """Append a query/response record as JSONL for later evaluation (Step 6 metrics).

    Fields mirror the Next.js baseline logging shape so both systems can be
    compared fairly during evaluation.
    """
    path = Path(settings.log_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    record = {"timestamp": datetime.now(timezone.utc).isoformat(), "system": "rag", **record}
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
