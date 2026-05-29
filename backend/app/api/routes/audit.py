from fastapi import APIRouter, Query

from app.core.auth import AuthenticatedUser, require_roles
from app.services.audit_service import audit_service

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/events")
async def list_audit_events(
    limit: int = Query(default=100, ge=1, le=500),
    _: AuthenticatedUser = require_roles("admin"),
):
    return {"items": audit_service.recent(limit=limit), "total": len(audit_service.recent(limit=500))}
