import type {
  Annotation,
  ChatSession,
  PanelWithBiomarkers,
  Profile,
} from "@/lib/data/types";

export type PatientStatus =
  | "pending_review"
  | "awaiting_patient"
  | "active"
  | "stale"
  | "new_member";

export interface PatientRollup {
  profile: Profile;
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  chatSessions: ChatSession[];

  status: PatientStatus;
  latestPanelDate: string | null;
  latestPanelReviewed: boolean;
  lastDoctorNoteDate: string | null;
  lastPatientActivity: string;
  daysSinceLastAction: number;
  flaggedMarkersCount: number;
  unreadFromPatient: number;
  summary: string;
}

function daysBetween(iso: string | null): number {
  if (!iso) return Infinity;
  const d = new Date(iso);
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Build a rollup for one patient from the cross-roster Supabase fetches.
 * Pure function, no side effects.
 */
export function rollupPatient(
  profile: Profile,
  allPanels: PanelWithBiomarkers[],
  allAnnotations: Annotation[],
  allChat: ChatSession[],
  doctorId: string,
): PatientRollup {
  const panels = allPanels
    .filter((p) => p.user_id === profile.id)
    .sort(
      (a, b) =>
        new Date(b.panel_date).getTime() - new Date(a.panel_date).getTime(),
    );
  const panelIdSet = new Set(panels.map((p) => p.id));

  const annotations = allAnnotations.filter(
    (a) =>
      (a.target_type === "panel" && panelIdSet.has(a.target_id)) ||
      a.author_id === profile.id,
  );

  const chatSessions = allChat.filter((s) => s.user_id === profile.id);

  const latestPanel = panels[0];
  const latestPanelDate = latestPanel?.panel_date ?? null;

  const doctorNotesOnLatest = latestPanel
    ? annotations.filter(
        (a) =>
          a.author_id === doctorId &&
          a.target_type === "panel" &&
          a.target_id === latestPanel.id,
      )
    : [];
  const latestPanelReviewed = doctorNotesOnLatest.length > 0;

  const lastDoctorAnnotation = annotations
    .filter((a) => a.author_id === doctorId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
  const lastDoctorNoteDate = lastDoctorAnnotation?.created_at ?? null;

  const activityCandidates = [
    latestPanel?.created_at,
    chatSessions[0]?.created_at,
    annotations.find((a) => a.author_id === profile.id)?.created_at,
    profile.created_at,
  ].filter((x): x is string => Boolean(x));
  const lastPatientActivityIso =
    activityCandidates.sort().reverse()[0] ?? profile.created_at;

  const daysSinceLastAction = daysBetween(lastPatientActivityIso);
  const flaggedMarkersCount =
    latestPanel?.biomarkers?.filter((b) => b.status !== "normal").length ?? 0;

  const unreadFromPatient = annotations.filter(
    (a) =>
      a.author_id === profile.id &&
      (!lastDoctorNoteDate || a.created_at > lastDoctorNoteDate),
  ).length;

  let status: PatientStatus;
  if (panels.length === 0) status = "new_member";
  else if (latestPanel && !latestPanelReviewed) status = "pending_review";
  else if (unreadFromPatient > 0) status = "active";
  else if (daysSinceLastAction > 90) status = "stale";
  else if (
    lastDoctorNoteDate &&
    daysBetween(lastDoctorNoteDate) < 90
  )
    status = "awaiting_patient";
  else status = "active";

  const summary = buildSummary({
    latestPanel,
    latestPanelDate,
    flaggedMarkersCount,
    status,
    daysSinceLastAction,
    unreadFromPatient,
  });

  return {
    profile,
    panels,
    annotations,
    chatSessions,
    status,
    latestPanelDate,
    latestPanelReviewed,
    lastDoctorNoteDate,
    lastPatientActivity: lastPatientActivityIso,
    daysSinceLastAction,
    flaggedMarkersCount,
    unreadFromPatient,
    summary,
  };
}

function buildSummary(args: {
  latestPanel: PanelWithBiomarkers | undefined;
  latestPanelDate: string | null;
  flaggedMarkersCount: number;
  status: PatientStatus;
  daysSinceLastAction: number;
  unreadFromPatient: number;
}): string {
  const {
    status,
    flaggedMarkersCount,
    latestPanelDate,
    unreadFromPatient,
    daysSinceLastAction,
  } = args;

  if (status === "new_member") {
    return "Just joined, no panels yet.";
  }
  if (status === "pending_review") {
    const flagText =
      flaggedMarkersCount > 0
        ? `${flaggedMarkersCount} flagged marker${flaggedMarkersCount > 1 ? "s" : ""}`
        : "all within range";
    const dateText = latestPanelDate
      ? new Date(latestPanelDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
        })
      : "just in";
    return `Panel from ${dateText} awaiting your note (${flagText}).`;
  }
  if (status === "active" && unreadFromPatient > 0) {
    return `${unreadFromPatient} new note${unreadFromPatient > 1 ? "s" : ""} from patient, waiting on your reply.`;
  }
  if (status === "awaiting_patient") {
    return `Waiting on patient response, ${daysSinceLastAction} day${daysSinceLastAction === 1 ? "" : "s"}.`;
  }
  if (status === "stale") {
    const months = Math.max(1, Math.floor(daysSinceLastAction / 30));
    return `Quiet for ${months} month${months === 1 ? "" : "s"}, check-in due.`;
  }
  return "Active care, nothing pressing.";
}

const STATUS_WEIGHT: Record<PatientStatus, number> = {
  pending_review: 0,
  active: 100,
  awaiting_patient: 200,
  stale: 300,
  new_member: 400,
};

/**
 * Sort rollups by urgency. Pending reviews with the oldest upload come first.
 * Then active patients with unreads, awaiting-patient aging, stale, new members.
 */
export function sortPatients(rollups: PatientRollup[]): PatientRollup[] {
  return [...rollups].sort((a, b) => {
    let wa = STATUS_WEIGHT[a.status];
    let wb = STATUS_WEIGHT[b.status];
    if (a.status === "pending_review") wa += a.daysSinceLastAction;
    if (b.status === "pending_review") wb += b.daysSinceLastAction;
    if (wa !== wb) return wa - wb;
    if (a.unreadFromPatient !== b.unreadFromPatient) {
      return b.unreadFromPatient - a.unreadFromPatient;
    }
    if (a.status === "awaiting_patient" || a.status === "stale") {
      return b.daysSinceLastAction - a.daysSinceLastAction;
    }
    return a.daysSinceLastAction - b.daysSinceLastAction;
  });
}
