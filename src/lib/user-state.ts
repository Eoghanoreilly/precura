/**
 * User phase state machine
 *
 * Determines what the user should see based on where they are
 * in their health journey - not a generic dashboard, a contextual experience.
 */

export type UserPhase =
  | "first_results"       // Just completed onboarding, hasn't seen results yet
  | "exploring"           // Seen results, exploring the app (first few days)
  | "awaiting_results"    // Ordered blood test, waiting
  | "results_ready"       // Blood test results in, not yet viewed
  | "results_reviewed"    // Has viewed blood test results
  | "returning"           // Been away, coming back

const KEYS = {
  resultsRevealed: "precura_results_revealed",
  bloodTestOrdered: "precura_blood_test_ordered",
  bloodTestViewed: "precura_blood_test_viewed",
  lastVisit: "precura_last_visit",
} as const;

export function getUserPhase(): UserPhase {
  if (typeof window === "undefined") return "exploring";

  const resultsRevealed = localStorage.getItem(KEYS.resultsRevealed) === "true";
  const bloodTestOrdered = localStorage.getItem(KEYS.bloodTestOrdered) === "true";
  const bloodTestViewed = localStorage.getItem(KEYS.bloodTestViewed) === "true";
  const lastVisit = localStorage.getItem(KEYS.lastVisit);

  // Haven't seen their first results reveal yet
  if (!resultsRevealed) return "first_results";

  // Blood test flow
  if (bloodTestOrdered && !bloodTestViewed) return "results_ready";
  if (bloodTestViewed) return "results_reviewed";

  // Been away for 7+ days
  if (lastVisit) {
    const daysSince = (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) return "returning";
  }

  return "exploring";
}

export function markResultsRevealed(): void {
  localStorage.setItem(KEYS.resultsRevealed, "true");
}

export function markBloodTestOrdered(): void {
  localStorage.setItem(KEYS.bloodTestOrdered, "true");
}

export function markBloodTestViewed(): void {
  localStorage.setItem(KEYS.bloodTestViewed, "true");
}

export function recordVisit(): void {
  localStorage.setItem(KEYS.lastVisit, Date.now().toString());
}

/**
 * For the demo returning user (Anna), pre-populate her state
 */
export function initMockReturningUser(): void {
  localStorage.setItem(KEYS.resultsRevealed, "true");
  localStorage.setItem(KEYS.bloodTestOrdered, "true");
  localStorage.setItem(KEYS.bloodTestViewed, "false");
  localStorage.setItem(KEYS.lastVisit, Date.now().toString());
}
