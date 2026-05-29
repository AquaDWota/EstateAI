from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.ai_service import ai_service

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None
    session_id: str | None = None


@router.post("")
async def chat(request: ChatRequest):
    response = await ai_service.chat(request.message, request.history)
    return {
        "message": response,
        "sessionId": request.session_id or "default",
    }


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    async def generate():
        text = await ai_service.chat(request.message, request.history)
        words = text.split(" ")
        for i, word in enumerate(words):
            chunk = word + (" " if i < len(words) - 1 else "")
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
