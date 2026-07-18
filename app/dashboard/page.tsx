import Link from "next/link";
import { getOverview, listRuns, type Overview, type RunSummary } from "@/lib/alfred-api";
import { Empty, StatusPill, formatTime } from "./ui";

export const metadata = { title: "Overview — Alfred" };

export default async function OverviewPage() {
  let overview: Overview | null = null;
  let runs: RunSummary[] = [];
  let unreachable = false;

  try {
    [overview, runs] = await Promise.all([getOverview(), listRuns()]);
  } catch {
    unreachable = true;
  }

  if (unreachable || !overview) {
    return (
      <>
        <h1 className="dash-h1">Overview</h1>
        <p className="dash-sub">Is Alfred earning its keep?</p>
        <div className="notice">
          Could not reach the Alfred API. Start the control plane
          (<span className="mono">python main.py</span>) and make sure your account has an
          active organization selected.
        </div>
      </>
    );
  }

  const successRate =
    overview.success_rate === null ? "—" : `${Math.round(overview.success_rate * 100)}%`;

  return (
    <>
      <h1 className="dash-h1">Overview</h1>
      <p className="dash-sub">Is Alfred earning its keep?</p>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-value">{overview.tickets}</div>
          <div className="stat-label">Tickets handled</div>
        </div>
        <div className="stat">
          <div className="stat-value">{overview.runs_total}</div>
          <div className="stat-label">Runs</div>
        </div>
        <div className="stat">
          <div className="stat-value">{overview.pull_requests}</div>
          <div className="stat-label">Pull requests</div>
        </div>
        <div className="stat">
          <div className="stat-value">{successRate}</div>
          <div className="stat-label">Auto-fixed</div>
        </div>
      </div>

      <h2 className="dash-h2">Recent activity</h2>
      {runs.length === 0 ? (
        <Empty>No runs yet. When a Jira ticket fires a webhook, it will appear here.</Empty>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Status</th>
              <th>Started</th>
              <th>Pull request</th>
            </tr>
          </thead>
          <tbody>
            {runs.slice(0, 8).map((run) => (
              <tr key={run.id}>
                <td className="mono">
                  <Link href={`/dashboard/runs/${run.id}`}>{run.ticket_key}</Link>
                </td>
                <td>
                  <StatusPill status={run.status} />
                </td>
                <td className="mono">{formatTime(run.started_at ?? run.created_at)}</td>
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
