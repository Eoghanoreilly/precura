"use client";

import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/layout";
import { useAutoGrow } from "./useAutoGrow";

export interface ComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  streaming?: boolean;
  onAbort?: () => void;
}

/**
 * Composer - sticky textarea + send button. Auto-grows 1-6 lines.
 * Cmd/Ctrl+Return to send. Shift+Return or plain Return inserts newline.
 */
export function Composer({
  onSend,
  disabled = false,
  placeholder = "Ask Precura anything about your health",
  streaming = false,
  onAbort,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const { ref, resize } = useAutoGrow({ minRows: 1, maxRows: 6, lineHeight: 24 });

  const canSend = value.trim().length > 0 && !disabled && !streaming;

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (canSend) {
        onSend(value);
        setValue("");
        setTimeout(() => resize(), 0);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(value);
    setValue("");
    setTimeout(() => resize(), 0);
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        ref={ref}
        className="composer-input"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
      />
      <div className="composer-actions">
        <span className="composer-hint">Cmd+Return to send</span>
        {streaming && onAbort ? (
          <Button tone="secondary" onClick={onAbort} type="button">
            Stop
          </Button>
        ) : (
          <Button tone="sage" type="submit">
            Send
          </Button>
        )}
      </div>
      <style jsx>{`
        .composer {
          position: sticky;
          bottom: 0;
          background: var(--paper);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-card);
          padding: var(--sp-3) var(--sp-4) var(--sp-3);
          margin-top: var(--sp-4);
          margin-bottom: var(--sp-6);
          box-shadow: var(--shadow-card);
          font-family: var(--font-sans);
        }
        .composer-input {
          width: 100%;
          border: none;
          outline: none;
          resize: none;
          background: transparent;
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: 1.5;
          color: var(--ink);
        }
        .composer-input:disabled {
          color: var(--ink-faint);
        }
        .composer-input::placeholder {
          color: var(--ink-faint);
        }
        .composer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--sp-2);
          padding-top: var(--sp-2);
          border-top: 1px solid var(--line-soft);
        }
        .composer-hint {
          font-size: var(--text-micro);
          color: var(--ink-faint);
          font-family: var(--font-sans);
        }
      `}</style>
    </form>
  );
}
