"use client";

import { useState } from "react";
import { Bot, SendHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { askEstateAI } from "@/lib/ai-client";

const SUGGESTIONS = [
  "Find undervalued duplexes under $800k",
  "Show high-yield rentals with low risk",
  "Compare Austin vs Charlotte appreciation trends",
];

export function AIChatSidebar() {
  const [value, setValue] = useState("");
  const [conversation, setConversation] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const send = async (preset?: string) => {
    const text = (preset ?? value).trim();
    if (!text || loading) return;
    const next = [...conversation, { role: "user" as const, content: text }];
    setConversation(next);
    setValue("");
    setLoading(true);
    const answer = await askEstateAI(text, next);
    setConversation([...next, { role: "assistant", content: answer }]);
    setLoading(false);
  };

  return (
    <Card className="h-full bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4 text-accent" />
          EstateAI Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {SUGGESTIONS.map((prompt, i) => (
            <motion.button
              key={prompt}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted"
              onClick={() => void send(prompt)}
            >
              {prompt}
            </motion.button>
          ))}
        </div>
        <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-foreground/80">
          <p className="font-medium">Live reasoning</p>
          <p className="mt-1 text-muted-foreground">
            Analyzing comparable sales, rental demand index, and mortgage sensitivity...
          </p>
        </div>
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2">
          {conversation.length === 0 ? (
            <p className="text-xs text-muted-foreground">No active conversation.</p>
          ) : (
            conversation.slice(-6).map((item, idx) => (
              <p key={idx} className="text-xs">
                <span className="font-medium">{item.role === "user" ? "You" : "AI"}: </span>
                <span className="text-muted-foreground">{item.content}</span>
              </p>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask EstateAI..."
            className="text-xs"
            onKeyDown={(e) => e.key === "Enter" && void send()}
          />
          <Button size="icon" aria-label="Send" onClick={() => void send()} disabled={loading}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          Context-aware AI is active
        </div>
      </CardContent>
    </Card>
  );
}
