import Link from "next/link";
import { listRuns, type RunSummary } from "@/lib/alfred-api";
import { Empty, StatusPill, duration, formatTime, problemMessage } from "../ui";

export const metadata = { title: "Runs — Alfred" };

export default async function RunsPage() {
  let runs: RunSummary[] = [];
  let problem: string | null = null;

  try {
    runs = await listRuns();
  } catch (error) {
    problem = problemMessage(error);
  }

  return (
    <>
      <h1 className="dash-h1">Runs</h1>
      <p className="dash-sub">Every ticket Alfred has picked up, and what came of it.</p>

      {problem ? (
        <div className="notice">{problem}</div>
      ) : runs.length === 0 ? (
        <Empty>No runs yet.</Empty>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Started</th>
              <th>Duration</th>
              <th>Pull request</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td className="mono">
                  <Link href={`/dashboard/runs/${run.id}`}>{run.ticket_key}</Link>
                </td>
                <td>
                  <StatusPill status={run.status} />
                </td>
                <td className="mono">{run.attempts}</td>
                <td className="mono">{formatTime(run.started_at ?? run.created_at)}</td>
                <td className="mono">{duration(run.started_at, run.finished_at)}</td>
                <td>
                  {run.pr_url ? (
                    <a href={run.pr_url} target="_blank" rel="noreferrer">
                      View PR
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
