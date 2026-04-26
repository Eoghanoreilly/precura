import { describe, it, expect } from 'vitest';
import { derivePatientState, type PatientStateInput } from '../caseStateDerivation';

const NOW = new Date('2026-04-25T12:00:00Z');

function input(overrides: Partial<PatientStateInput> = {}): PatientStateInput {
  return {
    openCases: [],
    lastActivityAt: '2026-04-24T12:00:00Z',
    now: NOW,
    ...overrides,
  };
}

describe('derivePatientState', () => {
  it('Awaiting you when an open case has an open task overdue', () => {
    const r = derivePatientState(input({
      openCases: [{
        category: 'panel_review',
        status: 'in_progress',
        priority: 'urgent',
        hasFlaggedMarker: true,
        tasks: [{ status: 'open', dueAt: '2026-04-22T12:00:00Z' }],
      }],
    }));
    expect(r).toBe('Awaiting you');
  });

  it('Awaiting you when due today', () => {
    const r = derivePatientState(input({
      openCases: [{
        category: 'consultation',
        status: 'in_progress',
        priority: 'normal',
        hasFlaggedMarker: false,
        tasks: [{ status: 'open', dueAt: '2026-04-25T18:00:00Z' }],
      }],
    }));
    expect(r).toBe('Awaiting you');
  });

  it('Attention when flagged but no due-soon task', () => {
    const r = derivePatientState(input({
      openCases: [{
        category: 'panel_review',
        status: 'in_progress',
        priority: 'normal',
        hasFlaggedMarker: true,
        tasks: [{ status: 'open', dueAt: '2026-04-30T00:00:00Z' }],
      }],
    }));
    expect(r).toBe('Attention');
  });

  it('Awaiting member when ALL open cases are awaiting_member', () => {
    const r = derivePatientState(input({
      openCases: [{
        category: 'consultation',
        status: 'awaiting_member',
        priority: 'normal',
        hasFlaggedMarker: false,
        tasks: [],
      }],
    }));
    expect(r).toBe('Awaiting member');
  });

  it('Onboarding when an open case has category=onboarding', () => {
    const r = derivePatientState(input({
      openCases: [{
        category: 'onboarding',
        status: 'in_progress',
        priority: 'normal',
        hasFlaggedMarker: false,
        tasks: [{ status: 'open', dueAt: '2026-04-30T00:00:00Z' }],
      }],
    }));
    expect(r).toBe('Onboarding');
  });

  it('Routine when in_progress, normal priority, no flag, no due-soon task', () => {
    const r = derivePatientState(input({
      openCases: [{
        category: 'panel_review',
        status: 'in_progress',
        priority: 'normal',
        hasFlaggedMarker: false,
        tasks: [{ status: 'open', dueAt: '2026-04-30T00:00:00Z' }],
      }],
    }));
    expect(r).toBe('Routine');
  });

  it('Stable when no open cases, recent activity', () => {
    const r = derivePatientState(input({ openCases: [], lastActivityAt: '2026-04-24T12:00:00Z' }));
    expect(r).toBe('Stable');
  });

  it('Stale 90d when no activity in 90 days', () => {
    const r = derivePatientState(input({ openCases: [], lastActivityAt: '2025-12-01T12:00:00Z' }));
    expect(r).toBe('Stale 90d');
  });

  it('precedence: Awaiting you wins over Onboarding', () => {
    const r = derivePatientState(input({
      openCases: [
        { category: 'onboarding', status: 'in_progress', priority: 'normal', hasFlaggedMarker: false, tasks: [{ status: 'open', dueAt: '2026-04-30T00:00:00Z' }] },
        { category: 'panel_review', status: 'in_progress', priority: 'urgent', hasFlaggedMarker: true, tasks: [{ status: 'open', dueAt: '2026-04-22T12:00:00Z' }] },
      ],
    }));
    expect(r).toBe('Awaiting you');
  });
});
