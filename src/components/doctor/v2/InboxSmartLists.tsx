'use client';

import React from 'react';
import Link from 'next/link';
import type { TaskKind } from '@/lib/data/types';

export type SmartListKey = 'all' | 'overdue' | 'today' | 'this-week';

export type SmartListCounts = {
  all: number;
  overdue: number;
  today: number;
  thisWeek: number;
};

export type ByKindCounts = Partial<Record<TaskKind, number>>;

export type SavedViewKey = 'awaiting-member' | 'emotional-signals' | 'closing-this-month';

export type InboxSmartListsProps = {
  active: SmartListKey;
  counts: SmartListCounts;
  byKind: ByKindCounts;
  // savedViews are placeholder - queries land in Phase 6
  savedViews?: Array<{ key: SavedViewKey; label: string; count: number }>;
};

const KIND_LABELS: Partial<Record<TaskKind, string>> = {
  review_panel: 'Reviews',
  reply_message: 'Replies',
  order_test: 'Orders',
  schedule_consult: 'Consults',
  send_referral: 'Referrals',
  write_training_plan: 'Training plans',
};

export function InboxSmartLists({ active, counts, byKind, savedViews = [] }: InboxSmartListsProps) {
  return (
    <nav aria-label="Inbox lists" style={{ padding: '16px 14px', fontFamily: 'var(--font-sans)' }}>
      <SectionLabel>Smart lists</SectionLabel>
      <ListItem href="/doctor?list=overdue" active={active === 'overdue'} count={counts.overdue} dotColor="#9C3F25" label="Overdue" />
      <ListItem href="/doctor?list=today" active={active === 'today'} count={counts.today} dotColor="#615C52" label="Today" />
      <ListItem href="/doctor?list=this-week" active={active === 'this-week'} count={counts.thisWeek} dotColor="#9B958A" label="This week" />
      <ListItem href="/doctor?list=all" active={active === 'all'} count={counts.all} dotColor="#445A4A" label="All open" />

      {Object.keys(byKind).length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 18 }}>By kind</SectionLabel>
          {(Object.keys(byKind) as TaskKind[])
            .filter((k) => KIND_LABELS[k] && (byKind[k] ?? 0) > 0)
            .map((k) => (
              <ListItem
                key={k}
                href={`/doctor?list=all&kind=${k}`}
                active={false}
                count={byKind[k] ?? 0}
                label={KIND_LABELS[k] ?? k}
              />
            ))}
        </>
      )}

      {savedViews.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 18 }}>Saved views</SectionLabel>
          {savedViews.map((v) => (
            <ListItem key={v.key} href={`/doctor?view=${v.key}`} active={false} count={v.count} label={v.label} />
          ))}
        </>
      )}
    </nav>
  );
}

function SectionLabel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: 'var(--ink-faint, #9B958A)',
        fontWeight: 700,
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ListItem({
  href,
  active,
  count,
  label,
  dotColor,
}: {
  href: string;
  active: boolean;
  count: number;
  label: string;
  dotColor?: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        borderRadius: 6,
        background: active ? 'var(--paper, #fff)' : 'transparent',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
        marginBottom: 2,
        fontSize: 13,
        color: active ? 'var(--ink, #1C1A17)' : 'var(--ink-muted, #615C52)',
        fontWeight: active ? 600 : 500,
        textDecoration: 'none',
      }}
    >
      {dotColor && (
        <span
          aria-hidden
          style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }}
        />
      )}
      <span style={{ flex: 1 }}>{label}</span>
      <span
        style={{
          fontSize: 11,
          color: count > 0 ? 'inherit' : 'var(--ink-faint, #9B958A)',
          fontWeight: count > 0 ? 700 : 400,
        }}
      >
        {count}
      </span>
    </Link>
  );
}
