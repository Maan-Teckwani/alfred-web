"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import DemoForm from "@/components/DemoForm";

export default function Closing() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // the pool of light breathes, slowly
      gsap.to(".closing-glow", {
        opacity: 0.55,
        scale: 1.06,
        transformOrigin: "50% 36%",
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      SplitText.create(".closing-h2", {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".closing-h2",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }),
      });

      gsap.from([".closing-p", ".closing-form"], {
        autoAlpha: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.16,
        delay: 0.35,
        scrollTrigger: { trigger: ".closing-inner", start: "top 72%", toggleActions: "play none none reverse" },
      });
    },
    { scope: section }
  );

  return (
    <section id="demo" className="closing" ref={section}>
      <div className="closing-glow" aria-hidden="true"></div>
      <div className="closing-inner">
        <h2 className="closing-h2">Protect the flow state.</h2>
        <p className="closing-p">
          Leave your email. We&rsquo;ll show you what your backlog looks like
          when it starts clearing itself.
        </p>
        <div className="closing-form">
          <DemoForm />
        </div>
      </div>
    </section>
  );
}
