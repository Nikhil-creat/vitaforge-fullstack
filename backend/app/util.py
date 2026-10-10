import json
import re
import time
from collections import defaultdict, deque


class ModelFormatError(Exception):
    """The model did not return the JSON we asked for."""


def extract_json(text: str) -> dict:
    text = (text or "").strip()
    m = re.search(r"\{.*\}", text, re.S)
    for cand in (text, m.group(0) if m else None):
        if not cand:
            continue
        try:
            val = json.loads(cand)
            if isinstance(val, dict):
                return val
        except json.JSONDecodeError:
            continue
    raise ModelFormatError("Model did not return valid JSON")


def strs(value, n: int = 8) -> list:
    return [str(x).strip() for x in value if str(x).strip()][:n] if isinstance(value, list) else []


_NUM = re.compile(r"\d+(?:[.,]\d+)?")


def invented_numbers(original: str, new: str) -> list:
    """Numbers present in `new` that never appear in `original`."""
    base = set(_NUM.findall(original))
    return sorted({n for n in _NUM.findall(new) if n not in base})


def redact_numbers(text: str, numbers) -> str:
    nums = set(numbers)
    return _NUM.sub(lambda m: "[X]" if m.group(0) in nums else m.group(0), text)


class RateLimiter:
    """Sliding-window limiter, in memory (fine for a single free-tier instance)."""

    def __init__(self, limit: int, window: float = 60.0) -> None:
        self.limit, self.window = limit, window
        self.hits = defaultdict(deque)

    def allow(self, key: str, now: float = None) -> bool:
        now = time.monotonic() if now is None else now
        q = self.hits[key]
        while q and now - q[0] >= self.window:
            q.popleft()
        if len(q) >= self.limit:
            return False
        q.append(now)
        return True


def client_ip(headers, client_host) -> str:
    xff = headers.get("x-forwarded-for")
    return xff.split(",")[0].strip() if xff else (client_host or "unknown")
