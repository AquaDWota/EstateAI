"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

export default function SignUpPage() {
  const router = useRouter();
  const { enabled, signUp, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await signUp(email, password);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard");
  }

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
              Add Supabase environment variables to enable sign up and Google OAuth.
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
          <CardTitle>Create your Estate AI account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="sign-up-email" className="text-xs font-medium text-muted-foreground">
                Email
              </label>
            <Input
              id="sign-up-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="sign-up-password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
            <Input
              id="sign-up-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating account..." : "Sign up"}
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
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
