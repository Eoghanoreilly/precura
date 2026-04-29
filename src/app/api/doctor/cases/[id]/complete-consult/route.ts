import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getCase } from '@/lib/data/cases';
import { logCaseEvent } from '@/lib/data/caseEvents';

export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || (profile.role !== 'doctor' && profile.role !== 'both')) {
      return NextResponse.json({ error: 'Doctor role required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const minutes = typeof body.minutes === 'number' && body.minutes > 0 ? body.minutes : null;
    if (!minutes) return NextResponse.json({ error: 'minutes required and must be > 0' }, { status: 400 });

    const c = await getCase(supabase, id);
    if (!c) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    const { data: task, error: taskErr } = await supabase.from('tasks').insert({
      case_id: id,
      kind: 'schedule_consult',
      title: `Consult completed (${minutes} min)`,
      status: 'done',
      done_at: new Date().toISOString(),
      source: 'doctor',
    }).select().single();
    if (taskErr) throw taskErr;

    const { error: billErr } = await supabase.rpc('emit_billing_for_action', {
      p_patient_id: c.patient_id,
      p_case_id: id,
      p_task_id: (task as { id: string }).id,
      p_action_code: 'CONSULT_MINUTES',
      p_qty: minutes,
      p_unit: 'min',
      p_external_sek: null,
    });
    if (billErr) console.error('billing emit failed', billErr);

    await logCaseEvent(supabase, {
      caseId: id,
      kind: 'commented',
      payload: { action: 'consult_completed', duration_minutes: minutes },
      actorId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
