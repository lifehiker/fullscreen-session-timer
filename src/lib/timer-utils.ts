import type { IntervalSettings, RuntimeSegment, SegmentInput } from "@/types/timer";

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function intervalsToSegments(settings: IntervalSettings): RuntimeSegment[] {
  const segments: RuntimeSegment[] = [];
  let idx = 0;

  if (settings.warmupSeconds && settings.warmupSeconds > 0) {
    segments.push({ id: `seg-${idx++}`, name: "Warm Up", durationSeconds: settings.warmupSeconds, type: "warmup" });
  }

  for (let round = 1; round <= settings.rounds; round++) {
    segments.push({ id: `seg-${idx++}`, name: `Work — Round ${round}`, durationSeconds: settings.workSeconds, type: "work" });
    if (round < settings.rounds && settings.restSeconds > 0) {
      segments.push({ id: `seg-${idx++}`, name: `Rest — Round ${round}`, durationSeconds: settings.restSeconds, type: "rest" });
    }
  }

  if (settings.cooldownSeconds && settings.cooldownSeconds > 0) {
    segments.push({ id: `seg-${idx++}`, name: "Cool Down", durationSeconds: settings.cooldownSeconds, type: "cooldown" });
  }

  return segments;
}

export function segmentInputsToRuntime(inputs: SegmentInput[]): RuntimeSegment[] {
  return [...inputs]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ id: s.id, name: s.name, durationSeconds: s.durationSeconds, type: s.type ?? "custom" }));
}

export function totalSessionSeconds(segments: RuntimeSegment[]): number {
  return segments.reduce((sum, s) => sum + s.durationSeconds, 0);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
