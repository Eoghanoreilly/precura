import type { SupabaseClient } from '@supabase/supabase-js';

export async function triggerForNewPanel(
  client: SupabaseClient,
  panelId: string,
): Promise<{ caseId: string }> {
  const { data, error } = await client.rpc('open_case_for_panel', { p_panel_id: panelId });
  if (error) throw error;
  return { caseId: data as string };
}
