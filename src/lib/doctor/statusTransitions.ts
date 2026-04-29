import type { CaseStatus } from '@/lib/data/types';

export type AutoEvent =
  | 'doctor_opened'
  | 'note_posted'
  | 'order_attached'
  | 'member_acted';

const AUTO: Record<CaseStatus, Partial<Record<AutoEvent, CaseStatus>>> = {
  new:             { doctor_opened: 'in_progress' },
  in_progress:     { note_posted: 'replied' },
  replied:         { order_attached: 'awaiting_member' },
  awaiting_member: { member_acted: 'in_progress' },
  on_hold:         {},
  closed:          {},
};

export function nextStatus(current: CaseStatus, event: AutoEvent): CaseStatus | null {
  return AUTO[current][event] ?? null;
}

export function isValidTransition(from: CaseStatus, to: CaseStatus): boolean {
  if (from === to) return false;
  if (to === 'on_hold' || to === 'closed') return true;
  if (from === 'closed') return false; // closed is terminal except via re-open (deferred)
  if (from === 'on_hold' && to === 'in_progress') return true;
  // auto-transitions are always valid
  return Object.values(AUTO[from]).includes(to);
}
