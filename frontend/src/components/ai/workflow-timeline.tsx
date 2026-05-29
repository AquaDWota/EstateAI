"use client";

import { CheckCircle2, Loader2, Orbit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS: { title: string; state: "done" | "active" | "queued" }[] = [
  { title: "Lead Qualification Agent", state: "done" },
  { title: "Market Research Agent", state: "active" },
  { title: "Deal Analysis Agent", state: "queued" },
  { title: "Outreach Agent", state: "queued" },
];

export function WorkflowTimeline({
  steps = STEPS,
}: {
  steps?: { title: string; state: "done" | "active" | "queued" }[];
}) {
  return (
    <Card className="bg-card/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Autonomous Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No workflow steps configured yet.
          </p>
        ) : (
          steps.map((step) => (
          <div key={step.title} className="flex items-center gap-2 text-xs">
            {step.state === "done" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : step.state === "active" ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            ) : (
              <Orbit className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={step.state === "queued" ? "text-muted-foreground" : ""}>
              {step.title}
            </span>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
