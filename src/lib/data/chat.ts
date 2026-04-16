import { createClient } from '@/lib/supabase/client'
import type { ChatSession, ChatMessage } from './types'

export async function buildUserContext(userId: string): Promise<string> {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', userId).single()

  const { data: panels } = await supabase
    .from('panels').select('*, biomarkers(*)').eq('user_id', userId)
    .order('panel_date', { ascending: false })

  const { data: annotations } = await supabase
    .from('annotations').select('*, author:profiles(display_name, role)')
    .order('created_at', { ascending: false }).limit(50)

  return JSON.stringify({
    profile: profile || {},
    panels: (panels || []).map((p: Record<string, unknown>) => ({
      date: (p as { panel_date: string }).panel_date,
      lab: (p as { lab_name: string }).lab_name,
      notes: (p as { notes: string }).notes,
      results: ((p as { biomarkers: Record<string, unknown>[] }).biomarkers || []).map((b) => ({
        name: b.name_eng || b.short_name,
        shortName: b.short_name,
        plainName: b.plain_name,
        value: b.value,
        unit: b.unit,
        refLow: b.ref_range_low,
        refHigh: b.ref_range_high,
        status: b.status,
      })),
    })),
    annotations: (annotations || []).map((a: Record<string, unknown>) => ({
      targetType: a.target_type,
      targetId: a.target_id,
      author: (a.author as Record<string, unknown>)?.display_name,
      authorRole: (a.author as Record<string, unknown>)?.role,
      body: a.body,
      date: a.created_at,
    })),
  }, null, 2)
}

export async function createChatSession(userId: string, title?: string): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title: title || 'New conversation' })
    .select('id')
    .single()
  return data?.id || null
}

export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensIn?: number,
  tokensOut?: number
): Promise<void> {
  const supabase = createClient()
  await supabase.from('chat_messages').insert({
    session_id: sessionId,
    role,
    content,
    tokens_in: tokensIn || null,
    tokens_out: tokensOut || null,
  })
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  return (data || []) as ChatMessage[]
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  return (data || []) as ChatSession[]
}
