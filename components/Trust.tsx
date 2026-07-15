"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Trust() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".trust-h2", {
        autoAlpha: 0,
        y: 26,
        duration: 1.2,
        scrollTrigger: { trigger: section.current, start: "top 78%", toggleActions: "play none none reverse" },
      });
      gsap.from(".trust-logo", {
        autoAlpha: 0,
        y: 18,
        duration: 1,
        stagger: 0.09,
        delay: 0.25,
        scrollTrigger: { trigger: ".trust-logos", start: "top 85%", toggleActions: "play none none reverse" },
      });
    },
    { scope: section }
  );

  return (
    <section id="trust" className="trust section-alt" ref={section}>
      <div className="container">
        <h2 className="trust-h2">
          Built for teams that would rather be shipping.
        </h2>
        <div className="trust-logos">
          <span className="trust-logo logo-serif">Meridian</span>
          <span className="trust-logo logo-caps">NORTHWELL</span>
          <span className="trust-logo logo-mono">axiom.systems</span>
          <span className="trust-logo logo-italic">Halcyon</span>
          <span className="trust-logo logo-thin">VANTA</span>
          <span className="trust-logo logo-serif">Brightwater</span>
        </div>
      </div>
    </section>
  );
}
