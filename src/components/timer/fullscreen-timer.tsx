"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useTimerTick } from "@/hooks/use-timer-tick";
import { TimerDisplay } from "./timer-display";
import { SegmentLabel } from "./segment-label";
import { NextSegmentPreview } from "./next-segment-preview";
import { ProgressBar } from "./progress-bar";
import { TimerControls } from "./timer-controls";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimerTheme } from "@/types/timer";

const themeClasses: Record<
  TimerTheme,
  {
    shell: string;
    stage: string;
    glow: string;
    control: string;
  }
> = {
  default: {
    shell: "bg-[radial-gradient(circle_at_top,rgba(255,141,94,0.32),transparent_24%),linear-gradient(180deg,#130f19,#0b1019_48%,#090c14)] text-white",
    stage: "border-white/10 bg-[linear-gradient(180deg,rgba(19,23,34,0.9),rgba(9,12,20,0.98))]",
    glow: "bg-[radial-gradient(circle,rgba(255,132,82,0.22),transparent_65%)]",
    control: "border-white/10 bg-white/5 text-[var(--paper)] hover:bg-white/10",
  },
  dark: {
    shell: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,#040404,#07090f_46%,#020202)] text-white",
    stage: "border-white/10 bg-[linear-gradient(180deg,rgba(14,14,16,0.9),rgba(4,4,5,0.98))]",
    glow: "bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_68%)]",
    control: "border-white/10 bg-white/5 text-white hover:bg-white/10",
  },
  "high-contrast": {
    shell: "bg-[linear-gradient(180deg,#020202,#0a0a0a)] text-yellow-300",
    stage: "border-yellow-300/35 bg-[linear-gradient(180deg,rgba(0,0,0,0.95),rgba(16,16,0,0.98))]",
    glow: "bg-[radial-gradient(circle,rgba(255,227,77,0.18),transparent_68%)]",
    control: "border-yellow-300/35 bg-yellow-300/8 text-yellow-200 hover:bg-yellow-300/14",
  },
  ocean: {
    shell: "bg-[radial-gradient(circle_at_top,rgba(84,201,255,0.2),transparent_22%),linear-gradient(180deg,#08101b,#0a1b26_48%,#071119)] text-cyan-300",
    stage: "border-cyan-400/20 bg-[linear-gradient(180deg,rgba(8,21,29,0.92),rgba(4,10,16,0.98))]",
    glow: "bg-[radial-gradient(circle,rgba(77,226,255,0.18),transparent_68%)]",
    control: "border-cyan-300/20 bg-cyan-400/8 text-cyan-100 hover:bg-cyan-400/12",
  },
  forest: {
    shell: "bg-[radial-gradient(circle_at_top,rgba(124,222,156,0.16),transparent_20%),linear-gradient(180deg,#07110b,#102016_48%,#07110a)] text-emerald-300",
    stage: "border-emerald-300/18 bg-[linear-gradient(180deg,rgba(8,25,16,0.94),rgba(5,13,9,0.98))]",
    glow: "bg-[radial-gradient(circle,rgba(110,231,183,0.16),transparent_68%)]",
    control: "border-emerald-300/18 bg-emerald-400/8 text-emerald-100 hover:bg-emerald-400/12",
  },
};

interface FullscreenTimerProps {
  className?: string;
}

export function FullscreenTimer({ className }: FullscreenTimerProps) {
  useTimerTick();
  const { theme, mode, soundEnabled, isRunning, isPaused, isFinished } = useTimerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const themeStyle = themeClasses[theme];
  const statusLabel = isFinished ? "Complete" : isPaused ? "Paused" : isRunning ? "Running" : "Ready";

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock.request("screen").then((l) => { lock = l; }).catch(() => {});
    return () => { lock?.release(); };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8", themeStyle.shell, className)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%,transparent_78%,rgba(255,255,255,0.03))]" />
      <div className={cn("pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 blur-3xl", themeStyle.glow)} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(transparent_0,transparent_18px,rgba(255,255,255,0.95)_19px)] [background-size:100%_20px]" />

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className={cn("absolute right-4 top-4 z-20 opacity-80 backdrop-blur transition hover:opacity-100", themeStyle.control)}
      >
        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>

      <div className={cn("relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] border p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10", themeStyle.stage)}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.68)]">
              {mode}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.68)]">
              {statusLabel}
            </div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.68)]">
            {soundEnabled ? "Audio cues on" : "Audio cues muted"}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-7">
          <SegmentLabel className="max-w-3xl" />
          <TimerDisplay large className="my-2" />
          <NextSegmentPreview />
          <ProgressBar className="w-full max-w-2xl" />
          <TimerControls size="lg" className="mt-2 flex-wrap justify-center" />
        </div>
      </div>
    </div>
  );
}
