import { describe, it, expect } from 'vitest';
import { nextStatus, isValidTransition } from '../statusTransitions';

describe('nextStatus auto-transitions', () => {
  it('new -> in_progress on doctor_opened', () => {
    expect(nextStatus('new', 'doctor_opened')).toBe('in_progress');
  });
  it('in_progress -> replied on note_posted', () => {
    expect(nextStatus('in_progress', 'note_posted')).toBe('replied');
  });
  it('replied -> awaiting_member on order_attached', () => {
    expect(nextStatus('replied', 'order_attached')).toBe('awaiting_member');
  });
  it('awaiting_member -> in_progress on member_acted', () => {
    expect(nextStatus('awaiting_member', 'member_acted')).toBe('in_progress');
  });
  it('returns null when transition does not apply', () => {
    expect(nextStatus('closed', 'doctor_opened')).toBe(null);
  });
});

describe('isValidTransition (manual transitions)', () => {
  it('allows any -> on_hold', () => {
    expect(isValidTransition('new', 'on_hold')).toBe(true);
    expect(isValidTransition('replied', 'on_hold')).toBe(true);
  });
  it('allows any -> closed', () => {
    expect(isValidTransition('in_progress', 'closed')).toBe(true);
    expect(isValidTransition('on_hold', 'closed')).toBe(true);
  });
  it('rejects backwards transitions like closed -> new', () => {
    expect(isValidTransition('closed', 'new')).toBe(false);
  });
  it('allows on_hold -> in_progress (resume)', () => {
    expect(isValidTransition('on_hold', 'in_progress')).toBe(true);
  });
});
