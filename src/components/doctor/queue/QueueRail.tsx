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
  return (
    <div style={{
      background: '#FDFBF6', border: '1px solid #E0D9C8', borderRadius: 12,
      overflow: 'auto', fontFamily: 'var(--font-sans)',
    }}>
      <QueueSection title="Pending review" count={pending.length}>
        {pending.map((p) => (
          <QueueRow key={p.id} {...p} isSelected={activePatientId === p.id} onClick={() => onSelect(p.id)} />
        ))}
      </QueueSection>
      <QueueSection title="Awaiting your note" count={awaitingNote.length}>
        {awaitingNote.map((p) => (
          <QueueRow key={p.id} {...p} isSelected={activePatientId === p.id} onClick={() => onSelect(p.id)} />
        ))}
      </QueueSection>
      <QueueSection title="Recently reviewed" count={recentlyReviewed.length}>
        {recentlyReviewed.map((p) => (
          <QueueRow key={p.id} {...p} muted isSelected={activePatientId === p.id} onClick={() => onSelect(p.id)} />
        ))}
      </QueueSection>
      {/* Deep-link affordance */}
      <div style={{ borderTop: '1px solid #E0D9C8', padding: '6px 10px' }}>
        {activePatientId && (
          <a
            href={`/doctor/patient/${activePatientId}`}
            style={{ fontSize: 11, color: '#445A4A', textDecoration: 'underline', textDecorationColor: '#CBDACC', textUnderlineOffset: 3 }}
          >
            Open full patient file
          </a>
        )}
      </div>
    </div>
  );
}
