'use client';
import React from 'react';
import type { CaseEvent } from '@/lib/data/types';

const KIND_LABELS: Record<CaseEvent['kind'], string> = {
  status_changed: 'Status changed',
  opened_by_doctor: 'Opened by doctor',
  note_posted: 'Note posted',
  task_completed: 'Task completed',
  order_placed: 'Order placed',
  referral_sent: 'Referral sent',
  consult_completed: 'Consult completed',
  member_acted: 'Member acted',
  followup_fired: 'Follow-up fired',
  linked: 'Linked',
  commented: 'Commented',
};

export function CaseActivityFeed({ events, doctorName }: { events: CaseEvent[]; doctorName: string }) {
  if (events.length === 0) {
    return null;
  }
  return (
    <section style={{ padding: '8px 24px 18px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        Activity
      </div>
      <div style={{ borderLeft: '2px solid var(--line-soft, #EEE9DB)', paddingLeft: 12, fontSize: 12, lineHeight: 1.6, color: 'var(--ink-muted, #615C52)' }}>
        {events.map((e) => (
          <div key={e.id} style={{ marginTop: 6 }}>
            <strong style={{ color: 'var(--ink, #1C1A17)' }}>{e.actor_id ? doctorName.split(/\s+/)[0] : 'System'}</strong>{' '}
            {summarize(e)}
            <span style={{ marginLeft: 6, color: 'var(--ink-faint, #9B958A)' }}>{relTime(e.occurred_at)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function summarize(e: CaseEvent): string {
  if (e.kind === 'status_changed') {
    const from = (e.payload as { from?: string | null })?.from;
    const to = (e.payload as { to?: string }).to;
    return `changed status${from ? ` from ${from}` : ''} to ${to}`;
  }
  return KIND_LABELS[e.kind].toLowerCase();
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
