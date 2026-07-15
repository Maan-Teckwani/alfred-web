"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Nav() {
  const nav = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(nav.current, {
        y: -70,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.25,
      });

      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) =>
          nav.current?.classList.toggle("is-scrolled", self.isActive),
      });

      gsap.to(".nav-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.4,
        },
      });
    },
    { scope: nav }
  );

  return (
    <nav className="nav" ref={nav}>
      <a href="#top" className="brand" aria-label="Alfred — back to top">
        <span className="brand-gem" aria-hidden="true"></span>
        <span className="brand-word">ALFRED</span>
      </a>
      <div className="nav-right">
        <a href="#method" className="nav-link">
          How it works
        </a>
        <a href="#showcase" className="nav-link">
          Product
        </a>
        <a href="#trust" className="nav-link">
          Trust
        </a>
        <a href="#demo" className="nav-cta">
          Book a Demo
        </a>
      </div>
      <span className="nav-progress" aria-hidden="true"></span>
    </nav>
  );
}
