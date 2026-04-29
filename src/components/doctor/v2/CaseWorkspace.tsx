'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { fetchCaseWorkspace, type CaseWorkspaceData } from '@/lib/doctor/v2/caseWorkspaceQueries';
import { isValidTransition } from '@/lib/doctor/statusTransitions';
import type { CaseStatus, Task } from '@/lib/data/types';
import { CaseToolbar } from './CaseToolbar';
import { CaseTitleRow } from './CaseTitleRow';
import { CaseDescription } from './CaseDescription';
import { CaseSubtasks } from './CaseSubtasks';
import { CaseLinkedCases } from './CaseLinkedCases';
import { CaseActivityFeed } from './CaseActivityFeed';
import { CaseComposer } from './CaseComposer';
import { CaseDetailsRail } from './CaseDetailsRail';
import { EmptyState } from './EmptyState';

export type CaseWorkspaceProps = {
  doctorName: string;
  // When set, use this short ID directly instead of reading ?case= from the URL.
  // Used by the mobile deep-link route at /doctor/case/[caseId].
  caseShortIdOverride?: string;
};

export function CaseWorkspace({ doctorName, caseShortIdOverride }: CaseWorkspaceProps) {
  const search = useSearchParams();
  const router = useRouter();
  const caseShortId = caseShortIdOverride ?? search?.get('case') ?? null;
  const [data, setData] = useState<CaseWorkspaceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  // Track which case IDs have already had the auto new->in_progress transition fired
  const autoTransitionedRef = useRef<Set<string>>(new Set());

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!caseShortId) {
      setData(null);
      return;
    }
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data: row } = await supabase.from('cases').select('id').eq('case_id_short', caseShortId).maybeSingle();
        if (!row?.id) {
          if (alive) {
            setData(null);
            setError('Case not found');
          }
          return;
        }
        const ws = await fetchCaseWorkspace(supabase, row.id as string);
        if (alive) {
          setData(ws);
          // Auto-transition: new -> in_progress on first open, once per case ID per session
          if (ws && ws.case.status === 'new' && !autoTransitionedRef.current.has(ws.case.id)) {
            autoTransitionedRef.current.add(ws.case.id);
            fetch(`/api/doctor/cases/${ws.case.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'in_progress' }),
            }).then((r) => {
              if (r.ok) reload();
            }).catch((e) => console.warn('auto new->in_progress failed', e));
          }
        }
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [caseShortId, version, reload]);

  if (!caseShortId) {
    return (
      <EmptyState title="Pick a case from the inbox" body="Cases open here so you can review the panel, write a note, and act without leaving the page." tone="neutral" />
    );
  }
  if (loading && !data) return <EmptyState title="Loading case..." body="Fetching panel, history, and patient context." tone="neutral" />;
  if (error) return <EmptyState title="Couldn't load this case" body={error} tone="error" />;
  if (!data) return <EmptyState title="Case not found" body={`No case matches ${caseShortId}.`} tone="error" />;

  async function changeStatus(next: CaseStatus) {
    if (!data) return;
    if (!isValidTransition(data.case.status, next)) {
      setError(`Cannot transition ${data.case.status} -> ${next}`);
      return;
    }
    try {
      const res = await fetch(`/api/doctor/cases/${data.case.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `PATCH failed: ${res.status}`);
      }
      reload();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleToggleTask(taskId: string, currentStatus: Task['status']) {
    if (!data) return;
    const nextStatus = currentStatus === 'done' ? 'open' : 'done';
    try {
      const res = await fetch(`/api/doctor/cases/${data.case.id}/subtasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: nextStatus }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `PATCH failed: ${res.status}`);
      }
      reload();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleAddSubtask() {
    if (!data) return;
    const title = window.prompt('Sub-task title', '');
    if (!title || !title.trim()) return;
    try {
      const res = await fetch(`/api/doctor/cases/${data.case.id}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'custom', title: title.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `POST failed: ${res.status}`);
      }
      reload();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', height: '100%' }}>
      <div style={{ overflowY: 'auto' }}>
        <CaseToolbar
          caseIdShort={data.case.case_id_short}
          category={data.case.category}
          watchers={1}
          openedAt={data.case.opened_at}
        />
        <CaseTitleRow
          title={data.case.title}
          status={data.case.status}
          onChangeStatus={changeStatus}
        />
        <CaseDescription data={data} />
        <CaseSubtasks
          tasks={data.tasks}
          doctorName={doctorName}
          onToggleTask={handleToggleTask}
          onAddSubtask={handleAddSubtask}
        />
        <CaseLinkedCases links={[]} />
        <CaseActivityFeed events={data.events} doctorName={doctorName} />
        <CaseComposer
          caseId={data.case.id}
          patientName={data.patient.display_name}
          emitsBillingCode={data.case.category === 'panel_review' ? 'PANEL_REVIEWED_WITH_NOTE' : null}
          onPosted={reload}
        />
      </div>
      <CaseDetailsRail data={data} doctorName={doctorName} />
    </div>
  );
}
