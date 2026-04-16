import { createClient } from '@/lib/supabase/client'
import type { PanelWithBiomarkers, Biomarker, MarkerHistory, Profile } from './types'

export async function getPanels(userId: string): Promise<PanelWithBiomarkers[]> {
  const supabase = createClient()
  const { data: panels } = await supabase
    .from('panels')
    .select('*, biomarkers(*)')
    .eq('user_id', userId)
    .order('panel_date', { ascending: false })

  return (panels || []) as PanelWithBiomarkers[]
}

export async function getAllPanels(): Promise<PanelWithBiomarkers[]> {
  const supabase = createClient()
  const { data: panels } = await supabase
    .from('panels')
    .select('*, biomarkers(*)')
    .order('panel_date', { ascending: false })

  return (panels || []) as PanelWithBiomarkers[]
}

export async function getMarkerHistory(userId: string, shortName: string): Promise<MarkerHistory[]> {
  const supabase = createClient()

  // Get all panels for this user with the target biomarker
  const { data: panels } = await supabase
    .from('panels')
    .select('panel_date, biomarkers!inner(short_name, value)')
    .eq('user_id', userId)
    .eq('biomarkers.short_name', shortName)
    .order('panel_date', { ascending: true })

  if (!panels) return []

  return panels.map((p: Record<string, unknown>) => ({
    date: p.panel_date as string,
    value: (p.biomarkers as Record<string, unknown>[])[0]?.value as number,
  })).filter(r => r.value !== undefined)
}

export async function getLatestBiomarkers(userId: string): Promise<Biomarker[]> {
  const panels = await getPanels(userId)
  if (panels.length === 0) return []
  return panels[0].biomarkers
}

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as Profile | null
}

// Insert helpers

export interface NewBiomarkerRow {
  short_name: string
  name_swe?: string
  name_eng: string
  plain_name: string
  value: number
  unit: string
  ref_range_low: number | null
  ref_range_high: number | null
}

export async function createPanel(
  userId: string,
  panelDate: string,
  labName: string,
  biomarkers: NewBiomarkerRow[]
): Promise<{ panelId: string; saved: number; skipped: number } | { error: string }> {
  const supabase = createClient()

  // Filter out rows with NaN value or empty unit before inserting
  const valid = biomarkers.filter(b => !isNaN(b.value) && b.unit.trim() !== '')
  const skipped = biomarkers.length - valid.length

  if (valid.length === 0) {
    return { error: 'No valid markers to save. Every row needs a numeric value and a unit.' }
  }

  const { data: panel, error: panelError } = await supabase
    .from('panels')
    .insert({ user_id: userId, panel_date: panelDate, lab_name: labName })
    .select()
    .single()

  if (panelError || !panel) return { error: panelError?.message || 'Failed to create panel' }

  const rows = valid.map(b => ({
    panel_id: panel.id,
    short_name: b.short_name,
    name_swe: b.name_swe || null,
    name_eng: b.name_eng,
    plain_name: b.plain_name,
    value: b.value,
    unit: b.unit,
    ref_range_low: b.ref_range_low,
    ref_range_high: b.ref_range_high,
    status: deriveStatus(b.value, b.ref_range_low, b.ref_range_high),
  }))

  const { error: bioError } = await supabase.from('biomarkers').insert(rows)
  if (bioError) {
    // Clean up the empty panel shell so it doesn't linger in the database
    await supabase.from('panels').delete().eq('id', panel.id)
    return { error: bioError.message }
  }

  return { panelId: panel.id, saved: valid.length, skipped }
}

function deriveStatus(
  value: number,
  low: number | null,
  high: number | null
): 'normal' | 'borderline' | 'abnormal' {
  if (low === null || high === null) return 'normal'
  if (value < low || value > high) {
    const range = high - low
    const overshoot = value < low ? low - value : value - high
    return overshoot > range * 0.2 ? 'abnormal' : 'borderline'
  }
  return 'normal'
}
