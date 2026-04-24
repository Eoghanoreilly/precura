"use client";

import React, { useEffect, useState } from "react";
import { CaseHeader } from "./CaseHeader";
import { ContinuityBanner, type ContinuityEvent } from "./ContinuityBanner";
import { PreReadTile } from "./PreReadTile";
import { FlaggedMarkerTile, type FlaggedMarkerTileProps } from "./FlaggedMarkerTile";
import { Composer } from "./Composer";
import { OutcomeButtons } from "./OutcomeButtons";
import { AuditFooter } from "./AuditFooter";
import type { ChooserItem } from "./InsertChipChooser";
import type { PrecuraPreRead } from "@/lib/data/preReads";

export type CasePageData = {
  memberId: string;
  memberName: string;
  memberInitials: string;
  memberAgeYears: number | null;
  memberJoinedAt: string;
  panelId: string;
  panelCount: number;
  continuityEvents: ContinuityEvent[];
  preRead: PrecuraPreRead | null;
  flaggedMarkers: FlaggedMarkerTileProps[];
  autoDraftedOpener: string;
  chatQuoteItems: ChooserItem[];
  trendItems: ChooserItem[];
  markerItems: ChooserItem[];
  emotionalTriggered: boolean;
  previousNoteCount: number;
  openedByName: string;
  openedAtISO: string;
};

export function CasePage({ data }: { data: CasePageData }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/panel/${data.panelId}/views`, { method: 'POST' }).catch(() => {});
  }, [data.panelId]);

  const acknowledge = async () => {
    setBusy(true);
    await fetch(`/api/panel/${data.panelId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    setBusy(false);
  };

  const postAndAcknowledge = async () => {
    setBusy(true);
    await fetch(`/api/panel/${data.panelId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    setNote('');
    setBusy(false);
  };

  const defer = async (reason: string) => {
    setBusy(true);
    await fetch(`/api/panel/${data.panelId}/defer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setBusy(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, background: '#FBF7F0' }}>
      <CaseHeader
        name={data.memberName}
        initials={data.memberInitials}
        ageYears={data.memberAgeYears}
        panelCount={data.panelCount}
        joinedAt={data.memberJoinedAt}
        emotionalTriggered={data.emotionalTriggered}
      />
      <ContinuityBanner events={data.continuityEvents} />
      {data.preRead && <PreReadTile narrative={data.preRead.narrative} facts={data.preRead.facts_json} />}
      {data.flaggedMarkers.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: data.flaggedMarkers.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
          {data.flaggedMarkers.map((m, i) => <FlaggedMarkerTile key={i} {...m} />)}
        </div>
      )}
      <Composer
        autoDraftedOpener={data.autoDraftedOpener}
        chatQuoteItems={data.chatQuoteItems}
        trendItems={data.trendItems}
        markerItems={data.markerItems}
        value={note} onChange={setNote}
      />
      <OutcomeButtons
        noteBody={note}
        onAcknowledge={acknowledge}
        onPostAndAcknowledge={postAndAcknowledge}
        onDefer={defer}
        disabled={busy}
      />
      <AuditFooter
        openedByName={data.openedByName}
        openedAtISO={data.openedAtISO}
        previousNoteCount={data.previousNoteCount}
        panelId={data.panelId}
      />
    </div>
  );
}
