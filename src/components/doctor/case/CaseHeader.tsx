"use client";

import React from "react";

export type CaseHeaderProps = {
  name: string;
  initials: string;
  ageYears: number | null;
  panelCount: number;
  joinedAt: string;
  emotionalTriggered: boolean;
};

export function CaseHeader({ name, initials, ageYears, panelCount, joinedAt, emotionalTriggered }: CaseHeaderProps) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #EEE9DB', borderRadius: 14,
      padding: '18px 22px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F6DDA0, #EFB59B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 600, color: '#9C3F25', letterSpacing: '-0.02em',
        }}>{initials}</div>
        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#615C52', fontWeight: 600, marginBottom: 2 }}>Member</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1C1A17', letterSpacing: '-0.02em' }}>{name}</div>
          <div style={{ fontSize: 12, color: '#8B8579', marginTop: 2 }}>
            {ageYears !== null ? `${ageYears} years - ` : ''}{panelCount} panel{panelCount === 1 ? '' : 's'} on file - joined {joinedAt}
          </div>
        </div>
      </div>
      {emotionalTriggered && (
        <div style={{
          background: '#FCEFE7', border: '1px solid #EFB59B', borderRadius: 999,
          padding: '5px 13px', fontSize: 11, fontWeight: 600, color: '#9C3F25', letterSpacing: '0.06em',
        }}>Emotional signal</div>
      )}
    </div>
  );
}
