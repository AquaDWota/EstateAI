from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import agents, chat, dashboard, properties
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="AI-powered real estate investment platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties.router, prefix=settings.api_prefix)
app.include_router(dashboard.router, prefix=settings.api_prefix)
app.include_router(chat.router, prefix=settings.api_prefix)
app.include_router(agents.router, prefix=settings.api_prefix)


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}
