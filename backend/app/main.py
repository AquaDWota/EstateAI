import time
import uuid
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import agents, audit, chat, dashboard, properties
from app.core.config import settings
from app.services.property_repository import property_repository

logger = logging.getLogger("estateai.api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

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
app.include_router(audit.router, prefix=settings.api_prefix)


@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    start = time.perf_counter()
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["x-request-id"] = request_id
    response.headers["x-process-time-ms"] = str(round((time.perf_counter() - start) * 1000, 2))
    logger.info(
        "request method=%s path=%s status=%s request_id=%s duration_ms=%s",
        request.method,
        request.url.path,
        response.status_code,
        request_id,
        response.headers["x-process-time-ms"],
    )
    return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    logger.exception("unhandled_error path=%s request_id=%s", request.url.path, request_id)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": str(exc),
            "requestId": request_id,
        },
    )


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": settings.app_name,
        "openaiConfigured": bool(settings.openai_api_key),
        "supabaseConfigured": bool(settings.supabase_auth_user_url and settings.supabase_api_key),
    }


@app.get("/ready")
async def readiness():
    database_ready = False
    try:
        _ = await property_repository.count_properties()
        database_ready = True
    except Exception:
        database_ready = False

    status_code = 200 if database_ready else 503
    payload = {
        "status": "ready" if database_ready else "degraded",
        "databaseReady": database_ready,
        "openaiConfigured": bool(settings.openai_api_key),
        "supabaseConfigured": bool(settings.supabase_auth_user_url and settings.supabase_api_key),
    }
    return JSONResponse(status_code=status_code, content=payload)
