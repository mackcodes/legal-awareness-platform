"""Ingest the hand-written in-app data (app/data/constitution.ts, app/data/acts.ts).

Node imports the TypeScript modules directly (type stripping, Node >= 22.18), which is safer
than parsing TypeScript with regex.

Articles contribute `simplified_text` keyed onto the shared `const-art-<n>` ID; merge_corpus.py
lets an authoritative source supply `original_text`. Acts contribute sections, an overview item
and a fines table, all with source_dataset "app-data".

Usage (from rag-service/):
    python scripts/ingest/ingest_app_data.py
"""
import json
import subprocess
from typing import Any, Dict, List

from common import REPO_DIR, write_part

# Acts in acts.ts that are no longer in force, keyed by act id. Source: BNS s. 358 and the BNS
# commencement notification (both in the corpus via ingest_acts.py).
REPEALED = {
    "ipc": "Repealed by section 358 of the Bharatiya Nyaya Sanhita, 2023 with effect from 1 July 2024. "
    "Offences committed on or after that date are governed by the BNS.",
}

_EXPORT_JS = """
const { CONSTITUTION_PARTS } = await import('./app/data/constitution.ts');
const { INDIAN_ACTS } = await import('./app/data/acts.ts');
process.stdout.write(JSON.stringify({ parts: CONSTITUTION_PARTS, acts: INDIAN_ACTS }));
"""


def load_app_data() -> Dict[str, Any]:
    result = subprocess.run(
        ["node", "--input-type=module", "-e", _EXPORT_JS],
        cwd=REPO_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return json.loads(result.stdout)


def article_items(parts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items = []
    for part in parts:
        for article in part["articlesList"]:
            items.append(
                {
                    "id": f"const-art-{article['number']}",
                    "source_type": "article",
                    "title": article["title"],
                    "act_or_case_name": "Constitution of India",
                    "number": article["number"],
                    "year": "1950",
                    "original_text": article.get("content") or article["description"],
                    "simplified_text": article["description"],
                    "audience_level": "citizen",
                    "topic_tags": [f"part-{part['number']}", part["name"]],
                    "language": "en",
                    "status": "active",
                    "source_dataset": "app-data",
                }
            )
    return items


def act_items(acts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items = []
    for act in acts:
        base = {
            "act_or_case_name": act["fullName"],
            "act_aliases": sorted({act["name"], act["fullName"], act["id"].replace("-", " ")}),
            "year": act["year"],
            "audience_level": "citizen",
            "topic_tags": [act["category"]],
            "language": "en",
            "status": "repealed" if act["id"] in REPEALED else "active",
            "amendment_notes": [REPEALED[act["id"]]] if act["id"] in REPEALED else [],
            "source_dataset": "app-data",
        }
        objectives ="\n".join(f"- {o}" for o in act.get("objectives", []))
        items.append(
            {
                **base,
                "id": f"{act['id']}-overview",
                "source_type": "act_section",
                "title": "Overview and objectives",
                "number": None,
                "original_text": f"{act['description']}\nObjectives:\n{objectives}",
            }
        )
        for section in act["sections"]:
            items.append(
                {
                    **base,
                    "id": f"{act['id']}-s{section['number']}",
                    "source_type": "act_section",
                    "title": section["title"],
                    "number": section["number"],
                    "original_text": section.get("content") or section["description"],
                    "simplified_text": section["description"],
                }
            )
        if act.get("fines"):
            lines = [
                f"- {f['violation']} ({f['section']}): {f['penalty']}"
                + (f"; imprisonment: {f['imprisonment']}" if f.get("imprisonment") else "")
                for f in act["fines"]
            ]
            items.append(
                {
                    **base,
                    "id": f"{act['id']}-fines",
                    "source_type": "act_section",
                    "title": "Penalties and fines",
                    "number": None,
                    "original_text": "\n".join(lines),
                }
            )
    return items


def main() -> None:
    data = load_app_data()
    write_part("app-data", article_items(data["parts"]) + act_items(data["acts"]))


if __name__ == "__main__":
    main()
