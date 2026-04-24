import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { listPanelViews, logPanelView } from '@/lib/data/panelViews';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: panelId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const views = await listPanelViews(supabase, panelId);
  return NextResponse.json({ views });
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: panelId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const view = await logPanelView(supabase, panelId, user.id);
  return NextResponse.json({ view });
}
