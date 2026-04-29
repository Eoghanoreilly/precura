import React from 'react';
import type { PatientProfileData } from '@/lib/doctor/v2/patientProfileQueries';

type Message = PatientProfileData['recentMessages'][number];

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min} min ago`;
  const hrs = Math.floor(min / 3600);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function OverviewMessages({ messages }: { messages: Message[] }) {
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
        Recent messages
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
        {messages.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-faint, #9B958A)', fontStyle: 'italic' }}>
            No messages yet.
          </div>
        ) : (
          messages.slice(0, 3).map((m, i) => (
            <div key={i}>
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
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{m.content.slice(0, 100)}{m.content.length > 100 ? '...' : ''}&rdquo;
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', marginTop: 4 }}>
                {formatRelative(m.created_at)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
