import type { SupabaseClient } from '@supabase/supabase-js';
import type { CaseStatus, CaseCategory, CasePriority, MembershipTier } from '@/lib/data/types';
import { derivePatientState, type PatientState } from '@/lib/doctor/caseStateDerivation';

export type DirectoryRow = {
  id: string;
  display_name: string;
  email: string;
  tier: MembershipTier;
  created_at: string;
  state: PatientState;
  brief: string;
  lastActivityAt: string | null;
  lastActivityKind: 'chat' | 'panel' | 'note' | 'consult' | 'order' | 'intake' | null;
  openCases: number;
  openTasks: number;
};

export async function fetchPatientsDirectory(client: SupabaseClient, currentUserId: string): Promise<DirectoryRow[]> {
  // 1. Load all profiles except the current doctor
  const { data: profiles, error: profileErr } = await client
    .from('profiles')
    .select('id, display_name, email, tier, created_at, role')
    .neq('id', currentUserId);
  if (profileErr) throw profileErr;
  const patientProfiles = (profiles ?? []).filter((p) => p.role === 'patient' || p.role === 'both');
  if (patientProfiles.length === 0) return [];

  const ids = patientProfiles.map((p) => p.id as string);

  // 2. Open cases for these patients (cases with status NOT in closed/on_hold)
  const { data: openCases } = await client
    .from('cases')
    .select('id, patient_id, category, status, priority, opened_at, migrated_from_panel_id')
    .in('patient_id', ids)
    .not('status', 'in', '(closed,on_hold)');

  // 3. Open tasks for those cases
  const caseIds = (openCases ?? []).map((c) => c.id as string);
  const { data: openTasks } = caseIds.length > 0 ? await client
    .from('tasks')
    .select('case_id, status, due_at')
    .in('case_id', caseIds)
    .in('status', ['open', 'in_progress']) : { data: [] };

  // 4. Last panel per patient (for flag detection in state derivation)
  const { data: latestPanels } = await client
    .from('panels')
    .select('id, user_id, panel_date, biomarkers(status)')
    .in('user_id', ids)
    .order('panel_date', { ascending: false });

  // 5. Recent activity proxies
  const { data: latestNotes } = await client
    .from('annotations')
    .select('target_id, created_at, author_id')
    .order('created_at', { ascending: false });
  const { data: latestChats } = await client
    .from('chat_messages')
    .select('content, created_at, role, chat_sessions!inner(user_id)')
    .eq('role', 'user')
    .in('chat_sessions.user_id', ids)
    .order('created_at', { ascending: false });

  // Build a per-patient roll-up
  const now = new Date();

  // Index latest panel per patient
  const latestPanelByPatient = new Map<string, { id: string; panel_date: string; flagged: boolean }>();
  for (const row of latestPanels ?? []) {
    const r = row as { id: string; user_id: string; panel_date: string; biomarkers?: Array<{ status: string }> };
    if (!latestPanelByPatient.has(r.user_id)) {
      const flagged = (r.biomarkers ?? []).some((b) => b.status === 'abnormal' || b.status === 'borderline');
      latestPanelByPatient.set(r.user_id, { id: r.id, panel_date: r.panel_date, flagged });
    }
  }

  // Index open cases by patient
  const casesByPatient = new Map<string, Array<{ category: CaseCategory; status: CaseStatus; priority: CasePriority; hasFlaggedMarker: boolean; tasks: Array<{ status: 'open' | 'in_progress'; dueAt: string | null }>; }>>();
  for (const c of openCases ?? []) {
    const row = c as { id: string; patient_id: string; category: CaseCategory; status: CaseStatus; priority: CasePriority; opened_at: string; migrated_from_panel_id: string | null };
    const tasksForCase = (openTasks ?? []).filter((t) => (t as { case_id: string }).case_id === row.id).map((t) => ({ status: (t as { status: 'open' | 'in_progress' }).status, dueAt: (t as { due_at: string | null }).due_at }));
    const linkedPanel = row.migrated_from_panel_id ? Array.from(latestPanelByPatient.values()).find((p) => p.id === row.migrated_from_panel_id) : undefined;
    const hasFlaggedMarker = linkedPanel?.flagged ?? false;
    const arr = casesByPatient.get(row.patient_id) ?? [];
    arr.push({ category: row.category, status: row.status, priority: row.priority, hasFlaggedMarker, tasks: tasksForCase });
    casesByPatient.set(row.patient_id, arr);
  }

  // Index last activity per patient
  const lastByPatient = new Map<string, { at: string; kind: DirectoryRow['lastActivityKind']; preview?: string }>();
  for (const row of latestPanels ?? []) {
    const r = row as { user_id: string; panel_date: string };
    const existing = lastByPatient.get(r.user_id);
    if (!existing || new Date(r.panel_date).getTime() > new Date(existing.at).getTime()) {
      lastByPatient.set(r.user_id, { at: r.panel_date, kind: 'panel' });
    }
  }
  for (const row of latestChats ?? []) {
    const r = row as unknown as { content: string; created_at: string; chat_sessions: { user_id: string } };
    const pid = r.chat_sessions.user_id;
    const existing = lastByPatient.get(pid);
    if (!existing || new Date(r.created_at).getTime() > new Date(existing.at).getTime()) {
      lastByPatient.set(pid, { at: r.created_at, kind: 'chat', preview: r.content });
    }
  }
  // Notes don't have direct patient join - skip for now
  void latestNotes;

  return patientProfiles.map((p) => {
    const id = p.id as string;
    const cases = casesByPatient.get(id) ?? [];
    const last = lastByPatient.get(id);
    const state = derivePatientState({
      openCases: cases,
      lastActivityAt: last?.at ?? null,
      now,
    });
    const openCasesCount = cases.length;
    const openTasksCount = cases.reduce((acc, c) => acc + c.tasks.length, 0);
    const brief = buildBrief({
      patientName: p.display_name as string,
      latestPanel: latestPanelByPatient.get(id),
      openCases: cases,
      lastChat: last?.kind === 'chat' ? last.preview : undefined,
      tier: (p.tier ?? 'standard') as MembershipTier,
      memberSince: p.created_at as string,
    });
    return {
      id,
      display_name: p.display_name as string,
      email: p.email as string,
      tier: (p.tier ?? 'standard') as MembershipTier,
      created_at: p.created_at as string,
      state,
      brief,
      lastActivityAt: last?.at ?? null,
      lastActivityKind: last?.kind ?? null,
      openCases: openCasesCount,
      openTasks: openTasksCount,
    };
  });
}

