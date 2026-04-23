"use client";

import React from "react";
import { EditorialColumn, Hero, SubGrid, SystemTile } from "@/components/layout";
import type { PanelWithBiomarkers, Annotation } from "@/lib/data/types";
import { getSeasonalContext } from "./seasonalContext";
import { getCategoryForMarker, getKeyMarker } from "./categoryMap";
import { getPlainName } from "./plainNames";

export interface StateEProps {
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
  status: "normal" | "borderline" | "abnormal",
  value: number,
  refHigh: number,
): "normal" | "low" | "high" | "critical" {
  if (status === "normal") return "normal";
  if (status === "abnormal") return "critical";
  return value > refHigh ? "high" : "low";
}

export function StateE({ panels }: StateEProps) {
  const latest = panels[0];
  if (!latest) return null;
  const biomarkers = latest.biomarkers ?? [];
  const season = getSeasonalContext();
  const grouped = biomarkers.reduce<Record<string, typeof biomarkers>>((acc, b) => {
    const sys = getCategoryForMarker(b.short_name);
    if (!acc[sys]) acc[sys] = [];
    acc[sys].push(b);
    return acc;
  }, {});

  return (
    <EditorialColumn>
      <Hero
        tone="quiet"
        eyebrow={<em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>Steady</em>}
        display="You're in a good rhythm."
        body={
          <>
            <p>{season.body}</p>
            <p>Your last panel sits well within range, and the most recent note from your doctor does not flag anything new.</p>
          </>
        }
      />

      <h2 style={SECTION_TITLE_STYLE}>Body systems · quiet view</h2>
      <SubGrid columns={3}>
        {Object.entries(grouped).map(([system, markers]) => {
          const key = getKeyMarker(markers);
          if (!key) return null;
          const refLow = key.ref_range_low ?? 0;
          const refHigh = key.ref_range_high ?? 1;
          return (
            <div
              key={system}
              style={{
                background: "var(--sage-tint)",
                borderRadius: "var(--radius)",
                padding: 2,
              }}
            >
              <SystemTile
                system={system}
                marker={{
                  shortName: key.short_name,
                  value: key.value,
                  unit: key.unit,
                  refLow,
                  refHigh,
                  status: mapStatus(key.status, key.value, refHigh),
                  plainName: getPlainName(key.short_name, key),
                }}
              />
            </div>
          );
        })}
      </SubGrid>
    </EditorialColumn>
  );
}

