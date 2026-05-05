"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IntervalSettings } from "@/types/timer";

interface IntervalBuilderFormProps {
  value: IntervalSettings;
  onChange: (settings: IntervalSettings) => void;
}

export function IntervalBuilderForm({ value, onChange }: IntervalBuilderFormProps) {
  const update = (field: keyof IntervalSettings, v: number) => onChange({ ...value, [field]: v });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label>Work (seconds)</Label>
        <Input type="number" value={value.workSeconds} onChange={(e) => update("workSeconds", parseInt(e.target.value) || 0)} min={1} />
      </div>
      <div className="space-y-1">
        <Label>Rest (seconds)</Label>
        <Input type="number" value={value.restSeconds} onChange={(e) => update("restSeconds", parseInt(e.target.value) || 0)} min={0} />
      </div>
      <div className="space-y-1">
        <Label>Rounds</Label>
        <Input type="number" value={value.rounds} onChange={(e) => update("rounds", parseInt(e.target.value) || 1)} min={1} max={100} />
      </div>
      <div className="space-y-1">
        <Label>Warmup (seconds)</Label>
        <Input type="number" value={value.warmupSeconds ?? 0} onChange={(e) => update("warmupSeconds", parseInt(e.target.value) || 0)} min={0} />
      </div>
      <div className="space-y-1">
        <Label>Cooldown (seconds)</Label>
        <Input type="number" value={value.cooldownSeconds ?? 0} onChange={(e) => update("cooldownSeconds", parseInt(e.target.value) || 0)} min={0} />
      </div>
    </div>
  );
}
