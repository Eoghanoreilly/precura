import { describe, it, expect } from 'vitest';
import { validateAcknowledge, validateDefer } from '../reviewState';

describe('validateAcknowledge', () => {
  it('requires doctor role', () => {
    expect(() => validateAcknowledge({ role: 'patient' } as any)).toThrow(/role/i);
  });
  it('accepts role doctor', () => {
    expect(() => validateAcknowledge({ role: 'doctor' } as any)).not.toThrow();
  });
  it('accepts role both', () => {
    expect(() => validateAcknowledge({ role: 'both' } as any)).not.toThrow();
  });
});
describe('validateDefer', () => {
  it('requires a non-empty reason', () => {
    expect(() => validateDefer({ role: 'doctor' } as any, '')).toThrow(/reason/i);
    expect(() => validateDefer({ role: 'doctor' } as any, '   ')).toThrow(/reason/i);
  });
  it('accepts a reason and doctor role', () => {
    expect(() => validateDefer({ role: 'doctor' } as any, 'recheck in 30d')).not.toThrow();
  });
});
