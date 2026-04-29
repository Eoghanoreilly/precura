'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DirectoryFilters } from './DirectoryFilters';
import type { PatientState } from '@/lib/doctor/caseStateDerivation';

export function DirectoryHeader({ totalCount, attentionCount, counts }: { totalCount: number; attentionCount: number; counts: Record<'all' | PatientState, number> }) {
  const router = useRouter();
  const search = useSearchParams();
  const state = (search?.get('state') ?? 'all') as 'all' | PatientState;
  const initialQ = search?.get('q') ?? '';
  const [q, setQ] = React.useState(initialQ);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(search?.toString() ?? '');
    if (q) params.set('q', q); else params.delete('q');
    router.replace(`/doctor/patients?${params.toString()}`);
  }
  return (
    <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--line-soft, #EEE9DB)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-faint, #9B958A)', fontWeight: 700 }}>Patients</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink, #1C1A17)', letterSpacing: '-0.015em', margin: 0 }}>
            {totalCount} member{totalCount === 1 ? '' : 's'} / {attentionCount} need your attention
          </h1>
        </div>
        <form onSubmit={submit}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              background: 'var(--canvas-soft, #FDFBF6)',
              border: '1px solid var(--line-card, #E0D9C8)',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontFamily: 'inherit',
              width: 280,
              outline: 'none',
            }}
          />
        </form>
      </div>
      <div style={{ marginTop: 14 }}>
        <DirectoryFilters active={state} counts={counts} />
      </div>
    </div>
  );
}
