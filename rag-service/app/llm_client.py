from dataclasses import dataclass
from typing import Optional

import requests

from .config import settings


class LlmGenerationError(Exception):
    pass


@dataclass
class Generation:
    text: str
    model_version: Optional[str]
    prompt_tokens: Optional[int]
    output_tokens: Optional[int]


def generate_answer(prompt: str) -> Generation:
    """Deterministic Gemini call: temperature 0 and no thinking budget, so repeated runs of the
    evaluation give comparable answers (Gemini 2.5 Flash otherwise thinks for a variable time)."""
    if not settings.gemini_api_key:
        raise LlmGenerationError("GEMINI_API_KEY is not configured.")

    response = requests.post(
        settings.gemini_api_url,
        headers={"x-goog-api-key": settings.gemini_api_key},
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0, "thinkingConfig": {"thinkingBudget": 0}},
        },
        timeout=30,
    )

    if not response.ok:
        raise LlmGenerationError(f"Gemini API error: {response.status_code} {response.text}")

    data = response.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        reason = (data.get("candidates") or [{}])[0].get("finishReason") or data.get("promptFeedback")
        raise LlmGenerationError(f"Gemini returned no answer (reason: {reason}).")

    usage = data.get("usageMetadata", {})
    return Generation(
        text=text,
        model_version=data.get("modelVersion"),
        prompt_tokens=usage.get("promptTokenCount"),
        output_tokens=usage.get("candidatesTokenCount"),
    )
