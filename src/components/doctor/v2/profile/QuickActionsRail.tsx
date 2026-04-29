'use client';

import React from 'react';
import type { PatientProfileData } from '@/lib/doctor/v2/patientProfileQueries';

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

type ProgressBarProps = {
  label: string;
  used: number;
  total: number;
  suffix?: string;
};

function ProgressBar({ label, used, total, suffix }: ProgressBarProps) {
  const pct = Math.min(100, total > 0 ? (used / total) * 100 : 0);
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--ink-muted, #615C52)',
          fontFamily: 'var(--font-sans)',
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ color: 'var(--ink, #1C1A17)', fontWeight: 600 }}>
          {used} / {total}{suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: 'var(--canvas-soft, #F4EFE3)',
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            background: pct > 80 ? 'var(--terracotta, #C9573A)' : 'var(--sage-deep, #445A4A)',
            borderRadius: 2,
            width: `${pct}%`,
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}

// Quick action handlers - Phase 7 wires order/referral/consult to real API routes

export function QuickActionsRail({ data }: { data: PatientProfileData }) {
  const { membershipUse, recentActivity, patient } = data;

  const consultLimit = patient.tier === 'plus' ? 60 : 30;
  const panelLimit = patient.tier === 'plus' ? 4 : 2;

  function getTargetCaseId(): string | null {
    return data.activeCases[0]?.id ?? null;
  }

  async function placeOrder() {
    const target = getTargetCaseId();
    if (!target) { alert('Open a case first to attach an order.'); return; }
    const test = window.prompt('Test name', 'Ferritin recheck');
    if (!test) return;
    const cost = window.prompt('Lab cost (SEK), blank if none', '');
    const res = await fetch(`/api/doctor/cases/${target}/order-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test_name: test, lab_cost_sek: cost ? Number(cost) : undefined }),
    });
    if (res.ok) alert('Order placed.');
    else { const j = await res.json().catch(() => null); alert(`Failed: ${j?.error ?? res.status}`); }
  }

  async function sendReferral() {
    const target = getTargetCaseId();
    if (!target) { alert('Open a case first to attach a referral.'); return; }
    const specialist = window.prompt('Specialist / department', 'Endocrinology');
    if (!specialist) return;
    const note = window.prompt('Note (optional)', '') ?? '';
    const res = await fetch(`/api/doctor/cases/${target}/send-referral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialist, note: note || undefined }),
    });
    if (res.ok) alert('Referral sent.');
    else { const j = await res.json().catch(() => null); alert(`Failed: ${j?.error ?? res.status}`); }
  }

  async function scheduleConsult() {
    const target = getTargetCaseId();
    if (!target) { alert('Open a case first to schedule a consult.'); return; }
    const when = window.prompt('Date/time (e.g. 2026-05-10 14:00)', '');
    const kind = window.prompt('Kind: video or in_person', 'video') ?? 'video';
    const res = await fetch(`/api/doctor/cases/${target}/schedule-consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduled_for: when || undefined, kind }),
    });
    if (res.ok) alert('Consult scheduled.');
    else { const j = await res.json().catch(() => null); alert(`Failed: ${j?.error ?? res.status}`); }
  }

  const secondaryBtnStyle: React.CSSProperties = {
    background: 'var(--paper, #fff)',
    border: '1px solid var(--line-soft, #E0D9C8)',
    color: 'var(--ink, #1C1A17)',
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    marginBottom: 6,
    fontFamily: 'var(--font-sans)',
  };

  return (
    <div
      style={{
        background: 'var(--canvas-soft, #FDFBF6)',
        padding: '22px 18px',
        fontSize: 12,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Quick actions */}
      <div
        style={{
          fontSize: 10,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        Quick actions
      </div>
      <button
        type="button"
        onClick={() => alert('Open new case - coming soon.')}
        style={{
          background: 'var(--ink, #1C1A17)',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          marginBottom: 6,
          fontFamily: 'var(--font-sans)',
        }}
      >
        Open new case
      </button>
      <button type="button" onClick={() => alert('Messaging coming soon.')} style={secondaryBtnStyle}>
        Message {patient.display_name.split(' ')[0]}
      </button>
      <button type="button" onClick={scheduleConsult} style={secondaryBtnStyle}>
        Schedule consult
      </button>
      <button type="button" onClick={placeOrder} style={secondaryBtnStyle}>
        Order panel
      </button>
      <button type="button" onClick={sendReferral} style={{ ...secondaryBtnStyle, marginBottom: 0 }}>
        Send referral
      </button>

      {/* Membership use */}
      <div
        style={{
          marginTop: 20,
          fontSize: 10,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 10,
        }}
      >
        Membership use
      </div>
      <div
        style={{
          background: 'var(--paper, #fff)',
          border: '1px solid var(--line-soft, #EEE9DB)',
          borderRadius: 8,
          padding: '10px',
        }}
      >
        <ProgressBar
          label="Consult minutes"
          used={membershipUse.consultMinutesUsed}
          total={consultLimit}
        />
        <ProgressBar
          label="Panels reviewed"
          used={membershipUse.panelsReviewed}
          total={panelLimit}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--ink-muted, #615C52)',
            marginTop: 4,
          }}
        >
          <span>Out-of-pocket</span>
          <span style={{ fontWeight: 600, color: 'var(--ink, #1C1A17)' }}>
            {membershipUse.outOfPocketSek} SEK
          </span>
        </div>
      </div>

      {/* Recent activity */}
      <div
        style={{
          marginTop: 20,
          fontSize: 10,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        Recent activity
      </div>
      {recentActivity.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontStyle: 'italic' }}>
          No recent activity.
        </div>
      ) : (
        <div style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--ink-muted, #615C52)' }}>
          {recentActivity.slice(0, 5).map((a, i) => (
            <div key={i} style={{ marginTop: i > 0 ? 4 : 0 }}>
              {a.label} - {formatRelative(a.at)}
            </div>
          ))}
        </div>
      )}

      {/* Linked people */}
      <div
        style={{
          marginTop: 20,
          fontSize: 10,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        Linked people
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-muted, #615C52)' }}>
        No related members linked.
      </div>
    </div>
  );
}
