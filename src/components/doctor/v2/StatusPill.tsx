import React from 'react';
import type { CaseStatus } from '@/lib/data/types';

const STYLES: Record<CaseStatus, { bg: string; fg: string }> = {
  new:              { bg: '#FCEFE7', fg: '#9C3F25' },
  in_progress:      { bg: '#FFF6EE', fg: '#9C3F25' },
  replied:          { bg: '#E5EDE7', fg: '#445A4A' },
  awaiting_member:  { bg: '#F4F1E9', fg: '#615C52' },
  on_hold:          { bg: '#F4EFE3', fg: '#615C52' },
  closed:           { bg: '#F4EFE3', fg: '#615C52' },
};

const LABELS: Record<CaseStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  replied: 'Replied',
  awaiting_member: 'Awaiting member',
  on_hold: 'On hold',
  closed: 'Closed',
};

export function StatusPill({ status, secondary }: { status: CaseStatus; secondary?: string }) {
  const s = STYLES[status];
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      <span
        style={{
          background: s.bg,
          color: s.fg,
          padding: '3px 9px',
          borderRadius: 5,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.01em',
        }}
      >
        {LABELS[status]}
      </span>
      {secondary && (
        <span style={{ fontSize: 10, color: s.fg, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
          {secondary}
        </span>
      )}
    </span>
  );
}
