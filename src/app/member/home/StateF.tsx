"use client";

import React from "react";
import { EditorialColumn, Hero, SubGrid, SystemTile, Button } from "@/components/layout";
import type { PanelWithBiomarkers, Annotation, Biomarker } from "@/lib/data/types";
import { BodySystemsGrid } from "./blocks/BodySystemsGrid";
import { WhatMoved, type MarkerChange } from "./blocks/WhatMoved";
import { getFlaggedMarkers, formatPanelDate, getCategoryForMarker } from "./categoryMap";
import { getPlainName } from "./plainNames";

export interface StateFProps {
  panels: PanelWithBiomarkers[];
  annotations?: Annotation[];
  userName?: string;
}

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: "var(--text-micro)",
  fontWeight: 600,
  color: "var(--ink-faint)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: "var(--sp-8) 0 var(--sp-4)",
};

// Translate the Biomarker.status ("normal" | "borderline" | "abnormal") into
// SystemTile's direction-aware status ("normal" | "low" | "high" | "critical")
// by comparing value to its reference range.
function mapStatus(
  status: Biomarker["status"],
  value: number,
  refHigh: number,
): "normal" | "low" | "high" | "critical" {
  if (status === "normal") return "normal";
  if (status === "abnormal") return "critical";
  return value > refHigh ? "high" : "low";
}

// Build MarkerChange[] by diffing latest vs previous panel. WhatMoved's
// canonical signature is { markers, panelTotal, panelFlagged, panelInRange }.
function buildChanges(
  latest: PanelWithBiomarkers,
  previous: PanelWithBiomarkers,
): MarkerChange[] {
  const latestMarkers = latest.biomarkers ?? [];
  const prevMarkers = previous.biomarkers ?? [];
  const changes: MarkerChange[] = [];

  for (const m of latestMarkers) {
    const prev = prevMarkers.find((p) => p.short_name === m.short_name);
    if (!prev) continue;
    if (prev.value === m.value) continue;
    changes.push({
      name: m.short_name,
      plainName: getPlainName(m.short_name, m),
      unit: m.unit,
      previousValue: prev.value,
      currentValue: m.value,
      status: m.status,
    });
  }

  changes.sort((a, b) => {
    const sevA = a.status === "normal" ? 0 : 1;
    const sevB = b.status === "normal" ? 0 : 1;
    if (sevA !== sevB) return sevB - sevA;
    const deltaA = Math.abs(a.currentValue - a.previousValue) / (a.previousValue || 1);
    const deltaB = Math.abs(b.currentValue - b.previousValue) / (b.previousValue || 1);
    return deltaB - deltaA;
  });

  return changes.slice(0, 4);
}

export function StateF({ panels }: StateFProps) {
  const latest = panels[0];
  const previous = panels[1];
  if (!latest) return null;

  const biomarkers = latest.biomarkers ?? [];
  const flagged = getFlaggedMarkers(biomarkers);

  const panelTotal = biomarkers.length;
  const panelFlagged = flagged.length;
  const panelInRange = panelTotal - panelFlagged;

  const changes = previous ? buildChanges(latest, previous) : [];

  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        eyebrow={
          <span style={{ color: "var(--terracotta)", fontWeight: 600 }}>
            New results · {formatPanelDate(latest.panel_date)}
          </span>
        }
        display="Your latest panel is in. Here is what moved."
        body={<p>A licensed doctor is reviewing the full panel. Movers are shown first.</p>}
        ctas={<Button tone="secondary" href={`/member/panels/${latest.id}`}>See full panel</Button>}
      />

      {previous && changes.length > 0 && (
        <div style={{ marginBottom: "var(--sp-8)" }}>
          <WhatMoved
            markers={changes}
            panelTotal={panelTotal}
            panelFlagged={panelFlagged}
            panelInRange={panelInRange}
          />
        </div>
      )}

      <h2 style={SECTION_TITLE_STYLE}>Body systems · latest panel</h2>
      <BodySystemsGrid biomarkers={biomarkers} />

      {flagged.length > 0 && (
        <>
          <h2 style={SECTION_TITLE_STYLE}>Flagged this panel</h2>
          <SubGrid columns={2}>
            {flagged.slice(0, 4).map((m) => {
              const refLow = m.ref_range_low ?? 0;
              const refHigh = m.ref_range_high ?? 1;
              return (
                <SystemTile
                  key={m.id}
                  system={getCategoryForMarker(m.short_name)}
                  marker={{
                    shortName: m.short_name,
                    value: m.value,
                    unit: m.unit,
                    refLow,
                    refHigh,
                    status: mapStatus(m.status, m.value, refHigh),
                    plainName: getPlainName(m.short_name, m),
                  }}
                />
              );
            })}
          </SubGrid>
        </>
      )}
    </EditorialColumn>
  );
}
