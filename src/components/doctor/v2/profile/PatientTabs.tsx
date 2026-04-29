'use client';

import React from 'react';
import Link from 'next/link';

type TabDef = {
  key: string;
  label: string;
  count?: number;
};

const TABS: TabDef[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'cases', label: 'Cases' },
  { key: 'panels', label: 'Panels' },
  { key: 'messages', label: 'Messages' },
  { key: 'notes', label: 'Notes' },
  { key: 'plan', label: 'Plan' },
  { key: 'intake', label: 'Intake' },
  { key: 'billing', label: 'Billing' },
];

export function PatientTabs({
  activeTab,
  patientId,
  counts,
}: {
  activeTab: string;
  patientId: string;
  counts: { cases: number; panels: number; notes: number };
}) {
  const countMap: Record<string, number | undefined> = {
    cases: counts.cases || undefined,
    panels: counts.panels || undefined,
    notes: counts.notes || undefined,
  };

  return (
    <div
      style={{
        padding: '0 28px',
        background: 'var(--paper, #fff)',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        display: 'flex',
        gap: 0,
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        overflowX: 'auto',
      }}
    >
      {TABS.map(({ key, label }) => {
        const isActive = activeTab === key;
        const count = countMap[key];
        return (
          <Link
            key={key}
            href={`/doctor/patient/${patientId}?tab=${key}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '14px 14px',
              borderBottom: isActive ? '2px solid var(--terracotta, #C9573A)' : '2px solid transparent',
              color: isActive ? 'var(--terracotta-deep, #9C3F25)' : 'var(--ink-muted, #615C52)',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              marginBottom: -1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'color 0.1s',
            }}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--ink-faint, #9B958A)',
                  fontWeight: 400,
                }}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
