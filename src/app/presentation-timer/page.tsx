import { Presentation } from "lucide-react";
import { UseCasePage } from "@/components/marketing/use-case-page";
import { createPresentationBlueprint } from "@/lib/session-presets";

export default function PresentationTimerPage() {
  return (
    <UseCasePage
      eyebrow="Presentation Timer"
      title="A fullscreen presentation timer that reads like a confidence monitor."
      description="Keep your talk on schedule with a timer that shows named sections, huge room-visible digits, and a clear next-segment preview for demos and Q&A."
      bullets={[
        "Split a talk into intro, content, demo, and questions without juggling slides and a phone.",
        "Use projector-safe themes that stay legible in bright conference rooms.",
        "Skip forward or back instantly when the room energy shifts.",
        "Launch fullscreen on a laptop, confidence monitor, or shared display.",
      ]}
      icon={Presentation}
      blueprint={createPresentationBlueprint()}
    />
  );
}
