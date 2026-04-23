"use client";

import React from "react";
import { EditorialColumn } from "@/components/layout";
import { MessageList } from "./messages/MessageList";
import { Composer } from "./composer/Composer";
import type { Turn } from "./useDiscussData";

export interface ActiveChatProps {
  messages: Turn[];
  streaming: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onAbort: () => void;
  onBack: () => void;
  onClearError: () => void;
}

/**
 * ActiveChat - message transcript + composer. Header has a back link to
 * return to HistoryView.
 */
export function ActiveChat({
  messages,
  streaming,
  error,
  onSend,
  onAbort,
  onBack,
  onClearError,
}: ActiveChatProps) {
  return (
    <EditorialColumn variant="narrow">
      <div className="ac-header">
        <button type="button" className="ac-back" onClick={onBack}>
          Back to history
        </button>
      </div>
      {error && (
        <div className="ac-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="ac-error-close"
            onClick={onClearError}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}
      {messages.length === 0 ? (
        <div className="ac-empty">
          <p>Ask Precura anything about your health.</p>
        </div>
      ) : (
        <MessageList messages={messages} streaming={streaming} />
      )}
      <Composer onSend={onSend} streaming={streaming} onAbort={onAbort} />
      <style jsx>{`
        .ac-header {
          display: flex;
          align-items: center;
          padding: var(--sp-4) 0 var(--sp-3);
        }
        .ac-back {
          background: none;
          border: none;
          padding: 0;
          font-family: var(--font-sans);
          font-size: var(--text-meta);
          color: var(--sage-deep);
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--sage-soft);
        }
        .ac-back:hover {
          color: var(--ink);
          text-decoration-color: var(--sage);
        }
        .ac-error {
          margin: var(--sp-3) 0;
          padding: var(--sp-3) var(--sp-4);
          background: var(--terracotta-tint);
          border: 1px solid var(--terracotta-soft);
          border-radius: var(--radius);
          color: var(--terracotta-deep);
          font-size: var(--text-meta);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--sp-3);
          font-family: var(--font-sans);
        }
        .ac-error-close {
          background: none;
          border: none;
          color: var(--terracotta-deep);
          font-size: var(--text-meta);
          cursor: pointer;
          font-family: var(--font-sans);
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .ac-empty {
          padding: var(--sp-9) 0;
          text-align: center;
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--ink-faint);
          font-size: var(--text-body);
        }
      `}</style>
    </EditorialColumn>
  );
}
