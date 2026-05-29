"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Command, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";
import { Input } from "@/components/ui/input";

const COMMANDS = [
  { label: "Open Property Map", href: "/properties" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Assistant", href: "/assistant" },
  { label: "Agent Control Center", href: "/control-center" },
  { label: "Workflow Builder", href: "/workflows" },
  { label: "Investment Analytics", href: "/investment-analytics" },
];

export function FloatingCommandPalette() {
  const open = useAppStore((s) => s.commandPaletteOpen);
  const setOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const filtered = useMemo(() => {
    if (!query) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="fixed left-1/2 top-20 z-[61] w-[92vw] max-w-xl -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-2xl"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask EstateAI or jump to a page..."
                className="pl-9"
              />
            </div>
            <div className="mt-2 space-y-1">
              {filtered.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Command className="h-3 w-3" /> Press Cmd/Ctrl+K anytime
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
