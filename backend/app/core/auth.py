from dataclasses import dataclass

import httpx
from fastapi import Depends, Header, HTTPException, Request, status

from app.core.config import settings


@dataclass
class AuthenticatedUser:
    id: str
    email: str | None = None
    role: str = "analyst"


def _is_production() -> bool:
    env = (getattr(settings, "environment", "") or "").lower()
    return env in {"production", "prod"} or __import__("os").environ.get("ENVIRONMENT", "").lower() in {"production", "prod"}


def _auth_configured() -> bool:
    return bool(settings.supabase_auth_user_url and settings.supabase_api_key)


async def _fetch_supabase_user(access_token: str) -> dict:
    timeout = httpx.Timeout(8.0, connect=3.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(
            settings.supabase_auth_user_url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "apikey": settings.supabase_api_key,
            },
        )
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )
    data = response.json()
    if not isinstance(data, dict) or "id" not in data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to resolve authenticated user.",
        )
    return data


async def require_user(
    request: Request,
    authorization: str | None = Header(default=None),
) -> AuthenticatedUser:
    if not _auth_configured():
        if _is_production() and settings.auth_required_in_production:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authentication is not configured.",
            )
        # Local/demo fallback while still exposing a consistent user object.
        return AuthenticatedUser(id="dev-user", email="dev@localhost")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )
    token = authorization.replace("Bearer ", "", 1).strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )

    user_payload = await _fetch_supabase_user(token)
    request.state.user_id = user_payload.get("id")
    request.state.user_email = user_payload.get("email")
    return AuthenticatedUser(
        id=user_payload["id"],
        email=user_payload.get("email"),
        role=(
            user_payload.get("app_metadata", {}).get("role")
            or user_payload.get("user_metadata", {}).get("role")
            or user_payload.get("role")
            or "analyst"
        ),
    )


CurrentUser = Depends(require_user)


def require_roles(*roles: str):
    allowed = {role.lower() for role in roles}

    async def dependency(user: AuthenticatedUser = CurrentUser) -> AuthenticatedUser:
        if user.role.lower() not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role permissions.",
            )
        return user

    return Depends(dependency)
