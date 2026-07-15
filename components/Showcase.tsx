"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Showcase() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".showcase-head > *", {
        autoAlpha: 0,
        y: 30,
        duration: 1.1,
        stagger: 0.12,
        scrollTrigger: { trigger: ".showcase-head", start: "top 82%", toggleActions: "play none none reverse" },
      });

      // each row: caption slides in from its side, window rises with weight
      gsap.utils.toArray<HTMLElement>(".show-row").forEach((row) => {
        const fromLeft = row.classList.contains("text-left");
        const text = row.querySelector(".show-text");
        const win = row.querySelector(".show-window");

        gsap.from(text, {
          autoAlpha: 0,
          x: fromLeft ? -34 : 34,
          duration: 1.2,
          scrollTrigger: { trigger: row, start: "top 76%", toggleActions: "play none none reverse" },
        });
        gsap.from(win, {
          autoAlpha: 0,
          y: 80,
          scale: 0.975,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.12,
          scrollTrigger: { trigger: row, start: "top 76%", toggleActions: "play none none reverse" },
        });
      });

      // dashboard internals tick in like a live feed
      gsap.from(".dash-stats > div", {
        autoAlpha: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.5,
        scrollTrigger: { trigger: ".dash-window", start: "top 72%", toggleActions: "play none none reverse" },
      });
      gsap.from(".dash-row", {
        autoAlpha: 0,
        x: -18,
        duration: 0.75,
        stagger: 0.13,
        delay: 0.75,
        scrollTrigger: { trigger: ".dash-window", start: "top 72%", toggleActions: "play none none reverse" },
      });

      // pull request: description, then the diff lands line by line
      gsap.from([".pr-meta", ".pr-title", ".pr-branches", ".pr-desc"], {
        autoAlpha: 0,
        y: 14,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.45,
        scrollTrigger: { trigger: ".pr-window", start: "top 72%", toggleActions: "play none none reverse" },
      });
      gsap.from(".pr-diff > div", {
        autoAlpha: 0,
        x: -14,
        duration: 0.6,
        stagger: 0.22,
        delay: 0.85,
        scrollTrigger: { trigger: ".pr-window", start: "top 72%", toggleActions: "play none none reverse" },
      });
      gsap.from(".pr-checks", {
        autoAlpha: 0,
        duration: 0.9,
        delay: 1.5,
        scrollTrigger: { trigger: ".pr-window", start: "top 72%", toggleActions: "play none none reverse" },
      });

      // slack: the message arrives, then the room reacts
      gsap.from(".slack-avatar", {
        autoAlpha: 0,
        scale: 0.6,
        duration: 0.7,
        ease: "back.out(2)",
        delay: 0.5,
        scrollTrigger: { trigger: ".slack-window", start: "top 72%", toggleActions: "play none none reverse" },
      });
      gsap.from([".slack-meta", ".slack-text", ".slack-card"], {
        autoAlpha: 0,
        y: 14,
        duration: 0.8,
        stagger: 0.14,
        delay: 0.65,
        scrollTrigger: { trigger: ".slack-window", start: "top 72%", toggleActions: "play none none reverse" },
      });
      gsap.from(".slack-react", {
        autoAlpha: 0,
        scale: 0.5,
        duration: 0.55,
        stagger: 0.16,
        ease: "back.out(2.5)",
        delay: 1.3,
        scrollTrigger: { trigger: ".slack-window", start: "top 72%", toggleActions: "play none none reverse" },
      });
    },
    { scope: section }
  );

  return (
    <section id="showcase" className="showcase" ref={section}>
      <div className="container">
        <div className="section-head showcase-head">
          <div className="eyebrow">See it work</div>
          <h2 className="section-h2">You stay in control of every fix.</h2>
        </div>

        {/* ---------- operations dashboard ---------- */}
        <div className="show-row text-left">
          <div className="show-text">
            <div className="show-label">Dashboard</div>
            <h3 className="show-h3">Watch your backlog clear itself.</h3>
            <p className="show-p">
              Every bug ticket and exactly where Alfred has it: reproducing,
              fixing, in review, or merged. One place to glance at, nothing new
              to babysit.
            </p>
          </div>
          <div className="show-window window dash-window" data-lag="0.14">
            <div className="window-bar">
              <span className="wdot"></span>
              <span className="wdot"></span>
              <span className="wdot"></span>
              <span className="wtitle">alfred &#183; operations</span>
            </div>
            <div className="dash-body">
              <div className="dash-stats">
                <div>
                  <div className="dash-stat-num">3</div>
                  <div className="dash-stat-label">In flight</div>
                </div>
                <div>
                  <div className="dash-stat-num is-bronze">28</div>
                  <div className="dash-stat-label">Resolved &#183; 7d</div>
                </div>
                <div>
                  <div className="dash-stat-num">14m</div>
                  <div className="dash-stat-label">Median</div>
                </div>
              </div>
              <div>
                <div className="dash-row">
                  <span className="dash-id">PROJ-1284</span>
                  <span className="dash-title">Null pointer in invoice export</span>
                  <span className="chip">PR OPEN</span>
                </div>
                <div className="dash-row">
                  <span className="dash-id">PROJ-1281</span>
                  <span className="dash-title">Race condition on token refresh</span>
                  <span className="chip is-sandbox">SANDBOX</span>
                </div>
                <div className="dash-row is-done">
                  <span className="dash-id">PROJ-1279</span>
                  <span className="dash-title">Off-by-one in pagination cursor</span>
                  <span className="chip is-merged">MERGED</span>
                </div>
                <div className="dash-row is-done">
                  <span className="dash-id">PROJ-1276</span>
                  <span className="dash-title">Timezone drift in scheduled digest</span>
                  <span className="chip is-merged">MERGED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- pull request ---------- */}
        <div className="show-row text-right">
          <div className="show-window window pr-window" data-lag="0.2">
            <div className="window-bar">
              <span className="wdot"></span>
              <span className="wdot"></span>
              <span className="wdot"></span>
              <span className="wtitle">alfred/api &#183; pull request #2841</span>
            </div>
            <div className="pr-body">
              <div className="pr-meta">
                <span className="pr-chip-open">OPEN</span>
                <span className="pr-meta-text">opened by alfred &#183; 2 minutes ago</span>
              </div>
              <h4 className="pr-title">Fix: null pointer in invoice export</h4>
              <div className="pr-branches">
                <span className="pr-branch is-head">alfred:fix/invoice-export</span>
                <span>&#8594;</span>
                <span className="pr-branch">main</span>
              </div>
              <p className="pr-desc">
                The export path assumed every line item carried a tax record.
                Guarded the lookup and added a regression test covering
                tax-exempt invoices. Root cause traced to PROJ-1284.
              </p>
              <div className="pr-diff">
                <div className="file">invoice/export.ts</div>
                <div className="del">- const tax = item.tax.rate;</div>
                <div className="add">+ const tax = item.tax?.rate ?? 0;</div>
              </div>
              <div className="pr-checks">
                <span className="pr-check-badge">&#10003;</span>
                All checks passed &#183;{" "}
                <span className="dim">build, unit, integration</span>
              </div>
            </div>
          </div>
          <div className="show-text">
            <div className="show-label">Pull Request</div>
            <h3 className="show-h3">Read the fix. Approve in a minute.</h3>
            <p className="show-p">
              Every PR spells out the root cause, the diff, and the tests it
              passed — enough to review with confidence. Nothing merges to your
              codebase until you approve it.
            </p>
          </div>
        </div>

        {/* ---------- slack notification ---------- */}
        <div className="show-row text-left">
          <div className="show-text">
            <div className="show-label">Notifications</div>
            <h3 className="show-h3">Get pinged only when a fix is ready.</h3>
            <p className="show-p">
              No status meetings, no chasing updates. Alfred messages your team
              once per bug — when there&rsquo;s a pull request waiting to be
              reviewed.
            </p>
          </div>
          <div className="show-window window slack-window" data-lag="0.14">
            <div className="window-bar">
              <span className="wdot"></span>
              <span className="wdot"></span>
              <span className="wdot"></span>
              <span className="wtitle"># engineering</span>
            </div>
            <div className="slack-body">
              <div className="slack-avatar">A</div>
              <div className="slack-msg">
                <div className="slack-meta">
                  <span className="slack-name">Alfred</span>
                  <span className="slack-app">APP</span>
                  <span className="slack-time">9:42 PM</span>
                </div>
                <p className="slack-text">
                  Resolved <span className="hl">PROJ-1284</span> — null pointer
                  in invoice export. A pull request is open and ready for
                  review.
                </p>
                <div className="slack-card">
                  <div className="slack-card-title">
                    #2841 &#183; Fix: null pointer in invoice export
                  </div>
                  <div className="slack-card-checks">
                    &#10003; All checks passed &#183;{" "}
                    <span className="dim">+4 &#8722;1</span>
                  </div>
                </div>
                <div className="slack-reacts">
                  <span className="slack-react">&#128077; 2</span>
                  <span className="slack-react">&#9989; 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
