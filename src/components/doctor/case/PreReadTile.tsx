"use client";

import React, { useState } from "react";
import type { PreReadFacts } from "@/lib/doctor/generatePreRead";

export function PreReadTile({ narrative, facts }: { narrative: string; facts: PreReadFacts }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div style={{
      background: '#f2f8f4', border: '1px solid #c0ddc8', borderRadius: 12,
      padding: '16px 18px', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2a7a48', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
            Pre-read summary
          </div>
          <div style={{ fontSize: 13, color: '#1e3d2a', lineHeight: 1.6 }}>{narrative}</div>
        </div>
        <button
          type="button" onClick={() => setShowDetail((v) => !v)}
          style={{
            flexShrink: 0, background: 'transparent', border: '1px solid #2a7a48',
            borderRadius: 8, padding: '6px 13px', fontSize: 12, fontWeight: 600,
            color: '#2a7a48', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}
        >
          {showDetail ? 'Hide detail' : 'Show detail'}
        </button>
      </div>
      {showDetail && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #c0ddc8', fontSize: 12, color: '#1e3d2a', lineHeight: 1.6 }}>
          <div style={{ marginBottom: 6 }}><strong>Panels on file:</strong> {facts.panel_count}</div>
          {facts.consistent_out_of_range.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>Consistently out of range:</strong>
              <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                {facts.consistent_out_of_range.map((m) => (
                  <li key={m.name}>{m.name} {m.direction} range, {m.stable ? 'stable' : 'shifting'} across {m.values.length} panels: {m.values.join(' / ')} {m.unit}</li>
                ))}
              </ul>
            </div>
          )}
          {facts.new_out_of_range.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <strong>New out of range this panel:</strong>
              <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                {facts.new_out_of_range.map((m) => (
                  <li key={m.name}>{m.name} {m.direction} range: {m.value} {m.unit}</li>
                ))}
              </ul>
            </div>
          )}
          {facts.trend_in_range.length > 0 && (
            <div>
              <strong>Within range but trending:</strong>
              <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                {facts.trend_in_range.map((m) => (
                  <li key={m.name}>{m.name} {m.direction} across {m.values.length} panels: {m.values.join(' / ')} {m.unit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
