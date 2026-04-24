import type { SupabaseClient } from '@supabase/supabase-js';
import type { PreReadFacts } from '@/lib/doctor/generatePreRead';

export type PrecuraPreRead = {
  id: string;
  panel_id: string;
  narrative: string;
  facts_json: PreReadFacts;
  generated_at: string;
  model: string;
};

export async function getPreRead(
  client: SupabaseClient,
  panelId: string,
): Promise<PrecuraPreRead | null> {
  const { data, error } = await client
    .from('precura_pre_reads')
    .select('*')
    .eq('panel_id', panelId)
    .maybeSingle();
  if (error) throw error;
  return (data as PrecuraPreRead | null) ?? null;
}

export async function upsertPreRead(
  client: SupabaseClient,
  params: { panelId: string; narrative: string; facts: PreReadFacts; model: string },
): Promise<PrecuraPreRead> {
  const { data, error } = await client
    .from('precura_pre_reads')
    .upsert(
      { panel_id: params.panelId, narrative: params.narrative, facts_json: params.facts, model: params.model },
      { onConflict: 'panel_id' },
    )
    .select('*')
    .single();
  if (error) throw error;
  return data as PrecuraPreRead;
}
