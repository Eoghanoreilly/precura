import React from "react";
import type { PanelWithBiomarkers } from "@/lib/data/types";
import { C, DOCTOR } from "@/components/member/tokens";
import { getFlaggedMarkers } from "./categoryMap";

const SERIF_FONT = 'Georgia, "Times New Roman", serif';

export function buildDynamicHeadline(
  latest: PanelWithBiomarkers,
  previous: PanelWithBiomarkers
): React.ReactNode {
  const improved: string[] = [];
  const concerns: string[] = [];

  for (const m of latest.biomarkers) {
    const prev = previous.biomarkers.find(
      (p) => p.short_name === m.short_name
    );
    if (!prev) continue;

    if (prev.status !== "normal" && m.status === "normal") {
      improved.push(m.short_name);
    }
    if (m.status !== "normal" && prev.status === "normal") {
      concerns.push(m.short_name);
    }
  }

  const wins =
    improved.length > 0
      ? `Your ${improved[0]}${improved[0] === "D-vitamin" || improved[0] === "25-OH-Vitamin-D" ? " (vitamin D)" : ""} recovered.`
      : "Mostly good news.";

  const worry =
    concerns.length > 0
      ? `${concerns[0]} is worth watching.`
      : improved.length > 0
        ? ""
        : "Everything looks stable.";

  return (
    <>
      {wins}{" "}
      {worry && (
        <span
          style={{
            fontStyle: "italic",
            fontFamily: SERIF_FONT,
            fontWeight: 400,
            color: C.inkMuted,
          }}
        >
          {worry}
        </span>
      )}
    </>
  );
}

export function buildDynamicSubheadline(
  latest: PanelWithBiomarkers,
  previous: PanelWithBiomarkers,
  panelCount: number
): string {
  const flagged = getFlaggedMarkers(latest.biomarkers);
  const total = latest.biomarkers.length;
  const inRange = total - flagged.length;

  if (flagged.length > 0) {
    return `Your latest panel shows ${inRange} of ${total} markers in range. ${flagged.length} marker${flagged.length > 1 ? "s" : ""} need${flagged.length === 1 ? "s" : ""} attention. Dr. ${DOCTOR.firstName} has reviewed the results.`;
  }
  return `All ${total} markers are in healthy range across your latest panel. ${panelCount} panels on file.`;
}
