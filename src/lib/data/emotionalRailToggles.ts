import type { SupabaseClient } from '@supabase/supabase-js';

export type ToggleAction = 'opened' | 'dismissed';

export async function recordRailToggle(
  client: SupabaseClient,
  params: { doctorId: string; memberId: string; action: ToggleAction; wasAutoTriggered: boolean },
): Promise<void> {
  const { error } = await client.from('emotional_rail_toggles').insert({
    doctor_id: params.doctorId,
    member_id: params.memberId,
    action: params.action,
    was_auto_triggered: params.wasAutoTriggered,
  });
  if (error) throw error;
}
