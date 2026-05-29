"use client";

import { motion } from "framer-motion";
import { Bot, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EVENTS = [
  "Lead Qualification Agent scored 12 inbound leads",
  "Deal Analysis Agent flagged 3 undervalued multifamily assets",
  "Negotiation Agent prepared revised offer strategy",
  "CRM Memory Agent linked prior owner conversation context",
];

export function AgentActivityPanel({ events = EVENTS }: { events?: string[] }) {
  return (
    <Card className="bg-card/90">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4 text-accent" />
          Live Agent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((event, idx) => (
          <motion.div
            key={event}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="flex items-start gap-2 rounded-md bg-muted/40 p-2"
          >
            <CircleDot className="mt-0.5 h-3 w-3 text-accent" />
            <p className="text-xs text-foreground/85">{event}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
