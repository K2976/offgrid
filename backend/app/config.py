from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "OffGrid API"
    app_env: str = "development"
    app_debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str = "sqlite:///./offgrid.db"

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_minutes: int = 60 * 24 * 7

    cors_allowed_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"]
    )

    request_body_max_bytes: int = 1_000_000

    groq_api_key: str = ""
    gemini_api_key: str = ""

    instagram_api_base_url: str = ""
    instagram_access_token: str = ""
    linkedin_api_base_url: str = ""
    linkedin_access_token: str = ""
    google_analytics_property_id: str = ""
    google_analytics_credentials_json: str = ""
    google_search_console_site_url: str = ""
    google_search_console_credentials_json: str = ""
    pagespeed_api_key: str = ""

    telegram_bot_token: str = ""
    telegram_default_chat_id: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""

    redis_url: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
