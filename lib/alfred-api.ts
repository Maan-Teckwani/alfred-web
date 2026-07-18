/**
 * Server-side client for the Alfred control-plane API.
 *
 * Every call runs on the server and attaches the caller's Clerk session token,
 * so the token is never exposed to the browser and no CORS round-trip is needed.
 * The backend derives the tenant from the token's organization claim.
 */
import { auth } from "@clerk/nextjs/server";

const API_BASE = process.env.ALFRED_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiError(`${init?.method ?? "GET"} ${path} failed (${res.status})`, res.status);
  }
  return (await res.json()) as T;
}

export type Overview = {
  tickets: number;
  runs_total: number;
  runs_by_status: Record<string, number>;
  pull_requests: number;
  success_rate: number | null;
};

export type RunSummary = {
  id: string;
  ticket_key: string;
  status: string;
  attempts: number;
  model: string | null;
  pr_url: string | null;
  created_at: string | null;
  started_at: string | null;
  finished_at: string | null;
};

export type RunEvent = {
  phase: string;
  message: string | null;
  log_ref: string | null;
  ts: string | null;
};

export type RunDetail = {
  id: string;
  status: string;
  attempts: number;
  model: string | null;
  pr_url: string | null;
  created_at: string | null;
  started_at: string | null;
  finished_at: string | null;
  ticket: { key: string | null; title: string | null; description: string | null };
  events: RunEvent[];
};

export type Repository = {
  id: string;
  full_name: string;
  provider: string;
  default_branch: string;
  test_command: string | null;
  enabled: boolean;
};

export const getOverview = () => request<Overview>("/dashboard/overview");

export const listRuns = (status?: string) =>
  request<RunSummary[]>(`/dashboard/runs${status ? `?status=${encodeURIComponent(status)}` : ""}`);

export const getRun = (id: string) => request<RunDetail>(`/dashboard/runs/${id}`);

export const listRepositories = () => request<Repository[]>("/dashboard/repositories");

export const getSettings = () => request<Record<string, unknown>>("/dashboard/settings");

export const putSettings = (payload: Record<string, unknown>) =>
  request<{ updated: string[] }>("/dashboard/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
