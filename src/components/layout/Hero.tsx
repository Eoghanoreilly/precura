"use client";

import React from "react";

export interface HeroProps {
  tone?: "warm" | "quiet";
  eyebrow?: React.ReactNode;
  display: React.ReactNode;
  body?: React.ReactNode;
  sig?: React.ReactNode;
  ctas?: React.ReactNode;
}

/**
 * Hero - editorial hero surface. Warm tone adds the H2 wash gradient + soft
 * terracotta blob; quiet tone is a flat paper surface for states that
 * shouldn't scream (State B flagged-markers, State D trajectory, State E steady).
 */
export function Hero({ tone = "warm", eyebrow, display, body, sig, ctas }: HeroProps) {
  return (
    <section className={`hero hero-${tone}`}>
      {tone === "warm" && <div className="hero-blob" aria-hidden="true" />}
      {eyebrow && <div className="hero-eyebrow">{eyebrow}</div>}
      <h1 className="hero-display">{display}</h1>
      {body && <div className="hero-body">{body}</div>}
      {sig && <div className="hero-sig">{sig}</div>}
      {ctas && <div className="hero-ctas">{ctas}</div>}

      <style jsx>{`
        .hero {
          position: relative;
          border-radius: var(--radius-hero);
          padding: var(--sp-9) clamp(28px, 4vw, 44px) var(--sp-9);
          margin-bottom: var(--sp-8);
          border: 1px solid var(--line-soft);
          overflow: hidden;
        }
        .hero-warm {
          background: var(--hero-wash);
        }
        .hero-quiet {
          background: var(--paper);
          border-color: var(--line-card);
        }
        .hero-blob {
          position: absolute;
          top: -80px;
          right: -100px;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(201,87,58,0.08), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-eyebrow {
          font-size: var(--text-eyebrow);
          color: var(--terracotta);
          margin-bottom: var(--sp-5);
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          position: relative;
        }
        .hero-display {
          font-size: var(--text-display);
          font-weight: 500;
          letter-spacing: -0.036em;
          line-height: var(--line-height-display);
          color: var(--ink);
          margin: 0 0 var(--sp-5);
          max-width: 820px;
          position: relative;
        }
        .hero-body {
          font-size: var(--text-body);
          line-height: var(--line-height-body);
          color: var(--ink-soft);
          max-width: 720px;
          margin-bottom: var(--sp-5);
          position: relative;
        }
        .hero-sig {
          font-size: var(--text-meta);
          color: var(--ink-muted);
          position: relative;
        }
        .hero-ctas {
          margin-top: var(--sp-6);
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-3);
          position: relative;
        }
      `}</style>
    </section>
  );
}

// Shared Button used inside hero ctas (and elsewhere).
export function Button({
  children,
  tone = "primary",
  href,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  tone?: "primary" | "secondary" | "sage";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const cls = `btn btn-${tone}`;
  if (href) {
    return (
      <a className={cls} href={href}>
        {children}
        <style jsx>{buttonStyles}</style>
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
      <style jsx>{buttonStyles}</style>
    </button>
  );
}

const buttonStyles = `
  .btn {
    padding: var(--sp-3) var(--sp-5);
    border-radius: var(--radius-pill);
    font-size: var(--text-meta);
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    font-family: var(--font-sans);
    letter-spacing: -0.005em;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease;
  }
  .btn:active { transform: scale(0.98); }
  .btn-primary {
    background: var(--ink);
    color: var(--canvas-soft);
  }
  .btn-secondary {
    background: transparent;
    color: var(--ink);
    border-color: var(--line-card);
  }
  .btn-sage {
    background: var(--sage-deep);
    color: var(--canvas-soft);
  }
`;
