import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarProps = {
  initials: string;
  patientId: string;
  size?: AvatarSize;
};

const SIZES: Record<AvatarSize, { wh: number; font: number }> = {
  sm: { wh: 24, font: 10 },
  md: { wh: 32, font: 11 },
  lg: { wh: 44, font: 14 },
};

const PALETTES = [
  ['#F6DDA0', '#EFB59B'],   // butter -> terracotta
  ['#D9E2DC', '#A8C0AE'],   // sage variants
  ['#EAD7E8', '#C4A8C3'],   // mauve variants
  ['#E8E4D6', '#D9CFB6'],   // sand variants
  ['#D6E2EA', '#A8B8C4'],   // dusk blue
  ['#F5DCC5', '#E0B898'],   // peach
];

function pickPalette(patientId: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < patientId.length; i++) hash = (hash * 31 + patientId.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length] as [string, string];
}

export function Avatar({ initials, patientId, size = 'md' }: AvatarProps) {
  const [a, b] = pickPalette(patientId);
  const { wh, font } = SIZES[size];
  return (
    <span
      aria-hidden
      style={{
        width: wh,
        height: wh,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${a}, ${b})`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: font,
        fontWeight: 600,
        color: 'var(--ink, #1C1A17)',
        flexShrink: 0,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
