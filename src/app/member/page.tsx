"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import type { MemberSidebarProps } from "@/components/member/MemberSidebar";
import {
  C,
  SYSTEM_FONT,
  DISPLAY_NUM,
  EYEBROW,
  DOCTOR,
} from "@/components/member/tokens";
import { MONO_FONT } from "@/components/home/tokens";
import { USE_REAL_DATA } from "@/components/member/data";
import { getCurrentUser, getPanels, getMarkerHistory } from "@/lib/data/panels";
import { getAllAnnotations } from "@/lib/data/annotations";
import type {
  Profile,
  PanelWithBiomarkers,
  Biomarker,
  Annotation,
  MarkerHistory,
} from "@/lib/data/types";

// ============================================================================
// State machine types
// ============================================================================

type HomeState = "A" | "B" | "C" | "D" | "E" | "F" | "G";

// ============================================================================
// Category grouping map for body systems
// ============================================================================

const CATEGORY_MAP: Record<string, string> = {
  HbA1c: "Blood sugar",
  "fP-Glukos": "Blood sugar",
  "f-Glucose": "Blood sugar",
  Kolesterol: "Cholesterol",
  LDL: "Cholesterol",
  HDL: "Cholesterol",
  Triglycerider: "Cholesterol",
  TSH: "Thyroid",
  fT4: "Thyroid",
  fT3: "Thyroid",
  ALAT: "Liver",
  ASAT: "Liver",
  GGT: "Liver",
  ALP: "Liver",
  Bilirubin: "Liver",
  Kreatinin: "Kidney",
  eGFR: "Kidney",
  Hb: "Iron / blood",
  Ferritin: "Iron / blood",
  Jarn: "Iron / blood",
  B12: "Iron / blood",
  Folat: "Iron / blood",
  CRP: "Inflammation",
  SR: "Inflammation",
  Leukocyter: "Inflammation",
  Testosteron: "Hormones",
  SHBG: "Hormones",
  "IGF-1": "Hormones",
  Kortisol: "Hormones",
  PSA: "Hormones",
  "D-vitamin": "Vitamins",
  "25-OH-Vitamin-D": "Vitamins",
};

const ALL_SYSTEMS = [
  "Blood sugar",
  "Cholesterol",
  "Thyroid",
  "Liver",
  "Kidney",
  "Iron / blood",
  "Inflammation",
  "Hormones",
  "Vitamins",
  "Minerals",
];

// Plain english names for common markers
const PLAIN_NAMES: Record<string, string> = {
  HbA1c: "long-term blood sugar",
  "fP-Glukos": "fasting blood sugar",
  "f-Glucose": "fasting blood sugar",
  LDL: "bad cholesterol",
  HDL: "good cholesterol",
  Kolesterol: "total cholesterol",
  Triglycerider: "blood fats",
  TSH: "thyroid function",
  fT4: "thyroid hormone",
  fT3: "thyroid hormone",
  ALAT: "liver enzyme",
  ASAT: "liver enzyme",
  GGT: "liver enzyme",
  ALP: "liver enzyme",
  Bilirubin: "bile pigment",
  Kreatinin: "kidney function",
  eGFR: "kidney filtration",
  Hb: "hemoglobin",
  Ferritin: "iron stores",
  Jarn: "iron",
  B12: "vitamin B12",
  Folat: "folate",
  CRP: "inflammation",
  SR: "inflammation rate",
  Leukocyter: "white blood cells",
  Testosteron: "testosterone",
  SHBG: "hormone binding",
  "IGF-1": "growth factor",
  Kortisol: "stress hormone",
  PSA: "prostate marker",
  "D-vitamin": "stored levels",
  "25-OH-Vitamin-D": "stored levels",
};

// ============================================================================
// Determine state from data
// ============================================================================

function determineState(
  panels: PanelWithBiomarkers[],
  annotations: Annotation[]
): HomeState {
  if (panels.length === 0) return "A";

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const doctorAnnotations = annotations.filter(
    (a) => a.author?.role === "doctor" || a.author?.role === "both"
  );

  const latestPanel = panels[0];
  const latestPanelDate = new Date(latestPanel.created_at);

  // Doctor annotations on the latest panel
  const latestPanelDoctorNotes = doctorAnnotations.filter(
    (a) => a.target_id === latestPanel.id
  );

  const hasDoctorReview = doctorAnnotations.length > 0;
  const latestAnnotation =
    doctorAnnotations.length > 0 ? doctorAnnotations[0] : null;
  const latestAnnotationDate = latestAnnotation
    ? new Date(latestAnnotation.created_at)
    : null;

  // G: New doctor note (created in last 7 days)
  if (latestAnnotationDate && latestAnnotationDate > sevenDaysAgo) {
    return "G";
  }

  // F: New results (panel created in last 7 days, 2+ panels to compare, no doctor annotation on it yet)
  if (
    panels.length >= 2 &&
    latestPanelDate > sevenDaysAgo &&
    latestPanelDoctorNotes.length === 0
  ) {
    return "F";
  }

  // E: Steady state (2+ panels, doctor reviewed, but everything is 7+ days old)
  if (
    panels.length >= 2 &&
    hasDoctorReview &&
    latestPanelDate <= sevenDaysAgo &&
    (!latestAnnotationDate || latestAnnotationDate <= sevenDaysAgo)
  ) {
    return "E";
  }

  // D: Multiple panels with doctor review
  if (panels.length >= 2 && hasDoctorReview) {
    return "D";
  }

  // C: Doctor reviewed (1+ panels, annotations from doctor)
  if (hasDoctorReview) {
    return "C";
  }

  // B: First panel, no review
  return "B";
}

// ============================================================================
// Data derivation helpers
// ============================================================================

function getPlainName(shortName: string, biomarker?: Biomarker): string {
  if (biomarker?.plain_name) return biomarker.plain_name;
  return PLAIN_NAMES[shortName] || "";
}

function getCategoryForMarker(shortName: string): string {
  // Direct match first
  if (CATEGORY_MAP[shortName]) return CATEGORY_MAP[shortName];

  // Strip Swedish specimen prefixes (P-, fP-, S-, B-, Pt-, Erc(B)-) and try again
  const stripped = shortName
    .replace(/^(fP-|Erc\(B\)-|Pt-|P-|S-|B-|U-)/, "")
    .trim();
  if (CATEGORY_MAP[stripped]) return CATEGORY_MAP[stripped];

  // Lowercase fuzzy matching for common variants
  const lower = stripped.toLowerCase();
  const FUZZY: Record<string, string> = {
    "alat": "Liver",
    "asat": "Liver",
    "ggt": "Liver",
    "alp": "Liver",
    "bilirubin": "Liver",
    "kolesterol": "Cholesterol",
    "ldl-kolesterol": "Cholesterol",
    "hdl-kolesterol": "Cholesterol",
    "triglycerid": "Cholesterol",
    "triglycerider": "Cholesterol",
    "apolipoprotein a1": "Cholesterol",
    "apolipoprotein b": "Cholesterol",
    "apo b/apo a1": "Cholesterol",
    "glukos": "Blood sugar",
    "hba1c": "Blood sugar",
    "tsh": "Thyroid",
    "t4, fritt": "Thyroid",
    "t3, fritt": "Thyroid",
    "ft4": "Thyroid",
    "ft3": "Thyroid",
    "kreatinin": "Kidney",
    "egfr": "Kidney",
    "cystatin": "Kidney",
    "hemoglobin": "Iron / blood",
    "ferritin": "Iron / blood",
    "järn": "Iron / blood",
    "jarn": "Iron / blood",
    "kobalamin": "Iron / blood",
    "b12": "Iron / blood",
    "folat": "Iron / blood",
    "erytrocyter": "Iron / blood",
    "evf": "Iron / blood",
    "mch": "Iron / blood",
    "mcv": "Iron / blood",
    "leukocyter": "Iron / blood",
    "trombocyter": "Iron / blood",
    "crp": "Inflammation",
    "sr": "Inflammation",
    "testosteron": "Hormones",
    "shbg": "Hormones",
    "igf-1": "Hormones",
    "kortisol": "Hormones",
    "psa": "Hormones",
    "25-oh vitamin d": "Vitamins",
    "d-vitamin": "Vitamins",
    "vitamin d": "Vitamins",
    "natrium": "Minerals",
    "kalium": "Minerals",
    "kalcium": "Minerals",
    "calcium": "Minerals",
    "magnesium": "Minerals",
    "urat": "Minerals",
    "homocystein": "Other",
  };

  if (FUZZY[lower]) return FUZZY[lower];
  return "Other";
}

function groupBiomarkersBySystem(
  biomarkers: Biomarker[]
): { name: string; count: number; flagged: boolean }[] {
  const systemCounts: Record<string, { total: number; flagged: number }> = {};

  for (const b of biomarkers) {
    const sys = getCategoryForMarker(b.short_name);
    if (!systemCounts[sys]) systemCounts[sys] = { total: 0, flagged: 0 };
    systemCounts[sys].total++;
    if (b.status !== "normal") systemCounts[sys].flagged++;
  }

  return ALL_SYSTEMS.map((name) => ({
    name,
    count: systemCounts[name]?.total || 0,
    flagged: (systemCounts[name]?.flagged || 0) > 0,
  })).filter((s) => s.count > 0);
}

