'use client';

import React from 'react';
import type { GroupedInbox, TaskRow } from '@/lib/doctor/v2/inboxGrouping';
import { InboxRow } from './InboxRow';

export type InboxTableProps = {
  grouped: GroupedInbox;
  activeCaseShortId: string | null;
  buildContextLine: (t: TaskRow) => string;
};

export function InboxTable({ grouped, activeCaseShortId, buildContextLine }: InboxTableProps) {
  const sections: Array<{
    key: keyof GroupedInbox;
    label: string;
    tint: string;
    rows: TaskRow[];
  }> = [
    {
      key: 'overdue',
      label: `Overdue ${grouped.counts.overdue}`,
      tint: 'var(--terracotta-tint, #FCEFE7)',
      rows: grouped.overdue,
    },
    {
      key: 'today',
      label: `Today ${grouped.counts.today}`,
      tint: 'var(--canvas-soft, #FDFBF6)',
      rows: grouped.today,
    },
    {
      key: 'thisWeek',
      label: `This week ${grouped.counts.thisWeek}`,
      tint: 'var(--canvas-soft, #FDFBF6)',
      rows: grouped.thisWeek,
    },
    {
      key: 'later',
      label: `Later ${grouped.counts.later}`,
      tint: 'var(--canvas-soft, #FDFBF6)',
      rows: grouped.later,
    },
    {
      key: 'noDueDate',
      label: `No due date ${grouped.counts.noDueDate}`,
      tint: 'var(--canvas-soft, #FDFBF6)',
      rows: grouped.noDueDate,
    },
    {
      key: 'doneToday',
      label: `Done today ${grouped.counts.doneToday}`,
      tint: 'var(--sage-tint, #E5EDE7)',
      rows: grouped.doneToday,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
      {/* Column header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '32px auto 1fr 110px 88px 88px',
          gap: 14,
          padding: '8px 18px',
          background: 'var(--canvas-soft, #FDFBF6)',
          borderBottom: '1px solid var(--line-soft, #EEE9DB)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--ink-faint, #9B958A)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        <div></div>
        <div></div>
        <div>Patient + case</div>
        <div>Kind</div>
        <div>Priority</div>
        <div style={{ textAlign: 'right' }}>Due</div>
      </div>

      {sections.map((s) => {
        // Hide empty sections except overdue + today (always shown even empty)
        if (s.rows.length === 0 && s.key !== 'overdue' && s.key !== 'today') return null;

        // Collapse later / noDueDate / doneToday by default
        const collapsed = s.key === 'doneToday' || s.key === 'later' || s.key === 'noDueDate';

        return (
          <section key={s.key}>
            <div
              style={{
                padding: '12px 18px 6px',
                background: s.tint,
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontWeight: 700,
                color:
                  s.key === 'overdue'
                    ? 'var(--terracotta-deep, #9C3F25)'
                    : s.key === 'doneToday'
                      ? 'var(--sage-deep, #445A4A)'
                      : 'var(--ink-faint, #9B958A)',
              }}
            >
              {s.label}
              {collapsed && s.rows.length > 0 && (
                <span
                  style={{
                    marginLeft: 8,
                    color: 'var(--ink-faint, #9B958A)',
                    fontWeight: 500,
                    textTransform: 'none',
                    letterSpacing: 'normal',
                  }}
                >
                  (collapsed)
                </span>
              )}
            </div>
            {!collapsed &&
              s.rows.map((row) => (
                <InboxRow
                  key={row.id}
                  task={row}
                  isActive={row.case_id_short === activeCaseShortId}
                  contextLine={buildContextLine(row)}
                />
              ))}
            {collapsed && s.rows.length > 0 && (
              <div
                style={{
                  padding: '6px 18px 12px',
                  fontSize: 11,
                  color: 'var(--ink-faint, #9B958A)',
                  background: s.tint,
                }}
              >
                {s.rows.length} item{s.rows.length === 1 ? '' : 's'}. Click to expand.
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
