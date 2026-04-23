"use client";

import React from "react";
import { BlinkingCursor } from "./BlinkingCursor";

export interface PrecuraMessageProps {
  content: string;
  timestamp?: string;
  streaming?: boolean;
}

/**
 * PrecuraMessage - left-aligned paper card with a sage avatar dot and a
 * serif italic eyebrow. Inline cursor while streaming.
 */
export function PrecuraMessage({ content, timestamp, streaming }: PrecuraMessageProps) {
  return (
    <div className="pmsg-row">
      <div className="pmsg-avatar" aria-hidden="true" />
      <article className="pmsg">
        <div className="pmsg-eyebrow">
          Precura
          {timestamp && <span className="pmsg-time"> &middot; {timestamp}</span>}
        </div>
        <div className="pmsg-body">
          {content}
          {streaming && <BlinkingCursor />}
        </div>
      </article>
      <style jsx>{`
        .pmsg-row {
          display: flex;
          align-items: flex-start;
          gap: var(--sp-3);
          width: 100%;
        }
        .pmsg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--sage) 0%, var(--sage-deep) 100%);
          box-shadow: 0 2px 8px rgba(68, 90, 74, 0.28);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .pmsg {
          max-width: 80%;
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          border-top-left-radius: 8px;
          padding: var(--sp-4);
          font-family: var(--font-sans);
        }
        .pmsg-eyebrow {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--sage-deep);
          margin-bottom: var(--sp-2);
        }
        .pmsg-time {
          color: var(--ink-faint);
          font-style: italic;
        }
        .pmsg-body {
          font-size: var(--text-body);
          line-height: var(--line-height-body);
          color: var(--ink-soft);
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
