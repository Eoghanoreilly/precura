"use client";

import React from "react";

export interface NarrativeCardProps {
  title?: React.ReactNode;
  tone?: "default" | "sage" | "warm";
  children: React.ReactNode;
}

export function NarrativeCard({ title, tone = "default", children }: NarrativeCardProps) {
  return (
    <article className={`narrcard tone-${tone}`}>
      {title && <h3 className="narrcard-title">{title}</h3>}
      <div className="narrcard-body">{children}</div>
      <style jsx>{`
        .narrcard {
          border-radius: var(--radius-card);
          border: 1px solid var(--line-soft);
          padding: var(--sp-6) var(--sp-6) var(--sp-6);
          font-family: var(--font-sans);
        }
        .tone-default { background: var(--paper); }
        .tone-sage    { background: var(--sage-tint); border-color: var(--sage-soft); }
        .tone-warm    { background: var(--canvas-warm); border-color: var(--stone-soft); }

        .narrcard-title {
          font-size: var(--text-section);
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 var(--sp-3);
          letter-spacing: -0.01em;
        }
        .narrcard-body {
          font-size: var(--text-body);
          line-height: var(--line-height-body);
          color: var(--ink-soft);
        }
        .narrcard-body > :global(p) {
          margin: 0 0 var(--sp-2);
        }
        .narrcard-body > :global(p:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </article>
  );
}
