"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.ok) {
      router.push("/app");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 text-[var(--paper)]">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[var(--signal-soft)]">
            Session Control
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl font-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.92] text-[var(--paper)]">
              Step back into the booth and launch the next room-facing run.
            </h1>
            <p className="max-w-xl text-lg text-[rgba(242,234,218,0.72)]">
              Save reusable session plans, keep pacing consistent, and move from draft to fullscreen without rebuilding your timer every time.
            </p>
          </div>
          <div className="grid gap-3 sm:max-w-lg">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(242,234,218,0.72)]">
              Browser-local drafts for quick setup, with account access when you want repeatable workflows.
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(242,234,218,0.72)]">
              Built for presentations, classrooms, coaching sessions, and any format that needs a clear timing stage.
            </div>
          </div>
        </section>

        <Card className="cue-panel w-full max-w-md justify-self-end border-white/10 bg-[rgba(10,12,22,0.84)] text-[var(--paper)]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Timer className="h-6 w-6 text-[var(--signal-soft)]" />
            </div>
            <CardTitle className="font-display text-4xl">Sign in to SessionTimer</CardTitle>
            <CardDescription className="text-[rgba(242,234,218,0.68)]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--signal-soft)] underline underline-offset-4">
                Create one free
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {registered ? (
                <div className="rounded-[1.2rem] border border-[rgba(255,210,150,0.18)] bg-[rgba(255,132,82,0.1)] px-4 py-3 text-sm text-[rgba(242,234,218,0.82)]">
                  Account created. Sign in to open your workspace.
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoFocus
                  className="border-white/10 bg-white/5 text-[var(--paper)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="border-white/10 bg-white/5 text-[var(--paper)]"
                />
              </div>
              {error ? <p className="text-sm text-[var(--signal-soft)]">{error}</p> : null}
              <Button
                type="submit"
                className="w-full rounded-full bg-[var(--signal)] text-[var(--ink)] hover:bg-[var(--signal-soft)]"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <LoginContent />
    </Suspense>
  );
}
