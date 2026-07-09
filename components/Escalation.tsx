import { IconCheck } from "./icons";

export default function Escalation() {
  return (
    <section className="esc">
      <div className="container">
        <div className="esc-grid">
          <div className="esc-copy">
            <h2>
              And when it&rsquo;s stuck,{" "}
              <span className="grad-text">it says so.</span>
            </h2>
            <p>
              No garbage merged, no silent failures. If the suite still fails
              after three correction rounds, Alfred stops guessing and hands
              off — cleanly.
            </p>
            <ul className="esc-list">
              <li>
                <IconCheck />
                <span>
                  <b>Three strikes, then handoff.</b> After the correction
                  limit, Alfred escalates instead of thrashing.
                </span>
              </li>
              <li>
                <IconCheck />
                <span>
                  <b>Everything committed.</b> The failing branch is pushed
                  with a full diagnostic report in markdown.
                </span>
              </li>
              <li>
                <IconCheck />
                <span>
                  <b>Humans get the context.</b> A Slack ping with direct links
                  to the branch, the trace, and the ticket.
                </span>
              </li>
            </ul>
          </div>

          <div className="esc-mock">
            <div className="hitl-card">
              <div className="hitl-top">
                <span className="hitl-draft">Draft</span>
                <span className="hitl-fail">[FAILED]</span>
              </div>
              <p className="hitl-title">
                Alfred Attempt: Fix hash validation loop
              </p>
              <p className="hitl-meta">
                alfred/patch-sec-999 · <span className="add">+48</span>{" "}
                <span className="del">−13</span> · ALFRED_HITL_REPORT.md
              </p>
              <p className="hitl-quote">
                &ldquo;Tried to fix SEC-999 but couldn&rsquo;t pass the test
                suite after 3 attempts. Handing over to humans.&rdquo;
              </p>
              <div className="hitl-slack">
                <span className="avatar" aria-hidden="true">
                  A
                </span>
                <span>
                  <span className="chan">#eng-alerts</span>
                  <b>Alfred</b> — I couldn&rsquo;t get SEC-999 green. Branch,
                  trace and report are linked here.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
