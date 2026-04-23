"use client";

import React from "react";

/**
 * BlinkingCursor - inline cursor appended at the end of a streaming assistant
 * message until the stream completes.
 */
export function BlinkingCursor() {
  return (
    <span className="cursor" aria-hidden="true">
      |
      <style jsx>{`
        .cursor {
          display: inline-block;
          width: 2px;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
          color: var(--ink-muted);
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
