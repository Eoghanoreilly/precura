import { createClient } from '@/lib/supabase/client'
import type { Annotation } from './types'

export async function getAnnotationsForPanel(panelId: string): Promise<Annotation[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('annotations')
    .select('*, author:profiles(display_name, role)')
    .eq('target_type', 'panel')
    .eq('target_id', panelId)
    .order('created_at', { ascending: true })
  return (data || []) as Annotation[]
}

export async function getAllAnnotations(): Promise<Annotation[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('annotations')
    .select('*, author:profiles(display_name, role)')
    .order('created_at', { ascending: false })
    .limit(50)
  return (data || []) as Annotation[]
}

export async function createAnnotation(
  targetType: 'panel' | 'biomarker',
  targetId: string,
  authorId: string,
  body: string
): Promise<Annotation | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('annotations')
    .insert({
      target_type: targetType,
      target_id: targetId,
      author_id: authorId,
      body,
    })
    .select('*, author:profiles(display_name, role)')
    .single()
  return data as Annotation | null
}

export async function deleteAnnotation(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('annotations').delete().eq('id', id)
  return !error
}
