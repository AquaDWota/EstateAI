"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Chip {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function SmartFilterBar({ chips }: { chips: Chip[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card/80 p-2 backdrop-blur">
      <Button variant="ghost" size="sm" className="gap-1">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </Button>
      {chips.map((chip) => (
        <motion.button
          key={chip.label}
          whileTap={{ scale: 0.97 }}
          onClick={chip.onToggle}
          className="inline-flex"
        >
          <Badge variant={chip.active ? "default" : "glass"} className="gap-1">
            {chip.label}
            {chip.active && <X className="h-3 w-3" />}
          </Badge>
        </motion.button>
      ))}
    </div>
  );
}
