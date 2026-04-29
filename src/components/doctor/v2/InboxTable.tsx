'use client';

import React, { useState } from 'react';
import type { GroupedInbox, TaskRow } from '@/lib/doctor/v2/inboxGrouping';
import { InboxRow } from './InboxRow';

export type InboxTableProps = {
  grouped: GroupedInbox;
  activeCaseShortId: string | null;
  buildContextLine: (t: TaskRow) => string;
};

export function InboxTable({ grouped, activeCaseShortId, buildContextLine }: InboxTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleSection(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
          gridTemplateColumns: '24px auto 1fr 60px',
          gap: 10,
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
        <div style={{ textAlign: 'right' }}>Due</div>
      </div>

      {sections.map((s) => {
        // Hide empty sections except overdue + today (always shown even empty)
        if (s.rows.length === 0 && s.key !== 'overdue' && s.key !== 'today') return null;

        // Collapse later / noDueDate / doneToday by default; expandable via toggle
        const collapsedByDefault = s.key === 'doneToday' || s.key === 'later' || s.key === 'noDueDate';
        const isOpen = collapsedByDefault ? expanded.has(s.key) : true;

        return (
          <section key={s.key}>
            <div
              onClick={collapsedByDefault && s.rows.length > 0 ? () => toggleSection(s.key) : undefined}
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
                cursor: collapsedByDefault && s.rows.length > 0 ? 'pointer' : 'default',
                userSelect: 'none',
              }}
            >
              {s.label}
              {collapsedByDefault && s.rows.length > 0 && (
                <span
                  style={{
                    marginLeft: 8,
                    color: 'var(--ink-faint, #9B958A)',
                    fontWeight: 500,
                    textTransform: 'none',
                    letterSpacing: 'normal',
                  }}
                >
                  {isOpen ? 'collapse' : `${s.rows.length} item${s.rows.length === 1 ? '' : 's'} - tap to show`}
                </span>
              )}
            </div>
            {isOpen &&
              s.rows.map((row) => (
                <InboxRow
                  key={row.id}
                  task={row}
                  isActive={row.case_id_short === activeCaseShortId}
                  contextLine={buildContextLine(row)}
                />
              ))}
          </section>
        );
      })}
    </div>
  );
}
