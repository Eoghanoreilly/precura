'use client';
import React, { useState } from 'react';

export type CaseComposerProps = {
  caseId: string;
  patientName: string;
  onPosted?: () => void;
  emitsBillingCode?: string | null;
};

export function CaseComposer({ caseId, patientName, onPosted, emitsBillingCode }: CaseComposerProps) {
  const [body, setBody] = useState('');
  const [scope, setScope] = useState<'note' | 'internal'>('note');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function insert(text: string) {
    setBody((b) => (b + (b.endsWith(' ') || b === '' ? '' : ' ') + text));
  }

  async function submit() {
    if (!body.trim() || posting) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch(`/api/doctor/cases/${caseId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), scope }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `Post failed: ${res.status}`);
      }
      setBody('');
      onPosted?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <section style={{ padding: '8px 24px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ border: '1px solid var(--ink, #1C1A17)', borderRadius: 10, background: 'var(--paper, #fff)' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line-soft, #EEE9DB)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-faint, #9B958A)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Reply
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            <ScopeChip active={scope === 'note'} onClick={() => setScope('note')} label={`Note for ${patientName.split(/\s+/)[0] ?? 'member'}`} dark />
            <ScopeChip active={scope === 'internal'} onClick={() => setScope('internal')} label="Internal" />
          </div>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type / for actions: trend, quote, order, consult"
          style={{ width: '100%', minHeight: 96, padding: 14, fontSize: 13, fontFamily: 'inherit', color: 'var(--ink, #1C1A17)', border: 'none', outline: 'none', resize: 'vertical', background: 'transparent', boxSizing: 'border-box' }}
        />
        <div style={{ padding: '8px 14px', borderTop: '1px solid var(--line-soft, #EEE9DB)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <ChipBtn onClick={() => insert('/trend')}>+ Trend</ChipBtn>
            <ChipBtn onClick={() => insert('/quote')}>+ Quote</ChipBtn>
            <ChipBtn onClick={() => insert('/order')}>+ Order</ChipBtn>
            <ChipBtn onClick={() => insert('/consult')}>+ Consult</ChipBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {emitsBillingCode && <span style={{ fontSize: 10, color: 'var(--ink-faint, #9B958A)', fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, monospace" }}>emits {emitsBillingCode}</span>}
            <button
              type="button"
              onClick={submit}
              disabled={posting || !body.trim()}
              style={{
                background: 'var(--ink, #1C1A17)',
                color: 'var(--paper, #fff)',
                border: 'none',
                padding: '7px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: posting ? 'wait' : 'pointer',
                opacity: !body.trim() ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        {error && <div style={{ padding: '8px 14px', background: 'var(--terracotta-tint, #FCEFE7)', color: 'var(--terracotta-deep, #9C3F25)', fontSize: 12, borderTop: '1px solid var(--terracotta-soft, #EFB59B)' }}>{error}</div>}
      </div>
    </section>
  );
}

function ScopeChip({ active, onClick, label, dark }: { active: boolean; onClick: () => void; label: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? (dark ? 'var(--ink, #1C1A17)' : 'var(--canvas, #F4EFE3)') : 'transparent',
        color: active ? (dark ? 'var(--paper, #fff)' : 'var(--ink, #1C1A17)') : 'var(--ink-muted, #615C52)',
        padding: '3px 10px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

function ChipBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'var(--canvas, #F4EFE3)',
        border: 'none',
        color: 'var(--ink-muted, #615C52)',
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
