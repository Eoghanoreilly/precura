import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { validateAcknowledge, resolveAcknowledgeStatus } from '@/lib/doctor/reviewState';
import { setReviewStatus } from '@/lib/data/reviewStatus';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: panelId } = await params;
  const body = await req.json().catch(() => ({}));
  const noteBody: string | null = body?.note ?? null;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).single();
  if (!profile) return NextResponse.json({ error: 'no profile' }, { status: 403 });

  try {
    validateAcknowledge(profile);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  if (noteBody && noteBody.trim()) {
    const { error: annoErr } = await supabase.from('annotations').insert({
      author_id: profile.id,
      target_id: panelId,
      target_type: 'panel',
      body: noteBody.trim(),
    });
    if (annoErr) return NextResponse.json({ error: annoErr.message }, { status: 500 });
  }

  const status = resolveAcknowledgeStatus(Boolean(noteBody && noteBody.trim()));
  await setReviewStatus(supabase, { panelId, status, reviewerId: profile.id });
  return NextResponse.json({ ok: true, review_status: status });
}
