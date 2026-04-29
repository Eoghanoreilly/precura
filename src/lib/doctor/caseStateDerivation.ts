import type { CaseStatus, CaseCategory, CasePriority } from '@/lib/data/types';

export type PatientState =
  | 'Awaiting you'
  | 'Attention'
  | 'Awaiting member'
  | 'Onboarding'
  | 'Routine'
  | 'Stable'
  | 'Stale 90d';

export type CaseTaskSummary = {
  status: 'open' | 'in_progress' | 'done' | 'skipped' | 'blocked';
  dueAt: string | null;
};

export type OpenCaseSummary = {
  category: CaseCategory;
  status: CaseStatus;
  priority: CasePriority;
  hasFlaggedMarker: boolean;
  tasks: CaseTaskSummary[];
};

export type PatientStateInput = {
  openCases: OpenCaseSummary[];
  lastActivityAt: string | null;
  now: Date;
};

const STALE_DAYS = 90;
const MS_PER_DAY = 86_400_000;

function isDueSoon(dueAt: string | null, now: Date): boolean {
  if (dueAt === null) return false;
  const due = new Date(dueAt).getTime();
  const startOfTomorrow = new Date(now);
  startOfTomorrow.setUTCHours(0, 0, 0, 0);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);
  return due < startOfTomorrow.getTime() || due < now.getTime();
}

export function derivePatientState(input: PatientStateInput): PatientState {
  const { openCases, lastActivityAt, now } = input;

  const hasAwaitingYou = openCases.some((c) =>
    c.tasks.some((t) => t.status === 'open' && isDueSoon(t.dueAt, now)),
  );
  if (hasAwaitingYou) return 'Awaiting you';

  const hasAttention = openCases.some(
    (c) => c.hasFlaggedMarker && (c.status === 'new' || c.status === 'in_progress'),
  );
  if (hasAttention) return 'Attention';

  if (openCases.length > 0 && openCases.every((c) => c.status === 'awaiting_member')) {
    return 'Awaiting member';
  }

  if (openCases.some((c) => c.category === 'onboarding')) return 'Onboarding';

  if (
    openCases.some(
      (c) => c.status === 'in_progress' && c.priority === 'normal' && !c.hasFlaggedMarker,
    )
  ) {
    return 'Routine';
  }

  if (openCases.length === 0) {
    if (lastActivityAt === null) return 'Stale 90d';
    const ageDays = (now.getTime() - new Date(lastActivityAt).getTime()) / MS_PER_DAY;
    return ageDays > STALE_DAYS ? 'Stale 90d' : 'Stable';
  }

  return 'Routine';
}
