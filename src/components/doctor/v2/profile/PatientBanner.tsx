'use client';

import React from 'react';
import { Avatar } from '@/components/doctor/v2/Avatar';
import type { PatientProfileData } from '@/lib/doctor/v2/patientProfileQueries';

function pillStyle(variant: 'sand' | 'sage' | 'terracotta' | 'muted'): React.CSSProperties {
  const map = {
    sand:       { background: '#F4EFE3', color: '#615C52' },
    sage:       { background: '#E5EDE7', color: '#445A4A' },
    terracotta: { background: '#FCEFE7', color: '#9C3F25' },
    muted:      { background: '#F4EFE3', color: '#615C52' },
  };
  const c = map[variant];
  return {
    ...c,
    padding: '2px 10px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    lineHeight: 1.6,
  };
}

function memberSinceLabel(createdAt: string): string {
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return '';
  return `Member since ${d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
}

function tierLabel(tier: string): string {
  if (tier === 'plus') return 'Plus tier';
  if (tier === 'paused') return 'Paused';
  return 'Standard tier';
}

export function PatientBanner({ data }: { data: PatientProfileData }) {
  const { patient, activeCases } = data;
  const nameParts = patient.display_name.trim().split(/\s+/);
  const initials = nameParts.map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase() || '??';

  const openTaskCount = activeCases.reduce((acc, c) => acc + (c.status === 'new' || c.status === 'in_progress' ? 1 : 0), 0);

  return (
    <div
      style={{
        padding: '24px 28px',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 18,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Avatar initials={initials} patientId={patient.id} size="lg" />

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--ink, #1C1A17)',
            letterSpacing: '-0.02em',
            margin: 0,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {patient.display_name}
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 8,
            alignItems: 'center',
          }}
        >
          <span style={pillStyle('sand')}>{tierLabel(patient.tier)}</span>
          <span style={{ ...pillStyle('muted'), fontWeight: 400 }}>{memberSinceLabel(patient.created_at)}</span>
          {activeCases.length > 0 && (
            <span style={pillStyle('terracotta')}>
              {activeCases.length} active case{activeCases.length !== 1 ? 's' : ''}
            </span>
          )}
          {openTaskCount > 0 && (
            <span style={pillStyle('terracotta')}>
              {openTaskCount} open task{openTaskCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          type="button"
          disabled
          title="Coming in v2.1"
          style={{
            background: 'var(--ink, #1C1A17)',
            color: '#fff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'not-allowed',
            opacity: 0.45,
            fontFamily: 'var(--font-sans)',
          }}
        >
          Open new case
        </button>
        <button
          type="button"
          disabled
          title="Coming in v2.1"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft, #E0D9C8)',
            color: 'var(--ink, #1C1A17)',
            padding: '8px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'not-allowed',
            opacity: 0.45,
            fontFamily: 'var(--font-sans)',
          }}
        >
          Message
        </button>
        <button
          type="button"
          disabled
          title="Coming in v2.1"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft, #E0D9C8)',
            color: 'var(--ink, #1C1A17)',
            padding: '8px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'not-allowed',
            opacity: 0.45,
            fontFamily: 'var(--font-sans)',
          }}
        >
          Schedule consult
        </button>
        <button
          type="button"
          disabled
          title="Coming in v2.1"
          style={{
            background: '#fff',
            border: '1px solid var(--line-soft, #E0D9C8)',
            color: 'var(--ink-muted, #615C52)',
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'not-allowed',
            opacity: 0.45,
            fontFamily: 'var(--font-sans)',
          }}
        >
          More
        </button>
      </div>
    </div>
  );
}
