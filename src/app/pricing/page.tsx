import Link from "next/link";
import { Check, Lock, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProBadge } from "@/components/paywall/pro-badge";

const freeFeatures = [
  "Unlimited live countdown usage",
  "Three browser-saved sessions",
  "Basic sound cues and local draft persistence",
  "Single countdown plus local use-case presets",
];

const proFeatures = [
  "Unlimited saved sessions",
  "Cloud sync across devices once billing/auth is configured",
  "Premium projector themes and future template packs",
  "Priority access to new facilitator and coaching workflows",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <Badge className="border-0 bg-[rgba(255,132,82,0.16)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--signal-soft)]">
            Simple Pricing
          </Badge>
          <h1 className="mt-5 font-display text-6xl leading-[0.92] text-[var(--paper)]">Keep the timer free to try. Upgrade when you want a real toolkit.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[rgba(242,234,218,0.72)]">
            SessionTimer is designed for repeat use, so the free tier stays generous while Pro handles deeper customization and future account-based syncing.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="cue-panel rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Free</p>
            <p className="mt-3 font-display text-5xl text-[var(--paper)]">$0</p>
            <p className="mt-2 text-[rgba(242,234,218,0.68)]">Best for immediate countdowns, trial runs, and browser-local session drafts.</p>
            <div className="mt-8 grid gap-3">
              {freeFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(242,234,218,0.72)]">
                  <Check className="h-4 w-4 text-[var(--signal-soft)]" />
                  {feature}
                </div>
              ))}
            </div>
            <Button asChild className="mt-8 rounded-full bg-[var(--signal)] px-6 text-[var(--ink)] hover:bg-[var(--signal-soft)]">
              <Link href="/app">Open Free Workspace</Link>
            </Button>
          </div>

          <div className="cue-panel rounded-[2rem] border border-[rgba(255,132,82,0.45)] bg-[linear-gradient(180deg,rgba(255,132,82,0.12),rgba(255,255,255,0.04))] p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Pro</p>
                <p className="mt-3 font-display text-5xl text-[var(--paper)]">$29<span className="text-xl text-[rgba(242,234,218,0.68)]">/year</span></p>
              </div>
              <ProBadge />
            </div>
            <p className="mt-2 text-[rgba(242,234,218,0.72)]">For teachers, presenters, and coaches who want a reusable system instead of a one-off timer tab.</p>
            <div className="mt-8 grid gap-3">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(242,234,218,0.72)]">
                  <Sparkles className="h-4 w-4 text-[var(--signal-soft)]" />
                  {feature}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.3rem] border border-dashed border-[rgba(255,132,82,0.32)] bg-[rgba(13,16,24,0.4)] p-4 text-sm text-[rgba(242,234,218,0.68)]">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[var(--signal-soft)]" />
                Billing hooks are prepared, but live Stripe setup still needs real product and webhook credentials.
              </div>
            </div>
            <Button asChild variant="outline" className="mt-8 rounded-full border-white/10 bg-transparent px-6 text-[var(--paper)] hover:bg-white/10">
              <Link href="/HUMAN_INPUT_NEEDED.md">Review Setup Requirements</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
