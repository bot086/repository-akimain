"""
config.py — Centralised environment variable management.
All settings are loaded from the .env file.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_env: str = "development"
    secret_key: str = "changeme"

    # Database
    database_url: str = "sqlite:///./akkira.db"

    # Upload directory (use /data/uploads on Render persistent disk)
    upload_dir: str = ""

    # Contact Details — update these in .env
    whatsapp_number: str = "918660976964"
    whatsapp_greeting: str = "Hi+Akshay%2C+I+saw+your+portfolio+and+would+love+to+collaborate%21"
    contact_email: str = "mahesh.mudalagiri@gmail.com"
    instagram_handle: str = "@akira_weddings"

    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
