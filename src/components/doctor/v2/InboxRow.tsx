'use client';

import React from 'react';
import Link from 'next/link';
import type { TaskRow } from '@/lib/doctor/v2/inboxGrouping';
import { Avatar } from './Avatar';
import { PriorityDot } from './PriorityDot';

const KIND_CHIPS: Record<string, string> = {
  review_panel: 'Review',
  reply_message: 'Reply',
  write_note: 'Note',
  order_test: 'Order',
  send_referral: 'Referral',
  schedule_consult: 'Consult',
  consult_prep: 'Prep',
  write_training_plan: 'Training plan',
  followup_check: 'Follow-up',
  checkin_outreach: 'Check-in',
  review_intake: 'Intake',
  custom: 'Task',
};

export type InboxRowProps = {
  task: TaskRow;
  isActive: boolean;
  contextLine: string; // one-liner derived server- or client-side
};

export function InboxRow({ task, isActive, contextLine }: InboxRowProps) {
  const initials = (task.patient_display_name || '??')
    .split(/\s+/)
    .map((s) => s[0] ?? '')
    .slice(0, 2)
    .join('');

  return (
    <Link
      href={`/doctor?case=${task.case_id_short}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px auto 1fr 110px 88px 88px',
        gap: 14,
        padding: '14px 18px',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        alignItems: 'center',
        background: isActive ? 'var(--canvas-soft, #FDFBF6)' : 'transparent',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: 'var(--font-sans)',
        minHeight: 64,
      }}
      aria-current={isActive ? 'true' : undefined}
    >
      <span
        aria-hidden
        style={{ width: 18, height: 18, border: '1.5px solid var(--line-card, #C4BDB0)', borderRadius: '50%' }}
      />
      <Avatar initials={initials} patientId={task.patient_id} size="sm" />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ink, #1C1A17)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {task.patient_display_name}{' '}
          <span style={{ color: 'var(--ink-faint, #9B958A)', fontWeight: 400 }}>/ {task.case_title}</span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--ink-muted, #615C52)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {contextLine}
        </div>
      </div>
      <span
        style={{
          background: 'var(--canvas, #F4EFE3)',
          color: 'var(--ink-muted, #615C52)',
          fontSize: 11,
          padding: '3px 8px',
          borderRadius: 4,
          fontWeight: 600,
          justifySelf: 'start',
        }}
      >
        {KIND_CHIPS[task.kind] ?? task.kind}
      </span>
      <span style={{ justifySelf: 'start' }}>
        <PriorityDot priority={task.priority} />
      </span>
      <DueLabel dueAt={task.due_at} />
    </Link>
  );
}

function DueLabel({ dueAt }: { dueAt: string | null }) {
  if (!dueAt)
    return (
      <span style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', textAlign: 'right' }}>no due</span>
    );

  const due = new Date(dueAt);
  const now = new Date();
  const ms = due.getTime() - now.getTime();
  const days = Math.round(ms / 86_400_000);
  const overdue = ms < 0;

  let label: string;
  if (overdue) {
    const od = Math.abs(days);
    label = od === 0 ? 'today' : `${od}d late`;
  } else if (days === 0) {
    const hours = Math.round(ms / 3_600_000);
    label = hours <= 0 ? 'now' : hours <= 12 ? `${hours}h` : 'today';
  } else if (days === 1) {
    label = 'tomorrow';
  } else if (days <= 6) {
    label = `${days}d`;
  } else {
    label = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  return (
    <span
      style={{
        fontSize: 12,
        color: overdue ? 'var(--terracotta-deep, #9C3F25)' : 'var(--ink-muted, #615C52)',
        fontWeight: overdue ? 700 : 600,
        textAlign: 'right',
        justifySelf: 'end',
      }}
    >
      {label}
    </span>
  );
}
