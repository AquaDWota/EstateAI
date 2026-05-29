"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CircleUserRound,
  Command,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#workflow", label: "AI Workflow" },
  { href: "/properties", label: "Properties" },
  { href: "/investors", label: "Investors" },
  { href: "/#pricing", label: "Pricing" },
];

export function Navbar({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const unread = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: 0, scale: scrolled ? 0.985 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={cn(
        "fixed left-1/2 top-3 z-50 w-[96%] max-w-7xl -translate-x-1/2 rounded-xl border transition-all",
        dark || isLanding
          ? "border-border/40 bg-background/80 backdrop-blur-xl shadow-lg"
          : "border-border/80 bg-background/85 backdrop-blur-xl shadow-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "text-2xl font-bold tracking-tight",
              dark || isLanding ? "text-foreground" : "text-foreground"
            )}
          >
            Estate.AI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                dark || isLanding ? "text-muted-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="group flex min-w-[220px] items-center gap-2 rounded-md border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-card"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="line-clamp-1">Ask EstateAI...</span>
            <kbd className="ml-auto inline-flex items-center gap-1 rounded border border-border px-1.5 text-[10px]">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            AI Live
          </span>
          <Link href="/dashboard">
            <Button size="sm">View Dashboard</Button>
          </Link>
          <button className="relative rounded-md p-2 hover:bg-muted" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground">
                {unread}
              </span>
            )}
          </button>
          <button onClick={toggleDarkMode} className="rounded-md p-2 hover:bg-muted" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="rounded-md p-2 hover:bg-muted" aria-label="Profile menu">
            <CircleUserRound className="h-4 w-4" />
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X className={dark || isLanding ? "text-white" : "text-slate-900"} />
          ) : (
            <Menu className={dark || isLanding ? "text-white" : "text-slate-900"} />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" onClick={() => setCommandPaletteOpen(true)}>
              <Search className="h-4 w-4" />
              Ask EstateAI...
            </Button>
            <Link href="/assistant" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full">
                Try AI Assistant
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Button className="w-full">View Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}
