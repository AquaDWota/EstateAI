from typing import Any, Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.auth import AuthenticatedUser, CurrentUser, require_roles
from app.services.audit_service import audit_service
from app.services.agent_orchestrator import orchestrator

router = APIRouter(prefix="/agents", tags=["agents"])


class WorkflowRequest(BaseModel):
    workflow: Literal[
        "full_analysis",
        "property_report",
        "portfolio_review",
        "market_analysis",
        "property_scoring",
        "opportunity_detection",
        "investor_report",
        "portfolio_optimization",
    ]
    property_id: str | None = Field(default=None, min_length=3, max_length=64)
    params: dict[str, Any] | None = None


@router.get("")
async def list_agents(_: AuthenticatedUser = CurrentUser):
    return {
        "agents": [
            {
                "id": "market_analysis",
                "name": "Market Analysis Agent",
                "description": "Tracks trends and economic indicators",
            },
            {
                "id": "property_scoring",
                "name": "Property Scoring Agent",
                "description": "Scores ROI, risk, rental demand, appreciation",
            },
            {
                "id": "opportunity_detection",
                "name": "Opportunity Detection Agent",
                "description": "Finds undervalued properties and growth zones",
            },
            {
                "id": "investor_report",
                "name": "Investor Report Agent",
                "description": "Generates investor-ready reports",
            },
            {
                "id": "portfolio_optimization",
                "name": "Portfolio Optimization Agent",
                "description": "Balances risk vs return allocation",
            },
        ]
    }


@router.post("/run")
async def run_agent(
    agent_name: str = Query(..., min_length=3, max_length=64),
    params: dict[str, Any] | None = None,
    user: AuthenticatedUser = require_roles("admin", "analyst"),
):
    result = await orchestrator.run_agent(agent_name, params)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    audit_service.record(
        user_id=user.id,
        action="agents.run",
        metadata={"agentName": agent_name},
    )
    return result


@router.post("/workflow")
async def run_workflow(
    request: WorkflowRequest,
    user: AuthenticatedUser = require_roles("admin", "analyst"),
):
    result = await orchestrator.run_workflow(
        request.workflow,
        request.property_id,
        request.params,
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    audit_service.record(
        user_id=user.id,
        action="agents.workflow",
        metadata={"workflow": request.workflow, "propertyId": request.property_id},
    )
    return result
