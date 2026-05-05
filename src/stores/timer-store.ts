import { create } from "zustand";
import type { TimerMode, TimerTheme, RuntimeSegment } from "@/types/timer";
import { totalSessionSeconds } from "@/lib/timer-utils";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

interface TimerStore {
  mode: TimerMode;
  segments: RuntimeSegment[];
  currentSegmentIndex: number;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  soundEnabled: boolean;
  theme: TimerTheme;

  loadCountdown: (seconds: number, title?: string) => void;
  loadSegments: (segs: RuntimeSegment[], mode?: TimerMode) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  advanceBy: (seconds: number) => void;
  nextSegment: () => void;
  previousSegment: () => void;
  toggleSound: () => void;
  setTheme: (theme: TimerTheme) => void;
  setMode: (mode: TimerMode) => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  mode: "COUNTDOWN",
  segments: [],
  currentSegmentIndex: 0,
  remainingSeconds: 0,
  totalSeconds: 0,
  isRunning: false,
  isPaused: false,
  isFinished: false,
  soundEnabled: true,
  theme: "default",

  loadCountdown: (seconds, title) => {
    const seg: RuntimeSegment = { id: "countdown", name: title || "Timer", durationSeconds: seconds, type: "custom" };
    set({ mode: "COUNTDOWN", segments: [seg], currentSegmentIndex: 0, remainingSeconds: seconds, totalSeconds: seconds, isRunning: false, isPaused: false, isFinished: false });
  },

  loadSegments: (segs, mode = "SEGMENTS") => {
    const total = totalSessionSeconds(segs);
    set({ mode, segments: segs, currentSegmentIndex: 0, remainingSeconds: segs[0]?.durationSeconds ?? 0, totalSeconds: total, isRunning: false, isPaused: false, isFinished: false });
  },

  start: () => set({ isRunning: true, isPaused: false }),

  pause: () => set({ isRunning: false, isPaused: true }),

  resume: () => set({ isRunning: true, isPaused: false }),

  reset: () => {
    const { segments } = get();
    set({ currentSegmentIndex: 0, remainingSeconds: segments[0]?.durationSeconds ?? 0, isRunning: false, isPaused: false, isFinished: false });
  },

  tick: () => get().advanceBy(1),

  advanceBy: (seconds) => {
    const { isRunning, isPaused, isFinished, remainingSeconds, currentSegmentIndex, segments, soundEnabled } = get();
    if (!isRunning || isPaused || isFinished || seconds <= 0 || segments.length === 0) {
      return;
    }

    let secondsToAdvance = seconds;
    let nextSegmentIndex = currentSegmentIndex;
    let nextRemainingSeconds = remainingSeconds;
    let nextIsRunning = true;
    let nextIsFinished = false;

    while (secondsToAdvance > 0 && nextSegmentIndex < segments.length) {
      if (nextRemainingSeconds > secondsToAdvance) {
        nextRemainingSeconds -= secondsToAdvance;
        secondsToAdvance = 0;
        break;
      }

      secondsToAdvance -= nextRemainingSeconds;

      if (soundEnabled) {
        playBeep(false);
      }

      const upcomingSegmentIndex = nextSegmentIndex + 1;
      if (upcomingSegmentIndex < segments.length) {
        nextSegmentIndex = upcomingSegmentIndex;
        nextRemainingSeconds = segments[upcomingSegmentIndex].durationSeconds;
        continue;
      }

      if (soundEnabled) {
        playBeep(true);
      }

      nextIsRunning = false;
      nextIsFinished = true;
      nextRemainingSeconds = 0;
      break;
    }

    set({
      currentSegmentIndex: nextSegmentIndex,
      remainingSeconds: nextRemainingSeconds,
      isRunning: nextIsRunning,
      isPaused: false,
      isFinished: nextIsFinished,
    });
  },

  nextSegment: () => {
    const { currentSegmentIndex, segments } = get();
    const nextIdx = currentSegmentIndex + 1;
    if (nextIdx < segments.length) {
      set({ currentSegmentIndex: nextIdx, remainingSeconds: segments[nextIdx].durationSeconds, isFinished: false });
    }
  },

  previousSegment: () => {
    const { currentSegmentIndex, segments } = get();
    const prevIdx = Math.max(0, currentSegmentIndex - 1);
    set({ currentSegmentIndex: prevIdx, remainingSeconds: segments[prevIdx].durationSeconds, isFinished: false });
  },

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setTheme: (theme) => set({ theme }),
  setMode: (mode) => set({ mode }),
}));

function playBeep(final: boolean) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx = new AudioContextCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = final ? 880 : 660;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (final ? 0.8 : 0.3));
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + (final ? 0.8 : 0.3));
  } catch {}
}