function getFlaggedMarkers(biomarkers: Biomarker[]): Biomarker[] {
  return biomarkers.filter((b) => b.status !== "normal");
}

function formatPanelDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================================
// Sparkline SVG generator
// ============================================================================

function Sparkline({
  points,
  color,
  width = 80,
  height = 28,
}: {
  points: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (points.length < 2)
    return <div style={{ width, height, background: "transparent" }} />;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const pad = 4;

  const pts = points.map((p, i) => [
    (i / (points.length - 1)) * (width - 10) + 5,
    height - ((p - min) / range) * (height - pad * 2) - pad,
  ]);

  const d = "M" + pts.map((p) => p[0] + "," + p[1]).join("L");
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ width, height, display: "block" }}
    >
      <rect
        x="0"
        y={Math.round(height * 0.2)}
        width={width}
        height={Math.round(height * 0.5)}
        rx="2"
        fill="rgba(78,142,92,0.06)"
      />
      <path
        d={d}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="3.5"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ============================================================================
// Range bar for flagged markers
// ============================================================================

function RangeBar({
  value,
  refLow,
  refHigh,
  color,
}: {
  value: number;
  refLow: number | null;
  refHigh: number | null;
  color: string;
}) {
  const low = refLow ?? 0;
  const high = refHigh ?? value * 2;
  const scaleMax = Math.max(high * 1.5, value * 1.3);
  const greenLeftPct = (low / scaleMax) * 100;
  const greenWidthPct = ((high - low) / scaleMax) * 100;
  const dotPct = Math.min(Math.max((value / scaleMax) * 100, 3), 97);

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: 28,
          background: C.stone,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Green normal zone */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${greenLeftPct}%`,
            width: `${greenWidthPct}%`,
            background:
              "linear-gradient(90deg, rgba(78,142,92,0.22), rgba(78,142,92,0.12))",
            borderRadius: 14,
          }}
        />
        {/* Value dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${dotPct}%`,
            transform: "translate(-50%, -50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: color,
            border: "3px solid white",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.08)",
            zIndex: 1,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: C.inkFaint,
          marginTop: 6,
          padding: "0 2px",
        }}
      >
        <span>{low} {refLow !== null ? "" : ""}</span>
        <span style={{ color: C.good, fontWeight: 600 }}>
          {low} - {high} normal
        </span>
        <span>{Math.round(scaleMax)}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Shared style constants
// ============================================================================

const CARD_STYLE: React.CSSProperties = {
  background: "white",
  border: `1px solid ${C.lineCard}`,
  borderRadius: 18,
  boxShadow: C.shadowSoft,
};

const CARD_SAGE_STYLE: React.CSSProperties = {
  background: C.sageTint,
  border: `1px solid ${C.sageSoft}`,
  borderRadius: 18,
};

const PILL_TERRA: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 14px",
  background: C.terracottaTint,
  border: `1px solid ${C.terracottaSoft}`,
  borderRadius: 100,
  fontSize: 10,
  fontWeight: 700,
  color: C.terracottaDeep,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const PILL_SAGE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 14px",
  background: C.sageTint,
  border: `1px solid ${C.sageSoft}`,
  borderRadius: 100,
  fontSize: 10,
  fontWeight: 700,
  color: C.sageDeep,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const BTN_PRIMARY: React.CSSProperties = {
  padding: "14px 24px",
  background: C.terracotta,
  borderRadius: 12,
  color: C.canvasSoft,
  fontSize: 14,
  fontWeight: 600,
  textAlign: "center",
  cursor: "pointer",
  boxShadow: "0 6px 16px -6px rgba(201,87,58,0.35)",
  border: "none",
  fontFamily: SYSTEM_FONT,
  display: "block",
  width: "100%",
  textDecoration: "none",
};

const BTN_SECONDARY: React.CSSProperties = {
  padding: "14px 24px",
  background: "white",
  border: `1px solid ${C.lineCard}`,
  borderRadius: 12,
  fontSize: 14,
  color: C.inkSoft,
  textAlign: "center",
  cursor: "pointer",
  fontFamily: SYSTEM_FONT,
  display: "block",
  width: "100%",
  textDecoration: "none",
};

const BTN_SAGE: React.CSSProperties = {
  padding: "14px 24px",
  background: C.sageDeep,
  borderRadius: 12,
  color: C.canvasSoft,
  fontSize: 14,
  fontWeight: 600,
  textAlign: "center",
  cursor: "pointer",
  border: "none",
  fontFamily: SYSTEM_FONT,
  display: "block",
  width: "100%",
  textDecoration: "none",
};

const LINK_ACCENT: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  fontSize: 13,
  fontWeight: 600,
  color: C.terracotta,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: C.terracottaSoft,
  cursor: "pointer",
};

const DOC_AVATAR: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: C.canvasSoft,
  fontSize: 14,
  fontWeight: 700,
  flexShrink: 0,
};

const DOC_AVATAR_SM: React.CSSProperties = {
  ...DOC_AVATAR,
  width: 38,
  height: 38,
  fontSize: 12,
};

const SERIF_FONT = 'Georgia, "Times New Roman", serif';

// ============================================================================
// Animation variants
// ============================================================================

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

// ============================================================================
// Pill dot (the colored circle before pill text)
// ============================================================================

function PillDot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ============================================================================
// System pills grid
// ============================================================================

function getKeyMarker(markers: Biomarker[]): Biomarker | null {
  // Return the "most interesting" marker: flagged first, then the one closest to range edge
  const flagged = markers.filter((m) => m.status !== "normal");
  if (flagged.length > 0) return flagged[0];
  if (markers.length === 0) return null;
  // Pick the marker closest to its range boundary
  let closest = markers[0];
  let closestDist = Infinity;
  for (const m of markers) {
    if (m.ref_range_low != null && m.ref_range_high != null) {
      const range = m.ref_range_high - m.ref_range_low;
      if (range > 0) {
        const distLow = Math.abs(m.value - m.ref_range_low) / range;
        const distHigh = Math.abs(m.value - m.ref_range_high) / range;
        const dist = Math.min(distLow, distHigh);
        if (dist < closestDist) { closestDist = dist; closest = m; }
      }
    }
  }
  return closest;
}

function MiniRangeBar({ marker }: { marker: Biomarker }) {
  const low = marker.ref_range_low ?? 0;
  const high = marker.ref_range_high ?? marker.value * 2;
  const scaleMax = high * 1.5;
  const greenLeft = (low / scaleMax) * 100;
  const greenRight = 100 - (high / scaleMax) * 100;
  const dotPos = Math.min(Math.max((marker.value / scaleMax) * 100, 2), 98);
  const dotColor = marker.status === "normal" ? C.good : marker.status === "borderline" ? C.caution : C.risk;

  return (
    <div style={{ position: "relative", height: 6, background: C.stone, borderRadius: 3, width: "100%" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${greenLeft}%`, right: `${greenRight}%`, background: `rgba(78,142,92,0.18)`, borderRadius: 3 }} />
      <div style={{ position: "absolute", top: "50%", left: `${dotPos}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: dotColor, border: "2px solid white", boxShadow: `0 1px 3px rgba(0,0,0,0.15)` }} />
    </div>
  );
}

