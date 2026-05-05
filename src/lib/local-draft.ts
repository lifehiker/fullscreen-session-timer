import type { TimerMode, SegmentInput, IntervalSettings } from "@/types/timer";

const DRAFT_KEY = "session_timer_draft";

export interface LocalDraft {
  title: string;
  mode: TimerMode;
  segments: SegmentInput[];
  intervalSettings?: IntervalSettings;
  savedAt: number;
}

export function saveDraft(draft: Omit<LocalDraft, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {}
}

export function loadDraft(): LocalDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalDraft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}
