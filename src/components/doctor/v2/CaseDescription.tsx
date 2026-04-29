'use client';
import React from 'react';
import type { CaseWorkspaceData } from '@/lib/doctor/v2/caseWorkspaceQueries';

export function CaseDescription({ data }: { data: CaseWorkspaceData }) {
  const flaggedTiles = (data.panel?.biomarkers ?? [])
    .filter((b) => b.status === 'abnormal' || b.status === 'borderline')
    .slice(0, 3);

  return (
    <section style={{ padding: '18px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        Description
      </div>
      <div
        style={{
          background: 'var(--canvas-soft, #FDFBF6)',
          border: '1px solid var(--line-soft, #EEE9DB)',
          borderRadius: 8,
          padding: '14px 16px',
        }}
      >
        {data.case.summary ? (
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink, #1C1A17)', margin: 0 }}>
            {data.case.summary}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--ink-muted, #615C52)', margin: 0, fontStyle: 'italic' }}>
            Precura summary will be generated when you open the case for the first time.
          </p>
        )}

        {flaggedTiles.length > 0 && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: `repeat(${flaggedTiles.length}, minmax(0,1fr))`, gap: 8 }}>
            {flaggedTiles.map((b) => (
              <div key={b.short_name} style={{ background: 'var(--terracotta-tint, #FFF6EE)', border: '1px solid var(--terracotta-soft, #EFB59B)', borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--terracotta-deep, #9C3F25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {b.status === 'abnormal' ? 'Out of range' : 'Borderline'}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink, #1C1A17)', marginTop: 2 }}>
                  {b.value} <span style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)', fontWeight: 400 }}>{b.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>{b.short_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
