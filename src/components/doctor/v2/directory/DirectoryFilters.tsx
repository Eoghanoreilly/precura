'use client';
import React from 'react';
import Link from 'next/link';
import type { PatientState } from '@/lib/doctor/caseStateDerivation';

const FILTERS: Array<{ key: 'all' | PatientState; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'Awaiting you', label: 'Awaiting you' },
  { key: 'Attention', label: 'Attention' },
  { key: 'Awaiting member', label: 'Awaiting member' },
  { key: 'Stable', label: 'Stable' },
  { key: 'Onboarding', label: 'Onboarding' },
  { key: 'Stale 90d', label: 'Stale 90d' },
];

export function DirectoryFilters({ active, counts }: { active: 'all' | PatientState; counts: Record<'all' | PatientState, number> }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11, fontFamily: 'var(--font-sans)' }}>
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        const c = counts[f.key] ?? 0;
        return (
          <Link
            key={f.key}
            href={f.key === 'all' ? '/doctor/patients' : `/doctor/patients?state=${encodeURIComponent(f.key)}`}
            style={{
              background: isActive ? 'var(--ink, #1C1A17)' : (f.key === 'Awaiting you' ? 'var(--terracotta-tint, #FCEFE7)' : 'var(--canvas, #F4EFE3)'),
              color: isActive ? 'var(--paper, #fff)' : (f.key === 'Awaiting you' ? 'var(--terracotta-deep, #9C3F25)' : 'var(--ink-muted, #615C52)'),
              padding: '5px 10px',
              borderRadius: 5,
              fontWeight: isActive || f.key === 'Awaiting you' ? 600 : 500,
              textDecoration: 'none',
            }}
          >
            {f.label} {c > 0 && <span style={{ marginLeft: 4 }}>{c}</span>}
          </Link>
        );
      })}
    </div>
  );
}
