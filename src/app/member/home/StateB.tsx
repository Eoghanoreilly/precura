"use client";

import React from "react";
import { EditorialColumn, Hero, SubGrid, SystemTile, Button } from "@/components/layout";
import type { PanelWithBiomarkers, Annotation, Biomarker } from "@/lib/data/types";
import { BodySystemsGrid } from "./blocks/BodySystemsGrid";
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
  margin: "0 0 var(--sp-4)",
};

function mapStatus(
  status: Biomarker["status"],
  value: number,
  refHigh: number,
): "normal" | "low" | "high" | "critical" {
  if (status === "normal") return "normal";
  if (status === "abnormal") return "critical";
  return value > refHigh ? "high" : "low";
}

export function StateB({ panels }: StateBProps) {
  const latest = panels[0];
  if (!latest) return null;

  const biomarkers = latest.biomarkers ?? [];
  const flagged = getFlaggedMarkers(biomarkers);

  const headline = flagged.length > 0
    ? `Your first panel flagged ${flagged.length} marker${flagged.length > 1 ? "s" : ""}. Here is what is happening.`
    : `Everything in your first panel sits within range. Here is the read.`;

  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        eyebrow={<em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>Your first panel</em>}
        display={headline}
        body={<p>A licensed doctor is reviewing this panel. You will see a note here when the review is done.</p>}
        ctas={<Button tone="sage" href={`/member/panels/${latest.id}`}>See the full panel</Button>}
      />

      {flagged.length > 0 && (
        <section style={{ marginBottom: "var(--sp-8)" }}>
          <h2 style={SECTION_TITLE_STYLE}>Flagged markers</h2>
          <SubGrid columns={3}>
            {flagged.slice(0, 3).map((m) => {
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
        </section>
      )}

      <section>
        <h2 style={SECTION_TITLE_STYLE}>Body systems</h2>
        <BodySystemsGrid biomarkers={biomarkers} />
      </section>
    </EditorialColumn>
  );
}
