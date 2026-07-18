/** Small presentational helpers shared across dashboard pages. */
import { ApiError } from "@/lib/alfred-api";

/**
 * Turn a failure into an honest explanation. A 403 means the session carries no
 * organization — saying "could not reach the API" there sends you debugging the
 * wrong thing entirely.
 */
export function problemMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 402) {
      return "Your organization doesn't have Alfred access yet. Signing up doesn't activate an account — we'll reach out once yours is approved.";
    }
    if (error.status === 403) {
      return "Your session has no active organization. Pick or create one using the switcher above, then reload.";
    }
    if (error.status === 401) {
      return "Your session was rejected. Try signing out and back in.";
    }
    return `The Alfred API returned ${error.status}.`;
  }
  return "Could not reach the Alfred API. Start the control plane with: python main.py";
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`pill pill-${status}`}>{status}</span>;
}

export function formatTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function duration(start: string | null, end: string | null) {
  if (!start || !end) return "—";
  const seconds = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

/** Alfred is unreachable or the org has no data yet — say which, don't show a blank page. */
export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="empty">{children}</div>;
}
