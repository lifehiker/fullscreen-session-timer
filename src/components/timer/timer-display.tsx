"use client";
import { useTimerStore } from "@/stores/timer-store";
import { formatTime } from "@/lib/timer-utils";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  className?: string;
  large?: boolean;
}

export function TimerDisplay({ className, large = false }: TimerDisplayProps) {
  const { remainingSeconds, isFinished, currentSegmentIndex, segments } = useTimerStore();
  const currentSegment = segments[currentSegmentIndex];

  const segmentColor = currentSegment?.type === "rest"
    ? "text-blue-400"
    : currentSegment?.type === "warmup"
    ? "text-yellow-400"
    : currentSegment?.type === "cooldown"
    ? "text-purple-400"
    : "text-foreground";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn(
        "font-mono font-bold tabular-nums leading-none tracking-[-0.08em] drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        large ? "text-[clamp(4rem,20vw,14rem)]" : "text-[clamp(3rem,10vw,6rem)]",
        isFinished ? "text-green-400" : segmentColor
      )}>
        {isFinished ? "Done!" : formatTime(remainingSeconds)}
      </div>
    </div>
  );
}
