"use client";

import { useState } from "react";
import { IconCheck } from "./icons";

type Mode = "byok" | "managed";
type Cur = "usd" | "inr";

type Tier = {
  name: string;
  usd: string;
  inr: string;
  monthly: boolean;
  blurb: string;
  feats: string[];
  cta: string;
  featured?: boolean;
};

const TIERS: Record<Mode, Tier[]> = {
  byok: [
    {
      name: "Free",
      usd: "$0",
      inr: "₹0",
      monthly: true,
      blurb: "Kick the tires on a real board.",
      feats: [
        "25 tickets / month",
        "1 seat",
        "Jira, GitHub & Slack integrations",
        "Community support",
      ],
      cta: "Start free",
    },
    {
      name: "Starter",
      usd: "$49",
      inr: "₹4,299",
      monthly: true,
      blurb: "For a small team's bug rotation.",
      feats: [
        "150 tickets / month",
        "3 seats",
        "Closed-loop test verification",
        "Slack escalation & HITL handoff",
      ],
      cta: "Get started",
    },
    {
      name: "Team",
      usd: "$199",
      inr: "₹17,499",
      monthly: true,
      blurb: "The sweet spot for most engineering teams.",
      feats: [
        "750 tickets / month",
        "10 seats",
        "Priority sandbox queue",
        "Email + Slack support",
      ],
      cta: "Get started",
      featured: true,
    },
    {
      name: "Business",
      usd: "$699",
      inr: "₹59,999",
      monthly: true,
      blurb: "For orgs running Alfred across boards.",
      feats: [
        "3,000 tickets / month",
        "30 seats",
        "Multiple repos & boards",
        "Priority support",
      ],
      cta: "Get started",
    },
    {
      name: "Scale",
      usd: "$1,999",
      inr: "₹1,74,999",
      monthly: true,
      blurb: "Serious backlog throughput.",
      feats: [
        "12,000 tickets / month",
        "Unlimited seats",
        "Dedicated sandbox capacity",
        "Priority support",
      ],
      cta: "Get started",
    },
    {
      name: "Enterprise",
      usd: "Custom",
      inr: "Custom",
      monthly: false,
      blurb: "Your rules, your infrastructure.",
      feats: [
        "Unlimited tickets & seats",
        "SSO & audit logs",
        "VPC / on-prem deployment",
        "Custom SLAs",
      ],
      cta: "Talk to sales",
    },
  ],
  managed: [
    {
      name: "Free trial",
      usd: "$0",
      inr: "₹0",
      monthly: false,
      blurb: "Inference on us — try it end to end.",
      feats: [
        "10 tickets to start",
        "No API key needed",
        "All integrations included",
        "Community support",
      ],
      cta: "Start trial",
    },
    {
      name: "Starter",
      usd: "$99",
      inr: "₹8,599",
      monthly: true,
      blurb: "Hands-off fixing for small teams.",
      feats: [
        "30 tickets / month",
        "≈ $3.30 per ticket",
        "LLM inference included",
        "Slack escalation & HITL handoff",
      ],
      cta: "Get started",
    },
    {
      name: "Team",
      usd: "$499",
      inr: "₹43,499",
      monthly: true,
      blurb: "The sweet spot for most engineering teams.",
      feats: [
        "175 tickets / month",
        "≈ $2.85 per ticket",
        "LLM inference included",
        "Priority sandbox queue",
      ],
      cta: "Get started",
      featured: true,
    },
    {
      name: "Business",
      usd: "$1,999",
      inr: "₹1,74,999",
      monthly: true,
      blurb: "For orgs running Alfred across boards.",
      feats: [
        "750 tickets / month",
        "≈ $2.67 per ticket",
        "Multiple repos & boards",
        "Priority support",
      ],
      cta: "Get started",
    },
    {
      name: "Scale",
      usd: "$4,999",
      inr: "₹4,37,999",
      monthly: true,
      blurb: "Serious backlog throughput.",
      feats: [
        "2,000 tickets / month",
        "≈ $2.50 per ticket",
        "Dedicated sandbox capacity",
        "Priority support",
      ],
      cta: "Get started",
    },
    {
      name: "Enterprise",
      usd: "Custom",
      inr: "Custom",
      monthly: false,
      blurb: "Your rules, your infrastructure.",
      feats: [
        "Custom ticket volume",
        "Volume per-ticket pricing",
        "SSO, VPC & custom SLAs",
        "Dedicated support",
      ],
      cta: "Talk to sales",
    },
  ],
};

const MODE_NOTE: Record<Mode, string> = {
  byok: "Connect your own Anthropic or OpenAI API key and pay the provider directly for tokens. Your Alfred plan covers the platform: sandboxes, orchestration, and integrations.",
  managed:
    "One bill, inference included. We carry the token costs so you never think about keys, quotas, or provider invoices.",
};

export default function Pricing() {
  const [mode, setMode] = useState<Mode>("byok");
  const [cur, setCur] = useState<Cur>("usd");

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="sec-head">
          <h2>
            Pricing for every size of{" "}
            <span className="grad-text">backlog.</span>
          </h2>
          <p>Start free on a real board. Upgrade when the tickets do.</p>
        </div>

        <div className="price-controls">
          <div className="seg" role="group" aria-label="Pricing model">
            <button
              type="button"
              aria-pressed={mode === "byok"}
              onClick={() => setMode("byok")}
            >
              Bring your own key
            </button>
            <button
              type="button"
              aria-pressed={mode === "managed"}
              onClick={() => setMode("managed")}
            >
              Managed compute
            </button>
          </div>
          <div className="seg seg-sm" role="group" aria-label="Currency">
            <button
              type="button"
              aria-pressed={cur === "usd"}
              onClick={() => setCur("usd")}
            >
              USD
            </button>
            <button
              type="button"
              aria-pressed={cur === "inr"}
              onClick={() => setCur("inr")}
            >
              INR
            </button>
          </div>
        </div>

        <p className="price-note">{MODE_NOTE[mode]}</p>

        <div className="price-grid">
          {TIERS[mode].map((t) => (
            <article
              className={`price-card ${t.featured ? "featured" : ""}`}
              key={`${mode}-${t.name}`}
            >
              {t.featured && <span className="price-pop">Most popular</span>}
              <p className="price-name">{t.name}</p>
              <div className="price-amount">
                <span className="num">{cur === "usd" ? t.usd : t.inr}</span>
                {t.monthly && <span className="per">/ month</span>}
              </div>
              <p className="price-blurb">{t.blurb}</p>
              <ul className="price-feats">
                {t.feats.map((f) => (
                  <li key={f}>
                    <IconCheck />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                className={t.featured ? "btn" : "btn-ghost"}
                href="#pricing"
                aria-label={`${t.cta} — ${t.name} plan`}
              >
                {t.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="price-foot">
          All paid plans include closed-loop verification, HITL escalation, and
          the Jira + GitHub + Slack integrations. Prices exclude taxes.
        </p>
      </div>
    </section>
  );
}
