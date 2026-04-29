import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getCase } from '@/lib/data/cases';
import { generatePreRead } from '@/lib/doctor/generatePreRead';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const supabase = await createServerSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || (profile.role !== 'doctor' && profile.role !== 'both')) {
      return NextResponse.json({ error: 'Doctor role required' }, { status: 403 });
    }

    const c = await getCase(supabase, id);
    if (!c) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    if (!c.migrated_from_panel_id) {
      return NextResponse.json({ ok: false, reason: 'No linked panel; summary skipped' });
    }

    // Fetch all panels for this patient with their biomarkers
    const { data: panels, error: panelsErr } = await supabase
      .from('panels')
      .select('id, created_at, biomarkers(short_name, value, unit, ref_range_low, ref_range_high)')
      .eq('user_id', c.patient_id)
      .order('created_at', { ascending: true });
    if (panelsErr) throw panelsErr;

    const safe = (panels ?? []).map((p) => {
      const r = p as {
        id: string;
        created_at: string;
        biomarkers?: Array<{
          short_name: string;
          value: number;
          unit: string;
          ref_range_low: number | null;
          ref_range_high: number | null;
        }>;
      };
      return { id: r.id, created_at: r.created_at, biomarkers: r.biomarkers ?? [] };
    });

    if (safe.length === 0) {
      return NextResponse.json({ ok: false, reason: 'No panels to summarize' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const client = apiKey ? new Anthropic({ apiKey }) : null;
    const result = await generatePreRead(safe, { client });

    const { error: updErr } = await supabase
      .from('cases')
      .update({ summary: result.narrative, summary_generated_at: new Date().toISOString() })
      .eq('id', id);
    if (updErr) throw updErr;

    return NextResponse.json({ ok: true, summary: result.narrative });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? 'Unknown error' }, { status: 500 });
  }
}
