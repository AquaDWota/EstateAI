"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export function ProtectedAppGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { enabled, user, loading } = useAuth();
  const authRequired = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (loading) return;
    if ((!enabled && authRequired) || (enabled && !user)) router.replace("/sign-in");
  }, [enabled, user, loading, router, authRequired]);

  if (enabled && loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  if ((authRequired && !enabled) || (enabled && !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in...
      </div>
    );
  }

  return <>{children}</>;
}
