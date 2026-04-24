import type { SupabaseClient } from '@supabase/supabase-js';

export type PanelView = {
  id: string;
  panel_id: string;
  viewer_id: string;
  opened_at: string;
};

export async function logPanelView(
  client: SupabaseClient,
  panelId: string,
  viewerId: string,
): Promise<PanelView> {
  const { data, error } = await client
    .from('panel_views')
    .insert({ panel_id: panelId, viewer_id: viewerId })
    .select('*')
    .single();
  if (error) throw error;
  return data as PanelView;
}

export async function listPanelViews(
  client: SupabaseClient,
  panelId: string,
): Promise<PanelView[]> {
  const { data, error } = await client
    .from('panel_views')
    .select('*')
    .eq('panel_id', panelId)
    .order('opened_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PanelView[];
}
