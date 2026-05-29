from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Estate AI API"
    environment: str = "development"
    api_prefix: str = "/api/v1"
    database_url: str = "postgresql+asyncpg://estateai:estateai@localhost:5432/estateai"
    openai_api_key: str = ""
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    auth_required_in_production: bool = True
    chat_rate_limit_per_minute: int = 30
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def supabase_auth_user_url(self) -> str:
        if not self.supabase_url:
            return ""
        return f"{self.supabase_url.rstrip('/')}/auth/v1/user"

    @property
    def supabase_api_key(self) -> str:
        return self.supabase_service_role_key or self.supabase_anon_key

    @property
    def asyncpg_dsn(self) -> str:
        return self.database_url.replace("postgresql+asyncpg://", "postgresql://")


settings = Settings()
