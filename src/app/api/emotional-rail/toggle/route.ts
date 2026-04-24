import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { recordRailToggle } from '@/lib/data/emotionalRailToggles';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { memberId, action, wasAutoTriggered } = body as {
    memberId?: string; action?: 'opened' | 'dismissed'; wasAutoTriggered?: boolean;
  };
  if (!memberId || (action !== 'opened' && action !== 'dismissed')) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  await recordRailToggle(supabase, {
    doctorId: user.id,
    memberId,
    action,
    wasAutoTriggered: Boolean(wasAutoTriggered),
  });
  return NextResponse.json({ ok: true });
}
