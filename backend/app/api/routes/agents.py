from fastapi import APIRouter
from pydantic import BaseModel

from app.services.agent_orchestrator import orchestrator

router = APIRouter(prefix="/agents", tags=["agents"])


class WorkflowRequest(BaseModel):
    workflow: str
    property_id: str | None = None
    params: dict | None = None


@router.get("")
async def list_agents():
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
async def run_agent(agent_name: str, params: dict | None = None):
    return await orchestrator.run_agent(agent_name, params)


@router.post("/workflow")
async def run_workflow(request: WorkflowRequest):
    return await orchestrator.run_workflow(
        request.workflow,
        request.property_id,
        request.params,
    )
