"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { API_URL } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const SUGGESTED_PROMPTS = [
  "Which properties have the best cash flow?",
  "Find undervalued multifamily properties.",
  "Analyze the best-performing market right now.",
  "Compare these two investments.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function streamChat(
  message: string,
  onChunk: (text: string) => void
): Promise<void> {
  try {
    const token = supabase
      ? (await supabase.auth.getSession()).data.session?.access_token ?? null
      : null;
    const res = await fetch(`${API_URL}/api/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok || !res.body) {
      throw new Error("Chat API unavailable");
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          onChunk(line.slice(6));
        }
      }
    }
  } catch {
    onChunk("EstateAI chat is temporarily unavailable. Please try again.");
  }
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    let assistant = "";
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    await streamChat(text, (chunk) => {
      assistant += chunk;
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: assistant };
        return copy;
      });
    });
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-2xl bg-violet-100 p-4">
                <Sparkles className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                Estate AI Investment Assistant
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Ask about properties, cash flow, risk, and market strategy.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                  <Bot className="h-4 w-4 text-violet-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-slate-100 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, markets, or properties..."
              disabled={loading}
            />
            <Button type="submit" disabled={loading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
