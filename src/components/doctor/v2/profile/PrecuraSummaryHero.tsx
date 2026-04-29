'use client';

import React, { useState } from 'react';

function formatRefreshed(iso: string | null): string {
  if (!iso) return 'never';
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function PrecuraSummaryHero({
  patientId,
  body,
  generatedAt,
}: {
  patientId: string;
  body: string | null;
  generatedAt: string | null;
}) {
  const [currentBody, setCurrentBody] = useState(body);
  const [currentGenerated, setCurrentGenerated] = useState(generatedAt);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`/api/doctor/patients/${patientId}/refresh-summary`, { method: 'POST' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        setError(j.error ?? 'Refresh failed');
        return;
      }
      const j = await res.json() as { summary?: string; generated_at?: string };
      if (j.summary) setCurrentBody(j.summary);
      if (j.generated_at) setCurrentGenerated(j.generated_at);
    } catch {
      setError('Network error - try again');
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div
      style={{
        background: 'var(--canvas-soft, #F4EFE3)',
        border: '1px solid var(--line-soft, #E0D9C8)',
        borderRadius: 12,
        padding: '20px 22px',
        marginBottom: 22,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-faint, #9B958A)',
            fontWeight: 700,
          }}
        >
          Precura summary
          {currentGenerated && (
            <> - refreshed {formatRefreshed(currentGenerated)}</>
          )}
        </span>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: refreshing ? 'var(--ink-faint, #9B958A)' : 'var(--sage-deep, #445A4A)',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            cursor: refreshing ? 'default' : 'pointer',
            padding: 0,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--terracotta-deep, #9C3F25)',
            marginBottom: 8,
          }}
        >
          {error}
        </div>
      )}

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.65,
          color: 'var(--ink, #1C1A17)',
          margin: 0,
        }}
      >
        {currentBody ?? (
          <span style={{ color: 'var(--ink-faint, #9B958A)', fontStyle: 'italic' }}>
            No summary yet. Click Refresh to generate one.
          </span>
        )}
      </p>
    </div>
  );
}
