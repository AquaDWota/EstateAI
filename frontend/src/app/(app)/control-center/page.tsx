"use client";

import { Play, Pause, CircleDashed } from "lucide-react";
import { AgentActivityPanel } from "@/components/ai/agent-activity-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOSStore, type AgentState } from "@/store/use-os-store";

export default function ControlCenterPage() {
  const agents = useOSStore((s) => s.agents);
  const activityLog = useOSStore((s) => s.activityLog);
  const setAgentState = useOSStore((s) => s.setAgentState);
  const runAgentTask = useOSStore((s) => s.runAgentTask);

  const cycleState = (state: AgentState): AgentState =>
    state === "active" ? "standby" : state === "standby" ? "paused" : "active";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">AI Agent Control Center</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgentActivityPanel events={activityLog.slice(0, 12)} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Agent Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-md border border-border p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-muted-foreground">{agent.state}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Tasks run: {agent.tasksRun}
                </p>
                <div className="mt-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => setAgentState(agent.id, cycleState(agent.state))}
                  >
                    {agent.state === "active" ? (
                      <>
                        <Pause className="h-3 w-3" /> Standby
                      </>
                    ) : agent.state === "standby" ? (
                      <>
                        <CircleDashed className="h-3 w-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" /> Activate
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => runAgentTask(agent.id)}
                  >
                    Run task
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
