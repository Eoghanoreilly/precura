"use client";

import React, { useState } from "react";

export type OutcomeButtonsProps = {
  noteBody: string;
  onAcknowledge: () => void;
  onPostAndAcknowledge: () => void;
  onDefer: (reason: string) => void;
  disabled?: boolean;
};

export function OutcomeButtons({ noteBody, onAcknowledge, onPostAndAcknowledge, onDefer, disabled }: OutcomeButtonsProps) {
  const [showDeferReason, setShowDeferReason] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E0D9C8', borderRadius: 14, padding: '16px 16px 14px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#615C52', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>Close review</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button type="button" disabled={disabled} onClick={onAcknowledge} style={btnStyle('sage-soft')}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#445A4A' }}>Acknowledge</div>
          <div style={{ fontSize: 11, color: '#728C76', marginTop: 2 }}>No action needed</div>
        </button>
        <button type="button" disabled={disabled || !noteBody.trim()} onClick={onPostAndAcknowledge} style={btnStyle('sage-primary', !noteBody.trim())}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Post note &amp; acknowledge</div>
          <div style={{ fontSize: 11, color: '#CBDACC', marginTop: 2 }}>{noteBody.trim() ? 'Primary action' : 'Write a note first'}</div>
        </button>
        <button type="button" disabled={disabled} onClick={() => setShowDeferReason((v) => !v)} style={btnStyle('cream')}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#615C52' }}>Defer</div>
          <div style={{ fontSize: 11, color: '#8B8579', marginTop: 2 }}>Reason required</div>
        </button>
        {showDeferReason && (
          <div style={{ background: '#FDFBF6', border: '1px solid #E0D9C8', borderRadius: 10, padding: 10, marginTop: 4 }}>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for deferring (required)"
              style={{ width: '100%', minHeight: 50, fontFamily: 'inherit', fontSize: 13, color: '#1C1A17', background: '#FFFFFF', border: '1px solid #E0D9C8', borderRadius: 8, padding: 8, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <button type="button" onClick={() => { setShowDeferReason(false); setReason(''); }} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #E0D9C8', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#615C52', fontFamily: 'inherit' }}>Cancel</button>
              <button type="button" disabled={!reason.trim()} onClick={() => { onDefer(reason.trim()); setShowDeferReason(false); setReason(''); }} style={{ padding: '6px 12px', background: reason.trim() ? '#445A4A' : '#C0C0C0', border: 'none', borderRadius: 8, cursor: reason.trim() ? 'pointer' : 'default', fontSize: 12, color: '#FFFFFF', fontFamily: 'inherit', fontWeight: 600 }}>Confirm defer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(variant: 'sage-soft' | 'sage-primary' | 'cream', disabledLook = false): React.CSSProperties {
  if (variant === 'sage-primary') return { width: '100%', background: disabledLook ? '#C0C0C0' : '#445A4A', border: '1px solid ' + (disabledLook ? '#C0C0C0' : '#445A4A'), borderRadius: 10, padding: '11px 12px', cursor: disabledLook ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'inherit' };
  if (variant === 'sage-soft') return { width: '100%', background: '#ECF1EC', border: '1px solid #CBDACC', borderRadius: 10, padding: '11px 12px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' };
  return { width: '100%', background: '#FDFBF6', border: '1px solid #E0D9C8', borderRadius: 10, padding: '11px 12px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' };
}
