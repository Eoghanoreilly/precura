'use client';
import React from 'react';
import type { CaseCategory } from '@/lib/data/types';

const CATEGORY_LABELS: Record<CaseCategory, string> = {
  panel_review: 'Panel review',
  consultation: 'Consultation',
  coaching: 'Coaching',
  treatment_followup: 'Treatment follow-up',
  onboarding: 'Onboarding',
  referral_followup: 'Referral follow-up',
};

export function CaseToolbar({
  caseIdShort,
  category,
  watchers,
  openedAt,
}: {
  caseIdShort: string;
  category: CaseCategory;
  watchers: number;
  openedAt: string;
}) {
  return (
    <div
      style={{
        padding: '10px 24px',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontSize: 11,
        color: 'var(--ink-faint, #9B958A)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <span style={{ fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, monospace" }}>{caseIdShort}</span>
      <span aria-hidden>/</span>
      <span style={{ color: 'var(--sage-deep, #445A4A)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
        {CATEGORY_LABELS[category]}
      </span>
      <span style={{ marginLeft: 'auto' }}>
        Watchers: {watchers} / Created {new Date(openedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
      </span>
    </div>
  );
}
