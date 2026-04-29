import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { ensurePatientSummary } from '@/lib/doctor/v2/patientSummary';
import { fetchPatientProfile } from '@/lib/doctor/v2/patientProfileQueries';

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
    const data = await fetchPatientProfile(supabase, id);
    if (!data) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    // Load full panel history with biomarkers for the summary
    const { data: panels } = await supabase
      .from('panels')
      .select('id, panel_date, biomarkers(short_name, value, unit, ref_range_low, ref_range_high, status)')
      .eq('user_id', id)
      .order('panel_date', { ascending: true });

    const result = await ensurePatientSummary(supabase, id, {
      patientName: data.patient.display_name,
      joinedAt: data.patient.created_at,
      panels: (panels ?? []).map((p) => {
        const r = p as { id: string; panel_date: string; biomarkers?: Array<{ short_name: string; value: number; unit: string; ref_range_low: number | null; ref_range_high: number | null; status: string }> };
        return { id: r.id, panel_date: r.panel_date, biomarkers: r.biomarkers ?? [] };
      }),
      recentMessages: data.recentMessages,
      recentNotes: data.recentNotes.map((n) => ({ body: n.body, created_at: n.created_at })),
      activeCases: data.activeCases.map((c) => ({ title: c.title, status: c.status, opened_at: c.opened_at })),
      membershipUse: data.membershipUse,
    }, { force: true });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? 'Unknown error' }, { status: 500 });
  }
}
