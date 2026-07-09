export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <p className="hero-eyebrow fade-up fade-up-1">
        <i aria-hidden="true" />
        Autonomous bug fixing · Early access
      </p>
      <h1 className="fade-up fade-up-2">
        Tickets in.
        <br />
        <span className="grad-text">Tested PRs out.</span>
      </h1>
      <p className="hero-sub fade-up fade-up-3">
        Alfred watches your Jira board, fixes bugs in an isolated sandbox, and
        proves every patch against your test suite — then opens the pull
        request and pings your team in Slack.
      </p>
      <div className="hero-ctas fade-up fade-up-4">
        <a className="btn btn-lg" href="#pricing">
          Start fixing free
        </a>
        <a className="btn-ghost btn-lg" href="#how-it-works">
          Watch it work
        </a>
      </div>
      <p className="hero-note fade-up fade-up-4">
        Free plan · 25 tickets a month · No card required
      </p>
    </section>
  );
}
