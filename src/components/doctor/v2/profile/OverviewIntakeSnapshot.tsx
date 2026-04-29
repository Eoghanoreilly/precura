import React from 'react';

// v2.1 follow-up: wire to real intake data once the onboarding schema is finalised.
// Intake data shape depends on in-flight onboarding work (FINDRISC, SCORE2, PHQ-9, GAD-7).
// For v2 Phase 3, this renders placeholder rows matching the mockup.

const TOOLS = [
  { label: 'FINDRISC', description: 'Diabetes risk score', value: 'Not completed' },
  { label: 'SCORE2', description: 'Cardiovascular risk', value: 'Not completed' },
  { label: 'PHQ-9', description: 'Depression screening', value: 'Not completed' },
  { label: 'GAD-7', description: 'Anxiety screening', value: 'Not completed' },
];

export function OverviewIntakeSnapshot() {
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
        Intake snapshot
      </div>

      <div
        style={{
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-soft, #EEE9DB)',
          borderRadius: 10,
          padding: '12px',
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          lineHeight: 1.65,
        }}
      >
        {TOOLS.map((t) => (
          <div key={t.label} style={{ color: 'var(--ink-muted, #615C52)' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink, #1C1A17)' }}>{t.label}</span>
            {' '}
            <span style={{ color: 'var(--ink-faint, #9B958A)', fontSize: 11 }}>({t.description})</span>
            {': '}
            {t.value}
          </div>
        ))}
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: 'var(--ink-faint, #9B958A)',
          }}
        >
          Intake tools available after onboarding is complete.
        </div>
      </div>
    </div>
  );
}
