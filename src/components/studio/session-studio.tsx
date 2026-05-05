"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Clock3,
  Copy,
  Flame,
  FolderClock,
  Library,
  Monitor,
  PlayCircle,
  Presentation,
  Projector,
  Save,
  Trash2,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SegmentListEditor } from "@/components/session/segment-list-editor";
import { IntervalBuilderForm } from "@/components/session/interval-builder-form";
import { FullscreenTimer } from "@/components/timer/fullscreen-timer";
import { useTimerStore } from "@/stores/timer-store";
import { clearDraft, loadDraft, saveDraft } from "@/lib/local-draft";
import {
  loadSavedSessions,
  persistSavedSessions,
  type SavedSessionRecord,
} from "@/lib/local-sessions";
import {
  createClassroomBlueprint,
  createCountdownBlueprint,
  createDefaultBlueprint,
  createIntervalBlueprint,
  createPresentationBlueprint,
  type SessionBlueprint,
} from "@/lib/session-presets";
import { cn } from "@/lib/utils";
import { formatDuration, generateId, intervalsToSegments, segmentInputsToRuntime, totalSessionSeconds } from "@/lib/timer-utils";
import type { IntervalSettings, SegmentInput, TimerMode, TimerTheme } from "@/types/timer";

const FREE_SAVED_LIMIT = 3;

const themeOptions: Array<{
  value: TimerTheme;
  label: string;
  description: string;
}> = [
  { value: "default", label: "Signal Red", description: "Warm cue-light contrast for auditoriums and workshops." },
  { value: "dark", label: "House Black", description: "Near-black projection mode for low-light rooms." },
  { value: "high-contrast", label: "Projector Yellow", description: "Maximum legibility on bright projectors." },
  { value: "ocean", label: "Late Blue", description: "Cool presentation mode with softer edge contrast." },
  { value: "forest", label: "Field Green", description: "Grounded training palette for coaching sessions." },
];

const presetOptions = [
  { key: "default", label: "Workshop", icon: Monitor, factory: createDefaultBlueprint },
  { key: "presentation", label: "Presentation", icon: Presentation, factory: createPresentationBlueprint },
  { key: "classroom", label: "Classroom", icon: Projector, factory: createClassroomBlueprint },
  { key: "interval", label: "Intervals", icon: Flame, factory: createIntervalBlueprint },
  { key: "countdown", label: "Countdown", icon: Clock3, factory: createCountdownBlueprint },
] as const;

function cloneSegments(segments: SegmentInput[]): SegmentInput[] {
  return segments.map((segment, index) => ({
    ...segment,
    id: generateId(),
    order: index,
  }));
}

function normalizeSegments(segments: SegmentInput[]): SegmentInput[] {
  return segments.map((segment, index) => ({
    ...segment,
    name: segment.name.trim() || `Segment ${index + 1}`,
    durationSeconds: Math.max(5, segment.durationSeconds),
    order: index,
  }));
}

interface SessionStudioProps {
  initialBlueprint?: SessionBlueprint;
  compact?: boolean;
}

