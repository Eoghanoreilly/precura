'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { TaskKind, CasePriority } from '@/lib/data/types';

const KIND_OPTIONS: Array<{ value: TaskKind | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'review_panel', label: 'Reviews' },
  { value: 'reply_message', label: 'Replies' },
  { value: 'order_test', label: 'Orders' },
  { value: 'schedule_consult', label: 'Consults' },
  { value: 'send_referral', label: 'Referrals' },
  { value: 'write_training_plan', label: 'Training plans' },
  { value: 'followup_check', label: 'Follow-ups' },
];

const PRIORITY_OPTIONS: Array<{ value: CasePriority | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'due-asc', label: 'Due asc' },
  { value: 'due-desc', label: 'Due desc' },
  { value: 'created-desc', label: 'Newest first' },
];

export type InboxFilterBarProps = {
  total: number;
  showing: number;
};

export function InboxFilterBar({ total, showing }: InboxFilterBarProps) {
  const search = useSearchParams();
  const kind = search?.get('kind') ?? 'all';
  const priority = search?.get('priority') ?? 'all';
  const sort = search?.get('sort') ?? 'due-asc';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderTop: '1px solid var(--line-soft, #EEE9DB)',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        background: 'var(--canvas-soft, #FDFBF6)',
        gap: 8,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>
        <FilterDropdown
          label={`Kind: ${KIND_OPTIONS.find((o) => o.value === kind)?.label ?? 'All'}`}
          options={KIND_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
          paramName="kind"
          current={kind}
          search={search}
        />
        <FilterDropdown
          label={`Priority: ${PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ?? 'All'}`}
          options={PRIORITY_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
          paramName="priority"
          current={priority}
          search={search}
        />
        <FilterDropdown
          label={`Sort: ${SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Due asc'}`}
          options={SORT_OPTIONS}
          paramName="sort"
          current={sort}
          search={search}
        />
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>
        {showing} of {total} open
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  paramName,
  current,
  search,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  paramName: string;
  current: string;
  search: ReturnType<typeof useSearchParams>;
}) {
  return (
    <details style={{ position: 'relative' }}>
      <summary
        style={{
          listStyle: 'none',
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-card, #E0D9C8)',
          padding: '4px 10px',
          borderRadius: 5,
          cursor: 'pointer',
          fontSize: 11,
        }}
      >
        {label}
      </summary>
      <ul
        style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          listStyle: 'none',
          padding: '4px 0',
          margin: 0,
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-card, #E0D9C8)',
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          minWidth: 160,
          zIndex: 10,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {options.map((o) => {
          const isActive = o.value === current;
          return (
            <li key={o.value}>
              <Link
                href={buildHref(search, paramName, o.value)}
                style={{
                  display: 'block',
                  padding: '6px 12px',
                  fontSize: 12,
                  color: isActive ? 'var(--terracotta-deep, #9C3F25)' : 'var(--ink, #1C1A17)',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                }}
              >
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

// Merge a single param into the current search params so other filters are preserved.
function buildHref(search: ReturnType<typeof useSearchParams>, paramName: string, value: string): string {
  const params = new URLSearchParams(search?.toString() ?? '');
  params.set(paramName, value);
  return `?${params.toString()}`;
}
