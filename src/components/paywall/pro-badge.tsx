import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProBadge({ className }: { className?: string }) {
  return (
    <Badge className={cn("bg-amber-500 text-white border-amber-600 gap-1", className)}>
      <Star className="h-3 w-3" /> Pro
    </Badge>
  );
}

export function ProGate({ children, isPro, fallback }: { children: React.ReactNode; isPro: boolean; fallback: React.ReactNode }) {
  return isPro ? <>{children}</> : <>{fallback}</>;
}
