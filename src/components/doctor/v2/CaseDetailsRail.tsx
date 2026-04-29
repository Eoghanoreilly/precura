'use client';
import React from 'react';
import type { CaseWorkspaceData } from '@/lib/doctor/v2/caseWorkspaceQueries';
import { StatusPill } from './StatusPill';
import { PriorityDot } from './PriorityDot';

export function CaseDetailsRail({ data, doctorName }: { data: CaseWorkspaceData; doctorName: string }) {
  const c = data.case;
  const openTaskCount = data.tasks.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const totalTaskCount = data.tasks.length;
  return (
    <aside
      style={{
        padding: '20px 18px',
        background: 'var(--canvas-soft, #FDFBF6)',
        borderLeft: '1px solid var(--line-soft, #EEE9DB)',
        fontSize: 12,
        fontFamily: 'var(--font-sans)',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <SectionLabel>Details</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 10, color: 'var(--ink, #1C1A17)' }}>
        <Cell label>Status</Cell>
        <Cell><StatusPill status={c.status} /></Cell>
        <Cell label>Priority</Cell>
        <Cell><PriorityDot priority={c.priority} /></Cell>
        <Cell label>Owner</Cell>
        <Cell>{c.owner_doctor_id ? doctorName : 'Unassigned'}</Cell>
        <Cell label>Member</Cell>
        <Cell>{data.patient.display_name}</Cell>
        <Cell label>Tier</Cell>
        <Cell style={{ textTransform: 'capitalize' }}>{data.patient.tier}</Cell>
        <Cell label>Category</Cell>
        <Cell style={{ textTransform: 'capitalize' }}>{c.category.replace(/_/g, ' ')}</Cell>
        <Cell label>Opened</Cell>
        <Cell>{new Date(c.opened_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Cell>
        <Cell label>Tasks</Cell>
        <Cell>{totalTaskCount - openTaskCount} of {totalTaskCount} done</Cell>
        {c.tags.length > 0 && (
          <>
            <Cell label>Tags</Cell>
            <Cell>{c.tags.join(', ')}</Cell>
          </>
        )}
      </div>

      <SectionLabel style={{ marginTop: 18 }}>Billing</SectionLabel>
      <div style={{ background: 'var(--paper, #fff)', border: '1px solid var(--line-soft, #EEE9DB)', borderRadius: 6, padding: 10, fontSize: 11, lineHeight: 1.5, color: 'var(--ink-muted, #615C52)' }}>
        <div>Tier: <span style={{ color: 'var(--ink, #1C1A17)', textTransform: 'capitalize' }}>{data.patient.tier}</span></div>
        <div style={{ marginTop: 4 }}>Posting will emit:</div>
        <div style={{ marginTop: 2, fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, monospace", fontSize: 10, color: 'var(--ink, #1C1A17)' }}>
          {c.category === 'panel_review' ? 'PANEL_REVIEWED_WITH_NOTE' : 'CASE_NOTE'}
        </div>
      </div>

      <SectionLabel style={{ marginTop: 18 }}>Watchers</SectionLabel>
      <div style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>{doctorName} (you)</div>
    </aside>
  );
}

function SectionLabel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--ink-faint, #9B958A)',
        marginBottom: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Cell({ children, label, style = {} }: { children: React.ReactNode; label?: boolean; style?: React.CSSProperties }) {
  return <div style={{ color: label ? 'var(--ink-faint, #9B958A)' : 'inherit', ...style }}>{children}</div>;
}
