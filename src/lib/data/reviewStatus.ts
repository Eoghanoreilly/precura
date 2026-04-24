import type { SupabaseClient } from '@supabase/supabase-js';
import type { PanelReviewStatus } from '@/lib/doctor/reviewState';

export async function setReviewStatus(
  client: SupabaseClient,
  params: { panelId: string; status: PanelReviewStatus; reviewerId: string; deferReason?: string },
): Promise<void> {
  const { error } = await client
    .from('panels')
    .update({
      review_status: params.status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: params.reviewerId,
      defer_reason: params.deferReason ?? null,
    })
    .eq('id', params.panelId);
  if (error) throw error;
}
