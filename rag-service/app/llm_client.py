import requests

from .config import settings


class LlmGenerationError(Exception):
    pass


def generate_answer(prompt: str) -> str:
    if not settings.gemini_api_key:
        raise LlmGenerationError("GEMINI_API_KEY is not configured.")

    response = requests.post(
        f"{settings.gemini_api_url}?key={settings.gemini_api_key}",
        json={"contents": [{"parts": [{"text": prompt}]}]},
        timeout=30,
    )

    if not response.ok:
        raise LlmGenerationError(f"Gemini API error: {response.status_code} {response.text}")

    data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        return "Sorry, I could not generate an answer."
