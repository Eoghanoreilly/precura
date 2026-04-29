import React from 'react';
import type { PatientProfileData } from '@/lib/doctor/v2/patientProfileQueries';

function formatRelative(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function MetaProp({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          color: 'var(--ink-faint, #9B958A)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          marginBottom: 3,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--ink, #1C1A17)',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function PatientMetaStrip({ data }: { data: PatientProfileData }) {
  const { patient, membershipUse, recentMessages, recentActivity } = data;

  const lastSeenEntry = recentActivity[0];
  const lastSeen = lastSeenEntry ? formatRelative(lastSeenEntry.at) + ' ' + lastSeenEntry.kind : 'No activity';

  const consultLimit = patient.tier === 'plus' ? 60 : 30;
  const panelLimit = patient.tier === 'plus' ? 4 : 2;

  const membershipDisplay = `${membershipUse.consultMinutesUsed} / ${consultLimit} consult min - ${membershipUse.panelsReviewed} / ${panelLimit} panels`;

  const firstMessage = recentMessages[0];
  const chatSnippet = firstMessage
    ? `"${firstMessage.content.slice(0, 40)}${firstMessage.content.length > 40 ? '...' : ''}"`
    : 'No messages yet';

  return (
    <div
      style={{
        padding: '14px 28px',
        background: 'var(--canvas-soft, #FDFBF6)',
        borderBottom: '1px solid var(--line-soft, #EEE9DB)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px 18px',
        }}
      >
        <MetaProp label="Allergies" value="None recorded" />
        <MetaProp
          label="Active conditions"
          value={data.activeCases.length > 0 ? `${data.activeCases[0].title} (open)` : 'None open'}
        />
        <MetaProp label="Primary doctor" value="Precura clinic" />
        <MetaProp label="Last seen" value={lastSeen} />
        <MetaProp label="Membership use" value={membershipDisplay} />
        <MetaProp label="Email" value={patient.email} />
        <MetaProp
          label="Latest message"
          value={
            <span style={{ color: 'var(--ink-muted, #615C52)', fontStyle: 'italic' }}>
              {chatSnippet}
            </span>
          }
        />
        <MetaProp
          label="Member ID"
          value={
            <span
              style={{
                fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, monospace",
                fontSize: 11,
                letterSpacing: '0.02em',
                color: 'var(--ink-muted, #615C52)',
              }}
            >
              PT-{patient.id.slice(0, 8).toUpperCase()}
            </span>
          }
        />
      </div>
    </div>
  );
}
