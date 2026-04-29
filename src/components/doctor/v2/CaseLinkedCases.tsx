'use client';
import React from 'react';
import Link from 'next/link';
import type { Case } from '@/lib/data/types';
import { StatusPill } from './StatusPill';

export function CaseLinkedCases({ links }: { links: Array<{ case: Case; relation: string }> }) {
  if (links.length === 0) {
    return (
      <section style={{ padding: '8px 24px 18px', fontFamily: 'var(--font-sans)' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Linked cases
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-faint, #9B958A)' }}>No linked cases</div>
      </section>
    );
  }
  return (
    <section style={{ padding: '8px 24px 18px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        Linked cases
      </div>
      <div style={{ background: 'var(--paper, #fff)', border: '1px solid var(--line-soft, #EEE9DB)', borderRadius: 8 }}>
        {links.map(({ case: c, relation }, i) => (
          <Link
            key={c.id}
            href={`/doctor?case=${c.case_id_short}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: i < links.length - 1 ? '1px solid var(--line-soft, #EEE9DB)' : 'none', textDecoration: 'none', color: 'inherit', fontSize: 13 }}
          >
            <span style={{ fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, monospace", fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>{c.case_id_short}</span>
            <span style={{ flex: 1, color: 'var(--sage-deep, #445A4A)', textDecoration: 'underline', textUnderlineOffset: 2 }}>{c.title}</span>
            <span style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>{relation}</span>
            <StatusPill status={c.status} />
          </Link>
        ))}
      </div>
    </section>
  );
}
