import React from 'react';
import type { CasePriority } from '@/lib/data/types';

const COLORS: Record<CasePriority, string> = {
  urgent: '#9C3F25',
  normal: '#615C52',
  low: '#9B958A',
};

const LABELS: Record<CasePriority, string> = {
  urgent: 'Urgent',
  normal: 'Normal',
  low: 'Low',
};

export function PriorityDot({ priority, showLabel = true }: { priority: CasePriority; showLabel?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[priority], flexShrink: 0 }} />
      {showLabel && (
        <span
          style={{
            fontSize: 12,
            color: COLORS[priority],
            fontWeight: priority === 'urgent' ? 600 : 500,
          }}
        >
          {LABELS[priority]}
        </span>
      )}
    </span>
  );
}
