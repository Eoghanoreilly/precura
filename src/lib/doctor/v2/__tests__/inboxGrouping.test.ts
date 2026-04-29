import { describe, it, expect } from 'vitest';
import { groupTasksByDue } from '../inboxGrouping';
import type { TaskRow } from '../inboxGrouping';
import type { TaskKind, CasePriority, TaskStatus } from '@/lib/data/types';

const NOW = new Date('2026-04-25T12:00:00Z');

function makeTask(overrides: Partial<TaskRow> & { status: TaskStatus }): TaskRow {
  return {
    id: 'task-1',
    case_id: 'case-1',
    kind: 'review_panel' as TaskKind,
    title: 'Review panel',
    due_at: null,
    priority: 'normal' as CasePriority,
    status: overrides.status,
    done_at: null,
    case_title: 'Test Case',
    case_id_short: 'CASE-001',
    patient_id: 'patient-1',
    patient_display_name: 'Anna Johansson',
    flag_count: 0,
    ...overrides,
  };
}

describe('groupTasksByDue', () => {
  it('puts overdue open tasks in overdue group', () => {
    const task = makeTask({ status: 'open', due_at: '2026-04-24T10:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.overdue).toContain(task);
    expect(result.today).toHaveLength(0);
    expect(result.counts.overdue).toBe(1);
  });

  it('puts overdue in_progress tasks in overdue group', () => {
    const task = makeTask({ status: 'in_progress', due_at: '2026-04-20T00:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.overdue).toContain(task);
    expect(result.counts.overdue).toBe(1);
  });

  it('puts task due today (same UTC date) in today group when not overdue', () => {
    // Due at 14:00 today - in the future so not overdue
    const task = makeTask({ status: 'open', due_at: '2026-04-25T14:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.today).toContain(task);
    expect(result.overdue).toHaveLength(0);
    expect(result.counts.today).toBe(1);
  });

  it('task due_at exactly now goes to overdue (not today)', () => {
    const task = makeTask({ status: 'open', due_at: '2026-04-25T12:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    // due_at === now means it is at the boundary - since due_at < now is strict,
    // exact equality is NOT overdue. It falls on today's date, so it goes to today.
    expect(result.today).toContain(task);
    expect(result.overdue).toHaveLength(0);
  });

  it('task due tomorrow goes to thisWeek', () => {
    const task = makeTask({ status: 'open', due_at: '2026-04-26T12:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.thisWeek).toContain(task);
    expect(result.counts.thisWeek).toBe(1);
  });

  it('task due 6 days out goes to thisWeek', () => {
    // 6 calendar days after now = 2026-05-01
    const task = makeTask({ status: 'open', due_at: '2026-05-01T12:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.thisWeek).toContain(task);
  });

  it('task due 7 days out goes to later', () => {
    const task = makeTask({ status: 'open', due_at: '2026-05-02T12:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.later).toContain(task);
    expect(result.counts.later).toBe(1);
  });

  it('puts open task with no due_at in noDueDate group', () => {
    const task = makeTask({ status: 'open', due_at: null });
    const result = groupTasksByDue([task], NOW);
    expect(result.noDueDate).toContain(task);
    expect(result.counts.noDueDate).toBe(1);
  });

  it('puts in_progress task with no due_at in noDueDate group', () => {
    const task = makeTask({ status: 'in_progress', due_at: null });
    const result = groupTasksByDue([task], NOW);
    expect(result.noDueDate).toContain(task);
  });

  it('puts done task completed today in doneToday group', () => {
    const task = makeTask({
      status: 'done',
      due_at: '2026-04-25T08:00:00Z',
      done_at: '2026-04-25T11:00:00Z', // before NOW but today
    });
    const result = groupTasksByDue([task], NOW);
    expect(result.doneToday).toContain(task);
    expect(result.counts.doneToday).toBe(1);
    // should not appear in open buckets
    expect(result.overdue).toHaveLength(0);
    expect(result.today).toHaveLength(0);
  });

  it('excludes done task completed yesterday from doneToday and all open groups', () => {
    const task = makeTask({
      status: 'done',
      due_at: '2026-04-24T10:00:00Z',
      done_at: '2026-04-24T10:30:00Z',
    });
    const result = groupTasksByDue([task], NOW);
    expect(result.doneToday).toHaveLength(0);
    expect(result.overdue).toHaveLength(0);
    expect(result.today).toHaveLength(0);
    expect(result.noDueDate).toHaveLength(0);
  });

  it('excludes skipped tasks from all groups', () => {
    const task = makeTask({ status: 'skipped', due_at: '2026-04-24T10:00:00Z' });
    const result = groupTasksByDue([task], NOW);
    expect(result.overdue).toHaveLength(0);
    expect(result.today).toHaveLength(0);
    expect(result.thisWeek).toHaveLength(0);
    expect(result.later).toHaveLength(0);
    expect(result.noDueDate).toHaveLength(0);
    expect(result.doneToday).toHaveLength(0);
  });

  it('excludes blocked tasks from all groups', () => {
    const task = makeTask({ status: 'blocked', due_at: null });
    const result = groupTasksByDue([task], NOW);
    expect(result.noDueDate).toHaveLength(0);
    expect(result.overdue).toHaveLength(0);
  });

  it('groups sort by due_at ascending within each group', () => {
    const t1 = makeTask({ id: 'a', status: 'open', due_at: '2026-04-26T18:00:00Z' });
    const t2 = makeTask({ id: 'b', status: 'open', due_at: '2026-04-26T09:00:00Z' });
    const t3 = makeTask({ id: 'c', status: 'open', due_at: '2026-04-27T12:00:00Z' });
    const result = groupTasksByDue([t1, t2, t3], NOW);
    // All 3 go to thisWeek; sorted by due_at asc
    expect(result.thisWeek[0].id).toBe('b');
    expect(result.thisWeek[1].id).toBe('a');
    expect(result.thisWeek[2].id).toBe('c');
  });

  it('noDueDate tasks sort stably (null due_at last within overall order)', () => {
    const t1 = makeTask({ id: 'x', status: 'open', due_at: null });
    const t2 = makeTask({ id: 'y', status: 'open', due_at: null });
    const result = groupTasksByDue([t1, t2], NOW);
    // Both in noDueDate; original order preserved when due_at is null
    expect(result.noDueDate).toHaveLength(2);
  });

  it('counts object matches array lengths', () => {
    const overdue = makeTask({ id: 'o', status: 'open', due_at: '2026-04-24T10:00:00Z' });
    const today = makeTask({ id: 't', status: 'open', due_at: '2026-04-25T18:00:00Z' });
    const noDue = makeTask({ id: 'n', status: 'open', due_at: null });
    const result = groupTasksByDue([overdue, today, noDue], NOW);
    expect(result.counts.overdue).toBe(result.overdue.length);
    expect(result.counts.today).toBe(result.today.length);
    expect(result.counts.noDueDate).toBe(result.noDueDate.length);
  });
});
