import { Navbar } from "@/components/layout/navbar";
import { SessionStudio } from "@/components/studio/session-studio";

export default function AppWorkspacePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SessionStudio />
      </div>
    </main>
  );
}
