import { describe, it, expect } from 'vitest';
import { generatePreRead, buildFactsJson, PRE_READ_SYSTEM } from '../generatePreRead';

type Panel = { id: string; created_at: string; biomarkers: Array<{short_name:string;value:number;unit:string;ref_range_low:number|null;ref_range_high:number|null}> };

const panels: Panel[] = [
  { id: 'p1', created_at: '2026-02-05T10:00:00Z', biomarkers: [
    { short_name: 'S-Ferritin', value: 22, unit: 'ug/L', ref_range_low: 30, ref_range_high: 150 },
    { short_name: 'P-ALAT', value: 62, unit: 'U/L', ref_range_low: null, ref_range_high: 50 },
  ]},
  { id: 'p2', created_at: '2026-04-18T10:00:00Z', biomarkers: [
    { short_name: 'S-Ferritin', value: 11, unit: 'ug/L', ref_range_low: 30, ref_range_high: 150 },
    { short_name: 'P-ALAT', value: 58, unit: 'U/L', ref_range_low: null, ref_range_high: 50 },
  ]},
];

describe('buildFactsJson', () => {
  it('lists markers consistently below range across panels', () => {
    const facts = buildFactsJson(panels);
    const ferritin = facts.consistent_out_of_range.find((x) => x.name === 'S-Ferritin');
    expect(ferritin?.direction).toBe('below');
  });
  it('lists markers consistently above range across panels', () => {
    const facts = buildFactsJson(panels);
    const alat = facts.consistent_out_of_range.find((x) => x.name === 'P-ALAT');
    expect(alat?.direction).toBe('above');
  });
  it('tracks panel count', () => {
    expect(buildFactsJson(panels).panel_count).toBe(2);
  });
});

describe('generatePreRead - system prompt', () => {
  it('bans forbidden words in system prompt', () => {
    expect(PRE_READ_SYSTEM).toMatch(/never.*likely.*benign/i);
    expect(PRE_READ_SYSTEM).toMatch(/never.*AI/i);
  });
});

describe('generatePreRead - fallback narrative', () => {
  it('returns factual fallback when LLM client is unavailable', async () => {
    const result = await generatePreRead(panels, { client: null });
    expect(result.narrative).toMatch(/2 panels/);
    expect(result.narrative).toMatch(/ferritin/i);
  });
});
