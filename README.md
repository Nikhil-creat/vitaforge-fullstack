# VitaForge — AI Resume Studio (Full-Stack)
Designed and developed by **NIKHIL CHARY SRIRAMOJU**

Upload a resume → ATS score + fix list → AI agent rewrites it into a one-page, ATS-safe resume. FastAPI backend calls **Groq** (free tier) so your API key stays on the server.

```
Browser (frontend/)  ──►  FastAPI (backend/app)  ──►  Groq API (Llama)
  ATS scoring, parser        rate limit, validation      llama-3.3-70b (smart)
  resume editor, PDF         RAG (TF-IDF), agent loop    llama-3.1-8b  (fast)
  AI panel + chat (SSE)      CSP + security headers
```

## Features
- Quill-style UI (light/dark, animated hero, Docker demo), prefilled studio
- Local ATS scoring (10-part rubric), live gauge, one-page auto-fit, export real DOCX (Word, validated), PDF (print to PDF), .txt, .html
- **Agent** (`/api/agent/run`): diagnose → RAG retrieve → rewrite → critic → revise → guardrail. Any number the model invents is replaced with `[X]`.
- AI review, cover letter, tailor-to-job, LinkedIn, interview questions, mock-interview feedback (with voice dictation), streaming career chat
- Server-side PDF/DOCX parsing; works offline with local templates if the API is down
- PWA, Docker, CI tests, GitHub Pages + Render deploy configs

## 1. Get a free Groq key
1. https://console.groq.com → sign up (no card on the free tier) → **API Keys → Create API Key**. Copy it (starts with `gsk_`).
2. Free-tier limits change; check https://console.groq.com/docs/rate-limits. At the time of writing, llama-3.3-70b allowed about 30 requests/min and 1,000/day. Models are set in `.env` (`GROQ_MODEL_SMART`, `GROQ_MODEL_FAST`).
3. Never put the key in frontend code or commit `.env`. If it leaks, revoke it in the console.

## 2. Run locally
```
cp .env.example .env          # then paste your key into GROQ_API_KEY
cd backend
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
set -a; source ../.env; set +a                         # Windows: set the variables manually
uvicorn app.main:app --reload --port 8000
```
Open http://localhost:8000 (API docs at /api/docs). The badge in the AI panel should say **Groq online**.

**Docker:** `cp .env.example .env` (add key) → `docker compose up --build` → http://localhost:8000

**Tests:** `cd backend && pip install pytest && python -m pytest -q`

## 3. Put it on GitHub
1. github.com → **+ → New repository** → `vitaforge-fullstack`, Public, no README/template → Create.
2. Unzip the project, then in the folder:
```
git init
git add .
git status          # confirm .env is NOT listed (only .env.example)
git commit -m "VitaForge full-stack"
git branch -M main
git remote add origin https://github.com/Nikhil-creat/vitaforge-fullstack.git
git push -u origin main
```
(Password prompt → use a Personal Access Token: GitHub → Settings → Developer settings → Tokens.)
No terminal? Repo page → **uploading an existing file** → drag the *contents* of the folder (keep `backend/`, `frontend/`, `Dockerfile`, `render.yaml`, `.github`). Do not upload `.env`.

## 4. Deploy free
### Option A (simplest): everything on Render
1. https://render.com → sign in with GitHub → **New → Blueprint** → pick your repo (it reads `render.yaml`). Or **New → Web Service → Docker**.
2. When asked for `GROQ_API_KEY`, paste your key (it is stored as a secret on Render, not in Git).
3. Deploy. You get `https://vitaforge-xxxx.onrender.com`; the backend serves the website too. Health check: `/api/health`.
Note: free web services may sleep after inactivity, so the first request can take ~30–60 s. Check render.com/pricing for current free-plan terms.

### Option B: frontend on GitHub Pages + backend on Render
1. Deploy the backend as in Option A. In Render → Environment set `ALLOWED_ORIGINS=https://nikhil-creat.github.io` (origin only, lowercase, no path).
2. Edit `frontend/config.js`: `window.VF_API = "https://vitaforge-xxxx.onrender.com";` and push.
3. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. The included workflow publishes `frontend/`.
4. Open https://Nikhil-creat.github.io/vitaforge-fullstack/
Without a backend the site still works in local mode (scoring, builder, templates); only the Groq features need the API.

Other free hosts for the backend: Hugging Face Spaces (Docker), Fly.io, Railway (free allowances vary). Frontend alone: Netlify Drop, Cloudflare Pages, Vercel.

## API
| Route | Purpose |
|---|---|
| GET `/api/health` | status, whether a key is configured |
| POST `/api/agent/run` | RAG + critic agent, returns trace and rewritten sections |
| POST `/api/ai/review` | JSON review, summary rewrite, bullet ideas |
| POST `/api/ai/generate` | `cover_letter`, `linkedin`, `tailor`, `interview_questions`, `interview_question` |
| POST `/api/ai/interview/feedback` | score + STAR-style improved answer |
| POST `/api/ai/chat/stream` | streaming chat (SSE) |
| POST `/api/rag/search` | achievement-library search |
| POST `/api/parse` | PDF/DOCX/TXT → text (5 MB max) |

## Security notes
Key only in server env · per-IP rate limit (`RATE_LIMIT_PER_MIN`) · input size limits · resume text is passed to the model as untrusted data · LLM output rendered as text, never HTML · CSP and security headers (set `ENABLE_CSP=0` if you add external scripts) · set `ALLOWED_ORIGINS` to your site in production. Free Groq usage may not carry privacy guarantees, so avoid sending sensitive details you would not want processed by a third party.

## Troubleshooting
- Badge says "add GROQ_API_KEY" → env var missing on the server. · 429 → Groq free limit; wait a minute. · 502 "unexpected format" → retry.
- CORS error from Pages → `ALLOWED_ORIGINS` must match the Pages origin exactly.
- 404 on Pages → check Settings → Pages source is GitHub Actions and the workflow run is green.

MIT License © 2026 NIKHIL CHARY SRIRAMOJU
