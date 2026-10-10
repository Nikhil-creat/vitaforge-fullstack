"""Minimal async client for Groq's OpenAI-compatible chat API (JSON + streaming)."""
import json

import httpx

from .config import settings


class GroqError(Exception):
    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status, self.message = status, message


def _headers() -> dict:
    return {"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"}


def _check() -> None:
    if not settings.groq_api_key:
        raise GroqError(503, "GROQ_API_KEY is not set on the server.")


def _map(resp) -> GroqError:
    if resp.status_code == 401:
        return GroqError(502, "Groq rejected the API key. Check GROQ_API_KEY.")
    if resp.status_code == 429:
        ra = resp.headers.get("retry-after")
        return GroqError(429, "Groq free-tier rate limit reached" + (f"; retry in {ra}s." if ra else ". Try again shortly."))
    try:
        msg = resp.json()["error"]["message"]
    except Exception:
        msg = resp.text[:200]
    return GroqError(502, f"Groq error {resp.status_code}: {msg}")


async def chat(messages, model, *, json_mode=False, temperature=0.3, max_tokens=1400) -> str:
    _check()
    payload = {"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens}
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    try:
        async with httpx.AsyncClient(timeout=settings.timeout) as c:
            r = await c.post(f"{settings.groq_base}/chat/completions", headers=_headers(), json=payload)
    except httpx.HTTPError as e:
        raise GroqError(504, f"Could not reach Groq ({e.__class__.__name__}).")
    if r.status_code != 200:
        raise _map(r)
    return r.json()["choices"][0]["message"]["content"] or ""


async def stream(messages, model, *, temperature=0.4, max_tokens=900):
    _check()
    payload = {"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens, "stream": True}
    try:
        async with httpx.AsyncClient(timeout=settings.timeout) as c:
            async with c.stream("POST", f"{settings.groq_base}/chat/completions", headers=_headers(), json=payload) as r:
                if r.status_code != 200:
                    await r.aread()
                    raise _map(r)
                async for line in r.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    d = line[5:].strip()
                    if d == "[DONE]":
                        break
                    try:
                        tok = json.loads(d)["choices"][0]["delta"].get("content")
                    except (ValueError, KeyError, IndexError):
                        continue
                    if tok:
                        yield tok
    except httpx.HTTPError as e:
        raise GroqError(504, f"Could not reach Groq ({e.__class__.__name__}).")
