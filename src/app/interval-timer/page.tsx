import { Flame } from "lucide-react";
import { UseCasePage } from "@/components/marketing/use-case-page";
import { createIntervalBlueprint } from "@/lib/session-presets";

export default function IntervalTimerPage() {
  return (
    <UseCasePage
      eyebrow="Interval Timer"
      title="A fullscreen interval timer for circuits, coaching, and structured drills."
      description="Run warmups, work blocks, rest periods, and cooldowns in one room-facing flow that coaches can control at a glance."
      bullets={[
        "Configure work/rest cycles with explicit rounds and optional bookends.",
        "See the current phase and next block clearly from across the floor.",
        "Reset or skip a segment without rebuilding the whole interval set.",
        "Use the same workspace for personal training, therapy drills, or rehearsal pacing.",
      ]}
      icon={Flame}
      blueprint={createIntervalBlueprint()}
    />
  );
}
