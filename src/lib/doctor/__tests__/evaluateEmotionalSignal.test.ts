import { describe, it, expect } from 'vitest';
import { evaluateEmotionalSignal, WORRY_WORDS } from '../evaluateEmotionalSignal';

type Msg = { content: string; created_at: string };

const d = (daysAgo: number, hour = 12) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - daysAgo);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
};

describe('evaluateEmotionalSignal', () => {
  it('returns triggered=false for empty messages', () => {
    expect(evaluateEmotionalSignal([]).triggered).toBe(false);
  });
  it('returns triggered=false for 2 messages in 7d (below frequency)', () => {
    const msgs: Msg[] = [
      { content: 'hi', created_at: d(1) },
      { content: 'hello', created_at: d(2) },
    ];
    expect(evaluateEmotionalSignal(msgs).triggered).toBe(false);
  });
  it('returns triggered=false for 5 messages in 7d with no night-hour or worry word', () => {
    const msgs: Msg[] = [0,1,2,3,4].map((i) => ({ content: 'question about supplements', created_at: d(i, 12) }));
    expect(evaluateEmotionalSignal(msgs).triggered).toBe(false);
  });
  it('returns triggered=true when 3+ messages in 7d with one after 22:00', () => {
    const msgs: Msg[] = [
      { content: 'question one', created_at: d(1, 23) },
      { content: 'question two', created_at: d(2, 12) },
      { content: 'question three', created_at: d(3, 14) },
    ];
    const r = evaluateEmotionalSignal(msgs);
    expect(r.triggered).toBe(true);
    expect(r.nightCount).toBe(1);
  });
  it('returns triggered=true when 3+ messages in 7d with a worry word', () => {
    const msgs: Msg[] = [
      { content: 'I am scared about this', created_at: d(1, 12) },
      { content: 'just a normal question', created_at: d(2, 12) },
      { content: 'another question', created_at: d(3, 12) },
    ];
    const r = evaluateEmotionalSignal(msgs);
    expect(r.triggered).toBe(true);
    expect(r.worryWordHits.scared).toBe(1);
  });
  it('counts worry word hits case-insensitively', () => {
    const msgs: Msg[] = [
      { content: 'I am SCARED', created_at: d(1) },
      { content: 'and worried', created_at: d(2) },
      { content: 'also Worried about this', created_at: d(3) },
    ];
    const r = evaluateEmotionalSignal(msgs);
    expect(r.worryWordHits.scared).toBe(1);
    expect(r.worryWordHits.worried).toBe(2);
  });
  it('ignores messages older than 7d in message count', () => {
    const msgs: Msg[] = [
      { content: 'I am scared', created_at: d(10) },
      { content: 'normal', created_at: d(2) },
      { content: 'normal', created_at: d(3) },
    ];
    const r = evaluateEmotionalSignal(msgs);
    expect(r.messageCount7d).toBe(2);
    expect(r.triggered).toBe(false);
  });
  it('returns matching worry words from WORRY_WORDS list', () => {
    expect(WORRY_WORDS).toContain('scared');
    expect(WORRY_WORDS).toContain("can't sleep");
  });
});
