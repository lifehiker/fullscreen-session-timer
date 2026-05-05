"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const payload = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Unable to create account");
      return;
    }

    router.push("/login?registered=1");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--background)] px-4 py-12">
      <Card className="cue-panel w-full max-w-md border-white/10 bg-[rgba(10,12,22,0.82)] text-[var(--paper)]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Timer className="h-6 w-6 text-[var(--signal-soft)]" />
          </div>
          <CardTitle className="font-display text-4xl">Create your SessionTimer account</CardTitle>
          <CardDescription className="text-[rgba(242,234,218,0.68)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--signal-soft)] underline underline-offset-4">
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} className="border-white/10 bg-white/5 text-[var(--paper)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="border-white/10 bg-white/5 text-[var(--paper)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} className="border-white/10 bg-white/5 text-[var(--paper)]" />
            </div>
            {error ? <p className="text-sm text-[var(--signal-soft)]">{error}</p> : null}
            <Button type="submit" className="w-full rounded-full bg-[var(--signal)] text-[var(--ink)] hover:bg-[var(--signal-soft)]" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
