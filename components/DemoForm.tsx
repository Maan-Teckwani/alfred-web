"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Demo requests are delivered by Web3Forms (https://web3forms.com) straight
 * to the inbox the access key was created for — no backend, no dashboard.
 *
 * Setup (one time, ~30 seconds):
 *   1. Go to https://web3forms.com and enter maanteckwani@gmail.com
 *   2. They email you an access key instantly
 *   3. Put it in .env.local as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=...
 *      (or paste it directly into the fallback string below)
 *
 * The key is designed to be public — it only lets people send YOU email.
 */
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
  "PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE";

type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || status !== "success") return;
      gsap
        .timeline()
        .from(".demo-success-ring", {
          scale: 0,
          autoAlpha: 0,
          duration: 0.8,
          ease: "back.out(2)",
        })
        .from(
          [".demo-success-title", ".demo-success-sub"],
          { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.12 },
          0.25
        );
    },
    { scope: wrap, dependencies: [status] }
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // honeypot — bots tick it, humans never see it
    const trap = form.elements.namedItem("botcheck") as HTMLInputElement | null;
    if (trap?.checked) {
      setStatus("success");
      return;
    }

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setInvalid(true);
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          ".demo-input",
          { x: 0 },
          { x: 8, duration: 0.07, repeat: 5, yoyo: true, clearProps: "x" }
        );
      }
      return;
    }

    setInvalid(false);
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "New Alfred demo request",
          from_name: "Alfred Landing Page",
          email: value,
          message: `Demo requested by ${value} via the Alfred landing page.`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(
          data.message ||
            "Something went sideways. Please try again in a moment."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network hiccup. Please try again in a moment.");
    }
  }

  return (
    <div ref={wrap}>
      {status === "success" ? (
        <div className="demo-success" role="status">
          <div className="demo-success-ring">&#10003;</div>
          <div className="demo-success-title">Consider it handled.</div>
          <p className="demo-success-sub">
            Your request is in. We&rsquo;ll email you shortly to set up a demo
            on your own codebase.
          </p>
        </div>
      ) : (
        <>
          <form className="demo-form" onSubmit={submit} noValidate>
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              style={{ display: "none" }}
              aria-hidden="true"
            />
            <input
              className={`demo-input${invalid ? " is-invalid" : ""}`}
              type="email"
              name="email"
              placeholder="you@company.com"
              aria-label="Work email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (invalid) setInvalid(false);
              }}
              disabled={status === "sending"}
              required
            />
            <button
              className="btn-solid demo-submit"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Book my demo"}
            </button>
          </form>
          {status === "error" && <div className="demo-error">{errorMsg}</div>}
          <div className="demo-note">
            NO SPAM &#183; JUST ONE EMAIL TO FIND A TIME
          </div>
        </>
      )}
    </div>
  );
}
