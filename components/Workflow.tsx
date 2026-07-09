"use client";

import { Fragment, useEffect, useState } from "react";
import {
  IconInbox,
  IconBox,
  IconTerminal,
  IconFlask,
  IconPR,
  IconCheck,
  IconX,
} from "./icons";

type StepState = "idle" | "active" | "done" | "fail" | "pass";

const STEPS = [
  { label: "Ticket", icon: IconInbox },
  { label: "Sandbox", icon: IconBox },
  { label: "Agent", icon: IconTerminal },
  { label: "Verify", icon: IconFlask },
  { label: "Ship", icon: IconPR },
];

type Phase = {
  id: string;
  dur: number;
  steps: StepState[];
  chip?: { text: string; tone: "bad" | "warn" | "good" };
  log: string;
};

const PHASES: Phase[] = [
  {
    id: "ticket",
    dur: 3000,
    steps: ["active", "idle", "idle", "idle", "idle"],
    log: "webhook caught · SEC-999 · payload parsed",
  },
  {
    id: "sandbox",
    dur: 2800,
    steps: ["done", "active", "idle", "idle", "idle"],
    log: "sandbox ready · workspace_sandboxes/sec-999",
  },
  {
    id: "agent",
    dur: 3200,
    steps: ["done", "done", "active", "idle", "idle"],
    log: "agent editing · app/services/hash_validator.py",
  },
  {
    id: "testfail",
    dur: 3000,
    steps: ["done", "done", "done", "fail", "idle"],
    chip: { text: "3 failed", tone: "bad" },
    log: "pytest · 3 failed, 21 passed · trimming trace",
  },
  {
    id: "retry",
    dur: 3200,
    steps: ["done", "done", "active", "fail", "idle"],
    chip: { text: "attempt 2/3", tone: "warn" },
    log: "self-correction 2/3 · replaying failure context",
  },
  {
    id: "testpass",
    dur: 2800,
    steps: ["done", "done", "done", "pass", "idle"],
    chip: { text: "24 passed", tone: "good" },
    log: "pytest · 24 passed in 3.2s · exit 0",
  },
  {
    id: "ship",
    dur: 4600,
    steps: ["done", "done", "done", "done", "active"],
    log: "PR #482 opened · SEC-999 → Done · #eng-alerts pinged",
  },
];

function linkClass(phase: Phase, k: number): string {
  if (phase.id === "retry" && k === 2) return "wf-link flow rev";
  const right = phase.steps[k + 1];
  if (right === "done") return "wf-link filled";
  if (right !== "idle") return "wf-link flow";
  return "wf-link";
}

