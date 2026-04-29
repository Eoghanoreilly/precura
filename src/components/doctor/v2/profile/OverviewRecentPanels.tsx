import React from 'react';
import Link from 'next/link';
import type { PatientProfileData } from '@/lib/doctor/v2/patientProfileQueries';

type Panel = PatientProfileData['recentPanels'][number];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function OverviewRecentPanels({ panels }: { panels: Panel[] }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
          fontFamily: 'var(--font-sans)',
        }}
      >
        Recent panels
      </div>

      {panels.length === 0 ? (
        <div
          style={{
            background: 'var(--paper, #fff)',
            border: '1px solid var(--line-soft, #EEE9DB)',
            borderRadius: 10,
            padding: '16px 14px',
            fontSize: 13,
            color: 'var(--ink-faint, #9B958A)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-sans)',
          }}
        >
          No panels on file yet.
        </div>
      ) : (
        <div
          style={{
            background: 'var(--paper, #fff)',
            border: '1px solid var(--line-soft, #EEE9DB)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {panels.map((p, i) => (
            <div
              key={p.id}
              style={{
                padding: '10px 14px',
                borderBottom: i < panels.length - 1 ? '1px solid var(--canvas-soft, #F4EFE3)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink, #1C1A17)', marginBottom: 2 }}>
                  {formatDate(p.panel_date)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>
                  {[
                    p.lab_name,
                    p.marker_count > 0 ? `${p.marker_count} markers` : null,
                    p.flag_count > 0 ? `${p.flag_count} flagged` : null,
                  ]
                    .filter(Boolean)
                    .join(' - ')}
                </div>
              </div>
              <Link
                href={`/member/panels/${p.id}`}
                style={{
                  fontSize: 11,
                  color: 'var(--sage-deep, #445A4A)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 2,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
