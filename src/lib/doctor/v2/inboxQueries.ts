import type { SupabaseClient } from '@supabase/supabase-js';
import type { TaskRow } from './inboxGrouping';

// fetchInboxTasks fetches all actionable tasks for the inbox.
// Status filter includes open/in_progress for active work, plus done tasks
// completed in the last 24h so the client can compute doneToday.
// flag_count is resolved in a second query against biomarkers to avoid
// a gnarly Postgres sub-select that hits query plan limits.
export async function fetchInboxTasks(
  client: SupabaseClient,
  _doctorId: string,
): Promise<TaskRow[]> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Build the status filter: open/in_progress always included;
  // done only for the last 24h window so the payload stays bounded.
  const { data: rawTasks, error: tasksError } = await client
    .from('tasks')
    .select('*, cases!inner(title, case_id_short, patient_id, migrated_from_panel_id, profiles!inner(id, display_name))')
    .or(
      `status.in.(open,in_progress),and(status.eq.done,done_at.gte.${oneDayAgo})`
    )
    .order('due_at', { ascending: true, nullsFirst: false });

  if (tasksError) throw tasksError;

  const rows = (rawTasks ?? []) as Array<Record<string, unknown>>;

  if (rows.length === 0) return [];

  // Collect unique panel IDs referenced by the fetched cases so we can
  // aggregate flagged biomarker counts in a single second query.
  const panelIds: string[] = [];
  for (const row of rows) {
    const c = row.cases as Record<string, unknown>;
    const panelId = c.migrated_from_panel_id as string | null;
    if (panelId && !panelIds.includes(panelId)) {
      panelIds.push(panelId);
    }
  }

  // Build a map of panel_id -> flag count (abnormal or borderline biomarkers)
  const flagCountByPanelId: Record<string, number> = {};
  if (panelIds.length > 0) {
    const { data: biomarkers, error: bioError } = await client
      .from('biomarkers')
      .select('panel_id, status')
      .in('panel_id', panelIds)
      .in('status', ['abnormal', 'borderline']);

    if (bioError) throw bioError;

    for (const bm of biomarkers ?? []) {
      const b = bm as { panel_id: string; status: string };
      flagCountByPanelId[b.panel_id] = (flagCountByPanelId[b.panel_id] ?? 0) + 1;
    }
  }

  // Shape raw Supabase rows into TaskRow[]
  return rows.map((row) => {
    const c = row.cases as {
      title: string;
      case_id_short: string;
      patient_id: string;
      migrated_from_panel_id: string | null;
      profiles: { id: string; display_name: string };
    };

    const panelId = c.migrated_from_panel_id;
    const flagCount = panelId ? (flagCountByPanelId[panelId] ?? 0) : 0;

    return {
      id: row.id as string,
      case_id: row.case_id as string,
      kind: row.kind as TaskRow['kind'],
      title: row.title as string,
      due_at: row.due_at as string | null,
      priority: row.priority as TaskRow['priority'],
      status: row.status as TaskRow['status'],
      done_at: row.done_at as string | null,
      case_title: c.title,
      case_id_short: c.case_id_short,
      patient_id: c.patient_id,
      patient_display_name: c.profiles.display_name,
      flag_count: flagCount,
    };
  });
}
