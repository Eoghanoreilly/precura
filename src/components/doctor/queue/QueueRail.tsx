"use client";

import React from "react";
import { QueueRow, type QueueRowProps } from "./QueueRow";
import { QueueSection } from "./QueueSection";

export type QueueItem = QueueRowProps & { id: string };

export type QueueRailProps = {
  pending: QueueItem[];
  awaitingNote: QueueItem[];
  recentlyReviewed: QueueItem[];
  activePatientId: string | null;
  onSelect: (id: string | null) => void;
};

export function QueueRail({ pending, awaitingNote, recentlyReviewed, activePatientId, onSelect }: QueueRailProps) {
  const total = pending.length + awaitingNote.length + recentlyReviewed.length;

  return (
    <aside
      style={{
        background: '#FDFBF6',
        border: '1px solid #E0D9C8',
        borderRadius: 14,
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 2px rgba(28,26,23,0.04), 0 12px 28px rgba(28,26,23,0.06)',
      }}
    >
      {/* Tray header */}
      <div
        style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid #EEE9DB',
          background: 'linear-gradient(180deg, #FEF4E4, #FDFBF6)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#615C52',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 4,
          }}
        >
          Patient list
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#1C1A17', letterSpacing: '-0.02em' }}>
            {total} patient{total === 1 ? '' : 's'}
          </div>
          {pending.length > 0 && (
            <div
              style={{
                background: '#FCEFE7',
                border: '1px solid #EFB59B',
                borderRadius: 999,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 700,
                color: '#9C3F25',
                letterSpacing: '0.02em',
              }}
            >
              {pending.length} pending
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 6px 10px' }}>
        {pending.length > 0 && (
          <QueueSection title="Pending review" count={pending.length}>
            {pending.map((p) => (
              <QueueRow key={p.id} {...p} isSelected={activePatientId === p.id} onClick={() => onSelect(p.id)} />
            ))}
          </QueueSection>
        )}
        {awaitingNote.length > 0 && (
          <QueueSection title="Awaiting your note" count={awaitingNote.length}>
            {awaitingNote.map((p) => (
              <QueueRow key={p.id} {...p} isSelected={activePatientId === p.id} onClick={() => onSelect(p.id)} />
            ))}
          </QueueSection>
        )}
        {recentlyReviewed.length > 0 && (
          <QueueSection title="Recently reviewed" count={recentlyReviewed.length}>
            {recentlyReviewed.map((p) => (
              <QueueRow key={p.id} {...p} muted isSelected={activePatientId === p.id} onClick={() => onSelect(p.id)} />
            ))}
          </QueueSection>
        )}
        {total === 0 && (
          <div
            style={{
              padding: '32px 14px',
              textAlign: 'center',
              fontSize: 12,
              color: '#8B8579',
              lineHeight: 1.5,
            }}
          >
            No patients yet.
          </div>
        )}
      </div>

      {/* Footer deep-link */}
      {activePatientId && (
        <div
          style={{
            borderTop: '1px solid #EEE9DB',
            padding: '10px 14px',
            background: '#FDFBF6',
          }}
        >
          <a
            href={`/doctor/patient/${activePatientId}`}
            style={{
              fontSize: 11,
              color: '#445A4A',
              textDecoration: 'underline',
              textDecorationColor: '#CBDACC',
              textUnderlineOffset: 3,
            }}
          >
            Open full patient file
          </a>
        </div>
      )}
    </aside>
  );
}
