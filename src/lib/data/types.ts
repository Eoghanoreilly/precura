import type { PanelReviewStatus } from '@/lib/doctor/reviewState'

export interface Profile {
  id: string
  email: string
  display_name: string
  role: 'patient' | 'doctor' | 'both'
  created_at: string
}

export interface Panel {
  id: string
  user_id: string
  panel_date: string
  lab_name: string | null
  panel_type: string | null
  notes: string | null
  created_at: string
  review_status: PanelReviewStatus
  reviewed_at: string | null
  reviewed_by: string | null
  defer_reason: string | null
}

export interface Biomarker {
  id: string
  panel_id: string
  short_name: string
  name_swe: string | null
  name_eng: string | null
  plain_name: string | null
  value: number
  unit: string
  ref_range_low: number | null
  ref_range_high: number | null
  status: 'normal' | 'borderline' | 'abnormal'
  created_at: string
}

export interface PanelWithBiomarkers extends Panel {
  biomarkers: Biomarker[]
}

export interface Annotation {
  id: string
  target_type: 'panel' | 'biomarker'
  target_id: string
  author_id: string
  body: string
  created_at: string
  author?: Pick<Profile, 'display_name' | 'role'>
}

export interface ChatSession {
  id: string
  user_id: string
  title: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  tokens_in: number | null
  tokens_out: number | null
  created_at: string
}

export interface MarkerHistory {
  date: string
  value: number
}
