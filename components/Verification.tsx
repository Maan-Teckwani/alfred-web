export default function Verification() {
  return (
    <section className="verify" id="verification">
      <div className="verify-orbs" aria-hidden="true" />
      <h2>
        Copilots suggest.
        <br />
        <span className="grad-text">Alfred ships.</span>
      </h2>
      <p>
        Autocomplete stops at the diff. Alfred runs your <b>real test suite</b>{" "}
        against every patch and only opens a pull request when it&rsquo;s
        green. Code that doesn&rsquo;t pass doesn&rsquo;t ship.
      </p>
    </section>
  );
}
