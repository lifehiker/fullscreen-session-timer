import type { IntervalSettings, SegmentInput, TimerMode } from "@/types/timer";
import { generateId } from "@/lib/timer-utils";

export interface SessionBlueprint {
  title: string;
  mode: TimerMode;
  countdownSeconds: number;
  segments: SegmentInput[];
  intervalSettings: IntervalSettings;
}

function buildSegments(
  segments: Array<{ name: string; minutes: number; seconds?: number; type?: SegmentInput["type"] }>
): SegmentInput[] {
  return segments.map((segment, index) => ({
    id: generateId(),
    name: segment.name,
    durationSeconds: segment.minutes * 60 + (segment.seconds ?? 0),
    order: index,
    type: segment.type ?? "custom",
  }));
}

export function createDefaultBlueprint(): SessionBlueprint {
  return {
    title: "Workshop Run of Show",
    mode: "SEGMENTS",
    countdownSeconds: 15 * 60,
    segments: buildSegments([
      { name: "Opening Frame", minutes: 3 },
      { name: "Context Setting", minutes: 7 },
      { name: "Group Work", minutes: 12 },
      { name: "Share Out", minutes: 6 },
      { name: "Close", minutes: 2 },
    ]),
    intervalSettings: {
      workSeconds: 45,
      restSeconds: 15,
      rounds: 8,
      warmupSeconds: 60,
      cooldownSeconds: 90,
    },
  };
}

export function createPresentationBlueprint(): SessionBlueprint {
  return {
    title: "Conference Talk Timer",
    mode: "SEGMENTS",
    countdownSeconds: 20 * 60,
    segments: buildSegments([
      { name: "Intro Story", minutes: 2 },
      { name: "Core Idea", minutes: 8 },
      { name: "Demo", minutes: 5 },
      { name: "Q&A", minutes: 5 },
    ]),
    intervalSettings: {
      workSeconds: 180,
      restSeconds: 30,
      rounds: 4,
      warmupSeconds: 60,
      cooldownSeconds: 60,
    },
  };
}

export function createClassroomBlueprint(): SessionBlueprint {
  return {
    title: "Classroom Blocks",
    mode: "SEGMENTS",
    countdownSeconds: 10 * 60,
    segments: buildSegments([
      { name: "Do Now", minutes: 4 },
      { name: "Mini Lesson", minutes: 9 },
      { name: "Partner Practice", minutes: 12 },
      { name: "Independent Work", minutes: 15 },
      { name: "Exit Ticket", minutes: 3 },
    ]),
    intervalSettings: {
      workSeconds: 600,
      restSeconds: 120,
      rounds: 3,
      warmupSeconds: 180,
      cooldownSeconds: 120,
    },
  };
}

export function createIntervalBlueprint(): SessionBlueprint {
  return {
    title: "Tabata Flow",
    mode: "INTERVALS",
    countdownSeconds: 12 * 60,
    segments: buildSegments([
      { name: "Round 1", minutes: 1 },
      { name: "Round 2", minutes: 1 },
      { name: "Round 3", minutes: 1 },
    ]),
    intervalSettings: {
      workSeconds: 40,
      restSeconds: 20,
      rounds: 10,
      warmupSeconds: 120,
      cooldownSeconds: 90,
    },
  };
}

export function createCountdownBlueprint(): SessionBlueprint {
  return {
    title: "Single Countdown",
    mode: "COUNTDOWN",
    countdownSeconds: 25 * 60,
    segments: buildSegments([{ name: "Focus Session", minutes: 25 }]),
    intervalSettings: {
      workSeconds: 60,
      restSeconds: 15,
      rounds: 6,
      warmupSeconds: 0,
      cooldownSeconds: 0,
    },
  };
}
