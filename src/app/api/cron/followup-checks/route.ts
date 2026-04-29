import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

// POST /api/cron/followup-checks
//
// Fires the daily follow-up check: scans cases.followup_at for due dates and
// opens a child follow-up case for each one that has come due.
//
// Secured by CRON_SECRET. Configure Vercel Cron to POST here daily at 02:00 UTC
// with Authorization: Bearer <CRON_SECRET>.
// If pg_cron is available on the Supabase tier, this endpoint is a fallback.

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? '';
    const expected = process.env.CRON_SECRET ?? '';
    if (!expected || auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc('fire_followup_checks');
    if (error) throw error;
    return NextResponse.json({ ok: true, fired: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
