from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Estate AI API"
    api_prefix: str = "/api/v1"
    database_url: str = "postgresql+asyncpg://estateai:estateai@localhost:5432/estateai"
    openai_api_key: str = ""
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
