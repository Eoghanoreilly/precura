"use client";

import React from "react";
import { formatSessionDate } from "./formatSessionDate";
import type { ChatSession } from "@/lib/data/types";

export interface SessionCardProps {
  session: ChatSession & { preview?: string; messageCount?: number };
  onOpen: (sessionId: string) => void;
}

/**
 * SessionCard - editorial tile for a past conversation. Click anywhere on the
 * card to open the session.
 */
export function SessionCard({ session, onOpen }: SessionCardProps) {
  const dateLabel = formatSessionDate(session.created_at);
  const preview = session.preview || session.title || "(no messages yet)";
  const count = session.messageCount ?? 0;

  return (
    <button
      type="button"
      className="scard"
      onClick={() => onOpen(session.id)}
      aria-label={`Open conversation from ${dateLabel}`}
    >
      <div className="scard-date">{dateLabel}</div>
      <div className="scard-preview">{preview}</div>
      {count > 0 && (
        <div className="scard-meta">
          {count} {count === 1 ? "message" : "messages"}
        </div>
      )}
      <style jsx>{`
        .scard {
          display: block;
          width: 100%;
          text-align: left;
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          padding: var(--sp-5);
          font-family: var(--font-sans);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .scard:hover {
          transform: translateY(-2px);
          border-color: var(--line-card);
          box-shadow: var(--shadow-card);
        }
        .scard:active {
          transform: scale(0.99);
        }
        .scard-date {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--text-meta);
          color: var(--sage-deep);
          margin-bottom: var(--sp-2);
        }
        .scard-preview {
          font-size: var(--text-body);
          color: var(--ink);
          line-height: var(--line-height-body);
          margin-bottom: var(--sp-3);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .scard-meta {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
      `}</style>
    </button>
  );
}
