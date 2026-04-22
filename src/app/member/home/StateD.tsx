"use client";

import React from "react";
import {
  EditorialColumn,
  Hero,
  SubGrid,
  NarrativeCard,
  Button,
} from "@/components/layout";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
} from "@/lib/data/types";
import { BodySystemsGrid } from "./blocks/BodySystemsGrid";
import { RiskTrajectory } from "./blocks/RiskTrajectory";
import { Sparkline } from "./blocks/Sparkline";
import {
  formatPanelDate,
  getPanelYearRange,
} from "./categoryMap";
import { getPlainName } from "./plainNames";

// ============================================================================
// StateD - multi-panel trajectory.
//
// Renders when the user has multiple panels but no particularly-new results
// or doctor note. Layout:
//   - quiet hero ("your trajectory so far")
//   - 2-up: trajectory chart (left) + latest doctor note (right)
//   - 4-up sparkline row for HbA1c / LDL / TSH / CRP
//   - 3-up body systems grid from the latest panel
// ============================================================================

export interface StateDProps {
  panels: PanelWithBiomarkers[];
  annotations?: Annotation[];
  userName?: string;
  // Optional props carried through the router. markerHistories is what feeds
  // the 4-up sparklines; when missing the row renders empty placeholders.
  markerHistories?: Record<string, MarkerHistory[]>;
  systems?: { name: string; count: number; flagged: boolean }[];
  latestDoctorAnnotation?: Annotation | null;
}

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: "var(--text-micro)",
  fontWeight: 600,
  color: "var(--ink-faint)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: "var(--sp-8) 0 var(--sp-4)",
};

// Markers we surface as mini sparklines on the home page. These are the
// "big four" that doctors ask about first; body-system drill-down sits below
// for everything else.
const TRACKED_SPARKLINES: { short: string; fallbackPlain: string }[] = [
  { short: "HbA1c", fallbackPlain: "long-term blood sugar" },
  { short: "LDL", fallbackPlain: "bad cholesterol" },
  { short: "TSH", fallbackPlain: "thyroid function" },
  { short: "CRP", fallbackPlain: "inflammation" },
];

// Fallback for when we can't find a direct short_name match in markerHistories
// (e.g. real Swedish labs report "P-LDL" or "LDL-kolesterol"). Match loosely.
function findHistoryForMarker(
  short: string,
  markerHistories: Record<string, MarkerHistory[]>
): { history: MarkerHistory[]; matchedKey: string | null } {
  if (markerHistories[short] && markerHistories[short].length > 0) {
    return { history: markerHistories[short], matchedKey: short };
  }
  const target = short.toLowerCase();
  for (const key of Object.keys(markerHistories)) {
    const stripped = key
      .replace(/^(fP-|Erc\(B\)-|Pt-|P-|S-|B-|U-)/, "")
      .toLowerCase()
      .trim();
    if (stripped === target || stripped.startsWith(target + "-") || stripped.startsWith(target + ",")) {
      return { history: markerHistories[key], matchedKey: key };
    }
  }
  return { history: [], matchedKey: null };
}

// Build a synthetic risk trajectory from the panels themselves. Precura does
// not (yet) run FINDRISC on stored panels, so we approximate: value =
// percentage of flagged biomarkers per panel, scaled to read on the chart's
// 0-30 risk axis. Projection is a flat hold from the latest value. This is
// honest about trend direction without inventing a model output.
function buildRiskSeries(panels: PanelWithBiomarkers[]): {
  history: { year: string; value: number }[];
  projection: { year: string; value: number }[];
} {
  if (panels.length === 0) return { history: [], projection: [] };

  const sorted = [...panels].sort(
    (a, b) =>
      new Date(a.panel_date).getTime() - new Date(b.panel_date).getTime()
  );

  const history = sorted.map((p) => {
    const total = p.biomarkers?.length ?? 0;
    const flagged = (p.biomarkers ?? []).filter(
      (b) => b.status !== "normal"
    ).length;
    const pct = total > 0 ? (flagged / total) * 100 : 0;
    // Scale 0-100% flagged into the 0-30 risk band. Panels with ~20% flagged
    // land around "moderate"; heavier flagging pushes into the upper band.
    const value = Math.min(30, Math.round(pct * 0.3 * 10) / 10);
    return {
      year: String(new Date(p.panel_date).getFullYear()),
      value,
    };
  });

  const last = history[history.length - 1];
  const lastYear = Number(last.year);
  const projection = [
    { year: String(lastYear), value: last.value },
    { year: String(lastYear + 1), value: last.value },
    { year: String(lastYear + 2), value: last.value },
  ];

  return { history, projection };
}

