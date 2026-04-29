import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getCase, updateCaseStatus } from '@/lib/data/cases';
import { isValidTransition } from '@/lib/doctor/statusTransitions';
import { logCaseEvent } from '@/lib/data/caseEvents';
import type { CaseStatus } from '@/lib/data/types';

export const runtime = 'nodejs';

const VALID_STATUSES: CaseStatus[] = ['new', 'in_progress', 'replied', 'awaiting_member', 'on_hold', 'closed'];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const supabase = await createServerSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || (profile.role !== 'doctor' && profile.role !== 'both')) {
      return NextResponse.json({ error: 'Doctor role required' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.status !== 'string' || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const nextSt = body.status as CaseStatus;
    const reason = typeof body.reason === 'string' ? body.reason : undefined;

    const current = await getCase(supabase, id);
    if (!current) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    if (current.status === nextSt) {
      return NextResponse.json({ ok: true, case: current });
    }
    if (!isValidTransition(current.status, nextSt)) {
      return NextResponse.json({ error: `Cannot transition ${current.status} -> ${nextSt}` }, { status: 400 });
    }
    if (nextSt === 'on_hold' && (!reason || reason.trim().length === 0)) {
      return NextResponse.json({ error: 'on_hold requires a reason' }, { status: 400 });
    }

    await updateCaseStatus(supabase, id, nextSt, reason);
    await logCaseEvent(supabase, {
      caseId: id,
      kind: 'status_changed',
      payload: { from: current.status, to: nextSt, reason: reason ?? null },
      actorId: user.id,
    });

    const updated = await getCase(supabase, id);
    return NextResponse.json({ ok: true, case: updated });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? 'Unknown error' }, { status: 500 });
  }
}