function SystemsGrid({
  systems,
  biomarkers,
}: {
  systems: { name: string; count: number; flagged: boolean }[];
  biomarkers?: Biomarker[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function getMarkersForSystem(systemName: string): Biomarker[] {
    if (!biomarkers) return [];
    return biomarkers.filter(
      (b) => getCategoryForMarker(b.short_name) === systemName
    );
  }

  return (
    <>
      <div className="systems-compact-grid">
        {systems.map((s) => {
          const markers = getMarkersForSystem(s.name);
          const key = getKeyMarker(markers);

          return (
            <div
              key={s.name}
              onClick={() => markers.length > 0 && setExpanded(expanded === s.name ? null : s.name)}
              style={{
                padding: "14px 16px",
                background: s.flagged ? C.terracottaTint : "white",
                border: `1px solid ${s.flagged ? C.terracottaSoft : C.lineCard}`,
                borderRadius: 14,
                cursor: markers.length > 0 ? "pointer" : "default",
                transition: "box-shadow 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, flex: "0 1 auto" }}>{s.name}</span>
                {key && (
                  <span style={{ ...DISPLAY_NUM, fontSize: 14, color: s.flagged ? C.caution : C.good, flexShrink: 0 }}>
                    {key.value}
                    <span style={{ fontSize: 10, color: C.inkFaint, fontWeight: 400, marginLeft: 3 }}>{key.unit}</span>
                  </span>
                )}
              </div>
              {key && <MiniRangeBar marker={key} />}
              {!key && (
                <div style={{ height: 6, background: C.good, borderRadius: 3, opacity: 0.2 }} />
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: C.inkFaint }}>
                  {key ? (key.plain_name || key.name_eng || key.short_name) : ""}
                </span>
                <span style={{ fontSize: 10, color: C.inkFaint }}>{s.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded detail overlay */}
      {expanded && (() => {
        const markers = getMarkersForSystem(expanded);
        const sys = systems.find((s) => s.name === expanded);
        if (!markers.length) return null;
        return (
          <div
            style={{
              marginTop: 12,
              background: "white",
              border: `1px solid ${sys?.flagged ? C.terracottaSoft : C.lineCard}`,
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: C.shadowCard,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{expanded}</span>
              <span
                onClick={() => setExpanded(null)}
                style={{ fontSize: 12, color: C.inkFaint, cursor: "pointer", padding: "4px 8px" }}
              >
                Close
              </span>
            </div>
            {markers.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: i < markers.length - 1 ? `1px solid ${C.lineSoft}` : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>
                    {m.plain_name || m.name_eng || m.short_name}
                  </div>
                  {m.ref_range_low != null && m.ref_range_high != null && (
                    <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2 }}>
                      Range: {m.ref_range_low} - {m.ref_range_high} {m.unit}
                    </div>
                  )}
                </div>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <MiniRangeBar marker={m} />
                </div>
                <div style={{ ...DISPLAY_NUM, fontSize: 15, color: m.status === "normal" ? C.ink : m.status === "borderline" ? C.caution : C.risk, flexShrink: 0, minWidth: 50, textAlign: "right" }}>
                  {m.value}
                  <span style={{ fontSize: 10, color: C.inkFaint, fontWeight: 400, marginLeft: 2 }}>{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </>
  );
}

// ============================================================================
// Doctor letter component
// ============================================================================

function DoctorLetter({
  annotation,
  compact,
}: {
  annotation: Annotation;
  compact?: boolean;
}) {
  const isCompact = compact || false;
  return (
    <div
      style={{
        padding: isCompact ? "22px 26px" : "28px 32px",
        background: "#FAFAF5",
        borderRadius: 22,
        border: `1px solid ${C.lineCard}`,
        boxShadow: `0 1px 2px rgba(28,26,23,0.03), 0 8px 24px rgba(28,26,23,0.06)`,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: isCompact ? 14 : 20,
        }}
      >
        <div style={isCompact ? DOC_AVATAR_SM : DOC_AVATAR}>
          {DOCTOR.initials}
        </div>
        <div>
          <div
            style={{
              fontSize: isCompact ? 14 : 15,
              fontWeight: 600,
              color: C.ink,
            }}
          >
            {isCompact ? `Dr. ${DOCTOR.firstName}` : DOCTOR.name}
          </div>
          <div style={{ fontSize: 13, color: C.inkFaint }}>
            {isCompact
              ? formatShortDate(annotation.created_at)
              : `Licensed GP / Written ${formatShortDate(annotation.created_at)}`}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: isCompact ? 15 : 16,
          color: C.inkSoft,
          lineHeight: 1.75,
          fontFamily: SERIF_FONT,
        }}
      >
        {annotation.body.split("\n").map((paragraph, i) => (
          <p key={i} style={{ marginBottom: i === annotation.body.split("\n").length - 1 ? 0 : 14 }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Doctor progress track
// ============================================================================

function DoctorProgressTrack() {
  return (
    <div style={{ ...CARD_STYLE, padding: 22, marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={DOC_AVATAR_SM}>{DOCTOR.initials}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
            {DOCTOR.name}
          </div>
          <div style={{ fontSize: 12, color: C.inkFaint }}>
            Reviewing your panel
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          margin: "20px 0",
        }}
      >
        {/* Done: Panel received */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: C.good,
              flexShrink: 0,
            }}
          />
          Panel received
        </div>
        <div
          style={{
            width: 40,
            height: 2,
            background: C.good,
          }}
        />
        {/* Active: Doctor review */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: `2px solid ${C.terracotta}`,
              background: "white",
              flexShrink: 0,
              boxShadow: "0 0 0 3px rgba(201,87,58,0.15)",
            }}
          />
          Doctor review
        </div>
        <div style={{ width: 40, height: 2, background: C.stone }} />
        {/* Pending: Notes ready */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.inkMuted,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: `2px solid ${C.sageSoft}`,
              background: "white",
              flexShrink: 0,
            }}
          />
          Notes ready
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Marker tag component (Improved / Watching / Stable / New)
// ============================================================================

function MarkerTag({
  label,
  tone,
}: {
  label: string;
  tone: "improved" | "watching" | "stable" | "new";
}) {
  const styles: Record<string, React.CSSProperties> = {
    improved: { background: C.sageTint, color: C.good },
    watching: { background: C.butterTint, color: C.caution },
    stable: { background: C.canvasDeep, color: C.inkFaint },
    new: { background: C.terracottaTint, color: C.terracotta },
  };

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 6,
        flexShrink: 0,
        ...styles[tone],
      }}
    >
      {label}
    </span>
  );
}

// ============================================================================
// STATE A: New member
// ============================================================================

function StateA({ userName }: { userName: string }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: 640, margin: "0 auto", fontFamily: SYSTEM_FONT }}
    >
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}>
          Welcome, {userName}
        </div>
        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Let&apos;s build your health picture.
        </h1>
        <p
          style={{
            fontSize: 15,
            color: C.inkMuted,
            lineHeight: 1.6,
            marginTop: 10,
            maxWidth: 560,
          }}
        >
          Precura connects your blood work to a doctor who reviews it
          personally. Upload your first panel and we&apos;ll take it from there.
        </p>
      </div>

      <div style={{ ...CARD_STYLE, padding: 28, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: C.ink,
            marginBottom: 6,
          }}
        >
          How it works
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 16,
          }}
        >
          {[
            {
              n: "1",
              title: "Upload a blood panel",
              sub: "Paste from a PDF or enter markers manually",
            },
            {
              n: "2",
              title: "Precura reviews your results",
              sub: "Markers are checked against reference ranges and Swedish norms",
            },
            {
              n: "3",
              title: `Dr. ${DOCTOR.firstName} writes you a personal note`,
              sub: "A licensed GP reviews your data and tells you what matters",
            },
          ].map((step) => (
            <div
              key={step.n}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  ...DISPLAY_NUM,
                  fontSize: 18,
                  color: C.terracotta,
                  flexShrink: 0,
                  width: 28,
                }}
              >
                {step.n}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: C.inkFaint,
                    marginTop: 2,
                  }}
                >
                  {step.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="/member/panels/new" style={{ textDecoration: "none" }}>
        <div style={{ ...BTN_PRIMARY, fontSize: 16, padding: 18 }}>
          Upload your first blood panel
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// STATE B: First panel, no review
// ============================================================================

function StateBMarkerExplanation(marker: Biomarker): string {
  const name = marker.short_name;
  const isVitD =
    name === "D-vitamin" || name === "25-OH-Vitamin-D" || name === "Vit D";
  const season = getSeasonalContext();

  if (isVitD && marker.status === "borderline") {
    return `Your vitamin D is slightly below the reference range. In Sweden, this is one of the most common findings, especially during the darker months. ${season.body} Dr. ${DOCTOR.firstName} will include this in your review.`;
  }
  if (isVitD && marker.status === "abnormal") {
    return `Your vitamin D is clearly below the recommended level. Living in Sweden, low sunlight exposure is the most common cause. A daily D3 supplement (1000-2000 IU) typically brings levels back within a few months. Dr. ${DOCTOR.firstName} will advise on dosage.`;
  }

  if (marker.status === "borderline") {
    return `This result sits just outside the normal reference range. It may reflect recent diet, stress, or natural variation rather than a clinical issue. Dr. ${DOCTOR.firstName} will put it in context with the rest of your panel.`;
  }
  return `This marker falls outside the expected range and deserves a closer look. Dr. ${DOCTOR.firstName} will assess whether it needs follow-up or monitoring.`;
}

function StateB({
  panel,
  systems,
}: {
  panel: PanelWithBiomarkers;
  systems: { name: string; count: number; flagged: boolean }[];
}) {
  const total = panel.biomarkers.length;
  const flagged = getFlaggedMarkers(panel.biomarkers);
  const inRange = total - flagged.length;
  const panelDate = formatPanelDate(panel.panel_date);

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <div className="stateb-grid">
        {/* ============================================================
            LEFT COLUMN - Main content
            ============================================================ */}
        <div>
          {/* Pending pill */}
          <div style={{ ...PILL_TERRA, marginBottom: 16 }}>
            <PillDot color={C.terracotta} />
            Pending doctor review
          </div>

          {/* Panel date eyebrow */}
          <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}>
            {panelDate}
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 38px)",
              fontWeight: 600,
              color: C.ink,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Your first results are in.{" "}
            <span
              style={{
                fontStyle: "italic",
                fontFamily: SERIF_FONT,
                fontWeight: 400,
                color: C.inkMuted,
              }}
            >
              {inRange} of {total} markers look good.
            </span>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 15,
              color: C.inkMuted,
              lineHeight: 1.6,
              marginTop: 12,
            }}
          >
            {flagged.length > 0
              ? `${flagged.length} marker${flagged.length > 1 ? "s" : ""} need${flagged.length === 1 ? "s" : ""} a closer look.`
              : "Everything looks healthy."}{" "}
            Dr. {DOCTOR.firstName} will review your results and write you a
            personal note.
          </p>

          {/* Flagged markers - full-width cards */}
          {flagged.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  ...EYEBROW,
                  color: C.terracotta,
                  marginBottom: 14,
                }}
              >
                Needs attention
              </div>
              {flagged.map((marker) => (
                <div
                  key={marker.id}
                  style={{
                    ...CARD_STYLE,
                    boxShadow: C.shadowCard,
                    padding: 24,
                    marginBottom: 16,
                  }}
                >
                  {/* Marker header row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 14,
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: C.ink,
                        }}
                      >
                        {marker.short_name}
                      </span>{" "}
                      <span style={{ fontSize: 12, color: C.inkFaint }}>
                        ({getPlainName(marker.short_name, marker)})
                      </span>
                    </div>
                    <div
                      style={{
                        ...DISPLAY_NUM,
                        fontSize: 24,
                        color:
                          marker.status === "abnormal" ? C.risk : C.caution,
                      }}
                    >
                      {marker.value}{" "}
                      <span
                        style={{
                          fontSize: 12,
                          color: C.inkFaint,
                          fontWeight: 400,
                        }}
                      >
                        {marker.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range bar */}
                  <RangeBar
                    value={marker.value}
                    refLow={marker.ref_range_low}
                    refHigh={marker.ref_range_high}
                    color={
                      marker.status === "abnormal" ? C.risk : C.caution
                    }
                  />

                  {/* Explanation */}
                  <p
                    style={{
                      fontSize: 15,
                      color: C.inkMuted,
                      lineHeight: 1.6,
                      marginTop: 16,
                      marginBottom: 0,
                    }}
                  >
                    {StateBMarkerExplanation(marker)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Body systems */}
          <div
            style={{
              ...CARD_SAGE_STYLE,
              padding: 24,
              marginTop: 28,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: C.sageDeep,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.good,
                }}
              />
              {inRange} markers in healthy range
            </div>
            <SystemsGrid systems={systems} biomarkers={panel.biomarkers} />
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN - Sidebar
            ============================================================ */}
        <div className="stateb-sidebar">
          {/* Doctor card */}
          <div
            style={{
              ...CARD_STYLE,
              boxShadow: C.shadowCard,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div style={DOC_AVATAR}>{DOCTOR.initials}</div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {DOCTOR.name}
                </div>
                <div style={{ fontSize: 12, color: C.inkFaint }}>
                  {DOCTOR.title}
                </div>
                <div style={{ fontSize: 12, color: C.inkFaint }}>
                  Licensed GP
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ marginTop: 4 }}>
              <div
                style={{
                  ...EYEBROW,
                  color: C.inkFaint,
                  marginBottom: 12,
                }}
              >
                Review status
              </div>
              {[
                { label: "Panel received", done: true, active: false },
                { label: "Under review", done: false, active: true },
                { label: "Notes ready", done: false, active: false },
              ].map((step, i) => (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: i < 2 ? 0 : 0,
                  }}
                >
                  {/* Dot + connecting line */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: 16,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: step.done
                          ? C.good
                          : step.active
                            ? "white"
                            : "white",
                        border: step.done
                          ? "none"
                          : step.active
                            ? `2px solid ${C.terracotta}`
                            : `2px solid ${C.sageSoft}`,
                        boxShadow: step.active
                          ? "0 0 0 3px rgba(201,87,58,0.15)"
                          : "none",
                        flexShrink: 0,
                      }}
                    />
                    {i < 2 && (
                      <div
                        style={{
                          width: 2,
                          height: 18,
                          background: step.done ? C.good : C.stone,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: step.done
                        ? C.inkMuted
                        : step.active
                          ? C.ink
                          : C.inkFaint,
                      fontWeight: step.active ? 600 : 400,
                      paddingBottom: i < 2 ? 10 : 0,
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel info card */}
          <div
            style={{
              ...CARD_STYLE,
              boxShadow: C.shadowSoft,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                ...EYEBROW,
                color: C.inkFaint,
                marginBottom: 12,
              }}
            >
              Panel details
            </div>
            {[
              { label: "Date", value: formatShortDate(panel.panel_date) },
              { label: "Lab", value: panel.lab_name || "Standard lab" },
              { label: "Total markers", value: String(total) },
              {
                label: "Flagged",
                value: String(flagged.length),
              },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "8px 0",
                  borderBottom: `1px solid ${C.lineSoft}`,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    color: C.inkMuted,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    ...DISPLAY_NUM,
                    fontSize: 15,
                    color: C.ink,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action cards */}
          <Link
            href="/member/discuss"
            style={{
              display: "block",
              textDecoration: "none",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                ...CARD_STYLE,
                boxShadow: C.shadowSoft,
                padding: "16px 24px",
                fontSize: 15,
                color: C.ink,
                fontWeight: 600,
                textAlign: "center",
                cursor: "pointer",
                transition: "box-shadow 0.15s ease",
              }}
            >
              Ask Precura about your results
            </div>
          </Link>
          <Link
            href="/member/panels/new"
            style={{
              display: "block",
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                ...CARD_STYLE,
                boxShadow: C.shadowSoft,
                padding: "16px 24px",
                fontSize: 15,
                color: C.ink,
                fontWeight: 600,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Add another blood panel
            </div>
          </Link>

          {/* Health journey teaser */}
          <div
            style={{
              padding: "20px 24px",
              background: C.butterTint,
              border: `1px solid ${C.butterSoft}`,
              borderRadius: 18,
            }}
          >
            <p
              style={{
                fontSize: 15,
                color: C.inkMuted,
                lineHeight: 1.6,
                fontStyle: "italic",
                fontFamily: SERIF_FONT,
                margin: 0,
              }}
            >
              This is your first panel. As you add more over time, Precura
              will track trends, flag changes, and give you a clearer picture
              of where your health is heading.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATE C: Doctor reviewed (1 panel)
// ============================================================================

function StateC({
  panel,
  annotation,
  systems,
}: {
  panel: PanelWithBiomarkers;
  annotation: Annotation;
  systems: { name: string; count: number; flagged: boolean }[];
}) {
  const total = panel.biomarkers.length;
  const flagged = getFlaggedMarkers(panel.biomarkers);
  const inRange = total - flagged.length;

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: 640, margin: "0 auto", fontFamily: SYSTEM_FONT }}
    >
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...PILL_SAGE, marginBottom: 16 }}>
          <PillDot color={C.good} />
          Reviewed by Dr. {DOCTOR.firstName} / {formatShortDate(annotation.created_at)}
        </div>
        <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}>
          Your {formatPanelDate(panel.panel_date)} panel
        </div>
        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Dr. {DOCTOR.firstName} reviewed your results.
        </h1>
      </div>

      {/* Doctor letter */}
      <DoctorLetter annotation={annotation} />

      {/* Actions below letter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Link
          href="/member/consultations"
          style={{ ...BTN_SAGE, flex: 1, textDecoration: "none" }}
        >
          Book a call with Dr. {DOCTOR.firstName}
        </Link>
        <Link
          href="/member/chat"
          style={{ ...BTN_SECONDARY, flex: 1, textDecoration: "none" }}
        >
          Ask Precura a question
        </Link>
      </div>

      {/* Panel summary */}
      <div style={{ ...CARD_SAGE_STYLE, padding: 20, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.sageDeep,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.good,
            }}
          />
          {inRange} markers in healthy range
        </div>
        <SystemsGrid systems={systems} biomarkers={panel.biomarkers} />
      </div>

      {/* Next steps */}
      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href="/member/panels/new"
          style={{ ...BTN_PRIMARY, flex: 1, textDecoration: "none" }}
        >
          Upload a newer panel
        </Link>
        <Link
          href="/member/panels"
          style={{ ...BTN_SECONDARY, flex: 1, textDecoration: "none" }}
        >
          View panel details
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATE D: Multiple panels (mature)
// ============================================================================

function StateD({
  panels,
  annotations,
  markerHistories,
  systems,
}: {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  markerHistories: Record<string, MarkerHistory[]>;
  systems: { name: string; count: number; flagged: boolean }[];
}) {
  const latest = panels[0];
  const previous = panels[1];
  const latestDoctorNote = annotations.find(
    (a) => a.author?.role === "doctor" || a.author?.role === "both"
  );

  // Build key markers with changes
  const keyMarkers = buildKeyMarkers(latest, previous, markerHistories);

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ fontFamily: SYSTEM_FONT }}
    >
      {/* Two-column grid */}
      <div className="home-two-col">
        {/* LEFT COLUMN */}
        <div>
          {/* Status headline */}
          <div style={{ marginBottom: 28 }}>
            {latestDoctorNote && (
              <div style={{ ...PILL_SAGE, marginBottom: 16 }}>
                <PillDot color={C.good} />
                Reviewed by Dr. {DOCTOR.firstName} /{" "}
                {formatShortDate(latestDoctorNote.created_at)}
              </div>
            )}
            <div
              style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}
            >
              {panels.length} panels on file / {getPanelYearRange(panels)}
            </div>
            <h1
              style={{
                fontSize: "clamp(28px, 3.5vw, 38px)",
                fontWeight: 600,
                color: C.ink,
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              {buildDynamicHeadline(latest, previous)}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: C.inkMuted,
                lineHeight: 1.6,
                marginTop: 12,
                maxWidth: 600,
              }}
            >
              {buildDynamicSubheadline(latest, previous, panels.length)}
            </p>
          </div>

          {/* What changed card */}
          <div style={{ ...CARD_STYLE, padding: 22, marginBottom: 20 }}>
            <div
              style={{ ...EYEBROW, color: C.terracotta, marginBottom: 4 }}
            >
              Your key markers over time
            </div>
            <p
              style={{
                fontSize: 12,
                color: C.inkFaint,
                marginBottom: 14,
              }}
            >
              Across {panels.length} panels from{" "}
              {getPanelYearRange(panels)}
            </p>

            {/* Panel timeline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                marginBottom: 18,
                padding: "0 4px",
              }}
            >
              {panels
                .slice()
                .reverse()
                .map((p, i, arr) => (
                  <React.Fragment key={p.id}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: i === arr.length - 1 ? 12 : 10,
                          height: i === arr.length - 1 ? 12 : 10,
                          borderRadius: "50%",
                          background:
                            i === arr.length - 1
                              ? C.terracotta
                              : C.good,
                          border:
                            i === arr.length - 1
                              ? "2px solid white"
                              : "none",
                          boxShadow:
                            i === arr.length - 1
                              ? `0 0 0 2px ${C.terracotta}`
                              : "none",
                          cursor: "pointer",
                          transition: "transform 0.15s",
                        }}
                      />
                      <div
                        style={{
                          fontSize: 9,
                          color:
                            i === arr.length - 1
                              ? C.terracotta
                              : C.inkFaint,
                          fontFamily: MONO_FONT,
                          fontWeight:
                            i === arr.length - 1 ? 600 : 400,
                          marginTop: 4,
                        }}
                      >
                        {shortPanelLabel(p.panel_date)}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: 2,
                          background:
                            i === arr.length - 2
                              ? C.terracotta
                              : C.stone,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
            </div>

            {/* Key marker rows */}
            {keyMarkers.map((km) => (
              <div
                key={km.shortName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 10px",
                  margin: "0 -10px",
                  borderRadius: 12,
                  borderBottom: `1px solid ${C.lineSoft}`,
                  background:
                    km.tone === "watching"
                      ? "rgba(208,132,23,0.04)"
                      : km.tone === "improved"
                        ? "rgba(78,142,92,0.04)"
                        : "transparent",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.ink,
                      }}
                    >
                      {km.shortName}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: C.inkFaint,
                        fontWeight: 400,
                        marginLeft: 4,
                      }}
                    >
                      ({km.plainName})
                    </span>
                  </div>
                  {km.description && (
                    <div
                      style={{
                        fontSize: 12,
                        color: C.inkFaint,
                        marginTop: 2,
                      }}
                    >
                      {km.description}
                    </div>
                  )}
                </div>
                <div style={{ width: 100, height: 32, flexShrink: 0 }}>
                  <Sparkline
                    points={km.history}
                    color={km.color}
                    width={100}
                    height={32}
                  />
                </div>
                <div
                  style={{
                    textAlign: "right",
                    minWidth: 55,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      ...DISPLAY_NUM,
                      fontSize: 18,
                      color: km.color,
                    }}
                  >
                    {km.currentValue}
                  </div>
                  <div style={{ fontSize: 10, color: C.inkFaint }}>
                    {km.unit}
                  </div>
                </div>
                <MarkerTag label={km.tag} tone={km.tone} />
              </div>
            ))}

            <Link
              href="/member/panels"
              style={{
                ...LINK_ACCENT,
                display: "block",
                marginTop: 14,
              }}
            >
              See all markers across all {panels.length} panels
            </Link>
          </div>

          {/* Doctor note card */}
          {latestDoctorNote && (
            <DoctorLetter annotation={latestDoctorNote} compact />
          )}
          {latestDoctorNote && (
            <div
              style={{ display: "flex", gap: 10, marginBottom: 20 }}
            >
              <Link
                href="/member/consultations"
                style={{
                  ...BTN_SAGE,
                  flex: 1,
                  padding: "12px 18px",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                Book check-in with Dr. {DOCTOR.firstName}
              </Link>
              <Link
                href="/member/chat"
                style={{
                  ...BTN_SECONDARY,
                  flex: 1,
                  padding: "12px 18px",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                Ask Precura a question
              </Link>
            </div>
          )}

          {/* Trajectory chart */}
          <div
            style={{ ...CARD_STYLE, padding: 22, marginBottom: 20 }}
          >
            <div
              style={{
                ...EYEBROW,
                color: C.terracotta,
                marginBottom: 4,
              }}
            >
              Your trajectory / {getPanelYearRange(panels)}
            </div>
            <TrajectoryChart panels={panels} />
            <p
              style={{
                fontSize: 13,
                color: C.inkMuted,
                lineHeight: 1.5,
                marginTop: 12,
              }}
            >
              Your overall trajectory across {panels.length} panels.
              Markers that improved are pulling the line up, while any
              flagged markers pull it slightly down.
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          {/* Body systems */}
          <div
            style={{
              ...CARD_SAGE_STYLE,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.sageDeep,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.good,
                }}
              />
              Body systems
            </div>
            <SystemsGrid systems={systems} biomarkers={panels.flatMap(p => p.biomarkers)} />
          </div>

          {/* Doctor review history */}
          {annotations.length > 0 && (
            <div
              style={{
                ...CARD_STYLE,
                padding: 18,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  ...EYEBROW,
                  color: C.terracotta,
                  marginBottom: 12,
                }}
              >
                Dr. {DOCTOR.firstName}&apos;s reviews
              </div>
              {annotations
                .filter(
                  (a) =>
                    a.author?.role === "doctor" ||
                    a.author?.role === "both"
                )
                .slice(0, 4)
                .map((a, i) => (
                  <div
                    key={a.id}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 14,
                      background: C.canvasSoft,
                      border: `1px solid ${C.lineCard}`,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase" as const,
                          color:
                            i === 0 ? C.terracotta : C.sageDeep,
                        }}
                      >
                        {i === 0 ? "Latest review" : "Review"}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: C.inkFaint,
                          fontFamily: MONO_FONT,
                        }}
                      >
                        {formatShortDate(a.created_at)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.inkMuted,
                        lineHeight: 1.5,
                      }}
                    >
                      &ldquo;
                      {a.body.length > 120
                        ? a.body.slice(0, 120) + "..."
                        : a.body}
                      &rdquo;
                    </div>
                  </div>
                ))}
              <Link
                href="/member/panels"
                style={{ ...LINK_ACCENT, marginTop: 10 }}
              >
                Read all notes in full
              </Link>
            </div>
          )}

          {/* Next step / quick actions */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                ...EYEBROW,
                color: C.terracotta,
                marginBottom: 8,
              }}
            >
              Next step
            </div>
            <Link
              href="/member/consultations"
              style={{
                ...BTN_PRIMARY,
                marginBottom: 10,
                textDecoration: "none",
              }}
            >
              Book check-in with Dr. {DOCTOR.firstName}
            </Link>
            <Link
              href="/member/panels/new"
              style={{
                ...BTN_SECONDARY,
                marginBottom: 10,
                textDecoration: "none",
              }}
            >
              Add another panel
            </Link>
            <Link
              href="/member/panels"
              style={{ ...LINK_ACCENT, marginTop: 8 }}
            >
              See your full health story
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATE E: Steady state
// ============================================================================

function StateE({
  panels,
  annotations,
  markerHistories,
  systems,
}: {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  markerHistories: Record<string, MarkerHistory[]>;
  systems: { name: string; count: number; flagged: boolean }[];
}) {
  const latest = panels[0];
  const previous = panels.length >= 2 ? panels[1] : null;
  const latestDoctorNote = annotations.find(
    (a) => a.author?.role === "doctor" || a.author?.role === "both"
  );

  const keyMarkers = buildKeyMarkers(
    latest,
    previous || latest,
    markerHistories
  );
  const daysSincePanel = daysAgo(latest.panel_date);
  const nextPanelDays = Math.max(90 - daysSincePanel, 0);

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <div className="home-two-col">
        {/* LEFT COLUMN */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}
            >
              {panels[0].biomarkers.length > 0
                ? (getCurrentUser as unknown as () => string)
                  ? ""
                  : ""
                : ""}
            </div>
            <h1
              style={{
                fontSize: "clamp(28px, 3.5vw, 38px)",
                fontWeight: 600,
                color: C.ink,
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              Holding steady.{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontFamily: SERIF_FONT,
                  fontWeight: 400,
                  color: C.inkMuted,
                }}
              >
                {nextPanelDays > 0
                  ? `Next panel in ${nextPanelDays} days.`
                  : "Time for your next panel."}
              </span>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: C.inkMuted,
                lineHeight: 1.6,
                marginTop: 10,
                maxWidth: 560,
              }}
            >
              Your latest results were reviewed
              {latestDoctorNote
                ? ` on ${formatShortDate(latestDoctorNote.created_at)}`
                : ""}
              . Nothing needs attention right now. Here&apos;s how your key
              markers are tracking.
            </p>
          </div>

          {/* Stability sparklines */}
          <div
            style={{ ...CARD_STYLE, padding: 20, marginBottom: 20 }}
          >
            <div
              style={{
                ...EYEBROW,
                color: C.terracotta,
                marginBottom: 8,
              }}
            >
              Your markers over time
            </div>
            {keyMarkers.map((km) => (
              <div
                key={km.shortName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 0",
                  borderBottom: `1px solid ${C.lineSoft}`,
                }}
              >
                <div style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 500 }}>
                  {km.shortName}{" "}
                  <span style={{ color: C.inkFaint, fontWeight: 400 }}>
                    ({km.plainName})
                  </span>
                </div>
                <div style={{ width: 80, height: 28, flexShrink: 0 }}>
                  <Sparkline
                    points={km.history}
                    color={km.color}
                    width={80}
                    height={28}
                  />
                </div>
                <div
                  style={{
                    ...DISPLAY_NUM,
                    fontSize: 15,
                    color: km.color,
                    minWidth: 50,
                    textAlign: "right",
                  }}
                >
                  {km.currentValue}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: km.tone === "watching" ? C.caution : C.good,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {km.tag}
                </div>
              </div>
            ))}
          </div>

          {/* Last doctor note (aged, muted) */}
          {latestDoctorNote && (
            <div
              style={{
                ...CARD_STYLE,
                padding: 18,
                marginBottom: 20,
                opacity: 0.85,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{ ...DOC_AVATAR, width: 32, height: 32, fontSize: 10 }}
                >
                  {DOCTOR.initials}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.ink,
                    }}
                  >
                    Dr. {DOCTOR.firstName}
                  </span>{" "}
                  <span style={{ fontSize: 12, color: C.inkFaint }}>
                    / {formatShortDate(latestDoctorNote.created_at)}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: C.inkMuted,
                  lineHeight: 1.5,
                  fontFamily: SERIF_FONT,
                  fontStyle: "italic",
                }}
              >
                &ldquo;
                {latestDoctorNote.body.length > 200
                  ? latestDoctorNote.body.slice(0, 200) + "..."
                  : latestDoctorNote.body}
                &rdquo;
              </p>
              <Link
                href="/member/panels"
                style={{
                  fontSize: 12,
                  color: C.terracotta,
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  textDecorationColor: C.terracottaSoft,
                  cursor: "pointer",
                  display: "block",
                  marginTop: 8,
                }}
              >
                Read full notes
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div
            style={{
              padding: "16px 20px",
              background: C.sageTint,
              border: `1px solid ${C.sageSoft}`,
              borderRadius: 14,
              fontSize: 14,
              color: C.sageDeep,
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.good,
                flexShrink: 0,
              }}
            />
            {nextPanelDays > 0
              ? `Next panel scheduled in ${nextPanelDays} days`
              : "Time for your next panel"}
          </div>

          {/* Seasonal context */}
          <div
            style={{
              padding: "18px 20px",
              background: C.butterTint,
              border: `1px solid ${C.butterSoft}`,
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.inkSoft,
                marginBottom: 4,
              }}
            >
              {getSeasonalContext().title}
            </div>
            <p
              style={{
                fontSize: 13,
                color: C.inkMuted,
                lineHeight: 1.5,
              }}
            >
              {getSeasonalContext().body}
            </p>
          </div>

          {/* Calm actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              href="/member/panels"
              style={{ ...BTN_SECONDARY, textDecoration: "none" }}
            >
              Browse your results
            </Link>
            <Link
              href="/member/panels"
              style={{ ...BTN_SECONDARY, textDecoration: "none" }}
            >
              Re-read doctor&apos;s notes
            </Link>
            <Link
              href="/member/chat"
              style={{ ...BTN_SECONDARY, textDecoration: "none" }}
            >
              Ask Precura a question
            </Link>
            <Link
              href="/member/panels/new"
              style={{ ...BTN_SECONDARY, textDecoration: "none" }}
            >
              Upload a new panel
            </Link>
          </div>

          <Link
            href="/member/panels"
            style={{ ...LINK_ACCENT, marginTop: 16 }}
          >
            See your full health story
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATE F: New results
// ============================================================================

function StateF({
  panels,
  markerHistories,
  systems,
}: {
  panels: PanelWithBiomarkers[];
  markerHistories: Record<string, MarkerHistory[]>;
  systems: { name: string; count: number; flagged: boolean }[];
}) {
  const latest = panels[0];
  const previous = panels.length >= 2 ? panels[1] : null;
  const total = latest.biomarkers.length;
  const flagged = getFlaggedMarkers(latest.biomarkers);
  const inRange = total - flagged.length;
  const borderline = latest.biomarkers.filter(
    (b) => b.status === "borderline"
  ).length;

  // Build what-moved data
  const changes = previous ? buildChanges(latest, previous, markerHistories) : [];

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: 640, margin: "0 auto", fontFamily: SYSTEM_FONT }}
    >
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...PILL_TERRA, marginBottom: 16 }}>
          <PillDot color={C.terracotta} />
          Pending doctor review
        </div>
        <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}>
          {formatPanelDate(latest.panel_date)}
        </div>
        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          New results just landed.{" "}
          <span
            style={{
              fontStyle: "italic",
              fontFamily: SERIF_FONT,
              fontWeight: 400,
              color: C.inkMuted,
            }}
          >
            Let&apos;s look.
          </span>
        </h1>
        <p
          style={{
            fontSize: 15,
            color: C.inkMuted,
            lineHeight: 1.6,
            marginTop: 10,
            maxWidth: 560,
          }}
        >
          Your {formatPanelDate(latest.panel_date)} panel is in.
          {previous
            ? ` Here's what changed since your last test.`
            : ""}
        </p>
      </div>

      {/* What changed */}
      {changes.length > 0 && (
        <div style={{ ...CARD_STYLE, padding: 22, marginBottom: 20 }}>
          <div
            style={{ ...EYEBROW, color: C.terracotta, marginBottom: 14 }}
          >
            {previous
              ? `What changed since ${formatPanelDate(previous.panel_date)}`
              : "Key markers"}
          </div>
          {changes.map((ch, i) => (
            <div
              key={ch.shortName}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 8px",
                margin: "0 -8px",
                borderRadius: 12,
                borderBottom:
                  i < changes.length - 1
                    ? `1px solid ${C.lineSoft}`
                    : "none",
                background:
                  ch.tone === "improved"
                    ? "rgba(78,142,92,0.04)"
                    : ch.tone === "watching"
                      ? "rgba(208,132,23,0.04)"
                      : "transparent",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {ch.shortName}
                </strong>
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: C.inkFaint,
                  }}
                >
                  {ch.description}
                </span>
              </div>
              {ch.history.length >= 2 && (
                <div style={{ width: 80, height: 28, flexShrink: 0 }}>
                  <Sparkline
                    points={ch.history}
                    color={ch.color}
                    width={80}
                    height={28}
                  />
                </div>
              )}
              <div
                style={{
                  textAlign: "right",
                  flexShrink: 0,
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    ...DISPLAY_NUM,
                    fontSize: 18,
                    color: ch.color,
                  }}
                >
                  {ch.currentValue}
                </div>
                {ch.previousValue !== undefined && (
                  <div
                    style={{
                      fontSize: 11,
                      color: ch.color,
                    }}
                  >
                    was {ch.previousValue}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel summary */}
      <div style={{ ...CARD_SAGE_STYLE, padding: 20, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.sageDeep,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.good,
            }}
          />
          {total} markers / {inRange} in range
          {borderline > 0 ? ` / ${borderline} borderline` : ""}
        </div>
        <SystemsGrid systems={systems} biomarkers={panels.flatMap(p => p.biomarkers)} />
      </div>

      {/* CTAs */}
      <div style={{ marginTop: 20 }}>
        <Link
          href="/member/consultations"
          style={{
            ...BTN_PRIMARY,
            marginBottom: 10,
            textDecoration: "none",
          }}
        >
          Have Dr. {DOCTOR.firstName} review these results
        </Link>
        <Link
          href="/member/chat"
          style={{
            ...BTN_SECONDARY,
            textDecoration: "none",
          }}
        >
          Ask Precura about the results
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STATE G: New doctor note
// ============================================================================

function StateG({
  panels,
  annotation,
  markerHistories,
  systems,
}: {
  panels: PanelWithBiomarkers[];
  annotation: Annotation;
  markerHistories: Record<string, MarkerHistory[]>;
  systems: { name: string; count: number; flagged: boolean }[];
}) {
  const latest = panels[0];
  const previous = panels.length >= 2 ? panels[1] : null;
  const total = latest.biomarkers.length;
  const flagged = getFlaggedMarkers(latest.biomarkers);
  const inRange = total - flagged.length;

  const changes = previous ? buildChanges(latest, previous, markerHistories) : [];

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: 640, margin: "0 auto", fontFamily: SYSTEM_FONT }}
    >
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...PILL_SAGE, marginBottom: 16 }}>
          <PillDot color={C.good} />
          New note from Dr. {DOCTOR.firstName}
        </div>
        <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 10 }}>
          Your {formatPanelDate(latest.panel_date)} panel
        </div>
        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Dr. {DOCTOR.firstName} just left you a note.
        </h1>
      </div>

      {/* Doctor letter - HERO */}
      <DoctorLetter annotation={annotation} />

      {/* Actions below letter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Link
          href="/member/consultations"
          style={{ ...BTN_SAGE, flex: 1, textDecoration: "none" }}
        >
          Book a call with Dr. {DOCTOR.firstName}
        </Link>
        <Link
          href="/member/chat"
          style={{ ...BTN_SECONDARY, flex: 1, textDecoration: "none" }}
        >
          Ask Precura about this
        </Link>
      </div>

      {/* What moved - with doctor flag references */}
      {changes.length > 0 && (
        <div style={{ ...CARD_STYLE, padding: 20, marginBottom: 20 }}>
          <div
            style={{
              ...EYEBROW,
              color: C.terracotta,
              marginBottom: 10,
            }}
          >
            What changed
          </div>
          {changes.map((ch) => (
            <div
              key={ch.shortName}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 8px",
                margin: "0 -8px",
                borderRadius: 12,
                borderBottom: `1px solid ${C.lineSoft}`,
                background:
                  ch.tone === "improved"
                    ? "rgba(78,142,92,0.04)"
                    : ch.tone === "watching"
                      ? "rgba(208,132,23,0.04)"
                      : "transparent",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {ch.shortName}
                </strong>{" "}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      ch.tone === "improved"
                        ? C.good
                        : ch.tone === "watching"
                          ? C.caution
                          : C.inkFaint,
                  }}
                >
                  {ch.tone === "watching"
                    ? `Dr. ${DOCTOR.firstName} flagged this`
                    : ch.description}
                </span>
              </div>
              {ch.history.length >= 2 && (
                <div style={{ width: 80, height: 28, flexShrink: 0 }}>
                  <Sparkline
                    points={ch.history}
                    color={ch.color}
                    width={80}
                    height={28}
                  />
                </div>
              )}
              <div
                style={{
                  textAlign: "right",
                  flexShrink: 0,
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    ...DISPLAY_NUM,
                    fontSize: 16,
                    color: ch.color,
                  }}
                >
                  {ch.currentValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel summary */}
      <div style={{ ...CARD_SAGE_STYLE, padding: 18, marginBottom: 20 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: C.sageDeep,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.good,
            }}
          />
          {inRange} of {total} markers in healthy range
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href="/member/consultations"
          style={{ ...BTN_PRIMARY, flex: 1, textDecoration: "none" }}
        >
          Book 15 min with Dr. {DOCTOR.firstName}
        </Link>
        <Link
          href="/member/panels"
          style={{ ...BTN_SECONDARY, flex: 1, textDecoration: "none" }}
        >
          See your full health story
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Trajectory Chart (simple SVG)
// ============================================================================

function TrajectoryChart({ panels }: { panels: PanelWithBiomarkers[] }) {
  // Compute a simple "health score" per panel based on % in range
  const sorted = [...panels].reverse();
  const points = sorted.map((p) => {
    const total = p.biomarkers.length;
    if (total === 0) return 50;
    const inRange = p.biomarkers.filter(
      (b) => b.status === "normal"
    ).length;
    return (inRange / total) * 100;
  });

  const w = 500;
  const h = 180;
  const padX = 50;
  const padY = 20;
  const plotW = w - padX * 2;
  const plotH = h - padY * 2 - 20;

  const min = Math.min(...points, 50);
  const max = Math.max(...points, 100);
  const range = max - min || 1;

  const pts = points.map((p, i) => {
    const x = padX + (i / Math.max(points.length - 1, 1)) * plotW;
    const y = padY + plotH - ((p - min) / range) * plotH;
    return { x, y };
  });

  const d =
    "M" + pts.map((p) => `${p.x},${p.y}`).join("L");
  const last = pts[pts.length - 1];

  return (
    <div
      style={{
        height: 200,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: "100%" }}
        fill="none"
      >
        {/* Zone bands */}
        <rect
          x="0"
          y="0"
          width={w}
          height={h * 0.28}
          fill="rgba(78,142,92,0.06)"
        />
        <rect
          x="0"
          y={h * 0.28}
          width={w}
          height={h * 0.28}
          fill="rgba(78,142,92,0.03)"
        />
        <rect
          x="0"
          y={h * 0.56}
          width={w}
          height={h * 0.22}
          fill="rgba(208,132,23,0.04)"
        />
        <rect
          x="0"
          y={h * 0.78}
          width={w}
          height={h * 0.22}
          fill="rgba(196,68,42,0.03)"
        />
        {/* Zone labels */}
        <text
          x="8"
          y={h * 0.15}
          fontSize="10"
          fill={C.good}
          opacity="0.6"
        >
          Excellent
        </text>
        <text
          x="8"
          y={h * 0.42}
          fontSize="10"
          fill={C.good}
          opacity="0.4"
        >
          Good
        </text>
        <text
          x="8"
          y={h * 0.7}
          fontSize="10"
          fill={C.caution}
          opacity="0.4"
        >
          Watch
        </text>

        {/* Line */}
        <path
          d={d}
          stroke={C.good}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Data points */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === pts.length - 1 ? 6 : 4}
            fill={C.good}
            stroke={i === pts.length - 1 ? "white" : "none"}
            strokeWidth={i === pts.length - 1 ? 2 : 0}
          />
        ))}

        {/* Year labels */}
        {sorted.map((p, i) => (
          <text
            key={p.id}
            x={pts[i].x}
            y={h - 4}
            fontSize="10"
            fill={
              i === sorted.length - 1 ? C.good : C.inkFaint
            }
            fontWeight={i === sorted.length - 1 ? 600 : 400}
            fontFamily={MONO_FONT}
            textAnchor="middle"
          >
            {new Date(p.panel_date).getFullYear()}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// Data derivation for key markers
// ============================================================================

interface KeyMarker {
  shortName: string;
  plainName: string;
  currentValue: number;
  previousValue?: number;
  unit: string;
  history: number[];
  color: string;
  tone: "improved" | "watching" | "stable" | "new";
  tag: string;
  description: string;
}

function buildKeyMarkers(
  latest: PanelWithBiomarkers,
  previous: PanelWithBiomarkers,
  markerHistories: Record<string, MarkerHistory[]>
): KeyMarker[] {
  const markers: KeyMarker[] = [];

  // Priority: flagged markers first, then those with most change
  const sorted = [...latest.biomarkers].sort((a, b) => {
    const sevA = a.status === "normal" ? 0 : a.status === "borderline" ? 1 : 2;
    const sevB = b.status === "normal" ? 0 : b.status === "borderline" ? 1 : 2;
    if (sevA !== sevB) return sevB - sevA;

    const prevA = previous.biomarkers.find(
      (p) => p.short_name === a.short_name
    );
    const prevB = previous.biomarkers.find(
      (p) => p.short_name === b.short_name
    );
    const changeA = prevA
      ? Math.abs(a.value - prevA.value) / (prevA.value || 1)
      : 0;
    const changeB = prevB
      ? Math.abs(b.value - prevB.value) / (prevB.value || 1)
      : 0;
    return changeB - changeA;
  });

  for (const m of sorted.slice(0, 6)) {
    const prev = previous.biomarkers.find(
      (p) => p.short_name === m.short_name
    );
    const historyData = markerHistories[m.short_name] || [];
    const historyValues =
      historyData.length >= 2
        ? historyData.map((h) => h.value)
        : prev
          ? [prev.value, m.value]
          : [m.value];

    let tone: "improved" | "watching" | "stable" | "new" = "stable";
    let tag = "Stable";
    let color: string = C.good;
    let description = "";

    if (m.status !== "normal") {
      tone = "watching";
      tag = "Watching";
      color = C.caution;
      description = prev
        ? `Drifting ${m.value > prev.value ? "up" : "down"}`
        : "Outside reference range";
    } else if (prev) {
      const change = m.value - prev.value;
      const pctChange = Math.abs(change) / (prev.value || 1);
      if (pctChange > 0.1) {
        if (
          (m.ref_range_low !== null &&
            prev.value < m.ref_range_low &&
            m.value >= m.ref_range_low) ||
          (m.ref_range_high !== null &&
            prev.value > m.ref_range_high &&
            m.value <= m.ref_range_high)
        ) {
          tone = "improved";
          tag = "Improved";
          color = C.good;
          description = "Recovered to healthy range";
        }
      }
    }
    if (!prev && m.status === "normal") {
      tone = "new";
      tag = "New";
      color = C.terracotta;
      description = "First measurement";
    }

    markers.push({
      shortName: m.short_name,
      plainName: getPlainName(m.short_name, m),
      currentValue: m.value,
      previousValue: prev?.value,
      unit: m.unit,
      history: historyValues,
      color,
      tone,
      tag,
      description,
    });
  }

  return markers;
}

interface ChangeMarker {
  shortName: string;
  plainName: string;
  currentValue: number;
  previousValue?: number;
  unit: string;
  history: number[];
  color: string;
  tone: "improved" | "watching" | "stable";
  description: string;
}

function buildChanges(
  latest: PanelWithBiomarkers,
  previous: PanelWithBiomarkers,
  markerHistories: Record<string, MarkerHistory[]>
): ChangeMarker[] {
  const changes: ChangeMarker[] = [];

  for (const m of latest.biomarkers) {
    const prev = previous.biomarkers.find(
      (p) => p.short_name === m.short_name
    );
    if (!prev) continue;
    if (Math.abs(m.value - prev.value) < 0.01) continue;

    const historyData = markerHistories[m.short_name] || [];
    const historyValues =
      historyData.length >= 2
        ? historyData.map((h) => h.value)
        : [prev.value, m.value];

    let tone: "improved" | "watching" | "stable" = "stable";
    let color: string = C.good;
    let description = "Stable, no significant changes";

    if (m.status !== "normal") {
      tone = "watching";
      color = C.caution;
      description =
        m.value > prev.value ? "Crept up a bit" : "Dropped slightly";
    } else if (
      prev.status !== "normal" &&
      m.status === "normal"
    ) {
      tone = "improved";
      color = C.good;
      description = "Back in healthy range";
    }

    changes.push({
      shortName: m.short_name,
      plainName: getPlainName(m.short_name, m),
      currentValue: m.value,
      previousValue: prev.value,
      unit: m.unit,
      history: historyValues,
      color,
      tone,
      description,
    });
  }

  // Sort: improvements first, then concerns, then stable
  changes.sort((a, b) => {
    const order = { improved: 0, watching: 1, stable: 2 };
    return order[a.tone] - order[b.tone];
  });

  return changes.slice(0, 5);
}

// ============================================================================
// Helpers
// ============================================================================

function getPanelYearRange(panels: PanelWithBiomarkers[]): string {
  if (panels.length === 0) return "";
  const sorted = [...panels].sort(
    (a, b) =>
      new Date(a.panel_date).getTime() - new Date(b.panel_date).getTime()
  );
  const first = new Date(sorted[0].panel_date).getFullYear();
  const last = new Date(sorted[sorted.length - 1].panel_date).getFullYear();
  return first === last ? `${first}` : `${first} - ${last}`;
}

function shortPanelLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const mon = d
    .toLocaleDateString("en-GB", { month: "short" })
    .slice(0, 3);
  const yr = String(d.getFullYear()).slice(2);
  return `${mon} ${yr}`;
}

function buildDynamicHeadline(
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

function buildDynamicSubheadline(
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

function getSeasonalContext(): { title: string; body: string } {
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) {
    return {
      title: "Spring is here",
      body: "With longer days returning, your vitamin D should continue climbing naturally. Outdoor activity also supports your metabolic markers.",
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      title: "Summer in Sweden",
      body: "Peak sunlight months. Your vitamin D will be at its highest naturally. A good time to establish outdoor routines that carry into autumn.",
    };
  }
  if (month >= 9 && month <= 10) {
    return {
      title: "Autumn approaching",
      body: "As daylight drops, consider starting a D3 supplement. Your next panel will show how your levels respond to the seasonal shift.",
    };
  }
  return {
    title: "Winter in Sweden",
    body: "Limited daylight means your vitamin D may drop. A daily D3 supplement (1000-2000 IU) helps maintain levels through the dark months.",
  };
}

// ============================================================================
// Main data-driven view
// ============================================================================

function AdaptiveHomeView() {
  const [user, setUser] = useState<Profile | null>(null);
  const [panels, setPanels] = useState<PanelWithBiomarkers[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [markerHistories, setMarkerHistories] = useState<
    Record<string, MarkerHistory[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) {
        setLoading(false);
        return;
      }
      setUser(u);

      const [p, a] = await Promise.all([
        getPanels(u.id),
        getAllAnnotations(),
      ]);
      setPanels(p);
      setAnnotations(a);

      // Fetch marker histories for all unique biomarker short_names
      if (p.length > 0) {
        const uniqueMarkers = new Set<string>();
        for (const panel of p) {
          for (const b of panel.biomarkers) {
            uniqueMarkers.add(b.short_name);
          }
        }

        const histories: Record<string, MarkerHistory[]> = {};
        const historyPromises = Array.from(uniqueMarkers).map(
          async (shortName) => {
            const h = await getMarkerHistory(u.id, shortName);
            histories[shortName] = h;
          }
        );
        await Promise.all(historyPromises);
        setMarkerHistories(histories);
      }

      setLoading(false);
    }
    load();
  }, []);

  const state = useMemo(
    () => determineState(panels, annotations),
    [panels, annotations]
  );

  const systems = useMemo(() => {
    if (panels.length === 0) return [];
    return groupBiomarkersBySystem(panels[0].biomarkers);
  }, [panels]);

  // Build sidebar
  const sidebar: MemberSidebarProps = useMemo(() => {
    const userName = user?.display_name || "Member";
    const initials = userName[0].toUpperCase();
    return {
      user: {
        name: userName,
        initials,
        memberSince: user?.created_at
          ? `Member since ${new Date(user.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`
          : "",
      },
      doctor: {
        name: DOCTOR.name,
        initials: DOCTOR.initials,
        title: DOCTOR.title,
      },
      nextPanel: {
        eyebrow:
          panels.length > 0 ? "Latest panel" : "Get started",
        headline:
          panels.length > 0
            ? new Date(panels[0].panel_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Add your first panel",
        subtext:
          panels.length > 0
            ? `${panels[0].biomarkers.length} markers`
            : "Upload your blood test data",
      },
      activeHref: "/member",
    };
  }, [user, panels]);

  const userInitials = (user?.display_name || "M")[0].toUpperCase();

  if (loading) {
    return (
      <MemberShell sidebar={sidebar} userInitials=".">
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div
            style={{
              width: 24,
              height: 24,
              border: `2.5px solid ${C.stone}`,
              borderTopColor: C.terracotta,
              borderRadius: "50%",
              margin: "0 auto 12px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div style={{ fontSize: 14, color: C.inkFaint, fontFamily: SYSTEM_FONT }}>
            Loading your health data...
          </div>
        </div>
      </MemberShell>
    );
  }

  // Find the latest doctor annotation for states that need it
  const latestDoctorAnnotation = annotations.find(
    (a) => a.author?.role === "doctor" || a.author?.role === "both"
  );

  const content = (() => {
    switch (state) {
      case "A":
        return (
          <StateA userName={user?.display_name?.split(" ")[0] || "there"} />
        );
      case "B":
        return <StateB panel={panels[0]} systems={systems} />;
      case "C":
        return (
          <StateC
            panel={panels[0]}
            annotation={latestDoctorAnnotation!}
            systems={systems}
          />
        );
      case "D":
        return (
          <StateD
            panels={panels}
            annotations={annotations}
            markerHistories={markerHistories}
            systems={systems}
          />
        );
      case "E":
        return (
          <StateE
            panels={panels}
            annotations={annotations}
            markerHistories={markerHistories}
            systems={systems}
          />
        );
      case "F":
        return (
          <StateF
            panels={panels}
            markerHistories={markerHistories}
            systems={systems}
          />
        );
      case "G":
        return (
          <StateG
            panels={panels}
            annotation={latestDoctorAnnotation!}
            markerHistories={markerHistories}
            systems={systems}
          />
        );
    }
  })();

  return (
    <MemberShell sidebar={sidebar} userInitials={userInitials}>
      {content}
      <style jsx global>{`
        html,
        body {
          background: ${C.stone};
          overflow-x: hidden;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .home-two-col {
          display: block;
        }
        @media (min-width: 768px) {
          .home-two-col {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
            align-items: start;
          }
        }
        /* State B responsive grid */
        .stateb-grid {
          display: block;
        }
        .stateb-sidebar {
          margin-top: 32px;
        }
        .systems-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .systems-compact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        @media (min-width: 1200px) {
          .stateb-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 280px;
            gap: 24px;
            align-items: start;
          }
          .stateb-sidebar {
            margin-top: 0;
            position: sticky;
            top: 24px;
          }
          .systems-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .systems-compact-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }
        @media (min-width: 1024px) {
          .systems-compact-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </MemberShell>
  );
}

// ============================================================================
// Mock data fallback (Anna demo mode, USE_REAL_DATA = false)
// ============================================================================

function MockDemoView() {
  const params = useSearchParams();
  const mockState = params.get("state") ?? "panel-results-day";

  // Import from existing data module for backwards compatibility
  const {
    buildMarkerChanges,
    buildPanelSummary,
    buildGlucoseHero,
    RISK_HISTORY,
    RISK_PROJECTION,
    NOTE_PREVIEW,
    NOTE_DATE,
    STATUS_TEXT,
  } = require("@/components/member/data");

  const sidebar: MemberSidebarProps = {
    user: {
      name: "Anna Bergstrom",
      initials: "A",
      memberSince: "Member since Jan 2026",
    },
    doctor: {
      name: DOCTOR.name,
      initials: DOCTOR.initials,
      title: DOCTOR.title,
    },
    nextPanel: {
      eyebrow: "Next panel",
      headline: "26 July 2026",
      subtext: "Kit ships 19 July",
    },
    activeHref: "/member",
  };

  return (
    <MemberShell sidebar={sidebar} userInitials="A">
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <p
          style={{
            fontSize: 14,
            color: C.inkFaint,
            padding: "20px 0",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Demo mode (Anna). State: {mockState}
        </p>
      </div>
      <style jsx global>{`
        html,
        body {
          background: ${C.stone};
          overflow-x: hidden;
        }
      `}</style>
    </MemberShell>
  );
}

// ============================================================================
// Page entry point
// ============================================================================

function MemberHomeContent() {
  const params = useSearchParams();

  // If USE_REAL_DATA is false, or explicit ?state= param, use mock mode
  if (!USE_REAL_DATA || params.get("state")) {
    return <MockDemoView />;
  }

  return <AdaptiveHomeView />;
}

export default function MemberHomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", background: C.stone }} />}>
      <MemberHomeContent />
    </Suspense>
  );
}
