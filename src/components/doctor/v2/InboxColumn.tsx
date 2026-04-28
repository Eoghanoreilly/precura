'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import type { TaskRow, GroupedInbox } from '@/lib/doctor/v2/inboxGrouping';
import { groupTasksByDue } from '@/lib/doctor/v2/inboxGrouping';
import { InboxSmartLists, type SmartListKey } from './InboxSmartLists';
import { InboxFilterBar } from './InboxFilterBar';
import { InboxTable } from './InboxTable';

export type InboxColumnProps = {
  tasks: TaskRow[];
  todayLabel: string; // e.g. "Friday, 25 April"
};

export function InboxColumn({ tasks, todayLabel }: InboxColumnProps) {
  const search = useSearchParams();
  const activeList = (search?.get('list') ?? 'all') as SmartListKey;
  const kindFilter = search?.get('kind') ?? 'all';
  const priorityFilter = search?.get('priority') ?? 'all';
  const activeCase = search?.get('case');

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      if (kindFilter !== 'all' && t.kind !== kindFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, kindFilter, priorityFilter]);

  const grouped: GroupedInbox = React.useMemo(() => groupTasksByDue(filtered, new Date()), [filtered]);

  // Apply smart-list narrowing on top of grouped buckets
  const visibleGroup = React.useMemo<GroupedInbox>(() => {
    if (activeList === 'all') return grouped;
    const empty: TaskRow[] = [];
    if (activeList === 'overdue')
      return { ...grouped, today: empty, thisWeek: empty, later: empty, noDueDate: empty, doneToday: empty };
    if (activeList === 'today')
      return { ...grouped, overdue: empty, thisWeek: empty, later: empty, noDueDate: empty, doneToday: empty };
    if (activeList === 'this-week')
      return { ...grouped, overdue: empty, today: empty, later: empty, noDueDate: empty, doneToday: empty };
    return grouped;
  }, [grouped, activeList]);

  const counts = grouped.counts;

  // Compute all-open total (sum of open buckets, excluding doneToday)
  const allOpenCount =
    counts.overdue + counts.today + counts.thisWeek + counts.later + counts.noDueDate;

  const byKind = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of grouped.overdue.concat(grouped.today, grouped.thisWeek, grouped.later, grouped.noDueDate)) {
      m[t.kind] = (m[t.kind] ?? 0) + 1;
    }
    return m;
  }, [grouped]);

  const triage = buildTriage(grouped);

  const heroLabel =
    activeList === 'overdue'
      ? `Overdue ${counts.overdue}`
      : activeList === 'today'
        ? `Today ${counts.today}`
        : activeList === 'this-week'
          ? `This week ${counts.thisWeek}`
          : `Inbox ${allOpenCount}`;

  const totalShowing =
    visibleGroup.overdue.length +
    visibleGroup.today.length +
    visibleGroup.thisWeek.length +
    visibleGroup.later.length +
    visibleGroup.noDueDate.length;

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <header style={{ padding: '24px 18px 12px' }}>
        <div
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-faint, #9B958A)',
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {todayLabel}
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--ink, #1C1A17)',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {heroLabel}
        </h1>
        {triage && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--ink-muted, #615C52)',
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.5,
              maxWidth: 560,
            }}
          >
            {triage}
          </p>
        )}
      </header>

      <InboxSmartLists
        active={activeList}
        counts={{
          all: allOpenCount,
          overdue: counts.overdue,
          today: counts.today,
          thisWeek: counts.thisWeek,
        }}
        byKind={byKind}
      />

      <InboxFilterBar total={allOpenCount} showing={totalShowing} />

      <InboxTable
        grouped={visibleGroup}
        activeCaseShortId={activeCase ?? null}
        buildContextLine={buildContextLine}
      />
    </div>
  );
}

function buildContextLine(t: TaskRow): string {
  const flagPart =
    t.flag_count > 0 ? `${t.flag_count} flagged marker${t.flag_count === 1 ? '' : 's'}` : '';
  const kindPart =
    ({
      review_panel: 'Panel review',
      reply_message: 'Member reply pending',
      write_note: 'Note to write',
      order_test: 'Test to order',
      send_referral: 'Referral to send',
      schedule_consult: 'Consult to schedule',
      consult_prep: 'Consult prep',
      write_training_plan: 'Training plan to write',
      followup_check: 'Follow-up check',
      checkin_outreach: 'Check in with member',
      review_intake: 'Intake to review',
      custom: 'Custom task',
    } as Record<string, string>)[t.kind] ?? 'Task';
  return [kindPart, flagPart].filter(Boolean).join(' / ');
}

function buildTriage(g: GroupedInbox): string | null {
  if (g.counts.overdue === 0 && g.counts.today === 0) return null;
  const parts: string[] = [];
  if (g.counts.overdue > 0) parts.push(`${g.counts.overdue} overdue`);
  if (g.counts.today > 0) parts.push(`${g.counts.today} due today`);
  return parts.join(' / ') + '.';
}
