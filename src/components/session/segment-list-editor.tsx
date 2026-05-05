"use client";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, Plus } from "lucide-react";
import type { SegmentInput } from "@/types/timer";
import { generateId } from "@/lib/timer-utils";

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface SegmentItemProps {
  segment: SegmentInput;
  disableDelete: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, field: "name" | "minutes" | "seconds", value: string) => void;
}

function SegmentItem({ segment, disableDelete, onDelete, onChange }: SegmentItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: segment.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const minutes = Math.floor(segment.durationSeconds / 60);
  const seconds = segment.durationSeconds % 60;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
      <button {...attributes} {...listeners} className="cursor-grab touch-none opacity-40 hover:opacity-70">
        <GripVertical className="h-4 w-4" />
      </button>
      <Input
        value={segment.name}
        onChange={(e) => onChange(segment.id, "name", e.target.value)}
        placeholder="Segment name"
        className="flex-1"
      />
      <Input
        type="number"
        value={minutes}
        onChange={(e) => onChange(segment.id, "minutes", e.target.value)}
        min={0}
        max={99}
        className="w-16 text-center"
        placeholder="m"
      />
      <span className="text-muted-foreground">:</span>
      <Input
        type="number"
        value={seconds}
        onChange={(e) => onChange(segment.id, "seconds", e.target.value)}
        min={0}
        max={59}
        className="w-16 text-center"
        placeholder="s"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(segment.id)}
        disabled={disableDelete}
        className="text-destructive hover:text-destructive disabled:opacity-30"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface SegmentListEditorProps {
  segments: SegmentInput[];
  onChange: (segments: SegmentInput[]) => void;
}

export function SegmentListEditor({ segments, onChange }: SegmentListEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addSegment = () => {
    const name = "Segment " + (segments.length + 1);
    onChange([...segments, { id: generateId(), name, durationSeconds: 300, order: segments.length, type: "custom" }]);
  };

  const deleteSegment = (id: string) => {
    if (segments.length <= 1) {
      return;
    }
    onChange(segments.filter((s) => s.id !== id));
  };

  const updateSegment = (id: string, field: "name" | "minutes" | "seconds", value: string) => {
    onChange(segments.map((s) => {
      if (s.id !== id) return s;
      if (field === "name") return { ...s, name: value };
      const m = Math.floor(s.durationSeconds / 60);
      const sec = s.durationSeconds % 60;
      if (field === "minutes") {
        const nextMinutes = clampNumber(parseInt(value, 10) || 0, 0, 99);
        return { ...s, durationSeconds: nextMinutes * 60 + sec };
      }
      const nextSeconds = clampNumber(parseInt(value, 10) || 0, 0, 59);
      return { ...s, durationSeconds: m * 60 + nextSeconds };
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIdx = segments.findIndex((s) => s.id === active.id);
      const newIdx = segments.findIndex((s) => s.id === over?.id);
      onChange(arrayMove(segments, oldIdx, newIdx).map((s, i) => ({ ...s, order: i })));
    }
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={segments.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {segments.map((seg) => (
            <SegmentItem
              key={seg.id}
              segment={seg}
              disableDelete={segments.length <= 1}
              onDelete={deleteSegment}
              onChange={updateSegment}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={addSegment} className="w-full gap-2 rounded-2xl border-white/10 bg-transparent text-[var(--paper)] hover:bg-white/10">
        <Plus className="h-4 w-4" /> Add Segment
      </Button>
    </div>
  );
}
