
"use client";
import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useTimerTick } from "@/hooks/use-timer-tick";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { SegmentLabel } from "./segment-label";

export function HomepageTimer() {
  useTimerTick();
  const { loadCountdown, segments } = useTimerStore();

  useEffect(() => {
    if (segments.length === 0) {
      loadCountdown(5 * 60, "Demo Timer");
    }
  }, [loadCountdown, segments.length]);

  return (
    <div className="bg-gray-900 p-10 flex flex-col items-center gap-6">
      <SegmentLabel className="text-gray-300" />
      <TimerDisplay className="text-white" />
      <TimerControls showVolumeToggle />
    </div>
  );
}
