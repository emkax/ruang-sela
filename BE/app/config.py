import os
from functools import lru_cache
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings  # type: ignore
from typing import Optional

class Settings(BaseSettings):
    supabase_url: Optional[str] = None
    supabase_service_key: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    model_name: str = "indobenchmark/indobert-base-p1"
    embedding_dim: int = 768
    openai_api_key: Optional[str] = None
    admin_key: str = "changeme"
    data_path: str = "../data/raw/ruangsela_DKI_bulk75_cookie_75.json"
    # allow HF token if private model
    hf_token: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
        # map env names
        fields = {
            "supabase_url": {"env": "SUPABASE_URL"},
            "supabase_service_key": {"env": "SUPABASE_SERVICE_KEY"},
            "supabase_anon_key": {"env": "SUPABASE_ANON_KEY"},
            "openai_api_key": {"env": "OPENAI_API_KEY"},
            "hf_token": {"env": "HF_TOKEN"},
            "model_name": {"env": "MODEL_NAME"},
        }

    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and (self.supabase_service_key or self.supabase_anon_key))

@lru_cache
def get_settings() -> Settings:
    # load from BE/.env explicitly if running from different cwd
    # pydantic already handles but ensure
    for cand in [".env", "BE/.env", "../.env"]:
        if os.path.exists(cand):
            break
    return Settings()
