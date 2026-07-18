import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getRun } from "@/lib/alfred-api";
import { StatusPill, duration, formatTime, problemMessage } from "../../ui";

export const metadata = { title: "Run detail — Alfred" };

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let run;
  try {
    run = await getRun(id);
  } catch (error) {
    // A run belonging to another organization is indistinguishable from one that
    // does not exist — that is the point.
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <>
        <h1 className="dash-h1">Run</h1>
        <div className="notice">{problemMessage(error)}</div>
      </>
    );
  }

  return (
    <>
      <p className="dash-sub">
        <Link href="/dashboard/runs">← All runs</Link>
      </p>
      <h1 className="dash-h1">{run.ticket.key ?? "Run"}</h1>
      <p className="dash-sub">{run.ticket.title ?? ""}</p>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-value">
            <StatusPill status={run.status} />
          </div>
          <div className="stat-label">Status</div>
        </div>
        <div className="stat">
          <div className="stat-value">{run.attempts}</div>
          <div className="stat-label">Attempts</div>
        </div>
        <div className="stat">
          <div className="stat-value">{duration(run.started_at, run.finished_at)}</div>
          <div className="stat-label">Duration</div>
        </div>
        <div className="stat">
          <div className="stat-value">{run.model ?? "—"}</div>
          <div className="stat-label">Model</div>
        </div>
      </div>

      {run.pr_url && (
        <>
          <h2 className="dash-h2">Pull request</h2>
          <a className="mono" href={run.pr_url} target="_blank" rel="noreferrer">
            {run.pr_url}
          </a>
        </>
      )}

      <h2 className="dash-h2">Timeline</h2>
      {run.events.length === 0 ? (
        <p className="dash-sub">No events recorded for this run.</p>
      ) : (
        <div className="timeline">
          {run.events.map((event, index) => (
            <div className="timeline-item" key={`${event.phase}-${index}`}>
              <div className="timeline-phase">{event.phase.replace(/_/g, " ")}</div>
              {event.message && <div className="timeline-msg">{event.message}</div>}
              <div className="timeline-ts">{formatTime(event.ts)}</div>
            </div>
          ))}
        </div>
      )}

      {run.ticket.description && (
        <>
          <h2 className="dash-h2">Ticket description</h2>
          <p className="dash-sub" style={{ whiteSpace: "pre-wrap" }}>
            {run.ticket.description}
          </p>
        </>
      )}
    </>
  );
}
