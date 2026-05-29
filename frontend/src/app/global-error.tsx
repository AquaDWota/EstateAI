"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global error:", error);

  return (
    <html>
      <body className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-semibold">Application error</h2>
          <p className="text-sm text-muted-foreground">
            EstateAI encountered an unexpected failure.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => reset()}>Reload view</Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
