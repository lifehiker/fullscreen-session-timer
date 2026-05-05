"use client";
import { useTimerStore } from "@/stores/timer-store";
import { formatTime } from "@/lib/timer-utils";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function NextSegmentPreview({ className }: { className?: string }) {
  const { segments, currentSegmentIndex } = useTimerStore();
  const next = segments[currentSegmentIndex + 1];
  if (!next) return null;

  return (
    <div className={cn("flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[rgba(242,234,218,0.72)] backdrop-blur", className)}>
      <ChevronRight className="h-4 w-4 text-[var(--signal-soft)]" />
      <span className="font-mono uppercase tracking-[0.2em] text-[rgba(242,234,218,0.5)]">Next</span>
      <span className="text-[var(--paper)]">{next.name}</span>
      <span className="font-mono text-[rgba(242,234,218,0.58)]">{formatTime(next.durationSeconds)}</span>
    </div>
  );
}
