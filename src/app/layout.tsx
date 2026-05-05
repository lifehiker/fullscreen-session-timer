import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SessionTimer | Fullscreen Presentation, Classroom, and Interval Timer",
  description:
    "A fullscreen session timer with huge room-visible digits, named segments, repeating intervals, and projector-safe themes for presenters, teachers, coaches, and facilitators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body">
        <Providers>
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                toast: "border border-white/10 bg-[rgba(11,14,24,0.92)] text-[var(--paper)]",
                title: "font-medium",
                description: "text-[rgba(242,234,218,0.7)]",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
