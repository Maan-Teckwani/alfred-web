import { listRepositories, type Repository } from "@/lib/alfred-api";
import { Empty, problemMessage } from "../ui";

export const metadata = { title: "Repositories — Alfred" };

export default async function RepositoriesPage() {
  let repos: Repository[] = [];
  let problem: string | null = null;

  try {
    repos = await listRepositories();
  } catch (error) {
    problem = problemMessage(error);
  }

  return (
    <>
      <h1 className="dash-h1">Repositories</h1>
      <p className="dash-sub">The repositories Alfred is allowed to touch.</p>

      {problem ? (
        <div className="notice">{problem}</div>
      ) : repos.length === 0 ? (
        <Empty>
          No repositories connected yet. One-click GitHub App install arrives with the
          deploy; until then repositories are provisioned by the control plane.
        </Empty>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Default branch</th>
              <th>Test command</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={repo.id}>
                <td className="mono">{repo.full_name}</td>
                <td className="mono">{repo.default_branch}</td>
                <td className="mono">{repo.test_command ?? "pytest (default)"}</td>
                <td className="mono">{repo.enabled ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
