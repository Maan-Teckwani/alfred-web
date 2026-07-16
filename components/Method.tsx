"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Alfred Loop v3 — a continuous, self-driven timeline (no scroll triggers).
// A ticket travels Jira → Alfred → Sandbox → GitHub → Slack and loops.
const SPEED = 1.1;
const SHOW_CAPTIONS = true;
const LOOP = 26; // seconds
const MONO = "var(--mono)";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const rv = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Vals = Record<string, CSSProperties> & {
  chipText: string;
  typed1: string;
  caps: { text: string; st: CSSProperties }[];
};

function computeVals(t: number, reduced: boolean): Vals {
  // timeline (seconds): dwell + travel segments
  // stations: 0 jira, 1 alfred, 2 sandbox, 3 github, 4 slack
  const segs: [number, number, number, number][] = [
    [0, 4, 0, 0], [4, 5.2, 0, 1],
    [5.2, 9, 1, 1], [9, 10.2, 1, 2],
    [10.2, 18.2, 2, 2], [18.2, 19.4, 2, 3],
    [19.4, 22.6, 3, 3], [22.6, 23.6, 3, 4],
    [23.6, 26, 4, 4],
  ];
  let s = 0;
  for (const [a, b, from, to] of segs) {
    if (t >= a && t <= b) { s = from + ease(rv(t, a, b)) * (to - from); break; }
  }
  const dwells: [number, number][] = [[0, 4], [5.2, 9], [10.2, 18.2], [19.4, 22.6], [23.6, 25.6]];

  // loop-seam fade for rail movers
  const seam = Math.min(rv(t, 0, 0.45), 1 - rv(t, 25.5, 26));

  const vals = {} as Vals;

  // rail geometry: node centers at (i+0.5)/5, line from 10% to 90%
  const frac = (0.5 + s) / 5;
  const topLine = "clamp(22px, 3.4vw, 30px)";
  vals.fill = {
    position: "absolute", left: "10%", top: topLine, height: "1px",
    width: "calc(" + (frac * 100).toFixed(3) + "% - 10%)",
    background: "linear-gradient(90deg, rgba(199,154,85,0.12), #C79A55)",
    boxShadow: "0 0 8px rgba(199,154,85,0.3)",
    opacity: seam,
  };
  vals.orb = {
    position: "absolute", top: "calc(" + topLine + " - 2px)", left: (frac * 100).toFixed(3) + "%",
    width: "5px", height: "5px", marginLeft: "-2.5px", borderRadius: "50%",
    background: "#E4C079", boxShadow: "0 0 12px 4px rgba(228,192,121,0.6)",
    opacity: seam,
  };
  vals.chipText = t < 18.8 ? "ALF-1427" : t < 23.1 ? "✓ FIX VERIFIED" : "PR #318";
  vals.chip = {
    position: "absolute", top: "-38px", left: (frac * 100).toFixed(3) + "%",
    transform: "translateX(-50%)",
    fontFamily: MONO, fontSize: "10px", letterSpacing: "0.12em", whiteSpace: "nowrap",
    color: "#E4C079", background: "#14110C",
    border: "1px solid rgba(199,154,85,0.45)", borderRadius: "20px", padding: "4px 11px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.5), 0 0 14px rgba(199,154,85,0.12)",
    opacity: seam,
  };

  // nodes
  const nodeSize = "clamp(44px, 6.8vw, 60px)";
  for (let i = 0; i < 5; i++) {
    const prox = clamp01(1 - Math.abs(i - s) * 1.6);
    const done = s > i + 0.4;
    vals["n" + (i + 1)] = {
      position: "relative", width: nodeSize, height: nodeSize, borderRadius: "50%",
      boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, #171411, #121009)",
      border: "1px solid rgba(199,154,85," + (0.14 + 0.66 * prox + (done ? 0.14 : 0)).toFixed(3) + ")",
      boxShadow: prox > 0.05 ? "0 0 " + (22 * prox).toFixed(0) + "px rgba(199,154,85," + (0.35 * prox).toFixed(2) + ")" : "none",
      transform: "scale(" + (1 + 0.13 * prox).toFixed(3) + ")",
    };
    vals["b" + (i + 1)] = {
      fontFamily: MONO, fontSize: "clamp(9px, 1.7vw, 11.5px)", letterSpacing: "0.08em",
      whiteSpace: "nowrap",
      color: prox > 0.4 ? "#EAE4D8" : "#8F8778",
      opacity: 0.55 + 0.45 * prox,
    };
  }

  // logo micro-animations
  const tau = dwells.map(([a]) => t - a); // local time per station
  // jira mark: settles in with a bob at loop start
  const jb = ease(rv(tau[0], 0.1, 0.7));
  vals.l1 = {
    width: "46%", height: "46%", objectFit: "contain",
    transform: "translateY(" + ((1 - jb) * -10).toFixed(1) + "px) scale(" + (0.85 + 0.15 * jb).toFixed(3) + ")",
    opacity: 0.35 + 0.65 * jb,
  };
  // github: invert to ivory, pop when PR opens
  const gp = tau[3] > 0 && tau[3] < 0.9 ? Math.sin(rv(tau[3], 0, 0.9) * Math.PI) : 0;
  vals.l4 = {
    width: "52%", height: "52%", objectFit: "contain",
    filter: "invert(0.92)",
    transform: "scale(" + (1 + 0.18 * gp).toFixed(3) + ")",
  };
  vals.ring4 = {
    position: "absolute", inset: "-1px", borderRadius: "50%",
    border: "1px solid rgba(199,154,85,0.7)",
    transform: "scale(" + (1 + rv(tau[3], 0, 1.1) * 0.8).toFixed(3) + ")",
    opacity: tau[3] > 0 && tau[3] < 1.1 ? Number((1 - rv(tau[3], 0, 1.1)).toFixed(2)) : 0,
    pointerEvents: "none",
  };
  // slack: wiggle on notify
  const wig = tau[4] > 0 ? Math.sin(tau[4] * 11) * 9 * Math.max(0, 1 - tau[4] / 1.3) : 0;
  vals.l5 = {
    width: "48%", height: "48%", objectFit: "contain",
    transform: "rotate(" + wig.toFixed(1) + "deg)",
  };

  // vignette cards
  const cardBase: CSSProperties = {
    position: "absolute", width: "min(560px, 92vw)", height: "100%",
    borderRadius: "14px", border: "1px solid rgba(233,225,210,0.09)",
    background: "linear-gradient(180deg, #171411 0%, #121009 100%)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    overflow: "hidden", display: "flex", flexDirection: "column",
  };
  for (let i = 0; i < 5; i++) {
    const [ds, de] = dwells[i];
    const k = Math.min(rv(t, ds - 0.15, ds + 0.55), 1 - rv(t, de, de + 0.85));
    const kk = ease(clamp01(k));
    vals["c" + (i + 1)] = Object.assign({}, cardBase, {
      opacity: Number(kk.toFixed(3)),
      transform: reduced ? "none" : "translateY(" + ((1 - kk) * 14).toFixed(1) + "px) scale(" + (0.97 + 0.03 * kk).toFixed(3) + ")",
      visibility: kk < 0.01 ? "hidden" : "visible",
      pointerEvents: "none",
    } as CSSProperties);
  }

  // line reveals (local tau, window a..b)
  const lr = (v: number, a: number, b: number, dy?: number): CSSProperties => {
    const k = ease(rv(v, a, b));
    return {
      opacity: Number(k.toFixed(3)),
      transform: reduced ? "none" : "translateY(" + ((1 - k) * (dy ?? 10)).toFixed(1) + "px)",
    };
  };

  // 1 · jira (tau0 0..4)
  vals.j1 = lr(tau[0], 0.3, 0.9);
  vals.j2 = lr(tau[0], 0.9, 1.6);
  vals.j3 = lr(tau[0], 2.2, 2.9);

  // 2 · alfred (tau1 0..3.8)
  vals.a1 = lr(tau[1], 0.2, 0.8);
  vals.a2 = lr(tau[1], 1.0, 1.7);
  vals.a3 = lr(tau[1], 1.9, 2.6);

  // 3 · sandbox: terminal → code typing → tests (tau2 0..8)
  vals.s1 = lr(tau[2], 0.2, 0.8);
  const k1k = ease(rv(tau[2], 1.2, 1.8));
  vals.k1 = {
    opacity: Number(k1k.toFixed(3)),
    color: "#C07A6B",
    textDecoration: rv(tau[2], 1.9, 2.2) > 0.8 ? "line-through" : "none",
    background: "rgba(192,122,107," + (0.09 * k1k).toFixed(3) + ")",
    borderRadius: "4px", padding: "3px 8px",
  };
  const line1 = "if (cart.isEmpty) return CheckoutState.EMPTY;";
  const n1 = Math.round(rv(tau[2], 2.3, 4.7) * line1.length);
  vals.typed1 = line1.slice(0, n1);
  vals.k2w = {
    opacity: n1 > 0 ? 1 : 0,
    background: "rgba(143,169,139,0.09)", borderRadius: "4px", padding: "3px 8px",
    display: "flex", alignItems: "center", minHeight: "1.2em",
  };
  vals.cur1 = {
    display: "inline-block", width: "7px", height: "14px", background: "#E4C079",
    marginLeft: "2px", animation: "alfBlink 1s step-end infinite",
    opacity: n1 > 0 && n1 < line1.length ? 1 : 0,
  };
  vals.t1 = lr(tau[2], 5.1, 5.6);
  vals.t2 = lr(tau[2], 5.7, 6.2);
  vals.t5 = lr(tau[2], 6.6, 7.2);

  // 4 · github (tau3 0..3.2)
  vals.g1 = lr(tau[3], 0.2, 0.8);
  vals.g2 = lr(tau[3], 0.8, 1.5);
  vals.g3 = lr(tau[3], 1.5, 2.3);

  // 5 · slack (tau4 0..2)
  vals.m1 = lr(tau[4], 0.1, 0.6);
  vals.m2 = lr(tau[4], 0.5, 1.2);
  vals.m3 = lr(tau[4], 1.1, 1.7);

  // captions
  vals.caps = [
    "A bug ticket lands in Jira.",
    "Alfred reads it and plans the fix.",
    "Code written and verified in an isolated sandbox.",
    "A pull request opens — checks green.",
    "The team gets one quiet message.",
  ].map((text, i) => {
    const [ds, de] = dwells[i];
    const k = SHOW_CAPTIONS ? ease(clamp01(Math.min(rv(t, ds + 0.1, ds + 0.7), 1 - rv(t, de, de + 0.7)))) : 0;
    return {
      text,
      st: {
        position: "absolute", inset: 0, margin: 0,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        opacity: Number(k.toFixed(3)), pointerEvents: "none",
        transform: reduced ? "none" : "translateY(" + ((1 - k) * 6).toFixed(1) + "px)",
      } as CSSProperties,
    };
  });

  return vals;
}

