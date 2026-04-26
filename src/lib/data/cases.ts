import type { SupabaseClient } from '@supabase/supabase-js';
import type { Case, CaseStatus, Task } from './types';

export async function getCase(client: SupabaseClient, id: string): Promise<Case | null> {
  const { data, error } = await client.from('cases').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // no rows
    throw error;
  }
  return data as Case;
}

export async function getCaseByShortId(
  client: SupabaseClient,
  shortId: string,
): Promise<Case | null> {
  const { data, error } = await client
    .from('cases')
    .select('*')
    .eq('case_id_short', shortId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Case;
}

export async function getOpenCasesForPatient(
  client: SupabaseClient,
  patientId: string,
): Promise<Case[]> {
  const { data, error } = await client
    .from('cases')
    .select('*')
    .eq('patient_id', patientId)
    .not('status', 'in', '(closed)')
    .order('opened_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Case[];
}

export async function getCaseWithTasks(
  client: SupabaseClient,
  id: string,
): Promise<{ case: Case; tasks: Task[] } | null> {
  const c = await getCase(client, id);
  if (!c) return null;
  const { data: tasks, error } = await client
    .from('tasks')
    .select('*')
    .eq('case_id', id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { case: c, tasks: (tasks ?? []) as Task[] };
}

export async function updateCaseStatus(
  client: SupabaseClient,
  id: string,
  next: CaseStatus,
  reason?: string,
): Promise<void> {
  const update: Record<string, unknown> = { status: next, updated_at: new Date().toISOString() };
  if (next === 'on_hold') update.on_hold_reason = reason ?? null;
  if (next === 'closed') {
    update.closed_at = new Date().toISOString();
    update.closed_reason = reason ?? null;
  }
  const { error } = await client.from('cases').update(update).eq('id', id);
  if (error) throw error;
}
