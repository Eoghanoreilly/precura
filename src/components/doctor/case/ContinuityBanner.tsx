"use client";

import React from "react";

export type ContinuityEvent = {
  date: string;
  kind: 'doctor-note' | 'new-panel' | 'member-message';
  actor?: string;
  body: string;
};

export function ContinuityBanner({ events }: { events: ContinuityEvent[] }) {
  const dotColor = (k: ContinuityEvent['kind']): string => {
    if (k === 'doctor-note') return '#9e9bdc';
    if (k === 'new-panel') return '#5548c8';
    return '#c46a1a';
  };

  return (
    <div style={{
      background: '#f8f8fb', border: '1px solid #dddaf5', borderRadius: 12,
      padding: '16px 16px 14px', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#5548c8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
        Case continuity
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor(e.kind), marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6b6b8a', marginBottom: 2 }}>
                {e.date}{e.actor ? ` - ${e.actor}` : ''}
              </div>
              <div style={{ fontSize: 12, color: '#2a2a2a', lineHeight: 1.45 }}>
                {e.kind === 'doctor-note' || e.kind === 'member-message' ? <em>&quot;{e.body}&quot;</em> : e.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
