"""Tiny RAG: TF-IDF cosine search over a curated achievement library (no external vector DB).
Groq has no embeddings endpoint, so retrieval is lexical. Swap `search` for a vector store later."""
import math
import re
from collections import Counter

KB = [
    ("api-latency", "Reduced API latency by [X%] by adding Redis caching and asynchronous batching", "backend api redis cache latency python fastapi performance"),
    ("docker", "Containerised [N] services with Docker Compose, cutting onboarding time from [X days] to [Y minutes]", "docker compose devops container deployment kubernetes"),
    ("rest", "Built REST endpoints serving [N] daily requests at [X%] uptime", "rest api backend python fastapi node express uptime"),
    ("tests", "Raised test coverage from [X%] to [Y%] using pytest and CI checks", "testing pytest ci quality coverage unit"),
    ("react", "Designed a React dashboard that reduced support tickets by [X%]", "react frontend dashboard ui javascript typescript"),
    ("sql", "Optimised SQL queries and indexes, speeding reports by [X]x", "sql database postgresql index query performance mysql"),
    ("cicd", "Automated deployments with GitHub Actions, reducing release time by [X%]", "ci cd github actions automation devops git pipeline"),
    ("rag", "Built a retrieval-augmented pipeline over [N] documents reaching [X%] answer accuracy", "rag retrieval vector embeddings llm ai search qdrant"),
    ("cnn", "Trained a CNN classifier reaching [X%] accuracy on [N] images", "cnn pytorch tensorflow vision model ml deep learning machine image classifier"),
    ("lead", "Led a team of [N] to ship an MVP in [X weeks], adopted by [N] users", "team lead mvp project users leadership agile"),
    ("auth", "Implemented JWT authentication and role-based access for [N] user types", "auth jwt security access backend oauth"),
    ("agent", "Built an LLM agent that triages [tickets] and resolves [X%] without human help", "agent agentic ai automation llm tools langgraph"),
    ("etl", "Built ETL pipelines processing [N] records per day with [X%] fewer failures", "etl data pipeline airflow kafka spark python"),
    ("ml", "Improved model F1 score from [X] to [Y] through feature engineering and tuning", "machine learning model scikit-learn f1 features data science"),
    ("mobile", "Shipped a mobile app used by [N] people with a [X] star store rating", "mobile android ios flutter kotlin swift app"),
    ("cloud", "Cut cloud spend by [X%] by right-sizing instances and adding autoscaling", "aws cloud azure gcp cost autoscaling infrastructure"),
    ("security", "Found and fixed [N] vulnerabilities, hardening the app against OWASP Top 10 issues", "security owasp vulnerability pentest cybersecurity"),
    ("monitor", "Added Prometheus and Grafana monitoring that reduced incident detection time by [X%]", "monitoring prometheus grafana observability logging sre"),
    ("perf", "Improved page load time by [X%] using code splitting and lazy loading", "frontend performance web vitals lazy loading nextjs"),
    ("docs", "Wrote documentation and onboarding guides adopted by [N] engineers", "documentation communication onboarding mentoring"),
]
_tok = lambda s: re.findall(r"[a-z0-9+#.]{2,}", s.lower())


def _tf(doc: str) -> dict:
    c = Counter(_tok(doc))
    n = sum(c.values()) or 1
    return {t: v / n for t, v in c.items()}


_docs = [_tf(t + " " + g) for _, t, g in KB]
_N = len(KB)
_df = Counter(t for d in _docs for t in d)
_idf = {t: math.log((_N + 1) / (c + 1)) + 1 for t, c in _df.items()}
_default_idf = math.log(_N + 1) + 1


def _vec(tf: dict) -> dict:
    return {t: w * _idf.get(t, _default_idf) for t, w in tf.items()}


def _norm(v: dict) -> float:
    return math.sqrt(sum(x * x for x in v.values())) or 1.0


_dv = [_vec(d) for d in _docs]
_dn = [_norm(v) for v in _dv]


def search(query: str, k: int = 4) -> list:
    q = _vec(_tf(query))
    qn = _norm(q)
    scored = []
    for (eid, text, _), v, n in zip(KB, _dv, _dn):
        dot = sum(w * v.get(t, 0.0) for t, w in q.items())
        scored.append((dot / (qn * n), eid, text))
    scored.sort(key=lambda x: -x[0])
    return [{"id": i, "text": t, "score": round(s, 3)} for s, i, t in scored[:k] if s > 0]
