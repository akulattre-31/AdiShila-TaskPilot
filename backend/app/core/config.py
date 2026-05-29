from pydantic_settings import BaseSettings
from pydantic import validator

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    JWT_SECRET: str
    ALLOWED_ORIGIN: str
    ENVIRONMENT: str = "development"
    MAX_DAILY_AI_CALLS: int = 500

    @validator("JWT_SECRET")
    def must_be_strong(cls, v):
        assert len(v) >= 32, "JWT_SECRET must be >=32 characters"
        return v

    @validator("ALLOWED_ORIGIN")
    def must_be_https_in_prod(cls, v, values):
        if values.get("ENVIRONMENT") == "production":
            assert v.startswith("https://"), "ALLOWED_ORIGIN needs HTTPS"
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
