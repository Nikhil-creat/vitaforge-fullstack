"""VitaForge API. Designed & developed by NIKHIL CHARY SRIRAMOJU."""
import json
from pathlib import Path
from typing import Annotated, List, Literal

from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from . import agent
from . import groq_client as groq
from . import prompts as P
from . import rag
from .config import settings
from .groq_client import GroqError
from .parsing import extract_text
from .util import ModelFormatError, RateLimiter, client_ip, extract_json, invented_numbers, redact_numbers, strs

Short = Annotated[str, Field(max_length=300)]
Long = Annotated[str, Field(max_length=6000)]


class Resume(BaseModel):
    name: Short = ""
    title: Short = ""
    email: Short = ""
    phone: Short = ""
    loc: Short = ""
    github: Short = ""
    linkedin: Short = ""
    summary: Long = ""
    skills: Long = ""
    exp: Long = ""
    projects: Long = ""
    edu: Long = ""
    certs: Long = ""
    ach: Long = ""


class ReviewReq(BaseModel):
    resume: Resume
    jd: Long = ""


class GenReq(ReviewReq):
    kind: Literal["cover_letter", "linkedin", "tailor", "interview_questions", "interview_question"]
    company: Short = ""
    role: Short = ""


class FeedbackReq(BaseModel):
    question: Annotated[str, Field(max_length=600)]
    answer: Annotated[str, Field(max_length=4000)]
    resume: Resume = Resume()


class Msg(BaseModel):
    role: Literal["user", "assistant"]
    content: Annotated[str, Field(max_length=2000)]


class ChatReq(BaseModel):
    resume: Resume = Resume()
    jd: Long = ""
    messages: Annotated[List[Msg], Field(min_length=1, max_length=20)]


class RagReq(BaseModel):
    query: Annotated[str, Field(max_length=500)]
    k: int = Field(4, ge=1, le=10)


app = FastAPI(title="VitaForge API", version="2.0.0", docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_methods=["GET", "POST"], allow_headers=["Content-Type"])
limiter = RateLimiter(settings.rate_per_min)
CSP = ("default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
       "font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob: https://cdnjs.cloudflare.com; "
       "frame-ancestors 'none'; base-uri 'self'")


@app.middleware("http")
async def security_headers(request: Request, call_next):
    resp = await call_next(request)
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["Referrer-Policy"] = "no-referrer"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Permissions-Policy"] = "camera=(), geolocation=(), microphone=(self)"
    if settings.csp and not request.url.path.startswith("/api/"):
        resp.headers["Content-Security-Policy"] = CSP
    return resp


@app.exception_handler(GroqError)
async def _groq_error(_, e: GroqError):
    return JSONResponse({"detail": e.message}, status_code=e.status)


@app.exception_handler(ModelFormatError)
async def _format_error(_, e: ModelFormatError):
    return JSONResponse({"detail": "The AI returned an unexpected format. Please try again."}, status_code=502)


async def limit(request: Request):
    if not limiter.allow(client_ip(request.headers, request.client.host if request.client else None)):
        raise HTTPException(429, "Too many requests. Please slow down a little.")


def guard(r: Resume, jd: str = "") -> dict:
    d = r.model_dump()
    if len(P.resume_text(d)) + len(jd) > settings.max_chars:
        raise HTTPException(413, "Resume plus job description is too long for one request.")
    return d


@app.get("/api/health")
async def health():
    return {"status": "ok", "ai": bool(settings.groq_api_key), "models": {"smart": settings.model_smart, "fast": settings.model_fast},
            "rate_limit_per_min": settings.rate_per_min}


@app.post("/api/rag/search", dependencies=[Depends(limit)])
async def rag_search(b: RagReq):
    return {"results": rag.search(b.query, b.k)}


@app.post("/api/ai/review", dependencies=[Depends(limit)])
async def review(b: ReviewReq):
    d = guard(b.resume, b.jd)
    out = extract_json(await groq.chat(P.review_messages(d, b.jd), settings.model_smart, json_mode=True, temperature=0.2, max_tokens=1100))
    base = P.resume_text(d)
    summary = str(out.get("summary_rewrite", ""))
    summary = redact_numbers(summary, invented_numbers(base, summary))
    bullets = [{"original": str(x.get("original", "")), "improved": redact_numbers(str(x.get("improved", "")), invented_numbers(base, str(x.get("improved", ""))))}
               for x in out.get("bullet_suggestions", []) if isinstance(x, dict)][:4]
    return {"verdict": str(out.get("verdict", "")), "strengths": strs(out.get("strengths"), 4), "weaknesses": strs(out.get("weaknesses"), 5),
            "missing_keywords": strs(out.get("missing_keywords"), 12), "summary_rewrite": summary, "bullet_suggestions": bullets}


@app.post("/api/ai/generate", dependencies=[Depends(limit)])
async def generate(b: GenReq):
    d = guard(b.resume, b.jd)
    smart = b.kind in ("cover_letter", "tailor")
    text = await groq.chat(P.generate_messages(b.kind, d, b.jd, b.company, b.role), settings.model_smart if smart else settings.model_fast,
                           temperature=0.5, max_tokens=900)
    return {"text": text.strip()}


@app.post("/api/ai/interview/feedback", dependencies=[Depends(limit)])
async def feedback(b: FeedbackReq):
    d = guard(b.resume)
    out = extract_json(await groq.chat(P.feedback_messages(b.question, b.answer, d), settings.model_smart, json_mode=True, temperature=0.3, max_tokens=800))
    try:
        score = max(1, min(10, int(out.get("score", 5))))
    except (TypeError, ValueError):
        score = 5
    return {"score": score, "feedback": str(out.get("feedback", "")), "improved_answer": str(out.get("improved_answer", ""))}


@app.post("/api/ai/chat/stream", dependencies=[Depends(limit)])
async def chat_stream(b: ChatReq):
    d = guard(b.resume, b.jd)
    msgs = [{"role": "system", "content": P.SYSTEM + "\nYou are chatting with the candidate. Use this context.\n" + P.ctx(d, b.jd)}]
    msgs += [m.model_dump() for m in b.messages[-8:]]

    async def gen():
        try:
            async for tok in groq.stream(msgs, settings.model_fast):
                yield f"data: {json.dumps({'t': tok})}\n\n"
        except GroqError as e:
            yield f"data: {json.dumps({'error': e.message})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/api/agent/run", dependencies=[Depends(limit)])
async def agent_run(b: ReviewReq):
    return await agent.run(guard(b.resume, b.jd), b.jd)


@app.post("/api/parse", dependencies=[Depends(limit)])
async def parse(file: UploadFile = File(...)):
    name = (file.filename or "").lower()
    if not name.endswith((".pdf", ".docx", ".txt", ".md")):
        raise HTTPException(415, "Upload a PDF, DOCX, TXT or MD file.")
    data = await file.read(5 * 1024 * 1024 + 1)
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(413, "File is larger than 5 MB.")
    try:
        text = await run_in_threadpool(extract_text, name, data)
    except Exception:
        raise HTTPException(422, "Could not read that file. Paste the text instead.")
    return {"text": text[:30000]}


FRONT = Path(__file__).resolve().parents[2] / "frontend"
if settings.serve_frontend and FRONT.is_dir():
    app.mount("/", StaticFiles(directory=str(FRONT), html=True), name="web")
