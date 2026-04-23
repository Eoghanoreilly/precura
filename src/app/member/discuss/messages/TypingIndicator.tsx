"use client";

import React from "react";

/**
 * TypingIndicator - three-dot loading indicator shown while waiting for the
 * first token of an assistant response. Replaced by streaming text once the
 * first chunk arrives.
 */
export function TypingIndicator() {
  return (
    <div className="typing" aria-label="Precura is thinking">
      <span className="dot" />
      <span className="dot d1" />
      <span className="dot d2" />
      <style jsx>{`
        .typing {
          display: inline-flex;
          gap: 4px;
          padding: var(--sp-2) 0;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink-faint);
          animation: bounce 1.1s infinite;
        }
        .d1 { animation-delay: 0.15s; }
        .d2 { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
