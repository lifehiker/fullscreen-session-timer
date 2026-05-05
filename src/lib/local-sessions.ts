import type { IntervalSettings, SegmentInput, TimerMode } from "@/types/timer";

const STORAGE_KEY = "session_timer_saved_sessions";

export interface SavedSessionRecord {
  id: string;
  title: string;
  mode: TimerMode;
  countdownSeconds: number;
  segments: SegmentInput[];
  intervalSettings: IntervalSettings;
  createdAt: number;
  updatedAt: number;
}

export function loadSavedSessions(): SavedSessionRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SavedSessionRecord[];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function persistSavedSessions(sessions: SavedSessionRecord[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}
