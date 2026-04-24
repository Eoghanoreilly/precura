import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { validateDefer } from '@/lib/doctor/reviewState';
import { setReviewStatus } from '@/lib/data/reviewStatus';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: panelId } = await params;
  const body = await req.json().catch(() => ({}));
  const reason: string = body?.reason ?? '';

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).single();
  if (!profile) return NextResponse.json({ error: 'no profile' }, { status: 403 });

  try {
    validateDefer(profile, reason);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  await setReviewStatus(supabase, { panelId, status: 'deferred', reviewerId: profile.id, deferReason: reason.trim() });
  return NextResponse.json({ ok: true, review_status: 'deferred' });
}
