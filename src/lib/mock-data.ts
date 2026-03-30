import { FindriscInputs, calculateFindrisc } from "./findrisc";

/**
 * Mock patient data for the "returning user" demo (Anna Bergstrom)
 * Designed to show a moderate risk score - interesting enough to demo
 */
export const MOCK_FINDRISC_INPUTS: FindriscInputs = {
  age: 40,
  heightCm: 168,
  weightKg: 78,
  sex: "female",
  waistCm: 86,
  physicalActivity: false,
  dailyFruitVeg: true,
  bloodPressureMeds: false,
  highBloodGlucoseHistory: false,
  familyDiabetes: "parent_sibling_child",
};

export const MOCK_FINDRISC_RESULT = calculateFindrisc(MOCK_FINDRISC_INPUTS);

export const MOCK_TIMELINE = [
  {
    date: "2026-03-15",
    label: "Profile created",
    description: "FINDRISC score: " + MOCK_FINDRISC_RESULT.score,
    type: "milestone" as const,
  },
  {
    date: "2026-03-15",
    label: "Risk assessment completed",
    description: "FINDRISC score: " + MOCK_FINDRISC_RESULT.score,
    type: "assessment" as const,
  },
  {
    date: "2026-03-22",
    label: "Blood test ordered",
    description: "Diabetes Focus Panel",
    type: "test" as const,
  },
  {
    date: "2026-03-27",
    label: "Blood test results received",
    description: "HbA1c: 38 mmol/mol (normal range)",
    type: "result" as const,
  },
];

/**
 * Narrative timeline - plain English, no jargon
 */
export const MOCK_NARRATIVE_TIMELINE = [
  { date: "Mar 27", text: "Your blood test results came back - mostly normal" },
  { date: "Mar 22", text: "You ordered a diabetes-focused blood test" },
  { date: "Mar 15", text: "You completed your first health check" },
];

/**
 * Mock historical FINDRISC scores for trend chart
 */
export const MOCK_SCORE_HISTORY = [
  { date: "Oct 2025", score: 6, label: "Initial" },
  { date: "Dec 2025", score: 7, label: "Check-in" },
  { date: "Jan 2026", score: 8, label: "Post-holidays" },
  { date: "Mar 2026", score: MOCK_FINDRISC_RESULT.score, label: "Latest" },
];

/**
 * Storage key for user's onboarding data
 */
const ONBOARDING_KEY = "precura_findrisc_inputs";
const RESULT_KEY = "precura_findrisc_result";

export function saveOnboardingData(inputs: FindriscInputs): void {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(inputs));
  const result = calculateFindrisc(inputs);
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function getOnboardingData(): FindriscInputs | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(ONBOARDING_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getFindriscResult() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(RESULT_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getOrMockFindriscInputs(): FindriscInputs {
  return getOnboardingData() || MOCK_FINDRISC_INPUTS;
}

export function getOrMockFindriscResult() {
  return getFindriscResult() || MOCK_FINDRISC_RESULT;
}