export default function Method() {
  const reducedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reduced;
    if (reduced) {
      setT(24.4);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    let last = 0;
    let cur = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      cur = (cur + dt * SPEED) % LOOP;
      setT(cur);
      raf = requestAnimationFrame(tick);
    };

    // Only run the loop while the section is scrolled into view.
    const start = () => {
      if (running) return;
      running = true;
      last = 0; // avoid a time jump after being paused
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  const v = computeVals(t, reducedRef.current);

  const nodeCol: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" };
  const cardHead: CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between", height: "40px",
    padding: "0 18px", borderBottom: "1px solid rgba(233,225,210,0.07)",
    background: "rgba(255,255,255,0.02)", flexShrink: 0,
  };
  const pill = (color: string, border: string): CSSProperties => ({
    fontFamily: MONO, fontSize: "10px", letterSpacing: "0.1em", color,
    border: "1px solid " + border, borderRadius: "20px", padding: "2px 9px",
  });

  return (
    <section
      id="method"
      ref={sectionRef}
      style={{
        background: "#0D0C0A",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(10px, 2.4vh, 24px)",
        padding: "48px 0 56px 0",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* head */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", padding: "0 16px" }}>
        <div style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C79A55" }}>
          How Alfred Works
        </div>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(24px, 3.8vw, 40px)", lineHeight: 1.12, margin: 0, color: "#EAE4D8", textWrap: "balance" } as CSSProperties}>
          A ticket goes in. A pull request comes out.
        </h2>
      </div>

      {/* pipeline rail */}
      <div style={{ position: "relative", width: "min(880px, 94vw)", marginTop: "48px" }}>
        {/* traveling ticket chip */}
        <div style={v.chip}>{v.chipText}</div>
        {/* line */}
        <div style={{ position: "absolute", left: "10%", right: "10%", top: "clamp(22px, 3.4vw, 30px)", height: "1px", background: "rgba(233,225,210,0.10)" }} />
        <div style={v.fill} />
        <div style={v.orb} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", position: "relative" }}>
          <div style={nodeCol}>
            <div style={v.n1}>
              <img src="/uploads/logo-jira-mark.png" alt="Jira" style={v.l1} />
            </div>
            <div style={v.b1}>Jira</div>
          </div>

          <div style={nodeCol}>
            <div style={v.n2}>
              <span style={{ position: "absolute", inset: "6px", borderRadius: "50%", border: "1px solid rgba(199,154,85,0.12)", borderTopColor: "rgba(199,154,85,0.8)", animation: "alfSpin 2.2s linear infinite" }} />
              <span style={{ fontFamily: "var(--serif)", fontSize: "clamp(19px, 2.6vw, 25px)", color: "#E4C079" }}>A</span>
            </div>
            <div style={v.b2}>Alfred</div>
          </div>

          <div style={nodeCol}>
            <div style={v.n3}>
              <span style={{ fontFamily: MONO, fontSize: "clamp(13px, 1.9vw, 17px)", color: "#C79A55" }}>
                ❯<span style={{ animation: "alfBlink 1.1s step-end infinite" }}>_</span>
              </span>
            </div>
            <div style={v.b3}>Sandbox</div>
          </div>

          <div style={nodeCol}>
            <div style={v.n4}>
              <span style={v.ring4} />
              <img src="/uploads/logo-github.png" alt="GitHub" style={v.l4} />
            </div>
            <div style={v.b4}>GitHub</div>
          </div>

          <div style={nodeCol}>
            <div style={v.n5}>
              <img src="/uploads/logo-slack.png" alt="Slack" style={v.l5} />
            </div>
            <div style={v.b5}>Slack</div>
          </div>
        </div>
      </div>

      {/* vignette stage */}
      <div style={{ position: "relative", width: "100%", height: "min(300px, 38vh)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "6px" }}>
        <div style={{ position: "absolute", width: "min(620px, 92vw)", height: "110%", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", background: "radial-gradient(closest-side, rgba(199,154,85,0.10), transparent)" }} />

        {/* 1 · Jira ticket */}
        <div style={v.c1}>
          <div style={cardHead}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.14em", color: "#8F8778" }}>ALF-1427</span>
            <span style={pill("#C07A6B", "rgba(192,122,107,0.4)")}>P1 · BUG</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px", padding: "14px 22px", boxSizing: "border-box", overflow: "hidden" }}>
            <div style={v.j1}>
              <span style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(18px, 2.7vw, 23px)", lineHeight: 1.2, color: "#EAE4D8" }}>Checkout crashes when the cart is empty</span>
            </div>
            <div style={{ display: "flex", gap: "8px", ...v.j2 }}>
              <span style={{ fontFamily: MONO, fontSize: "10px", color: "#8F8778", border: "1px solid rgba(233,225,210,0.14)", borderRadius: "20px", padding: "2px 9px" }}>checkout</span>
              <span style={{ fontFamily: MONO, fontSize: "10px", color: "#8F8778", border: "1px solid rgba(233,225,210,0.14)", borderRadius: "20px", padding: "2px 9px" }}>crash</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", ...v.j3 }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#C79A55", animation: "alfPulse 2.2s ease-in-out infinite" }} />
              <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.1em", color: "#C79A55" }}>ROUTED TO ALFRED →</span>
            </div>
          </div>
        </div>

        {/* 2 · Alfred */}
        <div style={v.c2}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", padding: "18px", boxSizing: "border-box" }}>
            <div style={{ position: "relative", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(199,154,85,0.15)", borderTopColor: "rgba(199,154,85,0.85)", animation: "alfSpin 1.6s linear infinite" }} />
              <span style={{ position: "absolute", inset: "8px", borderRadius: "50%", border: "1px solid rgba(199,154,85,0.1)", borderBottomColor: "rgba(228,192,121,0.5)", animation: "alfSpin 2.6s linear infinite reverse" }} />
              <span style={{ fontFamily: "var(--serif)", fontSize: "32px", color: "#E4C079" }}>A</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", fontFamily: MONO, fontSize: "clamp(11px, 2vw, 12.5px)" }}>
              <div style={v.a1}><span style={{ color: "#8FA98B" }}>✓</span> <span style={{ color: "#B6AD9C" }}>ticket read</span></div>
              <div style={v.a2}><span style={{ color: "#8FA98B" }}>✓</span> <span style={{ color: "#B6AD9C" }}>root cause — checkout.ts:214</span></div>
              <div style={v.a3}><span style={{ color: "#E4C079" }}>◈ planning fix…</span></div>
            </div>
          </div>
        </div>

        {/* 3 · Sandbox */}
        <div style={v.c3}>
          <div style={{ ...cardHead, justifyContent: "flex-start", gap: "12px" }}>
            <span style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(233,225,210,0.16)" }} />
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(233,225,210,0.16)" }} />
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(233,225,210,0.16)" }} />
            </span>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.12em", color: "#8F8778" }}>sandbox · alf-1427 · isolated</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", padding: "14px 22px", boxSizing: "border-box", background: "rgba(0,0,0,0.28)", fontFamily: MONO, fontSize: "clamp(10.5px, 1.9vw, 12.5px)", overflow: "hidden" }}>
            <div style={v.s1}><span style={{ color: "#8FA98B" }}>✓</span> <span style={{ color: "#8F8778" }}>sandbox ready — production untouched</span></div>
            <div style={v.k1}><span style={{ whiteSpace: "pre" }}>{"-   const first = cart.items[0].sku;"}</span></div>
            <div style={v.k2w}><span style={{ color: "#8FA98B", whiteSpace: "pre" }}>{"+   "}{v.typed1}</span><span style={v.cur1} /></div>
            <div style={v.t1}><span style={{ color: "#8FA98B" }}>✓</span> <span style={{ color: "#B6AD9C" }}>empty cart returns safely</span> <span style={{ color: "#8F8778" }}>9ms</span></div>
            <div style={v.t2}><span style={{ color: "#8FA98B" }}>✓</span> <span style={{ color: "#B6AD9C" }}>payment flow unaffected</span> <span style={{ color: "#8F8778" }}>21ms</span></div>
            <div style={v.t5}><span style={{ color: "#8FA98B", fontWeight: 500 }}>✓ 42 tests passed</span> <span style={{ color: "#8F8778" }}>· 0 failed · 3.2s</span></div>
          </div>
        </div>

        {/* 4 · GitHub PR */}
        <div style={v.c4}>
          <div style={cardHead}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/uploads/logo-github.png" alt="" style={{ width: "15px", height: "15px", objectFit: "contain", filter: "invert(0.92)" }} />
              <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.14em", color: "#8F8778" }}>PULL REQUEST · #318</span>
            </span>
            <span style={pill("#8FA98B", "rgba(143,169,139,0.35)")}>OPEN</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px", padding: "14px 22px", boxSizing: "border-box", overflow: "hidden" }}>
            <div style={v.g1}>
              <span style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(18px, 2.7vw, 22px)", lineHeight: 1.2, color: "#EAE4D8" }}>Guard checkout against empty carts</span>
            </div>
            <div style={v.g2}>
              <span style={{ fontFamily: MONO, fontSize: "11px", color: "#B6AD9C", border: "1px solid rgba(233,225,210,0.14)", borderRadius: "6px", padding: "3px 10px" }}>alfred/alf-1427 → main</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", ...v.g3 }}>
              <span style={{ fontFamily: MONO, fontSize: "10.5px", color: "#8FA98B", border: "1px solid rgba(143,169,139,0.28)", borderRadius: "20px", padding: "3px 10px" }}>✓ tests</span>
              <span style={{ fontFamily: MONO, fontSize: "10.5px", color: "#8FA98B", border: "1px solid rgba(143,169,139,0.28)", borderRadius: "20px", padding: "3px 10px" }}>✓ lint</span>
              <span style={{ fontFamily: MONO, fontSize: "10.5px", color: "#8FA98B", border: "1px solid rgba(143,169,139,0.28)", borderRadius: "20px", padding: "3px 10px" }}>✓ types</span>
            </div>
          </div>
        </div>

        {/* 5 · Slack */}
        <div style={v.c5}>
          <div style={cardHead}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/uploads/logo-slack.png" alt="" style={{ width: "14px", height: "14px", objectFit: "contain" }} />
              <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.12em", color: "#8F8778" }}># eng-fixes</span>
            </span>
            <span style={{ fontFamily: MONO, fontSize: "10px", color: "#8F8778" }}>09:58</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "14px 22px", boxSizing: "border-box", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "linear-gradient(160deg, #C79A55, #8A6A34)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontSize: "20px", color: "#14110C", flexShrink: 0 }}>A</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", ...v.m1 }}>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "#EAE4D8" }}>Alfred</span>
                  <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.08em", color: "#8F8778", border: "1px solid rgba(233,225,210,0.14)", borderRadius: "4px", padding: "1px 5px" }}>APP</span>
                </div>
                <div style={v.m2}>
                  <span style={{ fontSize: "clamp(13px, 2.2vw, 14.5px)", lineHeight: 1.55, color: "#CFC8BA", maxWidth: "380px", display: "inline-block" }}>
                    Opened <span style={{ color: "#C79A55" }}>PR #318</span> for ALF-1427 — all 42 tests passed. Ready for review.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", ...v.m3 }}>
                  <span style={{ fontFamily: MONO, fontSize: "10.5px", color: "#C79A55", border: "1px solid rgba(199,154,85,0.3)", borderRadius: "20px", padding: "3px 10px", background: "rgba(199,154,85,0.07)" }}>✓ 2</span>
                  <span style={{ fontFamily: MONO, fontSize: "10.5px", color: "#8F8778", border: "1px solid rgba(233,225,210,0.14)", borderRadius: "20px", padding: "3px 10px" }}>🎉 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* caption */}
      <div style={{ position: "relative", height: "30px", width: "min(560px, 92vw)" }}>
        {v.caps.map((cp, i) => (
          <p key={i} style={cp.st}>
            <span style={{ fontSize: "clamp(13px, 2.2vw, 15px)", lineHeight: 1.5, color: "#8F8778", textAlign: "center", textWrap: "pretty" } as CSSProperties}>{cp.text}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
