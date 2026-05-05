import { Projector } from "lucide-react";
import { UseCasePage } from "@/components/marketing/use-case-page";
import { createClassroomBlueprint } from "@/lib/session-presets";

export default function ClassroomTimerPage() {
  return (
    <UseCasePage
      eyebrow="Classroom Timer"
      title="A classroom timer built for projector screens and fast transitions."
      description="Show students exactly what phase they are in with giant digits, named blocks, and a low-clutter stage designed for the back row."
      bullets={[
        "Map the period into do now, mini-lesson, practice, and exit ticket.",
        "Choose high-contrast themes that hold up on aging classroom projectors.",
        "Use sound cues sparingly to mark transitions without constant teacher intervention.",
        "Keep a browser-local library of recurring class structures.",
      ]}
      icon={Projector}
      blueprint={createClassroomBlueprint()}
    />
  );
}
