import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { createTask, markTaskDone } from '@/lib/data/tasks';
import { logCaseEvent } from '@/lib/data/caseEvents';
import { getCase } from '@/lib/data/cases';
import type { TaskKind, CasePriority } from '@/lib/data/types';

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

    const body = await req.json().catch(() => null);
    if (!body || typeof body.kind !== 'string') {
      return NextResponse.json({ error: 'kind required' }, { status: 400 });
    }

    const c = await getCase(supabase, id);
    if (!c) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    const task = await createTask(supabase, {
      caseId: id,
      kind: body.kind as TaskKind,
      title: typeof body.title === 'string' ? body.title : undefined,
      priority: typeof body.priority === 'string' ? body.priority as CasePriority : undefined,
      source: 'doctor',
    });

    return NextResponse.json({ ok: true, task });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? 'Unknown error' }, { status: 500 });
  }
}

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
    if (!body || typeof body.taskId !== 'string') {
      return NextResponse.json({ error: 'taskId required' }, { status: 400 });
    }

    if (body.status === 'done') {
      await markTaskDone(supabase, body.taskId);
      await logCaseEvent(supabase, {
        caseId: id,
        kind: 'task_completed',
        payload: { task_id: body.taskId },
        actorId: user.id,
      });
    } else if (body.status === 'open') {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'open', done_at: null })
        .eq('id', body.taskId);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: 'Only done/open transitions supported' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? 'Unknown error' }, { status: 500 });
  }
}
