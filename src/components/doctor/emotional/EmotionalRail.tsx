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
    <aside style={{
      background: '#fffbf5', border: '1px solid #f0dcc8', borderRadius: 12,
      padding: '18px 18px 16px', fontFamily: 'var(--font-sans)',
    }}>
      <TriggerStrip signal={signal} />
      <VerbatimFeed messages={signal.recentMessages} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button type="button" onClick={dismiss} style={{ background: 'transparent', border: '1px solid #f0dcc8', borderRadius: 999, padding: '4px 12px', fontSize: 11, color: '#c46a1a', cursor: 'pointer', fontFamily: 'inherit' }}>
          Hide context
        </button>
      </div>
    </aside>
  );
}
