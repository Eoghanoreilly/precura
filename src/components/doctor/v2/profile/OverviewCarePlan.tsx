import React from 'react';

// v2.1 follow-up: wire to real care plan schema when the plan fields table is defined.
// For v2 Phase 3, this renders placeholder structure matching the mockup.

export function OverviewCarePlan() {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Diet', value: 'No plan set' },
    { label: 'Supplements', value: 'None prescribed' },
    { label: 'Training', value: 'Not enrolled' },
    { label: 'Next check', value: 'Not scheduled' },
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
          fontFamily: 'var(--font-sans)',
        }}
      >
        Care plan
      </div>

      <div
        style={{
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-soft, #EEE9DB)',
          borderRadius: 10,
          padding: '12px',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--ink, #1C1A17)',
        }}
      >
        {rows.map((r, i) => (
          <div key={r.label} style={{ marginTop: i > 0 ? 4 : 0 }}>
            <strong style={{ fontWeight: 600 }}>{r.label}:</strong>{' '}
            <span style={{ color: 'var(--ink-muted, #615C52)' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
