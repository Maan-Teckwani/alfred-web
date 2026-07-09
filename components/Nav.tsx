export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          Alfred
        </a>
        <nav className="nav-links" aria-label="Main">
          <a href="#how-it-works">How it works</a>
          <a href="#verification">Verification</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="nav-cta">
          <a className="link-quiet" href="#pricing">
            Sign in
          </a>
          <a className="btn btn-sm" href="#pricing">
            Get started free
          </a>
        </div>
      </div>
    </header>
  );
}
