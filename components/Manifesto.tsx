"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Manifesto() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      SplitText.create(".manifesto-h2", {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.3,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".manifesto-h2",
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }),
      });

      gsap.from(".manifesto-p", {
        autoAlpha: 0,
        y: 26,
        duration: 1.2,
        delay: 0.3,
        scrollTrigger: {
          trigger: ".manifesto-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".stat-cell", {
        autoAlpha: 0,
        y: 36,
        duration: 1.1,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });

      // the 14m figure counts up as it enters
      const counter = section.current!.querySelector<HTMLElement>("[data-count]");
      if (counter) {
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix ?? "";
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 86%",
            toggleActions: "restart none none reverse",
          },
          onUpdate: () => {
            counter.textContent = `${Math.round(state.v)}${suffix}`;
          },
        });
      }
    },
    { scope: section }
  );

  return (
    <section className="section" ref={section}>
      <div className="container">
        <div className="manifesto-grid">
          <h2 className="manifesto-h2">
            Your best engineers
            <br />
            <span className="dim">are stuck fixing bugs.</span>
          </h2>
          <p className="manifesto-p">
            Every bug ticket pulls a senior engineer out of deep work — an hour
            to context-switch in, another to climb back out. Multiply that
            across a sprint and the roadmap quietly slips, while the backlog
            only grows. Alfred takes that work off their plate entirely.
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat-cell">
            <div className="stat-num" data-count="14" data-suffix="m">
              14m
            </div>
            <div className="stat-label">
              Median time Alfred takes to turn a bug ticket into a review-ready
              pull request.
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">Zero</div>
            <div className="stat-label">
              Engineers pulled off the roadmap to chase it down.
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">One</div>
            <div className="stat-label">
              Thing left for your team: review the pull request, then merge.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
