import { describe, it, expect } from 'vitest';
import { computeDueAt, isOverdue, SLA_HOURS } from '../sla';
import type { TaskKind, CasePriority } from '@/lib/data/types';

describe('computeDueAt', () => {
  const created = new Date('2026-04-21T10:00:00Z');
  const cases: Array<[TaskKind, CasePriority, number]> = [
    ['review_panel', 'normal', 72],
    ['review_panel', 'urgent', 72],
    ['reply_message', 'normal', 48],
    ['reply_message', 'urgent', 24],
    ['order_test', 'normal', 24],
    ['schedule_consult', 'normal', 48],
    ['consult_prep', 'normal', 24],
    ['write_note', 'normal', 24],
    ['send_referral', 'normal', 48],
    ['followup_check', 'normal', 7 * 24],
    ['checkin_outreach', 'low', 14 * 24],
    ['review_intake', 'normal', 48],
    ['custom', 'normal', 72],
    ['write_training_plan', 'normal', 7 * 24],
  ];
  for (const [kind, priority, expectedHours] of cases) {
    it(`${kind} (${priority}) is due ${expectedHours}h after creation`, () => {
      const due = computeDueAt(kind, priority, created);
      expect(due.getTime() - created.getTime()).toBe(expectedHours * 60 * 60 * 1000);
    });
  }
});

describe('isOverdue', () => {
  it('returns true when now > due_at', () => {
    expect(isOverdue('2026-04-20T10:00:00Z', new Date('2026-04-21T10:00:00Z'))).toBe(true);
  });
  it('returns false when now < due_at', () => {
    expect(isOverdue('2026-04-22T10:00:00Z', new Date('2026-04-21T10:00:00Z'))).toBe(false);
  });
  it('returns false when due_at is null', () => {
    expect(isOverdue(null, new Date())).toBe(false);
  });
});

describe('SLA_HOURS', () => {
  it('exposes a record of all task kinds', () => {
    expect(SLA_HOURS.review_panel.normal).toBe(72);
    expect(SLA_HOURS.reply_message.urgent).toBe(24);
  });
});
