import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getCase, updateCaseStatus } from '@/lib/data/cases';
import { logCaseEvent } from '@/lib/data/caseEvents';
import { nextStatus } from '@/lib/doctor/statusTransitions';

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

    const json = await req.json().catch(() => null);
    if (!json || typeof json.body !== 'string' || json.body.trim().length === 0) {
      return NextResponse.json({ error: 'Note body required' }, { status: 400 });
    }
    const scope = json.scope === 'internal' ? 'internal' : 'note';
    const noteBody = json.body.trim();

    const current = await getCase(supabase, id);
    if (!current) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    if (scope === 'note') {
      if (current.migrated_from_panel_id) {
        // Panel-linked case: store as annotation (member-visible) + billing
        const { error: annoErr } = await supabase.from('annotations').insert({
          target_type: 'panel',
          target_id: current.migrated_from_panel_id,
          author_id: user.id,
          body: noteBody,
          case_id: current.id,
        });
        if (annoErr) throw annoErr;

        if (current.category === 'panel_review') {
          const { error: billErr } = await supabase.rpc('emit_billing_for_action', {
            p_patient_id: current.patient_id,
            p_case_id: current.id,
            p_task_id: null,
            p_action_code: 'PANEL_REVIEWED_WITH_NOTE',
            p_qty: 1,
            p_unit: 'item',
            p_external_sek: null,
          });
          if (billErr) console.error('billing emit failed', billErr);
        }
      }
      // For cases with or without a panel, always log the note as a case event (member-visible)
      await logCaseEvent(supabase, {
        caseId: id,
        kind: 'note_posted',
        payload: {
          scope: 'note',
          body: noteBody,
          visible_to_member: true,
          length: noteBody.length,
          has_panel: !!current.migrated_from_panel_id,
        },
        actorId: user.id,
      });
    } else {
      // internal: log as a comment event only, no member-visible annotation
      await logCaseEvent(supabase, {
        caseId: id,
        kind: 'commented',
        payload: { scope: 'internal', body: noteBody },
        actorId: user.id,
      });
    }

    // Auto-transition: in_progress -> replied after note_posted
    const nextS = nextStatus(current.status, 'note_posted');
    if (nextS) {
      await updateCaseStatus(supabase, id, nextS);
      await logCaseEvent(supabase, {
        caseId: id,
        kind: 'status_changed',
        payload: { from: current.status, to: nextS, reason: 'auto_after_note' },
        actorId: user.id,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? 'Unknown error' }, { status: 500 });
  }
}
