import Link from "next/link";
import { ArrowRight, Flame, Presentation, Projector, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { SessionStudio } from "@/components/studio/session-studio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const useCases = [
  {
    href: "/presentation-timer",
    title: "Presentation Timer",
    description: "Segment intros, demos, and Q&A without looking down at a laptop clock.",
    icon: Presentation,
  },
  {
    href: "/classroom-timer",
    title: "Classroom Timer",
    description: "Keep projector-friendly transitions visible from the back of the room.",
    icon: Projector,
  },
  {
    href: "/interval-timer",
    title: "Interval Timer",
    description: "Run precise work/rest rounds with warmup and cooldown built in.",
    icon: Flame,
  },
];

const featurePoints = [
  "Fullscreen timer built for distance readability instead of phone-sized utility.",
  "Single countdown, named segment agendas, and interval rounds in one workflow.",
  "Wake-lock support, end-of-segment sounds, and color themes for real rooms.",
  "Local draft persistence and browser-saved sessions with room for future account sync.",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="space-y-7">
            <Badge className="border-0 bg-[rgba(255,132,82,0.16)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--signal-soft)]">
              Fullscreen Session Timer
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-display text-[clamp(3.6rem,7vw,7rem)] leading-[0.9] text-[var(--paper)]">
                A room-facing timer designed like a stage cue system.
              </h1>
              <p className="max-w-2xl text-lg text-[rgba(242,234,218,0.74)] sm:text-xl">
                SessionTimer gives presenters, teachers, coaches, and facilitators a calm, high-contrast timer they can trust from across the room. No clutter. No workout-app noise. Just clear pacing.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="hero-chip">
                <TimerReset className="h-5 w-5 text-[var(--signal-soft)]" />
                <div>
                  <p className="font-display text-2xl text-[var(--paper)]">3 Modes</p>
                  <p className="text-sm text-[rgba(242,234,218,0.62)]">Countdown, agenda, interval</p>
                </div>
              </div>
              <div className="hero-chip">
                <Sparkles className="h-5 w-5 text-[var(--signal-soft)]" />
                <div>
                  <p className="font-display text-2xl text-[var(--paper)]">5 Themes</p>
                  <p className="text-sm text-[rgba(242,234,218,0.62)]">Projection-ready contrast</p>
                </div>
              </div>
              <div className="hero-chip">
                <ShieldCheck className="h-5 w-5 text-[var(--signal-soft)]" />
                <div>
                  <p className="font-display text-2xl text-[var(--paper)]">Local First</p>
                  <p className="text-sm text-[rgba(242,234,218,0.62)]">Drafts survive reloads</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-[var(--signal)] px-6 text-[var(--ink)] hover:bg-[var(--signal-soft)]">
                <Link href="/app">
                  Open Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-transparent px-6 text-[var(--paper)] hover:bg-white/10">
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-12 hidden h-32 w-32 rounded-full bg-[rgba(255,132,82,0.2)] blur-3xl lg:block" />
            <div className="absolute right-2 top-0 hidden h-40 w-40 rounded-full bg-[rgba(255,224,189,0.14)] blur-3xl lg:block" />
            <div className="cue-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.5)] to-transparent" />
              <div className="rounded-[1.6rem] border border-white/10 bg-[rgba(9,12,20,0.82)] p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[rgba(242,234,218,0.56)]">Now running</p>
                  <Badge className="border-0 bg-[rgba(255,132,82,0.16)] text-[var(--signal-soft)]">Fullscreen Timer</Badge>
                </div>
                <div className="mt-10">
                  <p className="font-mono text-sm uppercase tracking-[0.28em] text-[rgba(242,234,218,0.5)]">Current Segment</p>
                  <p className="mt-3 font-display text-5xl text-[var(--paper)]">Group Work</p>
                  <p className="mt-6 font-mono text-[clamp(4rem,12vw,8rem)] leading-none tracking-[-0.08em] text-[var(--signal-soft)]">12:00</p>
                </div>
                <div className="mt-10 space-y-3">
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[var(--signal)] to-[var(--signal-soft)]" />
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-[rgba(242,234,218,0.56)]">
                    <span>3 of 5</span>
                    <span>Next: Share Out</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {useCases.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="cue-panel group rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 transition-transform duration-300 hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.07)]"
            >
              <Icon className="h-6 w-6 text-[var(--signal-soft)] transition-transform duration-300 group-hover:rotate-[-6deg]" />
              <h2 className="mt-10 font-display text-3xl text-[var(--paper)]">{title}</h2>
              <p className="mt-3 text-[rgba(242,234,218,0.68)]">{description}</p>
              <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--signal-soft)]">
                Open Use Case
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <Badge className="border-0 bg-white/8 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--paper)]">
              Live Workspace
            </Badge>
            <h2 className="font-display text-5xl leading-[0.95] text-[var(--paper)]">Build your session, then launch it fullscreen.</h2>
            <p className="max-w-xl text-lg text-[rgba(242,234,218,0.7)]">
              This is the working product, not a mockup. Create segments, swap themes, test intervals, save a browser-local library, and run the timer immediately.
            </p>
            <div className="grid gap-3">
              {featurePoints.map((point) => (
                <div key={point} className="rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[rgba(242,234,218,0.7)]">
                  {point}
                </div>
              ))}
            </div>
          </div>
          <div>
            <SessionStudio compact />
          </div>
        </section>
      </div>
    </main>
  );
}
