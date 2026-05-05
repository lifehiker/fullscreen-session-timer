"use client";
import { useTimerStore } from "@/stores/timer-store";
import { cn } from "@/lib/utils";

export function SegmentLabel({ className }: { className?: string }) {
  const { segments, currentSegmentIndex, isFinished } = useTimerStore();
  const current = segments[currentSegmentIndex];

  if (!current || isFinished) return null;

  return (
    <div className={cn("text-center", className)}>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-[rgba(242,234,218,0.5)]">
        Current Segment
      </p>
      <span className="mt-3 block text-balance text-2xl font-semibold uppercase tracking-[0.18em] text-[var(--paper)] sm:text-3xl">
        {current.name}
      </span>
    </div>
  );
}
