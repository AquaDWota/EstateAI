"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  ChartNoAxesCombined,
  GitBranch,
  MessageSquare,
  Radar,
  UsersRound,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { AgentActivityPanel } from "@/components/ai/agent-activity-panel";
import { AIChatSidebar } from "@/components/ai/ai-chat-sidebar";
import { WorkflowTimeline } from "@/components/ai/workflow-timeline";

const NAV = [
  { href: "/dashboard", label: "AI CRM", icon: UsersRound },
  { href: "/pipeline", label: "Lead Pipeline", icon: ChartNoAxesCombined },
  { href: "/properties", label: "Map Intelligence", icon: Radar },
  { href: "/assistant", label: "Copilot", icon: MessageSquare },
  { href: "/outreach", label: "Outreach Automation", icon: MessageSquare },
  { href: "/control-center", label: "Agent Control", icon: Bot },
  { href: "/workflows", label: "Workflow Builder", icon: Workflow },
  { href: "/investment-analytics", label: "Investment Analytics", icon: GitBranch },
  { href: "/transactions", label: "Transactions", icon: Building2 },
];

export function AISidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden h-screen w-[320px] flex-col border-r border-border bg-card/60 p-4 lg:flex">
      <div className="mb-4 rounded-lg border border-border bg-card p-3">
        <p className="text-xs text-muted-foreground">EstateAI OS</p>
        <p className="font-semibold">Autonomous Real Estate Platform</p>
      </div>
      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 space-y-3 overflow-y-auto">
        <AIChatSidebar />
        <AIInsightCard
          title="Investment Zone Alert"
          detail="South Austin appreciation trend is +8.2% YoY with elevated rental absorption."
          confidence={89}
        />
        <WorkflowTimeline />
        <AgentActivityPanel />
      </div>
    </aside>
  );
}
