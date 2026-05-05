declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export function trackEvent(event: string, props?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible === "function") {
    window.plausible(event, { props });
  }
}
