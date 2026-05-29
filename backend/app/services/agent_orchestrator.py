import asyncio
from datetime import UTC, datetime
from typing import Any

from app.services.agents.investor_report import InvestorReportAgent
from app.services.agents.market_analysis import MarketAnalysisAgent
from app.services.agents.opportunity_detection import OpportunityDetectionAgent
from app.services.agents.portfolio_optimization import PortfolioOptimizationAgent
from app.services.agents.property_scoring import PropertyScoringAgent
from app.services.property_repository import property_repository


class AgentOrchestrator:
    """Coordinates autonomous agent workflows with async execution."""

    def __init__(self):
        self.agents = {
            "market_analysis": MarketAnalysisAgent(),
            "property_scoring": PropertyScoringAgent(),
            "opportunity_detection": OpportunityDetectionAgent(),
            "investor_report": InvestorReportAgent(),
            "portfolio_optimization": PortfolioOptimizationAgent(),
        }

    async def run_workflow(
        self,
        workflow: str,
        property_id: str | None = None,
        params: dict | None = None,
    ) -> dict[str, Any]:
        params = params or {}
        tasks = []

        if workflow == "full_analysis":
            tasks = [
                self.agents["market_analysis"].run(params),
                self.agents["property_scoring"].run({"property_id": property_id}),
                self.agents["opportunity_detection"].run(params),
            ]
        elif workflow == "property_report":
            prop = (
                await property_repository.get_property(property_id)
                if property_id
                else None
            )
            tasks = [
                self.agents["property_scoring"].run({"property_id": property_id}),
                self.agents["investor_report"].run({"property": prop}),
            ]
        elif workflow == "portfolio_review":
            tasks = [self.agents["portfolio_optimization"].run(params)]
        else:
            agent = self.agents.get(workflow)
            if not agent:
                return {"error": f"Unknown workflow: {workflow}"}
            return await agent.run(params)

        results = await asyncio.gather(*tasks, return_exceptions=True)
        output = {
            "workflow": workflow,
            "completedAt": datetime.now(UTC).isoformat(),
            "results": [],
        }
        for r in results:
            if isinstance(r, Exception):
                output["results"].append({"error": str(r)})
            else:
                output["results"].append(r)
        return output

    async def run_agent(self, agent_name: str, params: dict | None = None) -> dict:
        agent = self.agents.get(agent_name)
        if not agent:
            return {"error": f"Agent not found: {agent_name}"}
        return await agent.run(params or {})


orchestrator = AgentOrchestrator()
