import Link from "next/link";
import { ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionStudio } from "@/components/studio/session-studio";
import type { SessionBlueprint } from "@/lib/session-presets";

interface UseCasePageProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  blueprint: SessionBlueprint;
}

export function UseCasePage({
  eyebrow,
  title,
  description,
  bullets,
  icon: Icon,
  blueprint,
}: UseCasePageProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <Badge className="border-0 bg-[rgba(255,132,82,0.16)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--signal-soft)]">
              {eyebrow}
            </Badge>
            <div className="flex items-center gap-3 text-[var(--signal-soft)]">
              <Icon className="h-7 w-7" />
              <span className="font-mono text-xs uppercase tracking-[0.26em]">Room-visible timer workflow</span>
            </div>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.95] text-[var(--paper)] sm:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg text-[rgba(242,234,218,0.74)]">{description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--signal-soft)]" />
                  <p className="text-sm text-[rgba(242,234,218,0.74)]">{bullet}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-[var(--signal)] px-6 text-[var(--ink)] hover:bg-[var(--signal-soft)]">
                <Link href="/app">
                  Open Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-transparent px-6 text-[var(--paper)] hover:bg-white/10">
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-12 top-8 hidden h-32 w-32 rounded-full bg-[rgba(255,132,82,0.25)] blur-3xl lg:block" />
            <div className="absolute bottom-8 right-0 hidden h-40 w-40 rounded-full bg-[rgba(255,226,178,0.12)] blur-3xl lg:block" />
            <SessionStudio initialBlueprint={blueprint} compact />
          </div>
        </section>
      </div>
    </main>
  );
}
