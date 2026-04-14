import { BLOOD_TEST_HISTORY } from "@/lib/v2/mock-patient";
import type { MarkerChange } from "./WhatMoved";
import type { Category } from "./PanelSummary";

// ============================================================================
// Shared data derivation for /member proposal pages.
// ============================================================================

export function buildMarkerChanges(): MarkerChange[] {
  const latest = BLOOD_TEST_HISTORY[0];
  const previous = BLOOD_TEST_HISTORY[1];
  if (!latest || !previous) return [];

  const changes: MarkerChange[] = [];
  for (const m of latest.results) {
    const prev = previous.results.find((p) => p.shortName === m.shortName);
    if (!prev) continue;
    if (prev.value === m.value) continue;
    changes.push({
      name: m.shortName,
      plainName: m.plainName,
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
    const changeA =
      Math.abs(a.currentValue - a.previousValue) / a.previousValue;
    const changeB =
      Math.abs(b.currentValue - b.previousValue) / b.previousValue;
    return changeB - changeA;
  });

  return changes.slice(0, 4);
}

export function buildPanelSummary(): {
  total: number;
  flagged: number;
  inRange: number;
  panelDate: string;
  categories: Category[];
} {
  const latest = BLOOD_TEST_HISTORY[0];
  const total = latest.results.length;
  const flagged = latest.results.filter((m) => m.status !== "normal").length;
  const inRange = total - flagged;

  const metabolicMarkers = ["HbA1c", "f-Glucose", "f-Insulin"];
  const cardioMarkers = ["TC", "HDL", "LDL", "TG"];
  const thyroidMarkers = ["TSH"];
  const nutritionMarkers = ["Vit D"];
  const kidneyMarkers = ["Crea"];

  function categoryStats(shortNames: string[]): Category | null {
    const picked = latest.results.filter((m) =>
      shortNames.includes(m.shortName)
    );
    if (picked.length === 0) return null;
    return {
      name: "",
      markerCount: picked.length,
      flaggedCount: picked.filter((m) => m.status !== "normal").length,
    };
  }

  const categories: Category[] = [];
  const metabolic = categoryStats(metabolicMarkers);
  if (metabolic)
    categories.push({ ...metabolic, name: "Metabolic / blood sugar" });
  const cardio = categoryStats(cardioMarkers);
  if (cardio) categories.push({ ...cardio, name: "Cardiovascular" });
  const thyroid = categoryStats(thyroidMarkers);
  if (thyroid) categories.push({ ...thyroid, name: "Thyroid" });
  const nutrition = categoryStats(nutritionMarkers);
  if (nutrition) categories.push({ ...nutrition, name: "Nutrition" });
  const kidney = categoryStats(kidneyMarkers);
  if (kidney) categories.push({ ...kidney, name: "Kidney function" });

  return {
    total,
    flagged,
    inRange,
    panelDate: formatDate(latest.date),
    categories,
  };
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// FINDRISC risk projection. History tracks Anna's glucose drift, projection
// extrapolates the RISK_ASSESSMENTS.diabetes "worsening" trend.
export const RISK_HISTORY = [
  { year: "2022", value: 10 },
  { year: "2023", value: 12 },
  { year: "2024", value: 14 },
  { year: "2025", value: 15 },
  { year: "2026", value: 17 },
];

export const RISK_PROJECTION = [
  { year: "2026", value: 17 },
  { year: "2027", value: 19 },
  { year: "2028", value: 20 },
  { year: "2029", value: 21 },
  { year: "2030", value: 22 },
  { year: "2031", value: 23 },
];

export const NOTE_PREVIEW =
  "Your fasting glucose at 5.8 is in the upper normal range, not diabetic, but worth watching. Looking at your Precura history, it's been gradually rising from 5.0 in 2021. Combined with your family history, I'd recommend we keep a close eye on this.";

export const NOTE_DATE = "28 Mar 2026";

export const STATUS_TEXT =
  "Your fasting glucose moved. Dr. Tomas wants to walk you through it.";
