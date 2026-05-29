"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-950 to-slate-950" />
      <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-4 w-4" />
            Autonomous AI agents for real estate investors
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            AI-Powered Real Estate{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Investing
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            Analyze markets, discover opportunities, and make smarter investment
            decisions using autonomous AI agents.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                View Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="secondary" size="lg">
                Try AI Assistant
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-2 rounded-xl bg-slate-800/50 p-6 sm:grid-cols-3">
              {[
                { label: "Portfolio Value", value: "$2.84M", change: "+12.4%" },
                { label: "AI Confidence", value: "84%", change: "High" },
                { label: "Opportunities", value: "23", change: "Multi-market" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/5 bg-slate-900/60 p-4 text-center"
                >
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-violet-400">{stat.change}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
