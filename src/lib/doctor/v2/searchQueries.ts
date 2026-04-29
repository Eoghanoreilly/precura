import type { SupabaseClient } from '@supabase/supabase-js';

export type SearchResults = {
  patients: Array<{ id: string; display_name: string; email: string; openCases: number }>;
  cases: Array<{ id: string; case_id_short: string; title: string; status: string; patient_id: string; patient_display_name: string }>;
  panels: Array<{ id: string; panel_date: string; patient_id: string; patient_display_name: string; flag_count: number }>;
  notes: Array<{ id: string; body: string; created_at: string; case_id: string | null }>;
};

export async function searchAll(client: SupabaseClient, q: string): Promise<SearchResults> {
  const trimmed = q.trim();
  if (trimmed.length === 0) return emptyResults();
  const ilike = `%${trimmed}%`;

  // Run patients, cases, and notes in parallel; panels need a two-step query
  const [
    { data: patientRows },
    { data: caseRows },
    { data: noteRows },
    panelRows,
  ] = await Promise.all([
    // Patients by name or email
    client
      .from('profiles')
      .select('id, display_name, email, role')
      .or(`display_name.ilike.${ilike},email.ilike.${ilike}`)
      .neq('role', 'doctor')
      .limit(8),

    // Cases by case_id_short or title - use two-query pattern to avoid FK hint issues
    client
      .from('cases')
      .select('id, case_id_short, title, status, patient_id')
      .or(`case_id_short.ilike.${ilike},title.ilike.${ilike}`)
      .limit(8),

    // Notes (annotations) full-text
    client
      .from('annotations')
      .select('id, body, created_at, case_id')
      .ilike('body', ilike)
      .limit(6),

    // Panels: two-step - find matching profiles first, then fetch their panels
    fetchMatchingPanels(client, trimmed),
  ]);

  // Enrich cases with patient display names
  const casePatientIds = [...new Set((caseRows ?? []).map((c) => (c as { patient_id: string }).patient_id))];
  const profileMap: Record<string, string> = {};
  if (casePatientIds.length > 0) {
    const { data: profileRows } = await client
      .from('profiles')
      .select('id, display_name')
      .in('id', casePatientIds);
    for (const p of profileRows ?? []) {
      const pr = p as { id: string; display_name: string };
      profileMap[pr.id] = pr.display_name;
    }
  }

  return {
    patients: (patientRows ?? []).map((p) => ({
      id: (p as { id: string }).id,
      display_name: (p as { display_name: string }).display_name,
      email: (p as { email: string }).email,
      openCases: 0, // deferred to v2.1
    })),
    cases: (caseRows ?? []).map((c) => ({
      id: (c as { id: string }).id,
      case_id_short: (c as { case_id_short: string }).case_id_short,
      title: (c as { title: string }).title,
      status: (c as { status: string }).status,
      patient_id: (c as { patient_id: string }).patient_id,
      patient_display_name: profileMap[(c as { patient_id: string }).patient_id] ?? '',
    })),
    panels: panelRows,
    notes: (noteRows ?? []).map((n) => ({
      id: (n as { id: string }).id,
      body: (n as { body: string }).body,
      created_at: (n as { created_at: string }).created_at,
      case_id: (n as { case_id: string | null }).case_id,
    })),
  };
}

async function fetchMatchingPanels(
  client: SupabaseClient,
  trimmed: string,
): Promise<SearchResults['panels']> {
  if (trimmed.length <= 1) return [];

  // Step 1: find profiles whose display_name matches
  const { data: matchedProfiles } = await client
    .from('profiles')
    .select('id, display_name')
    .ilike('display_name', `%${trimmed}%`)
    .limit(20);

  if (!matchedProfiles || matchedProfiles.length === 0) return [];

  const userIds = matchedProfiles.map((p) => (p as { id: string }).id);
  const nameById: Record<string, string> = {};
  for (const p of matchedProfiles) {
    const pr = p as { id: string; display_name: string };
    nameById[pr.id] = pr.display_name;
  }

  // Step 2: fetch recent panels for those users
  const { data: panels } = await client
    .from('panels')
    .select('id, panel_date, user_id, biomarkers(status)')
    .in('user_id', userIds)
    .order('panel_date', { ascending: false })
    .limit(6);

  return (panels ?? []).map((row) => {
    const r = row as {
      id: string;
      panel_date: string;
      user_id: string;
      biomarkers: Array<{ status: string }>;
    };
    const flagCount = (r.biomarkers ?? []).filter(
      (b) => b.status === 'abnormal' || b.status === 'borderline',
    ).length;
    return {
      id: r.id,
      panel_date: r.panel_date,
      patient_id: r.user_id,
      patient_display_name: nameById[r.user_id] ?? '',
      flag_count: flagCount,
    };
  });
}

function emptyResults(): SearchResults {
  return { patients: [], cases: [], panels: [], notes: [] };
}
