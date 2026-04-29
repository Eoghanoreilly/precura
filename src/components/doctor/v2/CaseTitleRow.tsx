'use client';
import React from 'react';
import type { CaseStatus } from '@/lib/data/types';

const FLOW: CaseStatus[] = ['new', 'in_progress', 'replied', 'awaiting_member', 'closed'];

export function CaseTitleRow({
  title,
  status,
  onChangeStatus,
  onAssign,
  onAddSubtask,
  onLinkCase,
}: {
  title: string;
  status: CaseStatus;
  onChangeStatus?: (next: CaseStatus) => void;
  onAssign?: () => void;
  onAddSubtask?: () => void;
  onLinkCase?: () => void;
}) {
  return (
    <div
      style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink, #1C1A17)', letterSpacing: '-0.015em', margin: 0 }}>
          {title}
        </h1>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <select
            aria-label="Case status"
            value={status}
            onChange={(e) => onChangeStatus?.(e.target.value as CaseStatus)}
            style={{
              fontFamily: 'inherit',
              fontSize: 12,
              padding: '5px 12px',
              borderRadius: 5,
              background: 'var(--terracotta-tint, #FCEFE7)',
              border: '1px solid var(--terracotta-soft, #EFB59B)',
              color: 'var(--terracotta-deep, #9C3F25)',
              fontWeight: 600,
            }}
          >
            {FLOW.map((s) => (<option key={s} value={s}>{labelFor(s)}</option>))}
            <option value="on_hold">On hold</option>
          </select>
          <span style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>
            Workflow: {FLOW.map((s) => s === status ? <strong key={s}>{labelFor(s)}</strong> : labelFor(s)).reduce((acc: React.ReactNode[], el, i) => i === 0 ? [el] : [...acc, ' / ', el], [])}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={onAssign} type="button" style={btn}>Assign</button>
        <button onClick={onAddSubtask} type="button" style={btn}>Add sub-task</button>
        <button onClick={onLinkCase} type="button" style={btn}>Link case</button>
      </div>
    </div>
  );
}

function labelFor(s: CaseStatus): string {
  return ({
    new: 'New',
    in_progress: 'In progress',
    replied: 'Replied',
    awaiting_member: 'Awaiting member',
    on_hold: 'On hold',
    closed: 'Closed',
  } as Record<CaseStatus, string>)[s];
}

const btn: React.CSSProperties = {
  background: 'var(--paper, #fff)',
  border: '1px solid var(--line-card, #E0D9C8)',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--ink, #1C1A17)',
  cursor: 'pointer',
  fontFamily: 'inherit',
};
