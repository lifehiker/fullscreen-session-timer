"use client";
import { useTimerStore } from "@/stores/timer-store";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerControlsProps {
  className?: string;
  size?: "default" | "lg";
  showVolumeToggle?: boolean;
}

export function TimerControls({ className, size = "default", showVolumeToggle = true }: TimerControlsProps) {
  const { isRunning, isPaused, isFinished, soundEnabled, start, pause, resume, reset, nextSegment, previousSegment, toggleSound, segments, currentSegmentIndex } = useTimerStore();

  const btnSize = size === "lg" ? "xl" : "default";
  const iconSize = size === "lg" ? "h-7 w-7" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {segments.length > 1 && (
        <Button variant="ghost" size="icon" onClick={previousSegment} disabled={currentSegmentIndex === 0} className="opacity-70 hover:opacity-100">
          <SkipBack className={iconSize} />
        </Button>
      )}

      {!isRunning && !isPaused && !isFinished && (
        <Button size={btnSize} onClick={start} className="gap-2">
          <Play className={iconSize} /> Start
        </Button>
      )}
      {isRunning && (
        <Button size={btnSize} variant="outline" onClick={pause} className="gap-2">
          <Pause className={iconSize} /> Pause
        </Button>
      )}
      {isPaused && (
        <Button size={btnSize} onClick={resume} className="gap-2">
          <Play className={iconSize} /> Resume
        </Button>
      )}
      {isFinished && (
        <Button size={btnSize} onClick={reset} className="gap-2">
          <RotateCcw className={iconSize} /> Restart
        </Button>
      )}

      {segments.length > 1 && (
        <Button variant="ghost" size="icon" onClick={nextSegment} disabled={currentSegmentIndex >= segments.length - 1} className="opacity-70 hover:opacity-100">
          <SkipForward className={iconSize} />
        </Button>
      )}

      {(isRunning || isPaused) && (
        <Button variant="ghost" size="icon" onClick={reset} className="opacity-70 hover:opacity-100">
          <RotateCcw className={iconSize} />
        </Button>
      )}

      {showVolumeToggle && (
        <Button variant="ghost" size="icon" onClick={toggleSound} className="opacity-70 hover:opacity-100">
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
