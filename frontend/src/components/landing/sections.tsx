"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Brain,
  LineChart,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppreciationChart, RentalDemandChart } from "@/components/dashboard/charts";
import { PropertyCard } from "@/components/properties/property-card";
import { MOCK_PROPERTIES } from "@/lib/property-generator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    icon: Brain,
    title: "AI Property Scoring",
    desc: "ML-powered scores for ROI, risk, rental demand, and appreciation.",
  },
  {
    icon: Bot,
    title: "Autonomous Agents",
    desc: "Five specialized agents orchestrate market and portfolio analysis.",
  },
  {
    icon: MapPin,
    title: "Geo Intelligence",
    desc: "Heatmaps, investment zones, and transit overlays across major US markets.",
  },
  {
    icon: LineChart,
    title: "Performance Simulation",
    desc: "Model cash flow, cap rates, and exit strategies before you buy.",
  },
  {
    icon: Shield,
    title: "Risk Analytics",
    desc: "Crime index, economic indicators, and AI risk explanations.",
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    desc: "Opportunity feed, watchlists, and AI-generated investor reports.",
  },
];

const workflow = [
  { step: "01", title: "Ingest", desc: "Properties & market data flow into the platform." },
  { step: "02", title: "Analyze", desc: "Agents score, detect opportunities, and track trends." },
  { step: "03", title: "Recommend", desc: "Buy/Hold/Avoid with confidence and investment thesis." },
  { step: "04", title: "Act", desc: "Portfolio optimization and automated report generation." },
];

const testimonials = [
  {
    quote: "Estate AI cut our market research time from weeks to hours.",
    author: "Sarah Chen",
    role: "Multifamily Investor",
  },
  {
    quote: "The opportunity detection agent flagged three undervalued assets we closed.",
    author: "Marcus Rivera",
    role: "Fund Manager",
  },
  {
    quote: "Feels like a Bloomberg terminal built for modern real estate investors.",
    author: "Elena Park",
    role: "REIT Analyst",
  },
];

const pricing = [
  { name: "Starter", price: "$49", features: ["50 property views", "AI assistant", "Basic analytics"] },
  { name: "Pro", price: "$149", features: ["Unlimited listings", "All AI agents", "PDF reports", "Watchlists"], popular: true },
  { name: "Enterprise", price: "Custom", features: ["API access", "Custom agents", "MLS integration", "Dedicated support"] },
];

const faqs = [
  { q: "What markets does Estate AI support?", a: "Demo data spans multiple US markets. Production can connect to MLS and national feeds." },
  { q: "How do AI agents work?", a: "An orchestrator runs market, scoring, opportunity, report, and portfolio agents asynchronously with structured outputs." },
  { q: "Is this financial advice?", a: "No. Estate AI provides analytics and research tools. Consult licensed professionals for investment decisions." },
  { q: "Can I deploy to production?", a: "Yes — Vercel for frontend, Railway/Render for FastAPI backend, PostgreSQL via Prisma." },
];

const chartData = {
  appreciation: [
    { month: "Jan", value: 2.1 }, { month: "Mar", value: 2.8 },
    { month: "Jun", value: 3.5 }, { month: "Sep", value: 4.0 }, { month: "Dec", value: 4.5 },
  ],
  rental: [
    { month: "Jan", demand: 68 }, { month: "Apr", demand: 74 },
    { month: "Jul", demand: 80 }, { month: "Oct", demand: 84 }, { month: "Dec", demand: 87 },
  ],
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything investors need
          </h2>
          <p className="mt-4 text-slate-500">Premium analytics powered by autonomous AI</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-slate-200/80 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-xl bg-violet-50 p-3 w-fit">
                    <f.icon className="h-6 w-6 text-violet-600" />
                  </div>
                  <CardTitle className="mt-4">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">AI workflow</h2>
        <p className="mt-4 text-center text-slate-500">From data to decision in four steps</p>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {workflow.map((w, i) => (
            <motion.div
              key={w.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-4xl font-bold text-violet-200">{w.step}</span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{w.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnalyticsPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-violet-600">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm font-semibold">Analytics preview</span>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Investor-grade charts</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900">Property appreciation</h3>
            <AppreciationChart data={chartData.appreciation} />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900">Rental demand index</h3>
            <RentalDemandChart data={chartData.rental} />
          </Card>
        </div>
      </div>
    </section>
  );
}

export function PropertyShowcase() {
  const featured = MOCK_PROPERTIES.filter((p) => p.undervalued).slice(0, 3);
  return (
    <section className="py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white">Featured opportunities</h2>
        <p className="mt-4 text-slate-400">Interactive property showcase with AI scores</p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">Trusted by investors</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.author} className="p-6">
              <p className="text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-semibold text-slate-900">{t.author}</p>
              <p className="text-sm text-slate-500">{t.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">Simple pricing</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pricing.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 ${plan.popular ? "ring-2 ring-violet-500 shadow-xl" : ""}`}
            >
              {plan.popular && (
                <span className="text-xs font-semibold text-violet-600">Most popular</span>
              )}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-violet-600">{plan.price}<span className="text-sm text-slate-500 font-normal">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">FAQ</h2>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
