import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerSupabase } from '@/lib/supabase/server';
import { getPreRead, upsertPreRead } from '@/lib/data/preReads';
import { generatePreRead, type PanelWithMarkers } from '@/lib/doctor/generatePreRead';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: panelId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const cached = await getPreRead(supabase, panelId);
  if (cached) return NextResponse.json({ preRead: cached });

  const { data: panel } = await supabase
    .from('panels')
    .select('id, user_id, created_at, biomarkers(short_name,value,unit,ref_range_low,ref_range_high)')
    .eq('id', panelId)
    .single();
  if (!panel) return NextResponse.json({ error: 'panel not found' }, { status: 404 });

  const { data: allPanels } = await supabase
    .from('panels')
    .select('id, created_at, biomarkers(short_name,value,unit,ref_range_low,ref_range_high)')
    .eq('user_id', panel.user_id)
    .order('created_at', { ascending: true });

  const panelsForFacts = (allPanels ?? []) as unknown as PanelWithMarkers[];
  const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

  const result = await generatePreRead(panelsForFacts, { client });
  const stored = await upsertPreRead(supabase, {
    panelId,
    narrative: result.narrative,
    facts: result.facts,
    model: client ? 'claude-haiku-4-5' : 'fallback',
  });
  return NextResponse.json({ preRead: stored });
}
