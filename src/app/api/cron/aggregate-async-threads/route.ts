import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? '';
    const expected = process.env.CRON_SECRET ?? '';
    if (!expected || auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc('aggregate_async_threads');
    if (error) throw error;
    return NextResponse.json({ ok: true, emitted: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
