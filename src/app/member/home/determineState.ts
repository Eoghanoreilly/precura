import type { Annotation, PanelWithBiomarkers } from "@/lib/data/types";

// ============================================================================
// State machine types
// ============================================================================

export type HomeState = "A" | "B" | "C" | "D" | "E" | "F" | "G";

// ============================================================================
// Determine state from data
// ============================================================================

export function determineState(
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
