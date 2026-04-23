// Shared mock patient data for doctor portal design exploration.
// All concept pages at /doctor/concepts/<slug> import from here so
// differences are purely design, not data shape.

export type PatientStatus =
  | "pending_review"      // New panel uploaded, awaiting doctor note
  | "awaiting_patient"    // Doctor replied, waiting on patient action
  | "active"              // Ongoing conversation or recent activity
  | "stale"               // No activity in 90+ days, follow-up cue
  | "new_member";         // Just joined, no panels yet

export interface PatientFlag {
  marker: string;
  value: number;
  unit: string;
  direction: "high" | "low";
  severity: "mild" | "moderate" | "severe";
}

export interface MockPatient {
  id: string;
  name: string;
  age: number;
  sex: "M" | "F";
  initials: string;
  status: PatientStatus;
  memberSince: string;              // ISO date
  panelsCount: number;
  latestPanelDate: string | null;   // ISO date
  latestPanelReviewed: boolean;
  lastNoteDate: string | null;      // ISO date
  lastPatientActivity: string;      // ISO date
  daysSinceLastAction: number;      // derived, computed for convenience
  flaggedMarkers: PatientFlag[];
  unreadMessages: number;
  // Plain-English summary of the patient's current state in one sentence.
  summary: string;
  // Machine-generated suggested next action for the doctor
  suggestedAction: string;
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "p1",
    name: "Anna Bergstrom",
    age: 52,
    sex: "F",
    initials: "AB",
    status: "pending_review",
    memberSince: "2024-01-15",
    panelsCount: 4,
    latestPanelDate: "2026-04-21",
    latestPanelReviewed: false,
    lastNoteDate: "2025-11-02",
    lastPatientActivity: "2026-04-21",
    daysSinceLastAction: 2,
    flaggedMarkers: [
      { marker: "LDL", value: 4.1, unit: "mmol/L", direction: "high", severity: "moderate" },
      { marker: "HbA1c", value: 44, unit: "mmol/mol", direction: "high", severity: "mild" },
    ],
    unreadMessages: 0,
    summary:
      "Latest panel shows LDL trending up (3.6 -> 4.1) and HbA1c nudging into pre-diabetic range (44). Last review 5 months ago.",
    suggestedAction:
      "Review panel, flag LDL trajectory, suggest lipid-focused follow-up in 3 months.",
  },
  {
    id: "p2",
    name: "Erik Lindqvist",
    age: 38,
    sex: "M",
    initials: "EL",
    status: "pending_review",
    memberSince: "2026-03-05",
    panelsCount: 1,
    latestPanelDate: "2026-04-23",
    latestPanelReviewed: false,
    lastNoteDate: null,
    lastPatientActivity: "2026-04-23",
    daysSinceLastAction: 0,
    flaggedMarkers: [
      { marker: "Vitamin D", value: 38, unit: "nmol/L", direction: "low", severity: "mild" },
      { marker: "Ferritin", value: 18, unit: "mcg/L", direction: "low", severity: "moderate" },
    ],
    unreadMessages: 1,
    summary:
      "First panel just in. Low vitamin D (typical Nordic winter) and borderline low ferritin. New member, no prior history.",
    suggestedAction:
      "Welcoming first note. Recommend vitamin D supplementation and iron-focused follow-up panel in 8 weeks.",
  },
  {
    id: "p3",
    name: "Eoghan O'Reilly",
    age: 40,
    sex: "M",
    initials: "EO",
    status: "active",
    memberSince: "2024-06-10",
    panelsCount: 3,
    latestPanelDate: "2026-04-18",
    latestPanelReviewed: true,
    lastNoteDate: "2026-04-20",
    lastPatientActivity: "2026-04-23",
    daysSinceLastAction: 0,
    flaggedMarkers: [],
    unreadMessages: 2,
    summary:
      "Markers all within range. Replied to your latest note, asking a follow-up question about training during travel.",
    suggestedAction:
      "Reply to his question. No panel action needed.",
  },
  {
    id: "p4",
    name: "Mikael Andersson",
    age: 45,
    sex: "M",
    initials: "MA",
    status: "awaiting_patient",
    memberSince: "2025-02-18",
    panelsCount: 4,
    latestPanelDate: "2026-02-11",
    latestPanelReviewed: true,
    lastNoteDate: "2026-02-13",
    lastPatientActivity: "2026-02-13",
    daysSinceLastAction: 70,
    flaggedMarkers: [
      { marker: "LDL", value: 3.9, unit: "mmol/L", direction: "high", severity: "mild" },
    ],
    unreadMessages: 0,
    summary:
      "You asked for a retest in 3 months. He has not ordered the follow-up panel yet. No reply to your last message.",
    suggestedAction:
      "Send a gentle nudge about the retest, or wait another 2-4 weeks.",
  },
  {
    id: "p5",
    name: "Kristina Larsson",
    age: 61,
    sex: "F",
    initials: "KL",
    status: "stale",
    memberSince: "2024-08-22",
    panelsCount: 2,
    latestPanelDate: "2025-10-15",
    latestPanelReviewed: true,
    lastNoteDate: "2025-10-17",
    lastPatientActivity: "2025-11-04",
    daysSinceLastAction: 172,
    flaggedMarkers: [
      { marker: "TSH", value: 5.2, unit: "mIU/L", direction: "high", severity: "mild" },
    ],
    unreadMessages: 0,
    summary:
      "Last panel 6 months ago showed borderline TSH. No contact since November. Risk of falling off care.",
    suggestedAction:
      "Annual check-in message. If no response in 30 days, mark as inactive.",
  },
  {
    id: "p6",
    name: "Sofia Petersson",
    age: 29,
    sex: "F",
    initials: "SP",
    status: "new_member",
    memberSince: "2026-04-22",
    panelsCount: 0,
    latestPanelDate: null,
    latestPanelReviewed: false,
    lastNoteDate: null,
    lastPatientActivity: "2026-04-22",
    daysSinceLastAction: 1,
    flaggedMarkers: [],
    unreadMessages: 0,
    summary:
      "Just joined yesterday. No panels yet. Has not started the onboarding questionnaire.",
    suggestedAction:
      "Welcome message. Point her at the questionnaire and first-panel ordering flow.",
  },
];

// Population-level rollups - useful for dashboard / metrics concepts
export const POPULATION_STATS = {
  total: MOCK_PATIENTS.length,
  pendingReview: MOCK_PATIENTS.filter((p) => p.status === "pending_review").length,
  awaitingPatient: MOCK_PATIENTS.filter((p) => p.status === "awaiting_patient").length,
  active: MOCK_PATIENTS.filter((p) => p.status === "active").length,
  stale: MOCK_PATIENTS.filter((p) => p.status === "stale").length,
  newMembers: MOCK_PATIENTS.filter((p) => p.status === "new_member").length,
  flaggedMarkersThisWeek: MOCK_PATIENTS.reduce(
    (acc, p) => acc + (p.daysSinceLastAction <= 7 ? p.flaggedMarkers.length : 0),
    0,
  ),
  unreadMessages: MOCK_PATIENTS.reduce((acc, p) => acc + p.unreadMessages, 0),
};
