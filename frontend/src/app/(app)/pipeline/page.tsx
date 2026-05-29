"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOSStore, type LeadStage } from "@/store/use-os-store";
import { Button } from "@/components/ui/button";

const COLUMNS: { title: string; stage: LeadStage }[] = [
  { title: "New Leads", stage: "new" },
  { title: "Qualified", stage: "qualified" },
  { title: "In Negotiation", stage: "negotiation" },
  { title: "Closed", stage: "closed" },
];

export default function PipelinePage() {
  const leads = useOSStore((s) => s.leads);
  const moveLead = useOSStore((s) => s.moveLead);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lead Pipeline</h1>
      <div className="grid gap-4 xl:grid-cols-4">
        {COLUMNS.map((col, colIdx) => {
          const items = leads.filter((lead) => lead.stage === col.stage);
          return (
          <Card key={col.title} className="bg-card/90">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                {col.title}
                <Badge variant="glass">{items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="rounded-md border border-border bg-background p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground">Score {item.score}</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={colIdx === 0}
                      className="h-6 px-2 text-[11px]"
                      onClick={() => moveLead(item.id, "backward")}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={colIdx === COLUMNS.length - 1}
                      className="h-6 px-2 text-[11px]"
                      onClick={() => moveLead(item.id, "forward")}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
