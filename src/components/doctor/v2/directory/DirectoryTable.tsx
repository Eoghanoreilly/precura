'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { DirectoryRow } from './DirectoryRow';
import { EmptyState } from '../EmptyState';
import type { DirectoryRow as DirectoryRowData } from '@/lib/doctor/v2/patientsDirectoryQueries';
import type { PatientState } from '@/lib/doctor/caseStateDerivation';

export function DirectoryTable({ rows }: { rows: DirectoryRowData[] }) {
  const search = useSearchParams();
  const stateFilter = search?.get('state') as PatientState | null;
  const q = (search?.get('q') ?? '').trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (stateFilter && r.state !== stateFilter) return false;
    if (q && !r.display_name.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) return false;
    return true;
  });
  if (filtered.length === 0) {
    return <EmptyState title="No matching patients" body="Try clearing filters or your search query." tone="neutral" />;
  }
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 140px 1fr 110px',
          padding: '10px 28px',
          background: 'var(--canvas-soft, #FDFBF6)',
          borderBottom: '1px solid var(--line-soft, #EEE9DB)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--ink-faint, #9B958A)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div>Patient</div>
        <div>Current state</div>
        <div>Precura brief</div>
        <div style={{ textAlign: 'right' }}>Last activity</div>
      </div>
      {filtered.map((r) => <DirectoryRow key={r.id} row={r} />)}
    </div>
  );
}
