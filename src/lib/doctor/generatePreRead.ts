import Anthropic from '@anthropic-ai/sdk';

export type Biomarker = {
  short_name: string;
  value: number;
  unit: string;
  ref_range_low: number | null;
  ref_range_high: number | null;
};

export type PanelWithMarkers = {
  id: string;
  created_at: string;
  biomarkers: Biomarker[];
};

export type PreReadFacts = {
  panel_count: number;
  latest_panel_date: string;
  consistent_out_of_range: Array<{ name: string; direction: 'above'|'below'; values: number[]; unit: string; stable: boolean }>;
  new_out_of_range: Array<{ name: string; direction: 'above'|'below'; value: number; unit: string }>;
  trend_in_range: Array<{ name: string; direction: 'rising'|'falling'; values: number[]; unit: string }>;
};

export type PreReadResult = { narrative: string; facts: PreReadFacts };

export const PRE_READ_SYSTEM = `You are writing a factual pre-read summary for a doctor reviewing a patient's blood panel. Rules:
- Output 2-3 sentences maximum.
- Allowed verbs only: is, was, has, rose, dropped, stable, trending.
- Never use: likely, mild, benign, don't worry, normal, all clear, fine, slight, only. Never use AI.
- Always mention the panel count and one most-notable change.
- Never make a recommendation. Never draw a clinical conclusion.
- Use "above range" / "below range" exactly.
- Use plain-English marker names; Swedish prefixes only in parentheses.
- Output is data arrangement, not opinion.`;

function direction(b: Biomarker): 'above'|'below'|'in-range' {
  if (b.ref_range_high !== null && b.value > b.ref_range_high) return 'above';
  if (b.ref_range_low !== null && b.value < b.ref_range_low) return 'below';
  return 'in-range';
}

export function buildFactsJson(panels: PanelWithMarkers[]): PreReadFacts {
  const sorted = [...panels].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const latest = sorted[sorted.length - 1];
  const markersByName = new Map<string, Biomarker[]>();
  for (const p of sorted) for (const m of p.biomarkers) {
    const arr = markersByName.get(m.short_name) ?? [];
    arr.push(m);
    markersByName.set(m.short_name, arr);
  }
  const consistent_out_of_range: PreReadFacts['consistent_out_of_range'] = [];
  const new_out_of_range: PreReadFacts['new_out_of_range'] = [];
  const trend_in_range: PreReadFacts['trend_in_range'] = [];
  for (const [name, series] of markersByName) {
    if (series.length >= 2) {
      const dirs = series.map(direction);
      const allAbove = dirs.every((d) => d === 'above');
      const allBelow = dirs.every((d) => d === 'below');
      if (allAbove || allBelow) {
        const values = series.map((m) => m.value);
        const stable = Math.abs(values[values.length - 1] - values[0]) / Math.max(1, values[0]) < 0.15;
        consistent_out_of_range.push({ name, direction: allAbove ? 'above':'below', values, unit: series[0].unit, stable });
        continue;
      }
    }
    const latestM = series[series.length - 1];
    const latestDir = direction(latestM);
    if (latestDir !== 'in-range' && (series.length < 2 || direction(series[series.length - 2]) === 'in-range')) {
      new_out_of_range.push({ name, direction: latestDir, value: latestM.value, unit: latestM.unit });
      continue;
    }
    if (series.length >= 3 && series.every((m) => direction(m) === 'in-range')) {
      const values = series.map((m) => m.value);
      const up = values.every((v, i) => i === 0 || v >= values[i - 1]) && values[values.length - 1] > values[0];
      const down = values.every((v, i) => i === 0 || v <= values[i - 1]) && values[values.length - 1] < values[0];
      if (up || down) trend_in_range.push({ name, direction: up ? 'rising':'falling', values, unit: series[0].unit });
    }
  }
  return { panel_count: sorted.length, latest_panel_date: latest.created_at, consistent_out_of_range, new_out_of_range, trend_in_range };
}

function fallbackNarrative(facts: PreReadFacts): string {
  const parts: string[] = [`${facts.panel_count} panel${facts.panel_count === 1 ? '' : 's'} on file.`];
  if (facts.new_out_of_range.length > 0) {
    const m = facts.new_out_of_range[0];
    parts.push(`${m.name} ${m.direction} range for the first time in the latest panel.`);
  } else if (facts.consistent_out_of_range.length > 0) {
    const m = facts.consistent_out_of_range[0];
    parts.push(`${m.name} ${m.stable ? 'stable' : 'trending'} ${m.direction} range across panels.`);
  } else if (facts.trend_in_range.length > 0) {
    const m = facts.trend_in_range[0];
    parts.push(`${m.name} ${m.direction} across ${m.values.length} panels, still within range.`);
  } else {
    parts.push('All markers within reference ranges.');
  }
  return parts.join(' ');
}

export async function generatePreRead(panels: PanelWithMarkers[], opts: { client?: Anthropic | null } = {}): Promise<PreReadResult> {
  const facts = buildFactsJson(panels);
  if (!opts.client) return { narrative: fallbackNarrative(facts), facts };
  const response = await opts.client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 220,
    system: PRE_READ_SYSTEM,
    messages: [{ role: 'user', content: `Panel facts JSON:\n${JSON.stringify(facts, null, 2)}\n\nWrite the 2-3 sentence pre-read.` }],
  });
  const firstBlock = response.content[0];
  const narrative = firstBlock?.type === 'text' ? firstBlock.text.trim() : fallbackNarrative(facts);
  return { narrative, facts };
}
