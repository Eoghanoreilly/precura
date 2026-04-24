"use client";

import React from "react";

export type ChooserKind = 'chat-quote' | 'trend' | 'marker-reference';
export type ChooserItem = { id: string; label: string; insertText: string };

export function InsertChipChooser({
  kind, items, onInsert, onClose,
}: { kind: ChooserKind; items: ChooserItem[]; onInsert: (text: string) => void; onClose: () => void }) {
  const title = kind === 'chat-quote' ? 'Pick a chat message'
    : kind === 'trend' ? 'Pick a marker trend'
    : 'Pick a marker reference';

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, marginTop: 6, width: 360,
      background: '#FFFFFF', border: '1px solid #E0D9C8', borderRadius: 12,
      boxShadow: '0 12px 28px rgba(28,26,23,0.12)', padding: '10px 0', zIndex: 20,
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ padding: '4px 14px 8px', fontSize: 10, fontWeight: 700, color: '#615C52', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 260, overflow: 'auto' }}>
        {items.length === 0 ? (
          <li style={{ padding: '10px 14px', color: '#8B8579', fontSize: 13 }}>No items available.</li>
        ) : items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => { onInsert(it.insertText); onClose(); }}
              style={{ width: '100%', textAlign: 'left', padding: '8px 14px', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 13, color: '#1C1A17', cursor: 'pointer' }}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
