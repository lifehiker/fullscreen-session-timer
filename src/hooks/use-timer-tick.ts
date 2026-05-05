"use client";
import { useEffect, useRef } from "react";
import { useTimerStore } from "@/stores/timer-store";

export function useTimerTick() {
  const { isRunning, advanceBy } = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        if (elapsed >= 1000) {
          const elapsedSeconds = Math.floor(elapsed / 1000);
          lastTickRef.current += elapsedSeconds * 1000;
          advanceBy(elapsedSeconds);
        }
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [advanceBy, isRunning]);
}
