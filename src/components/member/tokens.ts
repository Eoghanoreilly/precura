// Member area tokens - re-export Welcome Kit palette + member-specific constants.
// One source of truth for the brand palette lives in src/components/home/tokens.ts.

export { C, SYSTEM_FONT, MONO_FONT } from "@/components/home/tokens";

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
