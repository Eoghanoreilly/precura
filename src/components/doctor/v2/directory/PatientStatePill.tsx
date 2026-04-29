import React from 'react';
import type { PatientState } from '@/lib/doctor/caseStateDerivation';

const STYLES: Record<PatientState, { bg: string; fg: string }> = {
  'Awaiting you': { bg: 'var(--terracotta-deep, #9C3F25)', fg: '#fff' },
  'Attention': { bg: 'var(--terracotta-tint, #FFF6EE)', fg: 'var(--terracotta-deep, #9C3F25)' },
  'Awaiting member': { bg: '#F4F1E9', fg: 'var(--ink-muted, #615C52)' },
  'Onboarding': { bg: 'var(--canvas, #F4EFE3)', fg: 'var(--ink-muted, #615C52)' },
  'Routine': { bg: 'var(--canvas, #F4EFE3)', fg: 'var(--ink-muted, #615C52)' },
  'Stable': { bg: 'var(--sage-tint, #E5EDE7)', fg: 'var(--sage-deep, #445A4A)' },
  'Stale 90d': { bg: 'var(--canvas, #F4EFE3)', fg: 'var(--ink-faint, #9B958A)' },
};

export function PatientStatePill({ state, secondary }: { state: PatientState; secondary?: string }) {
  const s = STYLES[state];
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, fontFamily: 'var(--font-sans)' }}>
      <span style={{ background: s.bg, color: s.fg, padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 600 }}>
        {state}
      </span>
      {secondary && <span style={{ fontSize: 10, color: s.fg, fontWeight: 600 }}>{secondary}</span>}
    </span>
  );
}
