"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

export default function SignInPage() {
  const router = useRouter();
  const { enabled, signIn, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const redirectTarget = useMemo(() => {
    if (typeof window === "undefined") return "/dashboard";
    return new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await signIn(email, password);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(redirectTarget);
  }
  useEffect(() => {
    if (user) router.replace(redirectTarget);
  }, [user, router, redirectTarget]);


  async function handleGoogleSignIn() {
    setPending(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setPending(false);
    }
  }

  if (!enabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication is not configured</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Add Supabase environment variables to enable email/password and Google
              sign in on the free tier.
            </p>
            <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3 font-mono text-xs">
              <p>NEXT_PUBLIC_SUPABASE_URL=...</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>Welcome back to Estate AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="sign-in-email" className="text-xs font-medium text-muted-foreground">
                Email
              </label>
            <Input
              id="sign-in-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="sign-in-password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
            <Input
              id="sign-in-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-sm text-muted-foreground">
            No account yet?{" "}
            <Link href="/sign-up" className="text-foreground underline underline-offset-4">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
