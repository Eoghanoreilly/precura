import type { TaskKind, CasePriority } from '@/lib/data/types';

type SlaTable = Record<TaskKind, Record<CasePriority, number>>;

export const SLA_HOURS: SlaTable = {
  review_panel:        { urgent: 72, normal: 72, low: 72 },
  reply_message:       { urgent: 24, normal: 48, low: 72 },
  write_note:          { urgent: 24, normal: 24, low: 48 },
  order_test:          { urgent: 24, normal: 24, low: 48 },
  send_referral:       { urgent: 48, normal: 48, low: 96 },
  schedule_consult:    { urgent: 24, normal: 48, low: 72 },
  consult_prep:        { urgent: 24, normal: 24, low: 24 },
  write_training_plan: { urgent: 48, normal: 7 * 24, low: 14 * 24 },
  followup_check:      { urgent: 7 * 24, normal: 7 * 24, low: 7 * 24 },
  checkin_outreach:    { urgent: 7 * 24, normal: 14 * 24, low: 14 * 24 },
  review_intake:       { urgent: 48, normal: 48, low: 72 },
  custom:              { urgent: 24, normal: 72, low: 7 * 24 },
};

export function computeDueAt(kind: TaskKind, priority: CasePriority, createdAt: Date): Date {
  const hours = SLA_HOURS[kind][priority];
  return new Date(createdAt.getTime() + hours * 60 * 60 * 1000);
}

export function isOverdue(dueAt: string | null, now: Date): boolean {
  if (dueAt === null) return false;
  return now.getTime() > new Date(dueAt).getTime();
}
