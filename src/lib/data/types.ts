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

// Doctor portal v2 - cases / tasks / billing

export type CaseCategory =
  | 'panel_review'
  | 'consultation'
  | 'coaching'
  | 'treatment_followup'
  | 'onboarding'
  | 'referral_followup'

export type CaseStatus =
  | 'new'
  | 'in_progress'
  | 'replied'
  | 'awaiting_member'
  | 'on_hold'
  | 'closed'

export type CasePriority = 'urgent' | 'normal' | 'low'

export type Case = {
  id: string
  case_id_short: string
  patient_id: string
  title: string
  category: CaseCategory
  status: CaseStatus
  priority: CasePriority
  owner_doctor_id: string | null
  opened_at: string
  closed_at: string | null
  closed_reason: string | null
  followup_at: string | null
  on_hold_reason: string | null
  summary: string | null
  summary_generated_at: string | null
  tags: string[]
  migrated_from_panel_id: string | null
  created_at: string
  updated_at: string
}

export type TaskKind =
  | 'review_panel'
  | 'reply_message'
  | 'write_note'
  | 'order_test'
  | 'send_referral'
  | 'schedule_consult'
  | 'consult_prep'
  | 'write_training_plan'
  | 'followup_check'
  | 'checkin_outreach'
  | 'review_intake'
  | 'custom'

export type TaskStatus = 'open' | 'in_progress' | 'done' | 'skipped' | 'blocked'

export type TaskSource = 'auto' | 'doctor'

export type Task = {
  id: string
  case_id: string
  kind: TaskKind
  title: string
  due_at: string | null
  priority: CasePriority
  status: TaskStatus
  assignee_doctor_id: string | null
  source: TaskSource
  trigger_event_ref: Record<string, unknown> | null
  created_at: string
  done_at: string | null
}

export type CaseEventKind =
  | 'status_changed'
  | 'opened_by_doctor'
  | 'note_posted'
  | 'task_completed'
  | 'order_placed'
  | 'referral_sent'
  | 'consult_completed'
  | 'member_acted'
  | 'followup_fired'
  | 'linked'
  | 'commented'

export type CaseEvent = {
  id: string
  case_id: string
  kind: CaseEventKind
  payload: Record<string, unknown>
  actor_id: string | null
  occurred_at: string
}

export type BillingItem = {
  id: string
  patient_id: string
  case_id: string | null
  task_id: string | null
  code: string
  qty: number
  unit: string
  sek_amount: number | null
  billed_against: 'membership' | 'out_of_pocket'
  occurred_at: string
}

export type MembershipTier = 'standard' | 'plus' | 'paused'
