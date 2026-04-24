import { describe, it, expect } from 'vitest';
import { validateAcknowledge, validateDefer } from '../reviewState';
import type { Profile } from '@/lib/data/types';

type Actor = Pick<Profile, 'role'>;

describe('validateAcknowledge', () => {
  it('requires doctor role', () => {
    expect(() => validateAcknowledge({ role: 'patient' } as Actor)).toThrow(/role/i);
  });
  it('accepts role doctor', () => {
    expect(() => validateAcknowledge({ role: 'doctor' } as Actor)).not.toThrow();
  });
  it('accepts role both', () => {
    expect(() => validateAcknowledge({ role: 'both' } as Actor)).not.toThrow();
  });
});
describe('validateDefer', () => {
  it('requires a non-empty reason', () => {
    expect(() => validateDefer({ role: 'doctor' } as Actor, '')).toThrow(/reason/i);
    expect(() => validateDefer({ role: 'doctor' } as Actor, '   ')).toThrow(/reason/i);
  });
  it('accepts a reason and doctor role', () => {
    expect(() => validateDefer({ role: 'doctor' } as Actor, 'recheck in 30d')).not.toThrow();
  });
});
