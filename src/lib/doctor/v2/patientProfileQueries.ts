import type { SupabaseClient } from '@supabase/supabase-js';
import type { Case, MembershipTier } from '@/lib/data/types';

export type PatientProfileData = {
  patient: {
    id: string;
    display_name: string;
    email: string;
    role: string;
    tier: MembershipTier;
    tier_started_at: string | null;
    consult_minutes_used_this_year: number;
    panels_reviewed_this_year: number;
    created_at: string;
  };
  summary: {
    body: string | null;
    generated_at: string | null;
    inputs_hash: string | null;
  };
  activeCases: Case[];
  closedCasesCount: number;
  recentPanels: Array<{
    id: string;
    panel_date: string;
    lab_name: string | null;
    marker_count: number;
    flag_count: number;
  }>;
  recentMessages: Array<{ content: string; created_at: string }>;
  recentNotes: Array<{ id: string; body: string; created_at: string; case_id: string | null }>;
  membershipUse: { consultMinutesUsed: number; panelsReviewed: number; outOfPocketSek: number };
  recentActivity: Array<{ kind: string; at: string; label: string }>;
};

export async function fetchPatientProfile(client: SupabaseClient, patientId: string): Promise<PatientProfileData | null> {
  const { data: patient, error: profErr } = await client
    .from('profiles')
    .select('id, display_name, email, role, tier, tier_started_at, consult_minutes_used_this_year, panels_reviewed_this_year, created_at')
    .eq('id', patientId)
    .single();
  if (profErr || !patient) return null;

  const [
    { data: summaryRow },
    { data: cases },
    { count: closedCasesCount },
    { data: panelRows },
    { data: msgRows },
    { data: noteRows },
    { data: billingRows },
  ] = await Promise.all([
    client.from('patient_summaries').select('summary, generated_at, inputs_hash').eq('patient_id', patientId).maybeSingle(),
    client.from('cases').select('*').eq('patient_id', patientId).not('status', 'in', '(closed,on_hold)').order('opened_at', { ascending: false }),
    client.from('cases').select('*', { count: 'exact', head: true }).eq('patient_id', patientId).eq('status', 'closed'),
    client.from('panels').select('id, panel_date, lab_name, biomarkers(status)').eq('user_id', patientId).order('panel_date', { ascending: false }).limit(3),
    client.from('chat_messages').select('content, created_at, chat_sessions!inner(user_id)').eq('chat_sessions.user_id', patientId).eq('role', 'user').order('created_at', { ascending: false }).limit(5),
    client.from('annotations').select('id, body, created_at, case_id, author_id').eq('target_type', 'panel').order('created_at', { ascending: false }).limit(10),
    client.from('billing_items').select('code, qty, sek_amount, billed_against').eq('patient_id', patientId),
  ]);

  // Derive marker/flag counts from biomarkers (note: 'status' on biomarkers is normal/borderline/abnormal)
  const recentPanels = (panelRows ?? []).map((p) => {
    const r = p as { id: string; panel_date: string; lab_name: string | null; biomarkers?: Array<{ status: string }> };
    const flagged = (r.biomarkers ?? []).filter((b) => b.status === 'abnormal' || b.status === 'borderline').length;
    return { id: r.id, panel_date: r.panel_date, lab_name: r.lab_name, marker_count: r.biomarkers?.length ?? 0, flag_count: flagged };
  });

  // Membership rollup (matches src/lib/data/billingItems.ts shape)
  let consultMinutesUsed = 0;
  let panelsReviewed = 0;
  let outOfPocketSek = 0;
  for (const item of billingRows ?? []) {
    const row = item as { code: string; qty: number; sek_amount: number | null; billed_against: string };
    if (row.code === 'CONSULT_MINUTES' && row.billed_against === 'membership') consultMinutesUsed += Number(row.qty);
    if (row.code === 'PANEL_REVIEWED_WITH_NOTE' && row.billed_against === 'membership') panelsReviewed += Number(row.qty);
    if (row.billed_against === 'out_of_pocket' && row.sek_amount !== null) outOfPocketSek += Number(row.sek_amount);
  }

  // Recent activity feed: combine chat, notes, panels, billing recent events
  const recentActivity: PatientProfileData['recentActivity'] = [];
  const lastChat = (msgRows ?? [])[0] as { content?: string; created_at?: string } | undefined;
  if (lastChat?.created_at) recentActivity.push({ kind: 'chat', at: lastChat.created_at, label: `Chat: "${(lastChat.content ?? '').slice(0, 60)}${(lastChat.content ?? '').length > 60 ? '...' : ''}"` });
  const lastPanel = (panelRows ?? [])[0] as { panel_date?: string } | undefined;
  if (lastPanel?.panel_date) recentActivity.push({ kind: 'panel', at: lastPanel.panel_date, label: 'Panel uploaded' });
  const lastNote = (noteRows ?? [])[0] as { created_at?: string } | undefined;
  if (lastNote?.created_at) recentActivity.push({ kind: 'note', at: lastNote.created_at, label: 'Doctor note posted' });
  recentActivity.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return {
    patient: {
      id: patient.id as string,
      display_name: patient.display_name as string,
      email: patient.email as string,
      role: patient.role as string,
      tier: (patient.tier ?? 'standard') as MembershipTier,
      tier_started_at: (patient.tier_started_at as string | null) ?? null,
      consult_minutes_used_this_year: (patient.consult_minutes_used_this_year as number) ?? 0,
      panels_reviewed_this_year: (patient.panels_reviewed_this_year as number) ?? 0,
      created_at: patient.created_at as string,
    },
    summary: {
      body: (summaryRow?.summary as string) ?? null,
      generated_at: (summaryRow?.generated_at as string) ?? null,
      inputs_hash: (summaryRow?.inputs_hash as string) ?? null,
    },
    activeCases: (cases ?? []) as Case[],
    closedCasesCount: closedCasesCount ?? 0,
    recentPanels,
    recentMessages: (msgRows ?? []).map((m) => ({ content: (m as { content: string }).content, created_at: (m as { created_at: string }).created_at })),
    recentNotes: (noteRows ?? []).map((n) => ({ id: (n as { id: string }).id, body: (n as { body: string }).body, created_at: (n as { created_at: string }).created_at, case_id: (n as { case_id: string | null }).case_id })),
    membershipUse: { consultMinutesUsed, panelsReviewed, outOfPocketSek },
    recentActivity,
  };
}
