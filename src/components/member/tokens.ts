// Member area tokens - re-export Welcome Kit palette + member-specific constants.
// One source of truth for the brand palette lives in src/components/home/tokens.ts.

export { C, SYSTEM_FONT, MONO_FONT } from "@/components/home/tokens";

// ============================================================================
// Member area type scale
// ============================================================================

/**
 * DISPLAY_NUM - the tabular mono face used for data values (panel markers,
 * risk percentages, dates in metadata). Shared across GlucoseHero, WhatMoved,
 * PanelSummary, RiskTrajectory so numbers feel like one voice.
 */
export const DISPLAY_NUM = {
  fontFamily:
    '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
  fontVariantNumeric: "tabular-nums" as const,
  fontWeight: 600,
  letterSpacing: "-0.022em",
};

/**
 * EYEBROW - small, tracked caps label used above cards. Lowered contrast
 * from inkMuted and smaller letter-spacing so eyebrows recede instead of
 * competing with headlines.
 */
export const EYEBROW = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
};

export const DOCTOR = {
  name: "Dr. Tomas Kurakovas",
  firstName: "Tomas",
  initials: "TK",
  title: "Your Precura doctor",
};

export type UserState =
  | "panel-results-day"
  | "between-panels"
  | "new-member-day-1";
