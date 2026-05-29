from openai import AsyncOpenAI

from app.core.config import settings
from app.services.data_store import PROPERTIES, filter_properties


class AIService:
    def __init__(self):
        self.client = (
            AsyncOpenAI(api_key=settings.openai_api_key)
            if settings.openai_api_key
            else None
        )

    async def chat(self, message: str, history: list[dict] | None = None) -> str:
        context = self._build_context(message)
        if not self.client:
            return self._mock_response(message, context)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are Estate AI, an expert real estate investment assistant "
                    "covering multiple US markets. Use the property context provided. "
                    "Give actionable investment advice with risk awareness."
                ),
            },
            {"role": "system", "content": f"Property context:\n{context}"},
        ]
        if history:
            messages.extend(history[-8:])
        messages.append({"role": "user", "content": message})

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=800,
        )
        return response.choices[0].message.content or ""

    def _build_context(self, message: str) -> str:
        filtered = filter_properties(query=message)
        top = filtered[:8] if filtered else PROPERTIES[:8]
        lines = []
        for p in top:
            lines.append(
                f"- {p['address']}: ${p['price']:,}, ROI {p['estimatedRoi']}%, "
                f"AI {p['aiScore']}, risk {p['riskScore']}, {p['aiRecommendation']}"
            )
        market = (
            "Market snapshot: median cap ~5.2%, rental demand remains strong in urban cores, "
            f"{len([p for p in PROPERTIES if p['undervalued']])} undervalued flags."
        )
        return market + "\n" + "\n".join(lines)

    def _mock_response(self, message: str, context: str) -> str:
        msg = message.lower()
        if "cash flow" in msg:
            top = sorted(PROPERTIES, key=lambda x: x["monthlyCashFlow"], reverse=True)[:3]
            addrs = ", ".join(f"{p['address']} (${p['monthlyCashFlow']}/mo)" for p in top)
            return (
                f"**Top cash flow opportunities:** {addrs}. "
                "These properties combine strong rental yields with below-median risk scores. "
                "I recommend stress-testing vacancy at 8% and reviewing insurance trends."
            )
        if "undervalued" in msg or "multifamily" in msg:
            und = [p for p in PROPERTIES if p["undervalued"]][:5]
            if not und:
                return "No undervalued flags currently; widen ROI filters or check multifamily inventory."
            lines = "\n".join(
                f"• **{p['address']}** — ${p['price']:,}, AI {p['aiScore']}, ROI {p['estimatedRoi']}%"
                for p in und
            )
            return f"**Undervalued opportunities:**\n{lines}\n\nConsider LOI within 14 days for top-scored assets."
        if "market" in msg:
            return (
                "**Market snapshot:** Absorption is improving with "
                "5.8% avg rental yield and 4.2% appreciation forecast. Transit score averages 72. "
                "Multifamily shows strongest risk-adjusted returns. Watch interest rate sensitivity "
                "on sub-$350k assets."
            )
        if "compare" in msg:
            return (
                "Share two property IDs or addresses to compare ROI, cap rate, risk, and cash flow. "
                "Example: compare prop-001 vs prop-012 for side-by-side thesis."
            )
        return (
            f"I analyzed your question against **{len(PROPERTIES)} active listings**. "
            "Ask about cash flow, undervalued multifamily, market trends, or specific addresses. "
            f"\n\n_Context preview:_\n{context[:500]}..."
        )


ai_service = AIService()
