import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerSupabase } from '@/lib/supabase/server';
import { getPreRead, upsertPreRead } from '@/lib/data/preReads';
import { generatePreRead, type PanelWithMarkers } from '@/lib/doctor/generatePreRead';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: panelId } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const cached = await getPreRead(supabase, panelId);
    if (cached) return NextResponse.json({ preRead: cached });

    const { data: panel, error: panelErr } = await supabase
      .from('panels')
      .select('id, user_id, created_at, biomarkers(short_name,value,unit,ref_range_low,ref_range_high)')
      .eq('id', panelId)
      .single();
    if (panelErr) {
      console.error('[pre-read] panel fetch error', panelErr);
      return NextResponse.json({ error: `panel fetch: ${panelErr.message}` }, { status: 500 });
    }
    if (!panel) return NextResponse.json({ error: 'panel not found' }, { status: 404 });

    const { data: allPanels, error: allErr } = await supabase
      .from('panels')
      .select('id, created_at, biomarkers(short_name,value,unit,ref_range_low,ref_range_high)')
      .eq('user_id', panel.user_id)
      .order('created_at', { ascending: true });
    if (allErr) {
      console.error('[pre-read] panels history fetch error', allErr);
      return NextResponse.json({ error: `panels history: ${allErr.message}` }, { status: 500 });
    }

    const panelsForFacts = (allPanels ?? []) as unknown as PanelWithMarkers[];
    let client: Anthropic | null = null;
    try {
      client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
    } catch (e) {
      console.error('[pre-read] Anthropic client init failed', e);
      client = null;
    }

    let result;
    try {
      result = await generatePreRead(panelsForFacts, { client });
    } catch (e) {
      console.error('[pre-read] LLM call threw, falling back to rule-based narrative', e);
      result = await generatePreRead(panelsForFacts, { client: null });
    }

    try {
      const stored = await upsertPreRead(supabase, {
        panelId,
        narrative: result.narrative,
        facts: result.facts,
        model: client ? 'claude-haiku-4-5' : 'fallback',
      });
      return NextResponse.json({ preRead: stored });
    } catch (e) {
      console.error('[pre-read] upsert failed, returning uncached result', e);
      return NextResponse.json({
        preRead: {
          id: 'uncached',
          panel_id: panelId,
          narrative: result.narrative,
          facts_json: result.facts,
          generated_at: new Date().toISOString(),
          model: 'fallback-uncached',
        },
      });
    }
  } catch (e) {
    console.error('[pre-read] unhandled error', e);
    return NextResponse.json({ error: (e as Error).message || 'unknown error' }, { status: 500 });
  }
}