export function StateD({ panels, annotations = [], markerHistories = {} }: StateDProps) {
  const latest = panels[0];
  if (!latest) return null;

  const latestNote = [...annotations]
    .filter((a) => a.author?.role === "doctor" || a.author?.role === "both")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

  const yearRange = getPanelYearRange(panels);
  const { history, projection } = buildRiskSeries(panels);

  const hasRiskSeries = history.length >= 2 && projection.length >= 2;

  return (
    <EditorialColumn>
      <Hero
        tone="quiet"
        eyebrow={
          <em
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--sage-deep)",
              fontStyle: "italic",
            }}
          >
            Trajectory / {yearRange}
          </em>
        }
        display="Your trajectory so far."
        body={
          <p>
            Here is how your key markers have moved across {panels.length}{" "}
            panels. Your most recent panel was on{" "}
            {formatPanelDate(latest.panel_date)}.
          </p>
        }
        ctas={
          <Button tone="secondary" href={`/member/panels/${latest.id}`}>
            View latest panel
          </Button>
        }
      />

      <SubGrid columns={2} gap="normal">
        {hasRiskSeries ? (
          <RiskTrajectory
            history={history}
            projection={projection}
            modelName="Overall panel signal"
            caption="Based on the share of markers outside range in each panel. A real risk model (FINDRISC and friends) will slot in here once we run it on stored panels."
          />
        ) : (
          <NarrativeCard title="Trajectory">
            <p>
              Not enough panels yet to draw a trend. Your next panel will
              unlock this view.
            </p>
          </NarrativeCard>
        )}

        <NarrativeCard title="Latest from your doctor">
          {latestNote ? (
            <>
              {String(latestNote.body ?? "")
                .split("\n")
                .filter((line) => line.trim().length > 0)
                .slice(0, 2)
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              <div style={{ marginTop: "var(--sp-3)" }}>
                <Button tone="secondary" href="/member/messages">
                  Read all notes
                </Button>
              </div>
            </>
          ) : (
            <p>
              No notes from your doctor yet. New notes show up here as soon
              as they are posted.
            </p>
          )}
        </NarrativeCard>
      </SubGrid>

      <h2 style={SECTION_TITLE_STYLE}>Key markers over time</h2>
      <SubGrid columns={4} gap="normal">
        {TRACKED_SPARKLINES.map(({ short, fallbackPlain }) => {
          const { history: h, matchedKey } = findHistoryForMarker(
            short,
            markerHistories
          );
          const points = h.map((entry) => entry.value);
          const latestValue = points[points.length - 1];
          const biomarker = (latest.biomarkers ?? []).find(
            (b) =>
              b.short_name === short ||
              (matchedKey != null && b.short_name === matchedKey)
          );
          const plainName = biomarker
            ? getPlainName(biomarker.short_name, biomarker)
            : fallbackPlain;
          const unit = biomarker?.unit ?? "";

          return (
            <div
              key={short}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line-soft)",
                borderRadius: "var(--radius-card)",
                padding: "var(--sp-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-3)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "var(--text-meta)",
                    fontWeight: 600,
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {short}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--ink-faint)",
                    marginTop: 2,
                  }}
                >
                  {plainName}
                </div>
              </div>

              {points.length >= 2 ? (
                <Sparkline
                  points={points}
                  color="var(--terracotta)"
                  width={160}
                  height={36}
                />
              ) : (
                <div
                  style={{
                    height: 36,
                    fontSize: "var(--text-micro)",
                    color: "var(--ink-faint)",
                    fontStyle: "italic",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  Not enough data yet.
                </div>
              )}

              {latestValue != null && (
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    fontSize: "var(--text-section)",
                    fontWeight: 600,
                    color: "var(--ink)",
                    letterSpacing: "-0.022em",
                  }}
                >
                  {latestValue}
                  {unit && (
                    <span
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--ink-faint)",
                        fontWeight: 400,
                        marginLeft: 4,
                      }}
                    >
                      {unit}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </SubGrid>

      <h2 style={SECTION_TITLE_STYLE}>
        Body systems / latest panel
      </h2>
      <BodySystemsGrid biomarkers={latest.biomarkers ?? []} />
    </EditorialColumn>
  );
}
