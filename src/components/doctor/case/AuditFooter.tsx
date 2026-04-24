"use client";

import React, { useState } from "react";
import { ViewHistoryModal } from "./ViewHistoryModal";

export type AuditFooterProps = {
  openedByName: string;
  openedAtISO: string;
  previousNoteCount: number;
  panelId: string;
};

export function AuditFooter({ openedByName, openedAtISO, previousNoteCount, panelId }: AuditFooterProps) {
  const [open, setOpen] = useState(false);
  const dt = new Date(openedAtISO);
  const formatted = `${dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')} CET`;

  return (
    <>
      <div style={{
        background: '#FBF7F0', border: '1px solid #EEE9DB', borderRadius: 10,
        padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 11,
        color: '#8B8579', letterSpacing: '0.01em',
      }}>
        Opened by {openedByName} on {formatted} - {previousNoteCount} previous note{previousNoteCount === 1 ? '' : 's'} -{' '}
        <button
          type="button" onClick={() => setOpen(true)}
          style={{ color: '#445A4A', textDecoration: 'underline', textDecorationColor: '#CBDACC', textUnderlineOffset: 3, background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
        >view history</button>
      </div>
      {open && <ViewHistoryModal panelId={panelId} onClose={() => setOpen(false)} />}
    </>
  );
}
