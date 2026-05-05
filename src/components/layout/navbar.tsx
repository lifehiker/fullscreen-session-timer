"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Timer, LayoutDashboard, LogOut, LogIn, Star } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/presentation-timer", label: "Presentation" },
    { href: "/classroom-timer", label: "Classroom" },
    { href: "/interval-timer", label: "Intervals" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(8,10,18,0.74)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Timer className="h-5 w-5 text-[var(--signal-soft)]" />
          </div>
          <div>
            <p className="font-display text-2xl leading-none text-[var(--paper)]">SessionTimer</p>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[rgba(242,234,218,0.48)]">Room-facing timing</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-[rgba(242,234,218,0.58)] transition-colors",
                pathname === item.href && "bg-[rgba(255,132,82,0.14)] text-[var(--paper)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="rounded-full text-[var(--paper)] hover:bg-white/10">
                <Link href="/app"><LayoutDashboard className="mr-1 h-4 w-4" />Workspace</Link>
              </Button>
              {!session.user.isPro && (
                <Button size="sm" variant="outline" asChild className="rounded-full border-[rgba(255,132,82,0.42)] bg-[rgba(255,132,82,0.08)] text-[var(--signal-soft)] hover:bg-[rgba(255,132,82,0.18)]">
                  <Link href="/pricing"><Star className="mr-1 h-4 w-4" />Go Pro</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full text-[var(--paper)] hover:bg-white/10">
                <LogOut className="mr-1 h-4 w-4" />Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="rounded-full text-[var(--paper)] hover:bg-white/10">
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="rounded-full border-white/10 bg-white/5 text-[var(--paper)] hover:bg-white/10">
                <Link href="/login"><LogIn className="mr-1 h-4 w-4" />Sign in</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full bg-[var(--signal)] text-[var(--ink)] hover:bg-[var(--signal-soft)]">
                <Link href="/app">Launch Timer</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
