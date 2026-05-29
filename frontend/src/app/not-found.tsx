import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-sm text-muted-foreground">
        The page you requested does not exist or may have moved.
      </p>
      <Button asChild>
        <Link href="/dashboard">Open dashboard</Link>
      </Button>
    </div>
  );
}
