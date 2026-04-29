'use client';
import React from 'react';
import Link from 'next/link';
import { Avatar } from '../Avatar';
import { PatientStatePill } from './PatientStatePill';
import type { DirectoryRow as DirectoryRowData } from '@/lib/doctor/v2/patientsDirectoryQueries';

export function DirectoryRow({ row }: { row: DirectoryRowData }) {
  const initials = row.display_name.split(/\s+/).map((s) => s[0] ?? '').slice(0, 2).join('');
  const awaitingYou = row.state === 'Awaiting you';
  return (
    <Link
      href={`/doctor/patient/${row.id}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 140px 1fr 110px',
        padding: '16px 28px',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        alignItems: 'center',
        background: awaitingYou ? 'var(--terracotta-tint, #FFF6EE)' : 'transparent',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar initials={initials} patientId={row.id} size="md" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink, #1C1A17)' }}>{row.display_name}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', textTransform: 'capitalize' }}>{row.tier}</div>
        </div>
      </div>
      <div>
        <PatientStatePill state={row.state} secondary={row.openTasks > 0 ? `${row.openTasks} open task${row.openTasks === 1 ? '' : 's'}` : undefined} />
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink, #1C1A17)', paddingRight: 14 }}>
        {row.brief}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)', textAlign: 'right' }}>
        {row.lastActivityAt ? `${relTime(row.lastActivityAt)}` : 'no activity'}
        <br />
        {row.lastActivityKind && <span style={{ color: 'var(--ink-faint, #9B958A)' }}>{row.lastActivityKind}</span>}
      </div>
    </Link>
  );
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.round(ms / 86_400_000);
  if (d < 0) return 'future';
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.round(d / 7)}w ago`;
  if (d < 365) return `${Math.round(d / 30)}mo ago`;
  return `${Math.round(d / 365)}y ago`;
}
