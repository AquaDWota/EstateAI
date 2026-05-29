from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.core.auth import AuthenticatedUser, CurrentUser
from app.core.config import settings
from app.core.rate_limit import rate_limiter, request_actor_key
from app.services.audit_service import audit_service
from app.services.ai_service import ai_service

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant|system)$")
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    history: list[ChatMessage] | None = None
    session_id: str | None = None


@router.post("")
async def chat(request: ChatRequest, raw_request: Request, user: AuthenticatedUser = CurrentUser):
    rate_limiter.check(
        key=f"chat:{request_actor_key(raw_request)}",
        max_requests=settings.chat_rate_limit_per_minute,
        window_seconds=60,
    )
    response = await ai_service.chat(
        request.message,
        [item.model_dump() for item in request.history] if request.history else None,
    )
    audit_service.record(
        user_id=user.id,
        action="chat.request",
        metadata={"sessionId": request.session_id or "default"},
    )
    return {
        "message": response,
        "sessionId": request.session_id or "default",
    }


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    raw_request: Request,
    user: AuthenticatedUser = CurrentUser,
):
    rate_limiter.check(
        key=f"chat_stream:{request_actor_key(raw_request)}",
        max_requests=settings.chat_rate_limit_per_minute,
        window_seconds=60,
    )

    async def generate():
        audit_service.record(
            user_id=user.id,
            action="chat.stream.request",
            metadata={"sessionId": request.session_id or "default"},
        )
        text = await ai_service.chat(
            request.message,
            [item.model_dump() for item in request.history] if request.history else None,
        )
        words = text.split(" ")
        for i, word in enumerate(words):
            chunk = word + (" " if i < len(words) - 1 else "")
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
