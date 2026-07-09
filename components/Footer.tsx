export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <span className="brand-mark" aria-hidden="true">
                A
              </span>
              Alfred
            </a>
            <p>
              The autonomous engineer that fixes bugs, proves them with your
              tests, and opens the PR.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#how-it-works">How it works</a>
              </li>
              <li>
                <a href="#verification">Verification</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#top">Blog</a>
              </li>
              <li>
                <a href="#top">Careers</a>
              </li>
              <li>
                <a href="#top">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#top">Docs</a>
              </li>
              <li>
                <a href="#top">Security</a>
              </li>
              <li>
                <a href="#top">Status</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Alfred Labs</span>
          <span>Autonomous fixes, verified by your tests.</span>
        </div>
      </div>
    </footer>
  );
}
