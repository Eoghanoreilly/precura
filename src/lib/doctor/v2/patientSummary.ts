import type { SupabaseClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';

const TTL_MS = 30 * 60 * 1000; // 30 minutes per spec

const SYSTEM = `You write a clinical Precura summary of a patient for a reviewing doctor. Rules:
- 4-5 sentences total. No bullet points.
- Use "above range" / "below range" exactly when describing markers.
- Allowed verbs: is, was, has, rose, dropped, stable, trending.
- Never use: likely, mild, benign, fine, slight, only. Never say AI.
- Use plain-English marker names; Swedish prefixes only in parentheses.
- Mention concrete numbers and trends. Mention what is open.
- Do not draw clinical conclusions or recommendations.`;

type Inputs = {
  patientName: string;
  joinedAt: string;
  panels: Array<{ id: string; panel_date: string; biomarkers: Array<{ short_name: string; value: number; unit: string; ref_range_low: number | null; ref_range_high: number | null; status: string }> }>;
  recentMessages: Array<{ content: string; created_at: string }>;
  recentNotes: Array<{ body: string; created_at: string }>;
  activeCases: Array<{ title: string; status: string; opened_at: string }>;
  membershipUse: { consultMinutesUsed: number; panelsReviewed: number };
};

export function computeInputsHash(input: Inputs): string {
  const minimal = {
    p: input.panels.map((p) => p.id).join(','),
    m: input.recentMessages.slice(0, 5).map((m) => m.content.slice(0, 200)).join('|'),
    n: input.recentNotes.slice(0, 3).map((n) => n.body.slice(0, 200)).join('|'),
    c: input.activeCases.map((c) => `${c.title}/${c.status}`).join(','),
  };
  return createHash('sha256').update(JSON.stringify(minimal)).digest('hex').slice(0, 16);
}

function deterministicFallback(input: Inputs): string {
  const parts: string[] = [];
  parts.push(`${input.patientName} joined Precura ${new Date(input.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}.`);
  if (input.panels.length === 0) {
    parts.push('No panels on file yet.');
  } else {
    const latest = input.panels[input.panels.length - 1];
    const flagged = (latest.biomarkers ?? []).filter((b) => b.status === 'abnormal' || b.status === 'borderline');
    parts.push(flagged.length > 0
      ? `Latest panel from ${new Date(latest.panel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} has ${flagged.length} flagged marker${flagged.length === 1 ? '' : 's'}.`
      : `Latest panel from ${new Date(latest.panel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} has all markers in range.`);
  }
  if (input.activeCases.length > 0) {
    parts.push(`${input.activeCases.length} open case${input.activeCases.length === 1 ? '' : 's'}: ${input.activeCases.slice(0, 2).map((c) => c.title).join('; ')}.`);
  } else {
    parts.push('No open cases.');
  }
  parts.push(`Used ${input.membershipUse.consultMinutesUsed} of consult minutes and ${input.membershipUse.panelsReviewed} panel reviews this year.`);
  return parts.join(' ');
}

export type RegenerateResult = { summary: string; cached: boolean; generated_at: string; inputs_hash: string };

export async function ensurePatientSummary(client: SupabaseClient, patientId: string, inputs: Inputs, opts: { force?: boolean } = {}): Promise<RegenerateResult> {
  const newHash = computeInputsHash(inputs);
  const { data: existing } = await client.from('patient_summaries').select('summary, generated_at, inputs_hash').eq('patient_id', patientId).maybeSingle();
  const now = Date.now();
  if (!opts.force && existing) {
    const ageMs = now - new Date(existing.generated_at as string).getTime();
    const sameInputs = (existing.inputs_hash as string) === newHash;
    if (ageMs < TTL_MS || sameInputs) {
      return { summary: existing.summary as string, cached: true, generated_at: existing.generated_at as string, inputs_hash: existing.inputs_hash as string };
    }
  }
  const summary = await callClaudeOrFallback(inputs);
  const generated_at = new Date().toISOString();
  await client.from('patient_summaries').upsert({
    patient_id: patientId,
    summary,
    generated_at,
    inputs_hash: newHash,
  });
  return { summary, cached: false, generated_at, inputs_hash: newHash };
}

async function callClaudeOrFallback(inputs: Inputs): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return deterministicFallback(inputs);
  try {
    const client = new Anthropic({ apiKey });
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Patient profile inputs JSON:\n${JSON.stringify(inputs, null, 2)}\n\nWrite the 4-5 sentence summary.` }],
    });
    const block = res.content[0];
    if (block?.type === 'text' && block.text.trim().length > 0) return block.text.trim();
    return deterministicFallback(inputs);
  } catch {
    return deterministicFallback(inputs);
  }
}
