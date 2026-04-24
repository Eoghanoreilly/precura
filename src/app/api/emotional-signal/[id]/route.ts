import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { evaluateEmotionalSignal } from '@/lib/doctor/evaluateEmotionalSignal';

const EMPTY_SIGNAL = { triggered: false, messageCount7d: 0, nightCount: 0, worryWordHits: {}, recentMessages: [] };

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: memberId } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: msgs, error: msgsErr } = await supabase
      .from('chat_messages')
      .select('content, created_at, role, session_id, chat_sessions!inner(user_id)')
      .eq('chat_sessions.user_id', memberId)
      .eq('role', 'user')
      .gte('created_at', new Date(Date.now() - 14 * 86_400_000).toISOString())
      .order('created_at', { ascending: false });

    if (msgsErr) {
      console.error('[emotional-signal] chat messages fetch error', msgsErr);
      return NextResponse.json({ signal: EMPTY_SIGNAL, warning: `chat messages query: ${msgsErr.message}` });
    }

    const signal = evaluateEmotionalSignal(
      (msgs ?? []).map((m: { content: string; created_at: string }) => ({
        content: m.content,
        created_at: m.created_at,
      })),
    );
    return NextResponse.json({ signal });
  } catch (e) {
    console.error('[emotional-signal] unhandled error', e);
    return NextResponse.json({ error: (e as Error).message || 'unknown error' }, { status: 500 });
  }
}
