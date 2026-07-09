import { IconZap, IconBox, IconRefresh, IconPR } from "./icons";

const FEATURES = [
  {
    icon: IconZap,
    title: "Triage in milliseconds",
    body: "A webhook fires the moment a bug lands on the board. Alfred picks it up before it hits anyone's standup.",
  },
  {
    icon: IconBox,
    title: "Fixes in isolation",
    body: "Every ticket gets its own sandboxed clone with scoped credentials. Your main branch never feels a thing.",
  },
  {
    icon: IconRefresh,
    title: "Debugs itself",
    body: "Failed tests go straight back into the loop. Alfred re-reads the trace and corrects its own patch — up to three rounds.",
  },
  {
    icon: IconPR,
    title: "Ships with receipts",
    body: "Green tests become a pull request with the branch, the diff, and the logs — and the Jira ticket closes itself.",
  },
];

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <div className="sec-head">
          <h2>
            Everything between{" "}
            <span className="grad-text">&ldquo;bug filed&rdquo;</span> and{" "}
            <span className="grad-text">&ldquo;PR merged.&rdquo;</span>
          </h2>
          <p>Alfred runs the whole loop — the boring parts and the hard parts.</p>
        </div>
        <div className="feat-grid">
          {FEATURES.map((f) => (
            <article className="feat-card" key={f.title}>
              <div className="feat-icon">
                <f.icon />
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
