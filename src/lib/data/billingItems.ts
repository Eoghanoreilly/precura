import type { SupabaseClient } from '@supabase/supabase-js';
import type { BillingItem } from './types';

export async function emitBillingItem(
  client: SupabaseClient,
  params: {
    patientId: string;
    caseId?: string | null;
    taskId?: string | null;
    code: string;
    qty?: number;
    unit?: string;
    sekAmount?: number | null;
    billedAgainst?: 'membership' | 'out_of_pocket';
  },
): Promise<BillingItem> {
  const { data, error } = await client
    .from('billing_items')
    .insert({
      patient_id: params.patientId,
      case_id: params.caseId ?? null,
      task_id: params.taskId ?? null,
      code: params.code,
      qty: params.qty ?? 1,
      unit: params.unit ?? 'item',
      sek_amount: params.sekAmount ?? null,
      billed_against: params.billedAgainst ?? 'membership',
    })
    .select()
    .single();
  if (error) throw error;
  return data as BillingItem;
}

export async function getMembershipUseForPatient(
  client: SupabaseClient,
  patientId: string,
): Promise<{
  consultMinutesUsed: number;
  panelsReviewed: number;
  outOfPocketSek: number;
}> {
  const { data, error } = await client
    .from('billing_items')
    .select('code, qty, sek_amount, billed_against')
    .eq('patient_id', patientId);
  if (error) throw error;
  let consultMinutesUsed = 0;
  let panelsReviewed = 0;
  let outOfPocketSek = 0;
  for (const item of data ?? []) {
    const row = item as Record<string, unknown>;
    if (row.code === 'CONSULT_MINUTES' && row.billed_against === 'membership') {
      consultMinutesUsed += Number(row.qty);
    }
    if (row.code === 'PANEL_REVIEWED_WITH_NOTE' && row.billed_against === 'membership') {
      panelsReviewed += Number(row.qty);
    }
    if (row.billed_against === 'out_of_pocket' && row.sek_amount !== null) {
      outOfPocketSek += Number(row.sek_amount);
    }
  }
  return { consultMinutesUsed, panelsReviewed, outOfPocketSek };
}
