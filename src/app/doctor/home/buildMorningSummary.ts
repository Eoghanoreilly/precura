import type { PatientRollup } from "./sortPatients";

export interface MorningSummaryAction {
  patientId: string;
  label: string;
  context: string;
}

export interface MorningSummaryData {
  headline: string;
  paragraphs: string[];
  topActions: MorningSummaryAction[];
}

/**
 * Build the deterministic morning summary from the patient roster.
 * Everything here must trace to data - no fabricated facts.
 */
export function buildMorningSummary(
  rollups: PatientRollup[],
): MorningSummaryData {
  const pending = rollups.filter((r) => r.status === "pending_review");
  const active = rollups.filter(
    (r) => r.status === "active" && r.unreadFromPatient > 0,
  );
  const awaitingLong = rollups
    .filter((r) => r.status === "awaiting_patient" && r.daysSinceLastAction >= 60)
    .sort((a, b) => b.daysSinceLastAction - a.daysSinceLastAction);
  const stale = rollups.filter((r) => r.status === "stale");
  const newMembers = rollups.filter((r) => r.status === "new_member");

  const paragraphs: string[] = [];

  if (pending.length === 1) {
    paragraphs.push(
      `${pending[0].profile.display_name}'s panel is waiting for your note.`,
    );
  } else if (pending.length > 1) {
    paragraphs.push(
      `${pending.length} panels are waiting for your note this morning.`,
    );
  }

  if (active.length === 1) {
    paragraphs.push(
      `${active[0].profile.display_name} replied and is waiting on you.`,
    );
  } else if (active.length > 1) {
    paragraphs.push(
      `${active.length} patients have replied since your last round.`,
    );
  }

  if (awaitingLong.length > 0) {
    const who = awaitingLong[0];
    paragraphs.push(
      `${who.profile.display_name} has not responded in ${who.daysSinceLastAction} days.`,
    );
  }
  if (stale.length > 0) {
    const s = stale[0];
    const month = new Date(s.lastPatientActivity).toLocaleDateString("en-GB", {
      month: "long",
    });
    paragraphs.push(
      `${s.profile.display_name} has been quiet since ${month}.`,
    );
  }
  if (newMembers.length > 0) {
    paragraphs.push(`${newMembers[0].profile.display_name} just joined.`);
  }

  if (paragraphs.length === 0) {
    paragraphs.push("Quiet morning. Nothing urgent in the roster today.");
  }

  const headline =
    pending.length > 0
      ? `${pending.length} panel${pending.length > 1 ? "s" : ""} to read this morning.`
      : active.length > 0
        ? `${active.length} patient${active.length > 1 ? "s" : ""} waiting on a reply.`
        : "Quiet morning. Nothing urgent.";

  const topActions: MorningSummaryAction[] = [
    ...pending.map((p) => ({
      patientId: p.profile.id,
      label: `Review ${p.profile.display_name}'s panel`,
      context: p.summary,
    })),
    ...active.map((p) => ({
      patientId: p.profile.id,
      label: `Reply to ${p.profile.display_name}`,
      context: p.summary,
    })),
    ...awaitingLong.slice(0, 1).map((p) => ({
      patientId: p.profile.id,
      label: `Nudge ${p.profile.display_name}`,
      context: p.summary,
    })),
  ].slice(0, 5);

  return { headline, paragraphs, topActions };
}
