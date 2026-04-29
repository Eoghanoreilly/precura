'use client';

import React from 'react';
import { Wordmark, IdentityCard, RailNav } from '@/components/layout';

export type NavRailProps = {
  doctorName: string;
  doctorInitials: string;
  patientCount: number;
  activeHref: '/doctor' | '/doctor/patients' | '/doctor/settings' | string;
  collapsed?: boolean;
};

const ITEMS: Array<{ label: string; href: string }> = [
  { label: 'Inbox', href: '/doctor' },
  { label: 'Patients', href: '/doctor/patients' },
  { label: 'Settings', href: '/doctor/settings' },
];

export function NavRail({ doctorName, doctorInitials, patientCount, activeHref, collapsed = false }: NavRailProps) {
  if (collapsed) {
    return (
      <nav
        aria-label="Primary"
        style={{
          padding: '14px 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--butter-soft, #F6DDA0), var(--terracotta-soft, #EFB59B))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--ink, #1C1A17)',
          }}
        >
          P
        </span>
      </nav>
    );
  }

  return (
    <nav aria-label="Primary" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 22, fontFamily: 'var(--font-sans)' }}>
      <Wordmark href="/doctor" />
      <IdentityCard
        user={{ name: doctorName, initials: doctorInitials, memberSince: 'Clinician' }}
        doctor={{
          name: 'Precura clinic',
          initials: 'P',
          title: `${patientCount} patient${patientCount === 1 ? '' : 's'}`,
        }}
      />
      <RailNav items={ITEMS} activeHref={activeHref} />
    </nav>
  );
}
