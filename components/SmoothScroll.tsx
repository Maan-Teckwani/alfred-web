"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  useGSAP,
  prefersReducedMotion,
} from "@/lib/gsap";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapper = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
        smoothTouch: 0.1,
      });

      // ScrollSmoother owns the scroll position, so in-page anchors
      // must be routed through it instead of native hash jumps.
      const onClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest?.(
          'a[href^="#"]'
        ) as HTMLAnchorElement | null;
        if (!anchor) return;
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const targetY = Math.max(smoother.offset(target, "top 90px"), 0);
        const distance = Math.abs(smoother.scrollTop() - targetY);
        gsap.to(smoother, {
          scrollTop: targetY,
          duration: gsap.utils.clamp(0.9, 2.2, distance / 2600),
          ease: "power4.inOut",
          overwrite: "auto",
        });
      };
      document.addEventListener("click", onClick);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // land deep links (e.g. /#demo) on their section — the native
        // hash jump happens before the smoother exists and gets lost
        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            smoother.scrollTo(target, false, "top 90px");
            ScrollTrigger.refresh();
          }
        }
      });

      return () => {
        document.removeEventListener("click", onClick);
        smoother.kill();
      };
    },
    { scope: wrapper }
  );

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
