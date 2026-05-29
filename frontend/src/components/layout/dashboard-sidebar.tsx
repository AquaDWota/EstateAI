"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Bot,
  LayoutDashboard,
  Map,
  MessageSquare,
  Search,
  Sparkles,
  Bell,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Search },
  { href: "/map", label: "Map", icon: Map },
  { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const notifications = useAppStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-slate-900">Estate AI</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Bell className="h-4 w-4" />
          Notifications
          {unread > 0 && (
            <span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 text-xs text-white">
              {unread}
            </span>
          )}
        </Link>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white">
          <Sparkles className="h-5 w-5" />
          <p className="mt-2 text-sm font-medium">AI Agents Active</p>
          <p className="mt-1 text-xs text-violet-200">5 agents monitoring active markets</p>
        </div>
      </div>
    </aside>
  );
}
