"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-rose-600",
                trend === "neutral" && "text-slate-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-violet-50 p-3">
          <Icon className="h-5 w-5 text-violet-600" />
        </div>
      </div>
    </motion.div>
  );
}
