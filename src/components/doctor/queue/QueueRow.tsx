"use client";

import React from "react";
import Link from "next/link";

export type QueueRowProps = {
  name: string;
  daysLabel: string;
  contextLine: string;
  isSelected: boolean;
  emotionalDot: boolean;
  muted?: boolean;
  href?: string;
  onClick: () => void;
};

const rowStyle = (isSelected: boolean): React.CSSProperties => ({
  display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px',
  background: isSelected ? '#FEF4E4' : 'transparent', border: 'none', borderRadius: 6,
  cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'none',
});

function RowContent({ name, daysLabel, contextLine, emotionalDot, muted }: Omit<QueueRowProps, 'isSelected' | 'onClick' | 'href'>) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {emotionalDot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9C3F25', display: 'inline-block' }} />}
          <div style={{ fontSize: 14, fontWeight: muted ? 500 : 600, color: muted ? '#615C52' : '#1C1A17' }}>{name}</div>
        </div>
        <div style={{ fontSize: 10, color: muted ? '#8B8579' : '#615C52' }}>{daysLabel}</div>
      </div>
      <div style={{ fontSize: 11, color: '#8B8579', lineHeight: 1.3 }}>{contextLine}</div>
    </>
  );
}

export function QueueRow({ name, daysLabel, contextLine, isSelected, emotionalDot, muted, href, onClick }: QueueRowProps) {
  if (href) {
    return (
      <Link href={href} onClick={onClick} style={rowStyle(isSelected)}>
        <RowContent name={name} daysLabel={daysLabel} contextLine={contextLine} emotionalDot={emotionalDot} muted={muted} />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} style={rowStyle(isSelected)}>
      <RowContent name={name} daysLabel={daysLabel} contextLine={contextLine} emotionalDot={emotionalDot} muted={muted} />
    </button>
  );
}
