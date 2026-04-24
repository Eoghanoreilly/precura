"use client";

import React from "react";
import { Sparkline } from "../Sparkline";

export type FlaggedMarkerTileProps = {
  plainEnglishName: string;
  swedishPrefix: string;
  value: number;
  unit: string;
  refLow: number | null;
  refHigh: number | null;
  direction: 'above' | 'below';
  history: number[];
};

export function FlaggedMarkerTile(props: FlaggedMarkerTileProps) {
  const isBelow = props.direction === 'below';
  const accent = isBelow ? '#c43030' : '#b87800';
  const bg = isBelow ? '#fff5f5' : '#fffbf0';
  const border = isBelow ? '#f0c8c8' : '#f0e0b0';
  const rangeLabel = props.refLow !== null && props.refHigh !== null
    ? `Ref: ${props.refLow} - ${props.refHigh} ${props.unit}`
    : props.refHigh !== null
      ? `Ref: under ${props.refHigh} ${props.unit}`
      : props.refLow !== null
        ? `Ref: over ${props.refLow} ${props.unit}`
        : '';

  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 12,
      padding: '16px 16px 14px', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
        {isBelow ? 'Below range' : 'Above range'}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>
        {props.plainEnglishName} <span style={{ color: '#615C52', fontWeight: 400, fontSize: 11 }}>({props.swedishPrefix})</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: accent, letterSpacing: '-1px' }}>{props.value}</span>
        <span style={{ fontSize: 13, color: '#888' }}>{props.unit}</span>
      </div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>{rangeLabel}</div>
      <Sparkline values={props.history} color={accent} ariaLabel={`${props.plainEnglishName} trend`} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#aaa', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
        {props.history.map((v, i) => <span key={i}>{v}</span>)}
      </div>
    </div>
  );
}