export default function Workflow() {
  const [i, setI] = useState(0);
  const [logs, setLogs] = useState<string[]>([PHASES[0].log]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      const n = (i + 1) % PHASES.length;
      setI(n);
      setLogs((ls) =>
        n === 0 ? [PHASES[0].log] : [...ls, PHASES[n].log].slice(-3),
      );
    }, PHASES[i].dur);
    return () => clearTimeout(t);
  }, [i, reduced]);

  const phase = reduced ? PHASES[PHASES.length - 1] : PHASES[i];
  const shownLogs = reduced ? PHASES.slice(-3).map((p) => p.log) : logs;

  return (
    <section className="wf" id="how-it-works">
      <div className="container">
        <div className="sec-head">
          <h2>
            Watch a ticket become{" "}
            <span className="grad-text">a tested PR.</span>
          </h2>
          <p>
            No prompts, no babysitting. A webhook fires and Alfred takes it
            from there.
          </p>
        </div>

        <div className="wf-glow-wrap">
          <div className="wf-panel">
            <div className="wf-bar">
              <span className="wf-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wf-title">alfred · orchestrator</span>
              <span className="wf-live">
                <i className="wf-live-dot" aria-hidden="true" />
                demo loop
              </span>
            </div>

            <div className="wf-rail" role="list" aria-label="Pipeline steps">
              {STEPS.map((s, k) => {
                const state = phase.steps[k];
                const showChip = k === 3 && phase.chip;
                return (
                  <Fragment key={s.label}>
                    <div className={`wf-step ${state}`} role="listitem">
                      <div className="wf-node">
                        {state === "done" || state === "pass" ? (
                          <IconCheck />
                        ) : state === "fail" ? (
                          <IconX />
                        ) : (
                          <s.icon />
                        )}
                      </div>
                      <span className="wf-step-label">{s.label}</span>
                      {k === 3 && (
                        <span
                          className={`wf-step-chip ${phase.chip?.tone ?? ""} ${
                            showChip ? "show" : ""
                          }`}
                          aria-hidden={!showChip}
                        >
                          {phase.chip?.text ?? ""}
                        </span>
                      )}
                    </div>
                    {k < STEPS.length - 1 && (
                      <div className={linkClass(phase, k)} aria-hidden="true">
                        <i />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>

            <div className="wf-stage">
              {/* 1 — Jira ticket */}
              <div className={`wf-scene ${phase.id === "ticket" ? "on" : ""}`}>
                <div className="wfp-card">
                  <div className="wfp-card-top">
                    <span className="wfp-glyph" aria-hidden="true" />
                    Jira · ACME board
                    <span className="right">just now</span>
                  </div>
                  <span className="wfp-key">SEC-999</span>
                  <p className="wfp-title">
                    Hash validation loop crashes payout worker
                  </p>
                  <div className="wfp-tags">
                    <span className="wfp-tag bug">Bug</span>
                    <span className="wfp-tag">Priority: High</span>
                    <span className="wfp-tag">To Do</span>
                  </div>
                </div>
              </div>

              {/* 2 — Sandbox */}
              <div className={`wf-scene ${phase.id === "sandbox" ? "on" : ""}`}>
                <div className="wfp-term">
                  <div className="cmd">
                    git clone git@github.com:acme/payments.git
                    workspace_sandboxes/sec-999
                  </div>
                  <div className="dim">
                    Cloning into &lsquo;workspace_sandboxes/sec-999&rsquo;...
                    done.
                  </div>
                  <div className="ok">
                    ✓ sandbox isolated · scoped credentials · branch
                    alfred/patch-sec-999
                  </div>
                </div>
              </div>

              {/* 3 — Agent edits */}
              <div className={`wf-scene ${phase.id === "agent" ? "on" : ""}`}>
                <div className="wfp-file">app/services/hash_validator.py</div>
                <div className="wfp-diff">
                  <span className="ctx">
                    def validate(payload: bytes) -&gt; str:
                  </span>
                  <span className="del">- while not verify(digest):</span>
                  <span className="del">- digest = rehash(digest)</span>
                  <span className="add">
                    + for attempt in range(MAX_ATTEMPTS):
                  </span>
                  <span className="add">
                    + if verify(digest): return digest
                  </span>
                  <span className="add">+ digest = rehash(digest)</span>
                </div>
              </div>

              {/* 4 — Tests fail */}
              <div
                className={`wf-scene ${phase.id === "testfail" ? "on" : ""}`}
              >
                <div className="wfp-term">
                  <div className="cmd">pytest -q</div>
                  <div className="dim">..F..F..............F</div>
                  <div className="err">3 failed, 21 passed in 4.1s</div>
                  <div className="err">
                    FAILED tests/test_hash.py::test_terminates — RecursionError
                  </div>
                  <div className="warn">
                    → trimming trace · entering correction loop
                  </div>
                </div>
              </div>

              {/* 5 — Self-correction */}
              <div className={`wf-scene ${phase.id === "retry" ? "on" : ""}`}>
                <div className="wfp-term">
                  <div className="warn">self-correction loop · attempt 2/3</div>
                  <div className="dim">
                    → feeding trimmed pytest trace back to the agent
                  </div>
                  <div>→ re-reading hash_validator.py with failure context</div>
                  <div>→ patching loop guard · adding MAX_ATTEMPTS bound</div>
                </div>
              </div>

              {/* 6 — Tests pass */}
              <div
                className={`wf-scene ${phase.id === "testpass" ? "on" : ""}`}
              >
                <div className="wfp-pass">
                  <div className="wfp-pass-badge">
                    <IconCheck />
                    24 passed in 3.2s
                  </div>
                  <div className="wfp-pass-sub">
                    exit code 0 · patch verified against the full suite
                  </div>
                </div>
              </div>

              {/* 7 — Ship */}
              <div className={`wf-scene ${phase.id === "ship" ? "on" : ""}`}>
                <div className="wfp-ship">
                  <div className="wfp-pr">
                    <span className="wfp-pr-icon">
                      <IconPR />
                    </span>
                    <span className="wfp-pr-body">
                      <span className="wfp-pr-title">
                        Alfred Auto-Fix: hash validation loop
                      </span>
                      <span className="wfp-pr-meta">
                        alfred/patch-sec-999 · +48 −13 · closes SEC-999
                      </span>
                    </span>
                    <span className="wfp-pr-badge">Tests passed</span>
                  </div>
                  <div className="wfp-chips">
                    <div className="wfp-chip">
                      <span className="dot green" aria-hidden="true" />
                      <span>
                        <b>#eng-alerts</b> — PR is up and green
                      </span>
                    </div>
                    <div className="wfp-chip">
                      <span className="dot blue" aria-hidden="true" />
                      <span>
                        <b>SEC-999</b> → Done
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="wf-log" aria-live="off">
              {shownLogs.map((l) => (
                <div className="wf-log-line" key={l}>
                  <span className="p">alfred ›</span>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
