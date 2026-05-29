"use client";

import { useMemo, useState } from "react";
import { Play, Plus, RotateCcw, Trash2 } from "lucide-react";
import { WorkflowTimeline } from "@/components/ai/workflow-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOSStore } from "@/store/use-os-store";
import { apiFetch } from "@/lib/api";

const DEFAULT_STEPS = [
  { id: "w1", title: "Lead Qualification Agent", done: true },
  { id: "w2", title: "Market Research Agent", done: false },
  { id: "w3", title: "Deal Analysis Agent", done: false },
  { id: "w4", title: "Outreach Agent", done: false },
];

export default function WorkflowsPage() {
  const steps = useOSStore((s) => s.workflowSteps);
  const toggleWorkflowStep = useOSStore((s) => s.toggleWorkflowStep);
  const setWorkflowStepDone = useOSStore((s) => s.setWorkflowStepDone);
  const addWorkflowStep = useOSStore((s) => s.addWorkflowStep);
  const removeWorkflowStep = useOSStore((s) => s.removeWorkflowStep);
  const clearWorkflowSteps = useOSStore((s) => s.clearWorkflowSteps);
  const resetWorkflowProgress = useOSStore((s) => s.resetWorkflowProgress);
  const resetWorkflowDefaults = useOSStore((s) => s.resetWorkflowDefaults);
  const addActivity = useOSStore((s) => s.addActivity);
  const activityLog = useOSStore((s) => s.activityLog);
  const safeSteps = steps.length > 0 ? steps : DEFAULT_STEPS;
  const [newStep, setNewStep] = useState("");
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [workflowKind, setWorkflowKind] = useState<
    "full_analysis" | "property_report" | "portfolio_review"
  >("full_analysis");
  const [backendResult, setBackendResult] = useState<{
    workflow: string;
    completedAt?: string;
    results?: { agent?: string; data?: Record<string, unknown>; error?: string }[];
    error?: string;
  } | null>(null);

  const workflowProgress = useMemo(() => {
    if (safeSteps.length === 0) return 0;
    const done = safeSteps.filter((step) => step.done).length;
    return Math.round((done / safeSteps.length) * 100);
  }, [safeSteps]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const executeWorkflow = async () => {
    if (isRunning || safeSteps.length === 0) return;
    setIsRunning(true);
    resetWorkflowProgress();
    addActivity("Workflow execution started");
    setBackendResult(null);
    const runSteps = [...safeSteps];
    const backendPromise = apiFetch<{
      workflow: string;
      completedAt: string;
      results: { agent?: string; data?: Record<string, unknown>; error?: string }[];
    }>("/agents/workflow", {
      method: "POST",
      body: JSON.stringify({
        workflow: workflowKind,
        params: { riskTolerance: "moderate" },
      }),
    }).catch((error: unknown) => {
      return { workflow: workflowKind, error: error instanceof Error ? error.message : "Unknown workflow error" };
    });

    for (const step of runSteps) {
      setActiveStepId(step.id);
      addActivity(`Running ${step.title}`);
      await sleep(650);
      setWorkflowStepDone(step.id, true);
      addActivity(`${step.title} completed`);
    }
    const backend = await backendPromise;
    if ("error" in backend) {
      addActivity(`Backend workflow failed: ${backend.error}`);
      setBackendResult({ workflow: workflowKind, error: backend.error });
    } else {
      addActivity(`Backend workflow completed: ${backend.workflow}`);
      backend.results?.forEach((result) => {
        if (result.agent) addActivity(`${result.agent} returned structured output`);
      });
      setBackendResult(backend);
    }
    setActiveStepId(null);
    setIsRunning(false);
    addActivity("Workflow execution finished");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Workflow Builder</h1>
        <div className="flex gap-2">
          {steps.length === 0 && (
            <Button variant="outline" onClick={resetWorkflowDefaults}>
              Reset Defaults
            </Button>
          )}
          <Button onClick={executeWorkflow} disabled={isRunning || safeSteps.length === 0}>
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Execute Workflow"}
          </Button>
        </div>
      </div>
      <div className="space-y-2 rounded-md border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <select
            value={workflowKind}
            onChange={(e) =>
              setWorkflowKind(
                e.target.value as "full_analysis" | "property_report" | "portfolio_review"
              )
            }
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="full_analysis">Full Analysis Workflow</option>
            <option value="property_report">Property Report Workflow</option>
            <option value="portfolio_review">Portfolio Review Workflow</option>
          </select>
          <Input
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Add workflow step (e.g. Negotiation Agent)"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newStep.trim()) {
                addWorkflowStep(newStep);
                setNewStep("");
              }
            }}
          />
          <Button
            variant="outline"
            onClick={() => {
              if (!newStep.trim()) return;
              addWorkflowStep(newStep);
              setNewStep("");
            }}
          >
            <Plus className="h-4 w-4" />
            Add Step
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Button variant="ghost" size="sm" onClick={resetWorkflowProgress}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Progress
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWorkflowSteps}
            disabled={safeSteps.length === 0}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Steps
          </Button>
          <span className="ml-auto text-muted-foreground">
            Progress {workflowProgress}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${workflowProgress}%` }}
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <WorkflowTimeline
          steps={safeSteps.map((step, i) => ({
            title: step.title,
            state:
              step.id === activeStepId
                ? "active"
                : step.done
                ? "done"
                : i === safeSteps.findIndex((s) => !s.done)
                  ? "active"
                  : "queued",
          }))}
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Automation Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {safeSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-muted-foreground">
                <button
                  onClick={() => toggleWorkflowStep(step.id)}
                  className="flex-1 text-left hover:text-foreground"
                >
                  {step.done ? "✓" : "○"} {step.title}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkflowStep(step.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <div className="pt-2 text-[11px] text-muted-foreground">
              Recent events:
            </div>
            {activityLog.slice(0, 4).map((event, i) => (
              <div key={i} className="rounded-md border border-border p-2 text-muted-foreground">
                {event}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Backend Execution Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {!backendResult ? (
            <p className="text-muted-foreground">
              Execute a workflow to fetch real backend agent outputs.
            </p>
          ) : backendResult.error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-destructive">
              {backendResult.error}
            </p>
          ) : (
            <>
              <p className="text-muted-foreground">
                Workflow: <span className="font-medium text-foreground">{backendResult.workflow}</span>{" "}
                · Completed: {backendResult.completedAt}
              </p>
              {backendResult.results?.map((result, idx) => (
                <div key={idx} className="rounded-md border border-border bg-background p-2">
                  <p className="font-medium">{result.agent ?? `Result ${idx + 1}`}</p>
                  {result.error ? (
                    <p className="text-destructive">{result.error}</p>
                  ) : (
                    <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[11px] text-muted-foreground">
                      {JSON.stringify(result.data ?? {}, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
