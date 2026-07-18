/** Small presentational helpers shared across dashboard pages. */

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
