"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Building, Zap } from "lucide-react";

const metrics = [
  { label: "Properties analyzed", value: "2.4M+", icon: Building },
  { label: "Active investors", value: "12K+", icon: Users },
  { label: "Avg ROI uplift", value: "18%", icon: TrendingUp },
  { label: "Agent workflows/mo", value: "890K", icon: Zap },
];

const roadmap = [
  { q: "Q2 2026", item: "MLS API integrations (CT, MA, NY)" },
  { q: "Q3 2026", item: "Institutional portfolio API & white-label" },
  { q: "Q4 2026", item: "Voice-enabled AI assistant & mobile apps" },
  { q: "2027", item: "Predictive market ML models nationwide" },
];

export default function InvestorsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-24 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">
              The AI-native real estate investment terminal
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Estate AI automates research, scoring, and portfolio optimization for
              modern investors across high-growth US markets.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <Card key={m.label} className="text-center">
                <CardContent className="pt-8">
                  <m.icon className="mx-auto h-8 w-8 text-violet-600" />
                  <p className="mt-4 text-3xl font-bold text-slate-900">{m.value}</p>
                  <p className="text-sm text-slate-500">{m.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-slate-900">Business model</h2>
            <p className="mt-4 text-slate-600">
              SaaS subscriptions ($49–$149/mo) plus enterprise API licensing for funds,
              brokerages, and prop-tech platforms. Future revenue from transaction
              intelligence and data partnerships.
            </p>
            <h2 className="mt-12 text-2xl font-bold text-slate-900">Market opportunity</h2>
            <p className="mt-4 text-slate-600">
              $85B+ US residential investment market with fragmented analytics tools.
              AI agents reduce diligence time by 70% and improve deal discovery in
              secondary markets.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-slate-900">Roadmap</h2>
            <div className="mt-8 space-y-4">
              {roadmap.map((r) => (
                <div
                  key={r.q}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <span className="font-bold text-violet-600">{r.q}</span>
                  <span className="text-slate-700">{r.item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-violet-600 py-16">
          <div className="mx-auto max-w-lg px-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact us</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <p className="text-center text-emerald-600">
                    Thank you — we&apos;ll be in touch.
                  </p>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                  >
                    <Input placeholder="Name" required />
                    <Input type="email" placeholder="Email" required />
                    <Input placeholder="Company / fund" />
                    <Button type="submit" className="w-full">
                      Request investor deck
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
