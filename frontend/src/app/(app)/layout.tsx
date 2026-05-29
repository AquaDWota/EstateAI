import { AISidebar } from "@/components/layout/ai-sidebar";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-20">
        <AISidebar />
        <div className="flex-1 lg:min-w-0">
          <header className="sticky top-20 z-30 flex h-12 items-center border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
            <Link href="/dashboard" className="font-bold text-foreground">
            Estate AI
          </Link>
            <nav className="ml-auto flex gap-4 text-sm text-muted-foreground">
            <Link href="/properties">Properties</Link>
            <Link href="/assistant">AI</Link>
            <Link href="/map">Map</Link>
          </nav>
        </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
