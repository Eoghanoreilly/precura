"use client";

import React from "react";
import type { EmotionalSignal } from "@/lib/doctor/evaluateEmotionalSignal";

export function TriggerStrip({ signal }: { signal: EmotionalSignal }) {
  const worryChips = Object.entries(signal.worryWordHits)
    .filter(([, count]) => (count ?? 0) > 0)
    .map(([word, count]) => `${word} (${count})`);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#c46a1a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Emotional signal</div>
        <div style={{ background: '#fdf0e4', border: '1px solid #f0dcc8', borderRadius: 8, padding: '3px 9px', fontSize: 11, color: '#c46a1a', fontWeight: 600 }}>
          {signal.messageCount7d} msgs / 7 days
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {signal.nightCount > 0 && (
          <div style={{ fontSize: 12, color: '#7a5030', background: '#fdf0e4', borderRadius: 6, padding: '4px 9px' }}>{signal.nightCount} after 22:00</div>
        )}
        {worryChips.map((c) => (
          <div key={c} style={{ fontSize: 12, color: '#7a5030', background: '#fdf0e4', borderRadius: 6, padding: '4px 9px' }}>{c}</div>
        ))}
      </div>
    </div>
  );
}
