export type TimerMode = "COUNTDOWN" | "SEGMENTS" | "INTERVALS";

export type TimerTheme = "default" | "dark" | "high-contrast" | "ocean" | "forest";

export interface SegmentInput {
  id: string;
  name: string;
  durationSeconds: number;
  order: number;
  type?: "work" | "rest" | "warmup" | "cooldown" | "custom";
}

export interface IntervalSettings {
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  warmupSeconds?: number;
  cooldownSeconds?: number;
}

export interface SessionSettings {
  intervalSettings?: IntervalSettings;
}

export interface RuntimeSegment {
  id: string;
  name: string;
  durationSeconds: number;
  type: "work" | "rest" | "warmup" | "cooldown" | "custom";
}

export interface TimerState {
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
}
