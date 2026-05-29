"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function InvestmentScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const tier =
    score >= 85 ? "Elite" : score >= 75 ? "Strong" : score >= 65 ? "Watch" : "Risky";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card/90 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur",
        className
      )}
    >
      <Sparkles className="h-3 w-3 text-accent" />
      <span>AI {score}</span>
      <span className="text-muted-foreground">· {tier}</span>
    </div>
  );
}
