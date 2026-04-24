"use client";

import React, { useCallback } from "react";
import type { EmotionalSignal } from "@/lib/doctor/evaluateEmotionalSignal";
import { TriggerStrip } from "./TriggerStrip";
import { VerbatimFeed } from "./VerbatimFeed";

export function EmotionalRail({
  signal, memberId, wasAutoTriggered, onDismiss,
}: { signal: EmotionalSignal; memberId: string; wasAutoTriggered: boolean; onDismiss: () => void }) {
  const dismiss = useCallback(async () => {
    await fetch('/api/emotional-rail/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, action: 'dismissed', wasAutoTriggered }),
    });
    onDismiss();
  }, [memberId, wasAutoTriggered, onDismiss]);

  return (
    <aside
      style={{
        background: '#fffbf5',
        border: '1px solid #f0dcc8',
        borderRadius: 14,
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 2px rgba(28,26,23,0.04), 0 12px 28px rgba(28,26,23,0.06)',
      }}
    >
      {/* Tray header */}
      <div
        style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid #f0dcc8',
          background: 'linear-gradient(180deg, #fdf0e4, #fffbf5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9C3F25',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 4,
            }}
          >
            Emotional signal
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1A17', letterSpacing: '-0.01em' }}>
            Tone context
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide context"
          style={{
            background: '#FFFFFF',
            border: '1px solid #f0dcc8',
            borderRadius: 999,
            padding: '4px 12px',
            fontSize: 11,
            fontWeight: 600,
            color: '#c46a1a',
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Hide
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', overflowY: 'auto' }}>
        <TriggerStrip signal={signal} />
        <VerbatimFeed messages={signal.recentMessages} />
      </div>
    </aside>
  );
}
