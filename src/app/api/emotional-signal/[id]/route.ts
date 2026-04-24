import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { evaluateEmotionalSignal } from '@/lib/doctor/evaluateEmotionalSignal';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: memberId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: msgs } = await supabase
    .from('chat_messages')
    .select('content, created_at, role, session_id, chat_sessions!inner(user_id)')
    .eq('chat_sessions.user_id', memberId)
    .eq('role', 'user')
    .gte('created_at', new Date(Date.now() - 14 * 86_400_000).toISOString())
    .order('created_at', { ascending: false });

  const signal = evaluateEmotionalSignal(
    (msgs ?? []).map((m: { content: string; created_at: string }) => ({
      content: m.content,
      created_at: m.created_at,
    })),
  );
  return NextResponse.json({ signal });
}
