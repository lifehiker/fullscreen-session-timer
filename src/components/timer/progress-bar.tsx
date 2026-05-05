"use client";
import { useTimerStore } from "@/stores/timer-store";
import { cn } from "@/lib/utils";

export function ProgressBar({ className }: { className?: string }) {
  const { segments, currentSegmentIndex, remainingSeconds } = useTimerStore();
  const current = segments[currentSegmentIndex];
  if (!current) return null;

  const segmentProgress = current.durationSeconds > 0
    ? ((current.durationSeconds - remainingSeconds) / current.durationSeconds) * 100
    : 0;

  const widthStyle = { width: segmentProgress.toFixed(2) + "%" };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className="flex justify-between font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[rgba(242,234,218,0.54)]">
        <span>Segment {currentSegmentIndex + 1} / {segments.length}</span>
        <span>{Math.round(segmentProgress)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--signal)] via-[#ffe0ba] to-[var(--signal-soft)] transition-all duration-1000 ease-linear"
          style={widthStyle}
        />
      </div>
    </div>
  );
}
