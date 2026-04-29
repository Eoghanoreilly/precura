import type { SupabaseClient } from '@supabase/supabase-js';
import type { CaseEvent, CaseEventKind } from './types';

export async function logCaseEvent(
  client: SupabaseClient,
  params: {
    caseId: string;
    kind: CaseEventKind;
    payload?: Record<string, unknown>;
    actorId?: string | null;
  },
): Promise<void> {
  const { error } = await client.from('case_events').insert({
    case_id: params.caseId,
    kind: params.kind,
    payload: params.payload ?? {},
    actor_id: params.actorId ?? null,
  });
  if (error) throw error;
}

export async function getCaseEvents(
  client: SupabaseClient,
  caseId: string,
): Promise<CaseEvent[]> {
  const { data, error } = await client
    .from('case_events')
    .select('*')
    .eq('case_id', caseId)
    .order('occurred_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as CaseEvent[];
}