export function SessionStudio({ initialBlueprint, compact = false }: SessionStudioProps) {
  const theme = useTimerStore((state) => state.theme);
  const soundEnabled = useTimerStore((state) => state.soundEnabled);
  const setTheme = useTimerStore((state) => state.setTheme);
  const setModeInStore = useTimerStore((state) => state.setMode);
  const loadCountdown = useTimerStore((state) => state.loadCountdown);
  const loadSegments = useTimerStore((state) => state.loadSegments);
  const startingBlueprint = initialBlueprint ?? createDefaultBlueprint();
  const [title, setTitle] = useState(startingBlueprint.title);
  const [mode, setMode] = useState<TimerMode>(startingBlueprint.mode);
  const [countdownMinutes, setCountdownMinutes] = useState(Math.floor(startingBlueprint.countdownSeconds / 60));
  const [countdownSeconds, setCountdownSeconds] = useState(startingBlueprint.countdownSeconds % 60);
  const [segments, setSegments] = useState<SegmentInput[]>(cloneSegments(startingBlueprint.segments));
  const [intervalSettings, setIntervalSettings] = useState<IntervalSettings>(startingBlueprint.intervalSettings);
  const [savedSessions, setSavedSessions] = useState<SavedSessionRecord[]>([]);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const totalCountdownSeconds = useMemo(
    () => Math.max(5, countdownMinutes * 60 + countdownSeconds),
    [countdownMinutes, countdownSeconds]
  );

  const runtimeSegments = useMemo(() => {
    if (mode === "COUNTDOWN") {
      return [
        {
          id: "countdown-runtime",
          name: title.trim() || "Countdown",
          durationSeconds: totalCountdownSeconds,
          type: "custom" as const,
        },
      ];
    }

    if (mode === "INTERVALS") {
      return intervalsToSegments(intervalSettings);
    }

    return segmentInputsToRuntime(normalizeSegments(segments));
  }, [intervalSettings, mode, segments, title, totalCountdownSeconds]);

  const liveTotalDuration = useMemo(() => totalSessionSeconds(runtimeSegments), [runtimeSegments]);

  useEffect(() => {
    const localSessions = loadSavedSessions();
    setSavedSessions(localSessions);
  }, []);

  useEffect(() => {
    if (hasLoadedDraft) {
      return;
    }

    const draft = loadDraft();
    if (!draft) {
      setHasLoadedDraft(true);
      return;
    }

    setTitle(draft.title);
    setMode(draft.mode);
    setSegments(cloneSegments(draft.segments));
    if (draft.mode === "COUNTDOWN" && draft.segments[0]) {
      setCountdownMinutes(Math.floor(draft.segments[0].durationSeconds / 60));
      setCountdownSeconds(draft.segments[0].durationSeconds % 60);
    }
    if (draft.intervalSettings) {
      setIntervalSettings(draft.intervalSettings);
    }
    setHasLoadedDraft(true);
  }, [hasLoadedDraft]);

  useEffect(() => {
    if (!hasLoadedDraft) {
      return;
    }

    saveDraft({
      title,
      mode,
      segments:
        mode === "COUNTDOWN"
          ? [
              {
                id: "draft-countdown",
                name: title.trim() || "Countdown",
                durationSeconds: totalCountdownSeconds,
                order: 0,
                type: "custom",
              },
            ]
          : normalizeSegments(segments),
      intervalSettings,
    });
  }, [countdownSeconds, countdownMinutes, hasLoadedDraft, intervalSettings, mode, segments, title, totalCountdownSeconds]);

  useEffect(() => {
    setModeInStore(mode);
    if (mode === "COUNTDOWN") {
      loadCountdown(totalCountdownSeconds, title.trim() || "Countdown");
      return;
    }
    loadSegments(runtimeSegments, mode);
  }, [loadCountdown, loadSegments, mode, runtimeSegments, setModeInStore, title, totalCountdownSeconds]);

  const loadBlueprint = (blueprint: SessionBlueprint) => {
    setTitle(blueprint.title);
    setMode(blueprint.mode);
    setCountdownMinutes(Math.floor(blueprint.countdownSeconds / 60));
    setCountdownSeconds(blueprint.countdownSeconds % 60);
    setSegments(cloneSegments(blueprint.segments));
    setIntervalSettings(blueprint.intervalSettings);
    toast.success(`${blueprint.title} loaded`);
  };

  const handlePresetChange = (value: string) => {
    const selected = presetOptions.find((preset) => preset.key === value);
    if (!selected) {
      return;
    }
    loadBlueprint(selected.factory());
  };

  const saveCurrentSession = () => {
    if (savedSessions.length >= FREE_SAVED_LIMIT) {
      toast.error("Free mode stores up to three saved sessions in this browser.");
      return;
    }

    const now = Date.now();
    const session: SavedSessionRecord = {
      id: generateId(),
      title: title.trim() || "Untitled Session",
      mode,
      countdownSeconds: totalCountdownSeconds,
      segments: normalizeSegments(segments),
      intervalSettings,
      createdAt: now,
      updatedAt: now,
    };

    const nextSessions = [session, ...savedSessions];
    setSavedSessions(nextSessions);
    persistSavedSessions(nextSessions);
    toast.success("Session saved to this browser");
  };

  const deleteSavedSession = (id: string) => {
    const nextSessions = savedSessions.filter((session) => session.id !== id);
    setSavedSessions(nextSessions);
    persistSavedSessions(nextSessions);
    toast.success("Saved session removed");
  };

  const duplicateSavedSession = (record: SavedSessionRecord) => {
    if (savedSessions.length >= FREE_SAVED_LIMIT) {
      toast.error("Delete an existing save before duplicating another one.");
      return;
    }

    const copy = {
      ...record,
      id: generateId(),
      title: `${record.title} Copy`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      segments: cloneSegments(record.segments),
    };
    const nextSessions = [copy, ...savedSessions];
    setSavedSessions(nextSessions);
    persistSavedSessions(nextSessions);
    toast.success("Duplicate created");
  };

  const applySavedSession = (record: SavedSessionRecord) => {
    loadBlueprint({
      title: record.title,
      mode: record.mode,
      countdownSeconds: record.countdownSeconds,
      segments: record.segments,
      intervalSettings: record.intervalSettings,
    });
  };

  const resetToDefault = () => {
    clearDraft();
    loadBlueprint(initialBlueprint ?? createDefaultBlueprint());
    toast.success("Draft cleared");
  };

  const selectedTheme = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];

  return (
    <section className={cn("grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", compact && "gap-5")}>
      <Card className="cue-panel overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(14,18,30,0.96),rgba(10,12,22,0.9))] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <CardHeader className="border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge className="border-0 bg-[rgba(255,132,82,0.16)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--signal-soft)]">
                Control Booth
              </Badge>
              <div>
                <CardTitle className="font-display text-3xl text-[var(--paper)]">Build the next session cue sheet</CardTitle>
                <CardDescription className="max-w-2xl pt-2 text-[0.95rem] text-[rgba(242,234,218,0.68)]">
                  Switch between one clean countdown, a multi-segment run of show, or a repeatable interval set. The live stage updates instantly.
                </CardDescription>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.5)]">Total Runtime</p>
              <p className="mt-1 font-mono text-3xl text-[var(--paper)]">{formatDuration(liveTotalDuration)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <label className="space-y-2">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Session Title</span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Workshop Run of Show"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-4 text-base text-[var(--paper)] placeholder:text-[rgba(242,234,218,0.3)]"
              />
            </label>
            <label className="space-y-2">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Starter Preset</span>
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/5 text-[var(--paper)]">
                  <SelectValue placeholder="Load a use-case preset" />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((preset) => (
                    <SelectItem key={preset.key} value={preset.key}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)} className="space-y-5">
            <TabsList className="grid h-auto grid-cols-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-1.5">
              <TabsTrigger value="COUNTDOWN" className="rounded-xl py-3 font-mono text-[0.8rem] uppercase tracking-[0.2em] data-[state=active]:bg-[rgba(255,132,82,0.18)] data-[state=active]:text-[var(--paper)]">
                Countdown
              </TabsTrigger>
              <TabsTrigger value="SEGMENTS" className="rounded-xl py-3 font-mono text-[0.8rem] uppercase tracking-[0.2em] data-[state=active]:bg-[rgba(255,132,82,0.18)] data-[state=active]:text-[var(--paper)]">
                Segments
              </TabsTrigger>
              <TabsTrigger value="INTERVALS" className="rounded-xl py-3 font-mono text-[0.8rem] uppercase tracking-[0.2em] data-[state=active]:bg-[rgba(255,132,82,0.18)] data-[state=active]:text-[var(--paper)]">
                Intervals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="COUNTDOWN" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Minutes</span>
                  <Input
                    type="number"
                    min={0}
                    max={180}
                    value={countdownMinutes}
                    onChange={(event) => setCountdownMinutes(Number(event.target.value) || 0)}
                    className="h-16 rounded-[1.4rem] border-white/10 bg-white/5 text-center font-mono text-4xl text-[var(--paper)]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Seconds</span>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={countdownSeconds}
                    onChange={(event) => setCountdownSeconds(Math.min(59, Number(event.target.value) || 0))}
                    className="h-16 rounded-[1.4rem] border-white/10 bg-white/5 text-center font-mono text-4xl text-[var(--paper)]"
                  />
                </label>
              </div>
              <p className="text-sm text-[rgba(242,234,218,0.64)]">
                For quick speaker cues or classroom transitions. One tap gets you to a fullscreen room-facing clock.
              </p>
            </TabsContent>

            <TabsContent value="SEGMENTS" className="space-y-4">
              <SegmentListEditor segments={segments} onChange={setSegments} />
              <div className="flex flex-wrap gap-2 text-xs text-[rgba(242,234,218,0.62)]">
                <span className="rounded-full border border-white/10 px-3 py-1">Drag to reorder</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Named agenda blocks</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Speaker-friendly pacing</span>
              </div>
            </TabsContent>

            <TabsContent value="INTERVALS" className="space-y-4">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <IntervalBuilderForm value={intervalSettings} onChange={setIntervalSettings} />
              </div>
              <p className="text-sm text-[rgba(242,234,218,0.64)]">
                Warmup and cooldown stay optional. Rest rounds are skipped automatically if you set them to zero.
              </p>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Display Theme</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg text-[var(--paper)]">{selectedTheme.label}</p>
                  <p className="text-sm text-[rgba(242,234,218,0.6)]">{selectedTheme.description}</p>
                </div>
                <Select value={theme} onValueChange={(value) => setTheme(value as TimerTheme)}>
                  <SelectTrigger className="w-[180px] rounded-full border-white/10 bg-[rgba(255,255,255,0.06)] text-[var(--paper)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={saveCurrentSession}
              variant="outline"
              className="h-auto rounded-[1.4rem] border-white/10 bg-white/5 px-5 py-4 text-[var(--paper)] hover:bg-white/10"
            >
              <Save className="h-4 w-4" />
              Save Session
            </Button>

            <Button
              onClick={resetToDefault}
              variant="ghost"
              className="h-auto rounded-[1.4rem] border border-transparent px-5 py-4 text-[rgba(242,234,218,0.72)] hover:border-white/10 hover:bg-white/5"
            >
              Reset Draft
            </Button>
          </div>

          <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Local Session Library</p>
                <p className="mt-1 text-sm text-[rgba(242,234,218,0.64)]">
                  Free mode stores up to three sessions in this browser. Cross-device syncing unlocks once account infrastructure is configured.
                </p>
              </div>
              <Badge className="border-0 bg-white/10 px-3 py-1 text-[var(--paper)]">
                {savedSessions.length}/{FREE_SAVED_LIMIT} saved
              </Badge>
            </div>

            <div className="mt-4 grid gap-3">
              {savedSessions.length === 0 ? (
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-[rgba(242,234,218,0.64)]">
                  Save your first session to keep a reusable run sheet in this browser.
                </div>
              ) : (
                savedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg text-[var(--paper)]">{session.title}</p>
                        <Badge className="border-0 bg-[rgba(255,132,82,0.14)] text-[var(--signal-soft)]">{session.mode}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-[rgba(242,234,218,0.62)]">
                        {session.mode === "COUNTDOWN"
                          ? `${formatDuration(session.countdownSeconds)} single countdown`
                          : `${session.segments.length} blocks • ${formatDuration(
                              totalSessionSeconds(
                                session.mode === "INTERVALS"
                                  ? intervalsToSegments(session.intervalSettings)
                                  : segmentInputsToRuntime(session.segments)
                              )
                            )}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => applySavedSession(session)}
                        className="rounded-full border-white/10 bg-transparent text-[var(--paper)] hover:bg-white/10"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => duplicateSavedSession(session)}
                        className="rounded-full text-[rgba(242,234,218,0.75)] hover:bg-white/10"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => deleteSavedSession(session.id)}
                        className="rounded-full text-[rgba(242,234,218,0.75)] hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="cue-panel overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(14,18,30,0.92),rgba(10,12,22,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.56)]">Live Stage</p>
                <CardTitle className="pt-1 font-display text-2xl text-[var(--paper)]">{title.trim() || "Untitled Session"}</CardTitle>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.22em] text-[rgba(242,234,218,0.62)]">
                <Volume2 className="h-3.5 w-3.5" />
                {soundEnabled ? "Sound On" : "Muted"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-none">
              <FullscreenTimer
                className={cn(
                  "rounded-none border-0 shadow-none",
                  compact ? "min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]" : "min-h-[560px] sm:min-h-[680px] lg:min-h-[780px]"
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="cue-panel border-white/10 bg-[rgba(10,12,22,0.82)]">
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <FolderClock className="h-5 w-5 text-[var(--signal-soft)]" />
              <p className="mt-4 font-display text-xl text-[var(--paper)]">Readable at a distance</p>
              <p className="mt-2 text-sm text-[rgba(242,234,218,0.62)]">Oversized mono digits, clear segment labeling, and high-contrast themes built for projected rooms.</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <Library className="h-5 w-5 text-[var(--signal-soft)]" />
              <p className="mt-4 font-display text-xl text-[var(--paper)]">Flexible session structures</p>
              <p className="mt-2 text-sm text-[rgba(242,234,218,0.62)]">Use the same surface for talks, classes, therapy sessions, circuits, or workshops without changing tools.</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <Projector className="h-5 w-5 text-[var(--signal-soft)]" />
              <p className="mt-4 font-display text-xl text-[var(--paper)]">Local-first reliability</p>
              <p className="mt-2 text-sm text-[rgba(242,234,218,0.62)]">Drafts and up to three saved sessions persist in-browser even when you just need the timer to work now.</p>
            </div>
          </CardContent>
        </Card>

        {!compact ? (
          <p className="text-sm text-[rgba(242,234,218,0.56)]">
            Want account-based syncing, billing, and email flows? The local-first UI is complete, and the remaining external services are documented in `HUMAN_INPUT_NEEDED.md`.
          </p>
        ) : null}
      </div>
    </section>
  );
}
