"""Agentic pipeline: diagnose -> retrieve (RAG) -> rewrite -> critic -> (revise) -> guardrail."""
from . import groq_client as groq
from . import prompts as P
from . import rag
from .config import settings
from .util import extract_json, invented_numbers, redact_numbers, strs

OUT = ("summary", "skills", "exp", "projects")


def _coerce(v, fallback: str) -> str:
    if isinstance(v, list):
        v = "\n".join(str(x) for x in v)
    return str(v or "").strip() or fallback


async def run(resume: dict, jd: str) -> dict:
    trace = []
    original = P.resume_text(resume)
    diag = extract_json(await groq.chat(P.diagnose_messages(resume, jd), settings.model_fast, json_mode=True, temperature=0.2, max_tokens=500))
    weak, kw = strs(diag.get("weak_areas"), 5), strs(diag.get("target_keywords"), 8)
    trace.append({"step": "diagnose", "detail": "; ".join(weak) or "no major gaps found"})
    query = " ".join([str(diag.get("rag_query", "")), resume.get("skills", ""), resume.get("title", "")])
    examples = rag.search(query, 4)
    trace.append({"step": "retrieve", "detail": [e["text"] for e in examples]})
    issues, cand, problems = [], {}, []
    for attempt in (1, 2):
        raw = extract_json(await groq.chat(P.rewrite_messages(resume, jd, weak, kw, examples, issues), settings.model_smart,
                                           json_mode=True, temperature=0.3, max_tokens=1700))
        cand = {k: _coerce(raw.get(k), resume.get(k, "")) for k in OUT}
        trace.append({"step": "rewrite", "detail": f"draft {attempt}"})
        nums = invented_numbers(original, " ".join(cand.values()))
        crit = extract_json(await groq.chat(P.critic_messages(resume, cand), settings.model_fast, json_mode=True, temperature=0, max_tokens=400))
        problems = ([f"new numbers: {', '.join(nums)}"] if nums else []) + [f"not in original: {x}" for x in strs(crit.get("invented"), 6)]
        trace.append({"step": "critic", "detail": "passed" if not problems else "; ".join(problems)})
        if not problems:
            break
        issues = problems
    passed = not problems
    if not passed:
        nums = invented_numbers(original, " ".join(cand.values()))
        cand = {k: redact_numbers(v, nums) for k, v in cand.items()}
        trace.append({"step": "guardrail", "detail": "invented numbers replaced with [X]; please review the wording"})
    return {"trace": trace, "resume": cand, "critic": {"passed": passed, "notes": problems},
            "models": {"smart": settings.model_smart, "fast": settings.model_fast}}
