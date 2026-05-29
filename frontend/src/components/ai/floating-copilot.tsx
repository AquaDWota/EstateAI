"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, ChevronUp, SendHorizontal } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { askEstateAI } from "@/lib/ai-client";

export function FloatingCopilot() {
  const open = useAppStore((s) => s.aiCopilotOpen);
  const setOpen = useAppStore((s) => s.setAiCopilotOpen);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message.trim() || loading) return;
    const text = message.trim();
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setMessage("");
    setLoading(true);
    const answer = await askEstateAI(text, next);
    setMessages([...next, { role: "assistant", content: answer }]);
    setLoading(false);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[320px]">
      <motion.div
        className="pointer-events-auto overflow-hidden rounded-xl border border-border bg-card/95 shadow-xl backdrop-blur"
        layout
      >
        <button
          className="flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left"
          onClick={() => setOpen(!open)}
        >
          <Bot className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">EstateAI Copilot</span>
          <span className="ml-auto">{open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-3"
            >
              <p className="text-xs text-muted-foreground">
                I can analyze deals, suggest offers, and draft outreach.
              </p>
              <div className="rounded-md bg-muted/40 p-2 text-xs">
                Active context: 5 selected opportunities, Austin + Charlotte markets.
              </div>
              <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No conversation yet.</p>
                ) : (
                  messages.slice(-4).map((item, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-medium">{item.role === "user" ? "You" : "AI"}: </span>
                      <span className="text-muted-foreground">{item.content}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask for analysis..."
                  className="h-8 text-xs"
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <Button size="icon" className="h-8 w-8" onClick={send} disabled={loading}>
                  <SendHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
