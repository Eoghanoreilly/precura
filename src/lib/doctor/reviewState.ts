import type { Profile } from '@/lib/data/types';

export type PanelReviewStatus = 'pending' | 'acknowledged_no_note' | 'acknowledged_with_note' | 'deferred';

export function validateAcknowledge(actor: Pick<Profile, 'role'>): void {
  if (!actor || (actor.role !== 'doctor' && actor.role !== 'both')) {
    throw new Error('Only a doctor role can acknowledge a panel.');
  }
}

export function validateDefer(actor: Pick<Profile, 'role'>, reason: string): void {
  if (!actor || (actor.role !== 'doctor' && actor.role !== 'both')) {
    throw new Error('Only a doctor role can defer a panel.');
  }
  if (!reason || reason.trim().length === 0) {
    throw new Error('A reason is required to defer a panel.');
  }
}

export function resolveAcknowledgeStatus(hasNote: boolean): PanelReviewStatus {
  return hasNote ? 'acknowledged_with_note' : 'acknowledged_no_note';
}
