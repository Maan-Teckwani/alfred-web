"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Hero() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const visual = section.current!.querySelector<HTMLElement>(".hero-visual")!;

      // The CSS centers the visual with a translate; hand that job to
      // GSAP so scroll parallax and cursor drift can compose with it.
      gsap.set(visual, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

      /* ---------- intro: the network assembles ---------- */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-svg", { autoAlpha: 0, scale: 0.965, duration: 2.2, ease: "power2.out" }, 0)
        .from(".h-ellipse", { drawSVG: "50% 50%", autoAlpha: 0, duration: 2, stagger: 0.16, ease: "power2.inOut" }, 0.1)
        .from(".h-spoke", { drawSVG: "0%", duration: 1.3, stagger: 0.07, ease: "power2.inOut" }, 0.45)
        .from(".h-chord", { drawSVG: "0%", autoAlpha: 0, duration: 0.9, ease: "power2.inOut" }, 1.2)
        .from(".h-core-glow", { scale: 0.4, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.6 }, 0.6)
        .from([".h-core-ring1", ".h-core-ring2", ".h-core-dot"], { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.1, stagger: 0.1, ease: "back.out(2)" }, 0.8)
        .from(".h-node-ring", { scale: 0, transformOrigin: "50% 50%", duration: 0.9, stagger: 0.06, ease: "back.out(1.8)" }, 0.95)
        .from(".h-node-dot", { autoAlpha: 0, duration: 0.7, stagger: 0.06 }, 1.05)
        .from(".hero-eyebrow", { autoAlpha: 0, y: 18, duration: 1 }, 0.35)
        .from(".hero-sub", { autoAlpha: 0, y: 22, duration: 1.1 }, 1.05)
        .from(".hero-ctas > *", { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.1 }, 1.25)
        .from(".hero-marker", { autoAlpha: 0, duration: 1.4 }, 1.9);

      /* ---------- headline: masked line reveal ---------- */
      SplitText.create(".hero-h1", {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.5,
            ease: "power4.out",
            stagger: 0.13,
            delay: 0.5,
          }),
      });

      /* ---------- ambient life: breathing nodes ---------- */
      gsap.set(".h-node-ring", { opacity: 0.16 });
      gsap.to(".h-node-ring", {
        opacity: 0.55,
        duration: () => gsap.utils.random(2.4, 3.8),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.45, from: "random" },
        delay: 2,
      });
      gsap.set(".h-core-ring1", { opacity: 0.35 });
      gsap.to(".h-core-ring1", {
        opacity: 0.9,
        scale: 1.12,
        transformOrigin: "50% 50%",
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      /* ---------- ambient life: travelling signals ---------- */
      const launchSignals = (selector: string, base: number) => {
        gsap.utils.toArray<SVGLineElement>(selector).forEach((line, i) => {
          gsap.set(line, { strokeDasharray: "4 380", strokeDashoffset: 384 });
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: gsap.utils.random(3.4, 5.2),
            ease: "none",
            repeat: -1,
            delay: base + i * 1.15,
          });
        });
      };
      launchSignals(".h-sig-in", 2.1);
      launchSignals(".h-sig-out", 2.8);

      /* ---------- scroll: parallax drift + copy exit ---------- */
      gsap.to(visual, {
        y: 170,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // explicit fromTo + no immediate render: the scrubs must not
      // capture mid-intro opacities as their resting state, so the
      // hero is always fully restored when you scroll back to the top
      gsap.fromTo(
        ".hero-copy",
        { y: 0, autoAlpha: 1 },
        {
          y: -70,
          autoAlpha: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section.current,
            start: "22% top",
            end: "75% top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        ".hero-marker",
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "18% top",
            scrub: true,
          },
        }
      );

      /* ---------- cursor: faint gravitational drift ---------- */
      if (window.matchMedia("(pointer: fine)").matches) {
        const driftX = gsap.quickTo(visual, "x", { duration: 1.6, ease: "power3.out" });
        const rotate = gsap.quickTo(visual, "rotation", { duration: 2.2, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const ratio = e.clientX / window.innerWidth - 0.5;
          driftX(ratio * 26);
          rotate(ratio * 0.8);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
      }
    },
    { scope: section }
  );

  return (
    <section id="top" className="hero" ref={section}>
      <div className="hero-pool" aria-hidden="true"></div>
      <div className="hero-vignette" aria-hidden="true"></div>

      {/* animated network visual */}
      <div className="hero-visual" aria-hidden="true">
        <svg className="hero-svg" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ln" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3a3a40" />
              <stop offset="1" stopColor="#1d1d21" />
            </linearGradient>
            <radialGradient id="ctr" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(216,195,155,0.9)" />
              <stop offset="0.5" stopColor="rgba(176,141,87,0.22)" />
              <stop offset="1" stopColor="rgba(176,141,87,0)" />
            </radialGradient>
          </defs>

          {/* architectural ellipses */}
          <ellipse className="h-ellipse" cx="500" cy="350" rx="360" ry="238" fill="none" stroke="#26262b" strokeWidth="1" strokeDasharray="2 7" opacity="0.5" />
          <ellipse className="h-ellipse" cx="500" cy="350" rx="232" ry="150" fill="none" stroke="#26262b" strokeWidth="1" opacity="0.45" />
          <ellipse className="h-ellipse" cx="500" cy="350" rx="120" ry="78" fill="none" stroke="#2c2c32" strokeWidth="1" opacity="0.6" />

          {/* radial structure */}
          <g stroke="url(#ln)" strokeWidth="1" fill="none">
            <line className="h-spoke" x1="500" y1="350" x2="189" y2="230" opacity="0.8" />
            <line className="h-spoke" x1="500" y1="350" x2="469" y2="111" opacity="0.8" />
            <line className="h-spoke" x1="500" y1="350" x2="776" y2="196" opacity="0.8" />
            <line className="h-spoke" x1="500" y1="350" x2="854" y2="392" opacity="0.8" />
            <line className="h-spoke" x1="500" y1="350" x2="680" y2="558" opacity="0.8" />
            <line className="h-spoke" x1="500" y1="350" x2="320" y2="558" opacity="0.8" />
            <line className="h-spoke" x1="500" y1="350" x2="142" y2="371" opacity="0.8" />
          </g>
          <g stroke="#222227" strokeWidth="1" fill="none" opacity="0.7">
            <line className="h-chord" x1="469" y1="111" x2="776" y2="196" />
            <line className="h-chord" x1="680" y1="558" x2="320" y2="558" />
            <line className="h-chord" x1="189" y1="230" x2="142" y2="371" />
          </g>

          {/* travelling signals — inbound bronze, outbound silver */}
          <g stroke="#c79f64" strokeWidth="1.6" strokeLinecap="round" fill="none">
            <line className="h-sig-in" x1="189" y1="230" x2="500" y2="350" />
            <line className="h-sig-in" x1="469" y1="111" x2="500" y2="350" />
            <line className="h-sig-in" x1="142" y1="371" x2="500" y2="350" />
          </g>
          <g stroke="#c8ccd2" strokeWidth="1.4" strokeLinecap="round" fill="none">
            <line className="h-sig-out" x1="500" y1="350" x2="854" y2="392" />
            <line className="h-sig-out" x1="500" y1="350" x2="680" y2="558" />
          </g>

          {/* outer nodes */}
          <g>
            {[
              { x: 189, y: 230, tone: "#3a3a40", dot: "#8f8c84" },
              { x: 469, y: 111, tone: "#3a3a40", dot: "#8f8c84" },
              { x: 776, y: 196, tone: "#3a3a40", dot: "#8f8c84" },
              { x: 854, y: 392, tone: "#4a4036", dot: "#c79f64" },
              { x: 680, y: 558, tone: "#4a4036", dot: "#c79f64" },
              { x: 320, y: 558, tone: "#3a3a40", dot: "#8f8c84" },
              { x: 142, y: 371, tone: "#3a3a40", dot: "#8f8c84" },
            ].map((n, i) => (
              <g key={i}>
                <circle className="h-node-ring" cx={n.x} cy={n.y} r="13" fill="none" stroke={n.tone} strokeWidth="1" />
                <circle className="h-node-dot" cx={n.x} cy={n.y} r="2.6" fill={n.dot} />
              </g>
            ))}
          </g>

          {/* focal node — Alfred */}
          <circle className="h-core-glow" cx="500" cy="350" r="70" fill="url(#ctr)" />
          <circle className="h-core-ring1" cx="500" cy="350" r="26" fill="none" stroke="#5a4d3a" strokeWidth="1" />
          <circle className="h-core-ring2" cx="500" cy="350" r="15" fill="none" stroke="#7a6747" strokeWidth="1" />
          <circle className="h-core-dot" cx="500" cy="350" r="4.5" fill="#e2cfa3" />
        </svg>
      </div>

      {/* copy */}
      <div className="hero-copy">
        <div className="hero-copy-inner">
          <div className="eyebrow hero-eyebrow">Autonomous Software Maintenance</div>
          <h1 className="hero-h1">
            The codebase
            <br />
            has a butler.
          </h1>
          <p className="hero-sub">
            Bug tickets go in. Review-ready pull requests come out. Your
            engineers never leave flow.
          </p>
          <div className="hero-ctas">
            <a href="#demo" className="btn-solid">
              Book a Demo
            </a>
            <a href="#method" className="btn-ghost">
              See Alfred work <span className="arrow">&#8594;</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-marker">Ticket &#8594; Pull Request</div>
    </section>
  );
}
