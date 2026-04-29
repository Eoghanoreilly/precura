import React from 'react';
import type { PatientProfileData } from '@/lib/doctor/v2/patientProfileQueries';

type Note = PatientProfileData['recentNotes'][number];

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 3600);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function OverviewNotes({ notes }: { notes: Note[] }) {
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
        Your notes
      </div>

      <div
        style={{
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-soft, #EEE9DB)',
          borderRadius: 10,
          padding: '12px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {notes.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-faint, #9B958A)', fontStyle: 'italic' }}>
            No notes yet.
          </div>
        ) : (
          notes.slice(0, 3).map((n, i) => (
            <div key={n.id}>
              {i > 0 && (
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid var(--canvas-soft, #F4EFE3)',
                    margin: '10px 0',
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--ink, #1C1A17)',
                  lineHeight: 1.55,
                }}
              >
                &ldquo;{n.body.slice(0, 80)}{n.body.length > 80 ? '...' : ''}&rdquo;
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', marginTop: 4 }}>
                {formatRelative(n.created_at)}
                {n.case_id && (
                  <span style={{ marginLeft: 4 }}>- on case</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
