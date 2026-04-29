'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchResults } from '@/lib/doctor/v2/searchQueries';

type FlatItem =
  | { kind: 'patient'; id: string; display_name: string; email: string; href: string }
  | { kind: 'case'; id: string; case_id_short: string; title: string; status: string; patient_display_name: string; href: string }
  | { kind: 'panel'; id: string; panel_date: string; patient_display_name: string; flag_count: number; href: string }
  | { kind: 'note'; id: string; body: string; created_at: string; href: string };

export function CmdK() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Global keyboard listener for cmd/ctrl-k
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus input on open; reset state on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ('');
      setResults(null);
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const trimmed = q.trim();
    if (trimmed.length === 0) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/doctor/search?q=${encodeURIComponent(trimmed)}`);
        const json = await res.json().catch(() => null);
        if (!cancelled && json?.ok) {
          setResults(json.results as SearchResults);
          setActiveIndex(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [q, open]);

  const flat: FlatItem[] = useMemo(() => buildFlat(results), [results]);

  const onArrow = useCallback((dir: 1 | -1) => {
    setActiveIndex((i) => Math.max(0, Math.min(flat.length - 1, i + dir)));
  }, [flat.length]);

  const goActive = useCallback(() => {
    if (flat.length === 0) return;
    const item = flat[Math.min(activeIndex, flat.length - 1)];
    setOpen(false);
    router.push(item.href);
  }, [flat, activeIndex, router]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,26,23,0.4)',
        zIndex: 80,
        padding: '10vh 24px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 580,
          margin: '0 auto',
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-card, #E0D9C8)',
          borderRadius: 14,
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Search input row */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-soft, #EEE9DB)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span aria-hidden style={{ fontSize: 14, color: 'var(--ink-faint, #9B958A)' }}>S</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); onArrow(1); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); onArrow(-1); }
              else if (e.key === 'Enter') { e.preventDefault(); goActive(); }
            }}
            placeholder="Search patients, cases, panels, notes..."
            style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 15, color: 'var(--ink, #1C1A17)', fontFamily: 'inherit', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: 'var(--ink-faint, #9B958A)', background: 'var(--canvas, #F4EFE3)', padding: '2px 6px', borderRadius: 4, fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, monospace" }}>esc</span>
        </div>

        {/* Results area */}
        <div style={{ padding: '6px 0', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: '12px 18px', fontSize: 12, color: 'var(--ink-faint, #9B958A)' }}>Searching...</div>
          )}
          {!loading && q.trim().length === 0 && (
            <div style={{ padding: '14px 18px', fontSize: 12, color: 'var(--ink-faint, #9B958A)' }}>
              Type a name, email, case ID, or note text. Up/down to navigate, return to open.
            </div>
          )}
          {!loading && q.trim().length > 0 && flat.length === 0 && (
            <div style={{ padding: '14px 18px', fontSize: 13, color: 'var(--ink-muted, #615C52)' }}>No matches.</div>
          )}
          {!loading && results && flat.length > 0 && (
            <Sections
              results={results}
              flat={flat}
              activeIndex={activeIndex}
              onSelect={(href) => { setOpen(false); router.push(href); }}
            />
          )}
        </div>

        {/* Footer shortcut hints */}
        <div style={{ padding: '8px 18px', borderTop: '1px solid var(--line-soft, #EEE9DB)', background: 'var(--canvas-soft, #FDFBF6)', fontSize: 10, color: 'var(--ink-faint, #9B958A)', display: 'flex', gap: 14 }}>
          <span><Kbd>up/down</Kbd> navigate</span>
          <span><Kbd>return</Kbd> open</span>
          <span style={{ marginLeft: 'auto' }}><Kbd>cmd-k</Kbd> from anywhere</span>
        </div>
      </div>
    </div>
  );
}

function buildFlat(r: SearchResults | null): FlatItem[] {
  if (!r) return [];
  const out: FlatItem[] = [];
  for (const p of r.patients) {
    out.push({ kind: 'patient', id: p.id, display_name: p.display_name, email: p.email, href: `/doctor/patient/${p.id}` });
  }
  for (const c of r.cases) {
    out.push({ kind: 'case', id: c.id, case_id_short: c.case_id_short, title: c.title, status: c.status, patient_display_name: c.patient_display_name, href: `/doctor?case=${c.case_id_short}` });
  }
  for (const p of r.panels) {
    out.push({ kind: 'panel', id: p.id, panel_date: p.panel_date, patient_display_name: p.patient_display_name, flag_count: p.flag_count, href: `/member/panels/${p.id}` });
  }
  for (const n of r.notes) {
    out.push({ kind: 'note', id: n.id, body: n.body, created_at: n.created_at, href: n.case_id ? `/doctor?case=${n.case_id}` : '/doctor' });
  }
  return out;
}

// Pre-compute per-section starting offsets to avoid mutable cursor in JSX
function computeOffsets(results: SearchResults) {
  const patientStart = 0;
  const caseStart = patientStart + results.patients.length;
  const panelStart = caseStart + results.cases.length;
  const noteStart = panelStart + results.panels.length;
  return { patientStart, caseStart, panelStart, noteStart };
}

function Sections({
  results,
  flat,
  activeIndex,
  onSelect,
}: {
  results: SearchResults;
  flat: FlatItem[];
  activeIndex: number;
  onSelect: (href: string) => void;
}) {
  const { patientStart, caseStart, panelStart, noteStart } = computeOffsets(results);

  function renderRow(it: FlatItem, idx: number) {
    const isActive = idx === activeIndex;
    const onClick = () => onSelect(it.href);
    const rowStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 18px',
      background: isActive ? 'var(--canvas, #F4EFE3)' : 'transparent',
      cursor: 'pointer',
    };

    if (it.kind === 'patient') {
      const initials = (it.display_name || '?')
        .split(/\s+/)
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return (
        <div key={`p-${it.id}`} style={rowStyle} onClick={onClick}>
          <span
            aria-hidden
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--butter-soft, #F6DDA0), var(--terracotta-soft, #EFB59B))',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, color: 'var(--ink, #1C1A17)', flexShrink: 0,
            }}
          >
            {initials}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--ink, #1C1A17)', fontWeight: 600 }}>{it.display_name}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>{it.email}</div>
          </div>
        </div>
      );
    }

    if (it.kind === 'case') {
      return (
        <div key={`c-${it.id}`} style={rowStyle} onClick={onClick}>
          <span style={{ fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, monospace", fontSize: 11, color: 'var(--ink-faint, #9B958A)', width: 64, textAlign: 'center', flexShrink: 0 }}>
            {it.case_id_short}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--ink, #1C1A17)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {it.patient_display_name} / {it.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', textTransform: 'capitalize' }}>
              {it.status.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      );
    }

    if (it.kind === 'panel') {
      const hasFlagged = it.flag_count > 0;
      return (
        <div key={`pn-${it.id}`} style={rowStyle} onClick={onClick}>
          <span
            aria-hidden
            style={{ fontSize: 12, color: hasFlagged ? 'var(--terracotta-deep, #9C3F25)' : 'var(--ink-faint, #9B958A)', width: 24, textAlign: 'center', flexShrink: 0 }}
          >
            {hasFlagged ? '!' : '/'}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--ink, #1C1A17)' }}>
              {it.patient_display_name} / panel {new Date(it.panel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>
              {hasFlagged ? `${it.flag_count} flagged` : 'all in range'}
            </div>
          </div>
        </div>
      );
    }

    // note
    const snippet = it.body.length > 100 ? `${it.body.slice(0, 100)}...` : it.body;
    return (
      <div key={`n-${it.id}`} style={rowStyle} onClick={onClick}>
        <span aria-hidden style={{ fontSize: 12, color: 'var(--sage-deep, #445A4A)', width: 24, textAlign: 'center', flexShrink: 0 }}>n</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--ink, #1C1A17)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {snippet}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>
            note / {new Date(it.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {results.patients.length > 0 && (
        <>
          <SectionLabel>Patients</SectionLabel>
          {flat.slice(patientStart, patientStart + results.patients.length).map((it, i) => renderRow(it, patientStart + i))}
        </>
      )}
      {results.cases.length > 0 && (
        <>
          <SectionLabel>Cases</SectionLabel>
          {flat.slice(caseStart, caseStart + results.cases.length).map((it, i) => renderRow(it, caseStart + i))}
        </>
      )}
      {results.panels.length > 0 && (
        <>
          <SectionLabel>Panels</SectionLabel>
          {flat.slice(panelStart, panelStart + results.panels.length).map((it, i) => renderRow(it, panelStart + i))}
        </>
      )}
      {results.notes.length > 0 && (
        <>
          <SectionLabel>Notes mentioning this term</SectionLabel>
          {flat.slice(noteStart, noteStart + results.notes.length).map((it, i) => renderRow(it, noteStart + i))}
        </>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '6px 18px',
      fontSize: 10,
      color: 'var(--ink-faint, #9B958A)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      fontWeight: 700,
      marginTop: 4,
    }}>
      {children}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, monospace",
      background: 'var(--paper, #fff)',
      border: '1px solid var(--line-card, #E0D9C8)',
      padding: '1px 5px',
      borderRadius: 3,
    }}>
      {children}
    </span>
  );
}
