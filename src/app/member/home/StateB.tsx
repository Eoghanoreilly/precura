"use client";

import React from "react";
import { EditorialColumn, Hero, SubGrid, SystemTile, Button } from "@/components/layout";
import type { PanelWithBiomarkers, Annotation, Biomarker } from "@/lib/data/types";
import type { SystemTileMarker } from "@/components/layout";
import { BodySystemsGrid } from "./blocks/BodySystemsGrid";
import { DoctorProgressTrack } from "./blocks/DoctorProgressTrack";
import { getFlaggedMarkers, getCategoryForMarker } from "./categoryMap";
import { getPlainName } from "./plainNames";

export interface StateBProps {
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
  marginBottom: "var(--sp-4)",
  margin: 0,
};

// Translate the Biomarker.status ("normal" | "borderline" | "abnormal") into
// SystemTile's direction-aware status ("normal" | "low" | "high" | "critical")
// by comparing value to its reference range.
function mapStatus(m: Biomarker): SystemTileMarker["status"] {
  if (m.status === "normal") return "normal";
  const low = m.ref_range_low;
  const high = m.ref_range_high;
  if (m.status === "abnormal") return "critical";
  if (high != null && m.value > high) return "high";
  if (low != null && m.value < low) return "low";
  return "high";
}

export function StateB({ panels }: StateBProps) {
  const latest = panels[0];
  if (!latest) return null;

  const biomarkers = latest.biomarkers ?? [];
  const flagged = getFlaggedMarkers(biomarkers).slice(0, 3);

  const headline = flagged.length > 0
    ? `Your first panel flagged ${flagged.length} marker${flagged.length > 1 ? "s" : ""}. Here is what is happening.`
    : `Everything in your first panel sits within range. Here is the read.`;

  return (
    <EditorialColumn>
      <Hero
        tone="quiet"
        eyebrow={<em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>Your first panel</em>}
        display={headline}
        body={<p>A licensed doctor is reviewing this panel. You will see a note here when the review is done.</p>}
        ctas={<Button tone="secondary" href={`/member/panels/${latest.id}`}>See the full panel</Button>}
      />

      {flagged.length > 0 && (
        <section style={{ marginBottom: "var(--sp-8)" }}>
          <h2 style={{ ...SECTION_TITLE_STYLE, marginBottom: "var(--sp-4)" }}>Flagged markers</h2>
          <SubGrid columns={3}>
            {flagged.map((m) => (
              <SystemTile
                key={m.id}
                system={getCategoryForMarker(m.short_name)}
                marker={{
                  shortName: m.short_name,
                  value: m.value,
                  unit: m.unit,
                  refLow: m.ref_range_low ?? 0,
                  refHigh: m.ref_range_high ?? 1,
                  status: mapStatus(m),
                  plainName: getPlainName(m.short_name, m),
                }}
              />
            ))}
          </SubGrid>
        </section>
      )}

      <section style={{ marginBottom: "var(--sp-8)" }}>
        <h2 style={{ ...SECTION_TITLE_STYLE, marginBottom: "var(--sp-4)" }}>Body systems</h2>
        <BodySystemsGrid biomarkers={biomarkers} />
      </section>

      <DoctorProgressTrack />
    </EditorialColumn>
  );
}