function buildBrief(input: { patientName: string; latestPanel?: { panel_date: string; flagged: boolean }; openCases: Array<{ category: CaseCategory; status: CaseStatus; priority: CasePriority; hasFlaggedMarker: boolean }>; lastChat?: string; tier: MembershipTier; memberSince: string }): string {
  const parts: string[] = [];
  if (input.openCases.length === 0 && !input.latestPanel) {
    return `New ${input.tier} member, joined ${new Date(input.memberSince).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}. No panels yet.`;
  }
  if (input.latestPanel) {
    parts.push(input.latestPanel.flagged
      ? `Latest panel from ${new Date(input.latestPanel.panel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} has flagged markers.`
      : `Latest panel from ${new Date(input.latestPanel.panel_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} is in range.`);
  }
  const urgent = input.openCases.find((c) => c.priority === 'urgent');
  if (urgent) {
    const cat = urgent.category.replace(/_/g, ' ');
    parts.push(`Urgent ${cat} case open.`);
  } else if (input.openCases.length > 0) {
    parts.push(`${input.openCases.length} open case${input.openCases.length === 1 ? '' : 's'}.`);
  }
  if (input.lastChat && input.lastChat.length > 0) {
    const trimmed = input.lastChat.length > 80 ? input.lastChat.slice(0, 80) + '...' : input.lastChat;
    parts.push(`Last said in chat: "${trimmed}"`);
  }
  return parts.slice(0, 3).join(' ');
}
