from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

class Settings(BaseSettings):
    # Hugging Face token for accessing private models
    # This is the ONLY environment variable - set via .env file: HF_TOKEN=your_token_here
    hf_token: Optional[str] = None

    # API Configuration (hardcoded)
    api_title: str = "Singlish Chatbot API"
    api_version: str = "1.0.0"
    debug: bool = True

    # CORS Configuration (hardcoded)
    cors_origins: List[str] = [
        "http://localhost:5173",
        "https://yh-singlish-chatbot.vercel.app",
        "https://nlp-project-f223i81vf-yuhuengs-projects.vercel.app"
    ]

    # Hugging Face Model Configuration (hardcoded)
    base_model_name: str = "yuhueng/qwen3-4b-singlish-base"
    adapter_repo_name: Optional[str] = None

    # Model loading configuration (hardcoded)
    device: str = "auto"
    torch_dtype: str = "float16"
    load_in_8bit: bool = False
    load_in_4bit: bool = False

    # Generation parameters (hardcoded)
    max_new_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9
    do_sample: bool = True

    # Legacy fields (kept for compatibility)
    model_name: str = "yuhueng/qwen3-4b-singlish-base"
    model_path: str = "yuhueng/qwen3-4b-singlish-base"
    adapter_path: Optional[str] = None

    # Server Configuration (hardcoded)
    host: str = "0.0.0.0"
    port: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        protected_namespaces=('settings_',),
        case_sensitive=False
    )

settings = Settings()