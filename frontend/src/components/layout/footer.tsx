import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">Estate AI</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-slate-500">
              AI-powered real estate investment intelligence. Analyze markets,
              discover opportunities, and automate research with autonomous agents.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li><Link href="/dashboard" className="hover:text-violet-600">Dashboard</Link></li>
              <li><Link href="/properties" className="hover:text-violet-600">Properties</Link></li>
              <li><Link href="/assistant" className="hover:text-violet-600">AI Assistant</Link></li>
              <li><Link href="/agents" className="hover:text-violet-600">AI Agents</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li><Link href="/investors" className="hover:text-violet-600">Investors</Link></li>
              <li><Link href="/#faq" className="hover:text-violet-600">FAQ</Link></li>
              <li><Link href="/#pricing" className="hover:text-violet-600">Pricing</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Estate AI. Demo platform — connect live MLS APIs for production.
        </div>
      </div>
    </footer>
  );
}
