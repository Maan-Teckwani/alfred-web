"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Footer() {
  const footer = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".footer-grid > div", {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: { trigger: footer.current, start: "top 88%", toggleActions: "play none none reverse" },
      });
      gsap.from(".footer-bottom", {
        autoAlpha: 0,
        duration: 1.2,
        delay: 0.4,
        scrollTrigger: { trigger: footer.current, start: "top 88%", toggleActions: "play none none reverse" },
      });
    },
    { scope: footer }
  );

  return (
    <footer className="footer" ref={footer}>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-row">
              <span className="brand-gem" aria-hidden="true"></span>
              <span className="footer-brand-word">ALFRED</span>
            </div>
            <p className="footer-tagline">Quietly keeping software moving.</p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <div className="footer-links">
              <a href="#method" className="footer-link">
                Method
              </a>
              <a href="#showcase" className="footer-link">
                Product
              </a>
              <a href="#trust" className="footer-link">
                Trust
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#" className="footer-link">
                About
              </a>
              <a href="#" className="footer-link">
                Security
              </a>
              <a href="#" className="footer-link">
                Contact
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Begin</div>
            <a href="#demo" className="footer-demo-btn">
              Book a Demo
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&#169; 2026 Alfred</span>
          <span className="tag">Software maintenance, automated.</span>
        </div>
      </div>
    </footer>
  );
}
