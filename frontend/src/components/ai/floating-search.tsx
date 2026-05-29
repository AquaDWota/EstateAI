"use client";

import { Sparkles, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export function FloatingSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <motion.div
      layout
      className="relative rounded-xl border border-border/80 bg-card/85 p-2 shadow-lg backdrop-blur-md"
    >
      <Sparkles className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
      <Search className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Ask in natural language: "High cash flow rentals in Austin"'
        className="h-10 border-0 bg-transparent pl-9 pr-9 shadow-none"
      />
    </motion.div>
  );
}
