import type { SupabaseClient } from '@supabase/supabase-js';
import type { Case, Task, CaseEvent } from '@/lib/data/types';
import { getCase } from '@/lib/data/cases';
import { getTasksForCase } from '@/lib/data/tasks';
import { getCaseEvents } from '@/lib/data/caseEvents';

export type CaseWorkspaceData = {
  case: Case;
  tasks: Task[];
  events: CaseEvent[];
  panel: {
    id: string;
    panel_date: string;
    biomarkers: Array<{
      short_name: string;
      value: number;
      unit: string;
      ref_range_low: number | null;
      ref_range_high: number | null;
      status: string;
    }>;
  } | null;
  patient: {
    id: string;
    display_name: string;
    email: string;
    tier: string;
    created_at: string;
  };
  linkedAnnotations: Array<{
    id: string;
    body: string;
    author_id: string;
    created_at: string;
  }>;
};

// fetchCaseWorkspace assembles all the data needed to render the case workspace
// right pane: the case itself, its tasks, activity feed, linked panel biomarkers,
// patient profile, and any annotations linked to this case.
export async function fetchCaseWorkspace(
  client: SupabaseClient,
  caseId: string,
): Promise<CaseWorkspaceData | null> {
  // Fetch case first - bail immediately if not found
  const caseData = await getCase(client, caseId);
  if (!caseData) return null;

  // Fetch tasks, events, and patient profile in parallel - none depend on each other
  const [tasks, events, patientResult, annotationsResult] = await Promise.all([
    getTasksForCase(client, caseId),
    getCaseEvents(client, caseId),
    client
      .from('profiles')
      .select('id, display_name, email, role, created_at')
      .eq('id', caseData.patient_id)
      .single(),
    client
      .from('annotations')
      .select('id, body, author_id, created_at')
      .eq('target_type', 'case')
      .eq('target_id', caseId)
      .order('created_at', { ascending: false }),
  ]);

  if (patientResult.error) throw patientResult.error;
  if (annotationsResult.error) throw annotationsResult.error;

  const profile = patientResult.data as {
    id: string;
    display_name: string;
    email: string;
    role: string;
    created_at: string;
  };

  // Derive member tier from role field. The platform uses 'standard' / 'plus' as
  // membership tiers; profiles without an explicit tier default to 'standard'.
  // If a dedicated membership_tier column lands later, swap this derivation out.
  const tier =
    profile.role === 'both' ? 'plus' :
    profile.role === 'patient' ? 'standard' :
    'standard';

  // Fetch the linked panel and its biomarkers if the case has one
  let panel: CaseWorkspaceData['panel'] = null;
  if (caseData.migrated_from_panel_id) {
    const { data: panelData, error: panelError } = await client
      .from('panels')
      .select('id, panel_date, biomarkers(short_name, value, unit, ref_range_low, ref_range_high, status)')
      .eq('id', caseData.migrated_from_panel_id)
      .single();

    if (panelError && panelError.code !== 'PGRST116') throw panelError;

    if (panelData) {
      const p = panelData as {
        id: string;
        panel_date: string;
        biomarkers: Array<{
          short_name: string;
          value: number;
          unit: string;
          ref_range_low: number | null;
          ref_range_high: number | null;
          status: string;
        }>;
      };
      panel = {
        id: p.id,
        panel_date: p.panel_date,
        biomarkers: p.biomarkers ?? [],
      };
    }
  }

  return {
    case: caseData,
    tasks,
    events,
    panel,
    patient: {
      id: profile.id,
      display_name: profile.display_name,
      email: profile.email,
      tier,
      created_at: profile.created_at,
    },
    linkedAnnotations: (annotationsResult.data ?? []) as CaseWorkspaceData['linkedAnnotations'],
  };
}
