"use client";

import { useState } from "react";
import { Bot, Play, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const AGENTS = [
  {
    id: "market_analysis",
    name: "Market Analysis Agent",
    desc: "Tracks trends, appreciation patterns, and economic indicators",
  },
  {
    id: "property_scoring",
    name: "Property Scoring Agent",
    desc: "Scores ROI, risk, rental demand, and appreciation potential",
  },
  {
    id: "opportunity_detection",
    name: "Opportunity Detection Agent",
    desc: "Finds undervalued properties and high-growth areas",
  },
  {
    id: "investor_report",
    name: "Investor Report Agent",
    desc: "Generates investor-ready reports and summaries",
  },
  {
    id: "portfolio_optimization",
    name: "Portfolio Optimization Agent",
    desc: "Suggests allocation strategies balancing risk vs return",
  },
];

export default function AgentsPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const runAgent = async (agentId: string) => {
    setRunning(agentId);
    setResult(null);
    try {
      const data = await apiFetch<Record<string, unknown>>(
        `/agents/run?agent_name=${agentId}`,
        { method: "POST", body: "{}" }
      );
      setResult(data);
    } catch {
      setResult({
        agent: agentId,
        data: { message: "Backend offline — start FastAPI on port 8000 for live agent runs." },
      });
    }
    setRunning(null);
  };

  const runFullWorkflow = async () => {
    setRunning("workflow");
    try {
      const data = await apiFetch<Record<string, unknown>>("/agents/workflow", {
        method: "POST",
        body: JSON.stringify({ workflow: "full_analysis" }),
      });
      setResult(data);
    } catch {
      setResult({ error: "Start backend for orchestrated workflows" });
    }
    setRunning(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Autonomous AI Agents</h1>
          <p className="text-slate-500">Modular agent orchestrator with async execution</p>
        </div>
        <Button onClick={runFullWorkflow} disabled={!!running}>
          {running === "workflow" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run full analysis
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="flex flex-col">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <Bot className="h-5 w-5 text-violet-600" />
              </div>
              <CardTitle className="mt-4 text-base">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="flex-1 text-sm text-slate-500">{agent.desc}</p>
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() => runAgent(agent.id)}
                disabled={!!running}
              >
                {running === agent.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Run agent"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Agent output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
