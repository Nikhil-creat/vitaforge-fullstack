import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")
from fastapi.testclient import TestClient  # noqa: E402

from app import groq_client  # noqa: E402
from app.config import settings  # noqa: E402
from app.main import app  # noqa: E402

c = TestClient(app)


def test_health():
    r = c.get("/api/health")
    assert r.status_code == 200 and "ai" in r.json()


def test_rag_search():
    r = c.post("/api/rag/search", json={"query": "docker compose", "k": 3})
    assert r.status_code == 200 and r.json()["results"]


def test_generate_uses_groq(monkeypatch):
    async def fake(*a, **k):
        return "Dear team"
    monkeypatch.setattr(groq_client, "chat", fake)
    r = c.post("/api/ai/generate", json={"kind": "cover_letter", "resume": {"name": "A", "skills": "Python"}, "jd": "", "company": "X", "role": "Dev"})
    assert r.status_code == 200 and r.json()["text"] == "Dear team"


def test_input_too_long():
    big = {"summary": "x" * 5000, "exp": "y" * 5000, "projects": "z" * 5000}
    assert c.post("/api/ai/review", json={"resume": big, "jd": "j" * 5000}).status_code == 413


def test_missing_key(monkeypatch):
    monkeypatch.setattr(settings, "groq_api_key", "")
    assert c.post("/api/ai/review", json={"resume": {"name": "A"}, "jd": ""}).status_code == 503
