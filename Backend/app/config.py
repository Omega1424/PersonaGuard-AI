from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List


class Settings(BaseSettings):
    # ── HuggingFace token (optional — HF Spaces are public) ──────────────────
    hf_token: Optional[str] = None

    # ── Gemini API key (for LLM judge at reveal time) ─────────────────────────
    gemini_api_key: Optional[str] = None

    # ── API ────────────────────────────────────────────────────────────────────
    api_title: str = "PersonaGuard AI API"
    api_version: str = "3.0.0"
    debug: bool = True

    # ── CORS ───────────────────────────────────────────────────────────────────
    cors_origins: List[str] = [
        "http://localhost:5173",
        "https://yh-singlish-chatbot.vercel.app",
        "https://nlp-project-f223i81vf-yuhuengs-projects.vercel.app",
        "https://persona-guard-ai.vercel.app",
    ]

    # ── Legacy HuggingFace model config ───────────────────────────────────────
    base_model_name: str = "yuhueng/qwen3-4b-singlish-base"
    adapter_repo_name: Optional[str] = None
    device: str = "auto"
    torch_dtype: str = "float16"
    load_in_8bit: bool = False
    load_in_4bit: bool = False
    max_new_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9
    do_sample: bool = True
    model_name: str = "yuhueng/qwen3-4b-singlish-base"
    model_path: str = "yuhueng/qwen3-4b-singlish-base"
    adapter_path: Optional[str] = None

    # ── Server ─────────────────────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        protected_namespaces=("settings_",),
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
