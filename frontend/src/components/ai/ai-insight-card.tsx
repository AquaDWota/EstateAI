"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AIInsightCard({
  title,
  detail,
  confidence,
}: {
  title: string;
  detail: string;
  confidence: number;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 240 }}>
      <Card className="border-border/80 bg-card/90">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-accent" />
              <p className="text-sm font-semibold">{title}</p>
            </div>
            <span className="text-xs text-muted-foreground">{confidence}%</span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{detail}</p>
          <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 hover:text-foreground">
            Inspect reasoning <ChevronRight className="h-3 w-3" />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
