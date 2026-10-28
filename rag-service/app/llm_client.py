import re
import time
from dataclasses import dataclass
from typing import Optional

import requests

from .config import settings

# On a rate-limit reply, wait the delay Gemini suggests and retry once, but only if that delay is
# short: a user waiting longer than this is better served by a clear error.
MAX_RETRY_WAIT_S = 20
OVERLOAD_RETRY_WAITS_S = (2, 5)


class LlmGenerationError(Exception):
    pass


@dataclass
class Generation:
    text: str
    model_version: Optional[str]
    prompt_tokens: Optional[int]
    output_tokens: Optional[int]


def _retry_delay(response: requests.Response) -> Optional[float]:
    """Seconds Gemini asks us to wait, from its RetryInfo ("retryDelay": "14s")."""
    match = re.search(r'"retryDelay":\s*"(\d+(?:\.\d+)?)s"', response.text)
    return float(match.group(1)) if match else None


def generate_answer(prompt: str, deterministic: bool = True) -> Generation:
    """Deterministic Gemini call: temperature 0 and no thinking budget, so repeated runs of the
    evaluation give comparable answers (Gemini 2.5 Flash otherwise thinks for a variable time).
    deterministic=False sends Gemini's defaults, as the production chatbot does (System A)."""
    if not settings.gemini_api_key:
        raise LlmGenerationError("GEMINI_API_KEY is not configured.")

    body: dict = {"contents": [{"parts": [{"text": prompt}]}]}
    if deterministic:
        body["generationConfig"] = {"temperature": 0, "thinkingConfig": {"thinkingBudget": 0}}

    def call() -> requests.Response:
        try:
            return requests.post(
                settings.gemini_api_url,
                headers={"x-goog-api-key": settings.gemini_api_key},
                json=body,
                timeout=30,
            )
        except requests.Timeout:
            raise LlmGenerationError("Gemini did not respond within 30 s; please try again.")
        except requests.RequestException as exc:
            raise LlmGenerationError(f"Could not reach Gemini: {exc.__class__.__name__}.")

    response = call()
    # 503 means the model is briefly overloaded; it usually clears within seconds.
    for overload_wait in OVERLOAD_RETRY_WAITS_S:
        if response.status_code != 503:
            break
        time.sleep(overload_wait)
        response = call()
    if response.status_code == 429:
        wait = _retry_delay(response)
        if wait is not None and wait <= MAX_RETRY_WAIT_S:
            time.sleep(wait)
            response = call()
    if response.status_code == 429:
        # The free tier limits both requests per minute and per day (gemini-2.5-flash: 5/min, 20/day).
        wait = _retry_delay(response)
        if wait is None:
            raise LlmGenerationError("Gemini quota exceeded.")
        if wait > 120:
            raise LlmGenerationError(f"Gemini daily quota used up; it resets in about {wait / 3600:.1f} hours.")
        raise LlmGenerationError(f"Gemini per-minute limit reached; retry in about {wait:.0f} s.")
    if not response.ok:
        raise LlmGenerationError(f"Gemini API error: {response.status_code} {response.text[:300]}")

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
