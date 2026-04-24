"use client";

import React from "react";
import type { EmotionalMessage } from "@/lib/doctor/evaluateEmotionalSignal";

export function VerbatimFeed({ messages }: { messages: EmotionalMessage[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-sans)' }}>
      {messages.map((m, i) => {
        const dt = new Date(m.created_at);
        const isRecent = i === 0;
        return (
          <div key={`${m.created_at}-${i}`} style={{ background: '#ffffff', border: '1px solid #ede8e0', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: isRecent ? '#c46a1a' : '#8a6a50', marginBottom: 3, fontFamily: 'var(--font-mono)' }}>
              {dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {String(dt.getHours()).padStart(2, '0')}:{String(dt.getMinutes()).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 13, color: '#2a2a2a', lineHeight: 1.5 }}>&quot;{m.content}&quot;</div>
          </div>
        );
      })}
    </div>
  );
}
