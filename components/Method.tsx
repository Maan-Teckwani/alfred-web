"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const STEPS = [
  {
    index: "01",
    title: "Ticket",
    desc: "A Jira issue lands in the queue. Alfred reads it before anyone else is interrupted.",
    tone: "is-bronze",
  },
  {
    index: "02",
    title: "Sandbox",
    desc: "The bug is reproduced in an isolated environment. Production never feels a thing.",
    tone: "",
  },
  {
    index: "03",
    title: "Resolve",
    desc: "The fix is written, run against your test suite, and verified end to end.",
    tone: "",
  },
  {
    index: "04",
    title: "Pull Request",
    desc: "A clean PR opens — carrying its reasoning, its scope, and the tests it passed.",
    tone: "",
  },
  {
    index: "05",
    title: "Slack",
    desc: "One quiet message: ready for review. Merge, and move on.",
    tone: "is-silver",
  },
];

export default function Method() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".method-head > *", {
        autoAlpha: 0,
        y: 30,
        duration: 1.1,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".method-head",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // the metallic baseline sweeps across as you move through;
      // the runner spark only exists while the sweep is underway
      const sweep = {
        trigger: ".method-track",
        start: "top 78%",
        end: "top 30%",
        scrub: 1.2,
      };
      gsap.to(".method-baseline-glow", { scaleX: 1, ease: "none", scrollTrigger: sweep });
      gsap.set(".method-runner", { autoAlpha: 0 });
      const fadeRunner = (to: number) =>
        gsap.to(".method-runner", { autoAlpha: to, duration: 0.4, overwrite: "auto" });
      gsap.fromTo(
        ".method-runner",
        { left: "0%" },
        {
          left: "100%",
          ease: "none",
          scrollTrigger: {
            ...sweep,
            onEnter: () => fadeRunner(1),
            onEnterBack: () => fadeRunner(1),
            onLeave: () => fadeRunner(0),
            onLeaveBack: () => fadeRunner(0),
          },
        }
      );

      gsap.from(".method-step", {
        autoAlpha: 0,
        y: 34,
        duration: 1.1,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".method-steps",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".step-node", {
        scale: 0,
        transformOrigin: "50% 50%",
        duration: 0.8,
        stagger: 0.16,
        ease: "back.out(2.2)",
        scrollTrigger: {
          trigger: ".method-steps",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: section }
  );

  return (
    <section id="method" className="section section-alt" ref={section}>
      <div className="container">
        <div className="section-head method-head">
          <div className="eyebrow">The Method</div>
          <h2 className="section-h2">
            Interruption goes in.
            <br />A pull request comes out.
          </h2>
        </div>

        <div className="method-track">
          <div className="method-baseline" aria-hidden="true"></div>
          <div className="method-baseline-glow" aria-hidden="true"></div>
          <div className="method-runner" aria-hidden="true"></div>
          <div className="method-steps">
            {STEPS.map((s) => (
              <div key={s.index} className={`method-step ${s.tone}`}>
                <div className="step-node">
                  <span className="dot"></span>
                </div>
                <div className="step-index">{s.index}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
