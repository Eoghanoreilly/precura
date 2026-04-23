"use client";

import React from "react";

export interface UserMessageProps {
  content: string;
  timestamp?: string;
}

/**
 * UserMessage - right-aligned sage-tint card. Serif italic eyebrow with
 * "You * HH:MM". Max-width 80% of column.
 */
export function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="umsg-row">
      <article className="umsg">
        <div className="umsg-eyebrow">
          You
          {timestamp && <span className="umsg-time"> &middot; {timestamp}</span>}
        </div>
        <div className="umsg-body">{content}</div>
      </article>
      <style jsx>{`
        .umsg-row {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }
        .umsg {
          max-width: 80%;
          background: var(--sage-tint);
          border: 1px solid var(--sage-soft);
          border-radius: var(--radius-card);
          border-bottom-right-radius: 8px;
          padding: var(--sp-4);
          font-family: var(--font-sans);
        }
        .umsg-eyebrow {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--sage-deep);
          margin-bottom: var(--sp-2);
        }
        .umsg-time {
          color: var(--ink-faint);
          font-style: italic;
        }
        .umsg-body {
          font-size: var(--text-body);
          line-height: var(--line-height-body);
          color: var(--ink);
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
