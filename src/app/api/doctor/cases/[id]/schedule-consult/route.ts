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
    const scheduledFor = typeof body.scheduled_for === 'string' ? body.scheduled_for : null;
    const kind = body.kind === 'in_person' ? 'in_person' : 'video';

    const c = await getCase(supabase, id);
    if (!c) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    // No billing at scheduling time - consult is billed when completed
    const { error: taskErr } = await supabase.from('tasks').insert({
      case_id: id,
      kind: 'schedule_consult',
      title: `Consult scheduled (${kind})${scheduledFor ? ` - ${scheduledFor}` : ''}`,
      status: 'done',
      done_at: new Date().toISOString(),
      source: 'doctor',
    });
    if (taskErr) throw taskErr;

    await logCaseEvent(supabase, {
      caseId: id,
      kind: 'commented',
      payload: { action: 'schedule_consult', scheduled_for: scheduledFor, kind },
      actorId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
