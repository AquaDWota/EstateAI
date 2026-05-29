"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Sparkles, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    router.push(`/properties?q=${encodeURIComponent(address.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar dark />
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 -z-20">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-124.8%2C24.3%2C-66.9%2C49.4&layer=mapnik"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) brightness(0.45)" }}
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/90 via-slate-950/65 to-slate-950/90" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-1.5 text-sm font-medium text-violet-100 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Zillow-style map search + AI underwriting
              </div>

              <h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Explore Properties
                <br />
                <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                  on a Live Map
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
                Search any city, ZIP, or address and evaluate listings with AI-powered
                ROI, risk, and market insights.
              </p>

              <form onSubmit={handleSearch} className="mt-10">
                <div className="mx-auto max-w-2xl">
                  <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:p-4">
                    <MapPin className="h-6 w-6 flex-shrink-0 text-slate-200" />
                    <Input
                      type="text"
                      placeholder="Enter city, ZIP, or address (e.g., Austin, TX or 78701)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-12 border-0 bg-transparent text-base text-white placeholder:text-slate-300 focus-visible:ring-0"
                    />
                    <Button type="submit" size="lg" className="h-12 px-6">
                      <Search className="h-4 w-4" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">
                    Or{" "}
                    <Link href="/properties" className="font-medium text-violet-300 underline">
                      open map listings
                    </Link>{" "}
                    to browse all active markets.
                  </p>
                </div>
              </form>

              <div className="mt-14 grid grid-cols-3 gap-4 sm:gap-6">
                {[
                  { value: "75+", label: "Live Listings" },
                  { value: "8", label: "US Markets" },
                  { value: "AI", label: "Agent Analysis" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {[
              {
                title: "1. Search",
                desc: "Enter a market or address and instantly load map-based listings.",
              },
              {
                title: "2. Analyze",
                desc: "Review cap rate, projected ROI, rental demand, and risk scores.",
              },
              {
                title: "3. Decide",
                desc: "Use AI buy/hold/avoid recommendations to prioritize deals.",
              },
            ].map((item) => (
              <Card key={item.title} className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-violet-600 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white">
              Ready to explore your next investment?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
              Open the Zillow-style map view and compare opportunities side-by-side.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/properties">
                  Open Map Listings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
