import os


def _b(name: str, default: bool) -> bool:
    return os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


class Settings:
    """Environment-driven settings. The Groq key is read from the server environment only."""

    def __init__(self) -> None:
        self.groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
        self.groq_base = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        self.model_smart = os.getenv("GROQ_MODEL_SMART", "llama-3.3-70b-versatile")
        self.model_fast = os.getenv("GROQ_MODEL_FAST", "llama-3.1-8b-instant")
        self.origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o.strip()]
        self.rate_per_min = int(os.getenv("RATE_LIMIT_PER_MIN", "20"))
        self.max_chars = int(os.getenv("MAX_INPUT_CHARS", "12000"))
        self.timeout = float(os.getenv("GROQ_TIMEOUT", "45"))
        self.csp = _b("ENABLE_CSP", True)
        self.serve_frontend = _b("SERVE_FRONTEND", True)


settings = Settings()
