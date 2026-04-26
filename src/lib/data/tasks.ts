import type { SupabaseClient } from '@supabase/supabase-js';
import type { Task, TaskKind, TaskStatus, CasePriority } from './types';
import { computeDueAt } from '@/lib/doctor/sla';

export async function getOpenTasksForDoctor(
  client: SupabaseClient,
  doctorId: string,
): Promise<Array<Task & { case_title: string; case_id_short: string; patient_id: string }>> {
  const { data, error } = await client
    .from('tasks')
    .select('*, cases!inner(title, case_id_short, patient_id)')
    .in('status', ['open', 'in_progress'])
    .order('due_at', { ascending: true });
  if (error) throw error;
  // assignee filter is implicit while single-doctor; future: .eq('assignee_doctor_id', doctorId)
  return (data ?? []).map((row: Record<string, unknown>) => {
    const c = row.cases as { title: string; case_id_short: string; patient_id: string };
    return {
      ...(row as Task),
      case_title: c.title,
      case_id_short: c.case_id_short,
      patient_id: c.patient_id,
    };
  });
}

export async function getTasksForCase(
  client: SupabaseClient,
  caseId: string,
): Promise<Task[]> {
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function createTask(
  client: SupabaseClient,
  params: {
    caseId: string;
    kind: TaskKind;
    title?: string;
    priority?: CasePriority;
    source?: 'auto' | 'doctor';
  },
): Promise<Task> {
  const priority = params.priority ?? 'normal';
  const dueAt = computeDueAt(params.kind, priority, new Date());
  const { data, error } = await client
    .from('tasks')
    .insert({
      case_id: params.caseId,
      kind: params.kind,
      title: params.title ?? defaultTitleFor(params.kind),
      priority,
      source: params.source ?? 'doctor',
      due_at: dueAt.toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function markTaskDone(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client
    .from('tasks')
    .update({ status: 'done' as TaskStatus, done_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

function defaultTitleFor(kind: TaskKind): string {
  const map: Record<TaskKind, string> = {
    review_panel: 'Review panel',
    reply_message: 'Reply to message',
    write_note: 'Write a note',
    order_test: 'Order a test',
    send_referral: 'Send a referral',
    schedule_consult: 'Schedule a consult',
    consult_prep: 'Prep for consult',
    write_training_plan: 'Write training plan',
    followup_check: 'Follow-up check',
    checkin_outreach: 'Check in with member',
    review_intake: 'Review intake',
    custom: 'Custom task',
  };
  return map[kind];
}
