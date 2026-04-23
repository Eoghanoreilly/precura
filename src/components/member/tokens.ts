// Member area tokens.
//
// DEPRECATION NOTICE (2026-04-22):
// New code MUST read from CSS custom properties in globals.css. The C color
// object and SYSTEM_FONT / MONO_FONT re-exports below are kept only so the
// existing /member/* pages that still inline-style with C.xyz keep compiling
// until their own migration spec. When the last consumer is migrated, delete
// C, SYSTEM_FONT, MONO_FONT, DISPLAY_NUM, EYEBROW. DOCTOR, UserState stay.

export { C, SYSTEM_FONT, MONO_FONT } from "@/components/home/tokens";

/**
 * @deprecated Use `font-family: var(--font-mono); font-variant-numeric: tabular-nums;` in CSS.
 */
export const DISPLAY_NUM = {
  fontFamily:
    '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
  fontVariantNumeric: "tabular-nums" as const,
  fontWeight: 600,
  letterSpacing: "-0.022em",
};

/**
 * @deprecated Use `font-size: var(--text-micro); font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;` in CSS.
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
