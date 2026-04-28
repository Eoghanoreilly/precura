import type { TaskKind, CasePriority, TaskStatus } from '@/lib/data/types';

export type TaskRow = {
  // Core task fields
  id: string;
  case_id: string;
  kind: TaskKind;
  title: string;
  due_at: string | null;
  priority: CasePriority;
  status: TaskStatus;
  done_at: string | null;
  // Joined fields
  case_title: string;
  case_id_short: string;
  patient_id: string;
  patient_display_name: string;
  flag_count: number;
};

export type GroupedInbox = {
  overdue: TaskRow[];
  today: TaskRow[];
  thisWeek: TaskRow[];
  later: TaskRow[];
  noDueDate: TaskRow[];
  doneToday: TaskRow[];
  counts: {
    overdue: number;
    today: number;
    thisWeek: number;
    later: number;
    noDueDate: number;
    doneToday: number;
  };
};

// Returns the UTC date string (YYYY-MM-DD) for a given Date
function utcDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Returns start of the UTC day for a given Date
function startOfUtcDay(d: Date): Date {
  const s = new Date(d);
  s.setUTCHours(0, 0, 0, 0);
  return s;
}

function sortByDueAsc(tasks: TaskRow[]): TaskRow[] {
  return [...tasks].sort((a, b) => {
    if (a.due_at === null && b.due_at === null) return 0;
    if (a.due_at === null) return 1;
    if (b.due_at === null) return -1;
    return a.due_at < b.due_at ? -1 : a.due_at > b.due_at ? 1 : 0;
  });
}

export function groupTasksByDue(tasks: TaskRow[], now: Date): GroupedInbox {
  const todayStr = utcDateStr(now);
  const startOfToday = startOfUtcDay(now);
  // "thisWeek" = within next 6 calendar days (so tomorrow through day+6 inclusive)
  const sixDaysMs = 6 * 24 * 60 * 60 * 1000;
  const endOfThisWeek = new Date(startOfToday.getTime() + sixDaysMs + 24 * 60 * 60 * 1000 - 1);

  const overdue: TaskRow[] = [];
  const today: TaskRow[] = [];
  const thisWeek: TaskRow[] = [];
  const later: TaskRow[] = [];
  const noDueDate: TaskRow[] = [];
  const doneToday: TaskRow[] = [];

  for (const task of tasks) {
    // skipped / blocked are excluded from all buckets
    if (task.status === 'skipped' || task.status === 'blocked') continue;

    // done tasks: only include in doneToday if done_at >= start of today
    if (task.status === 'done') {
      if (task.done_at !== null && new Date(task.done_at) >= startOfToday) {
        doneToday.push(task);
      }
      // done tasks not done today are dropped entirely
      continue;
    }

    // From here: status is open or in_progress
    if (task.due_at === null) {
      noDueDate.push(task);
      continue;
    }

    const dueDate = new Date(task.due_at);

    // Overdue: due_at strictly before now
    if (dueDate < now) {
      overdue.push(task);
      continue;
    }

    // Today: due_at falls on the same UTC date as now (and is not overdue)
    const dueDateStr = utcDateStr(dueDate);
    if (dueDateStr === todayStr) {
      today.push(task);
      continue;
    }

    // thisWeek: due_at within the next 6 calendar days (tomorrow through day+6)
    if (dueDate <= endOfThisWeek) {
      thisWeek.push(task);
      continue;
    }

    // later: beyond 6 days out
    later.push(task);
  }

  return {
    overdue: sortByDueAsc(overdue),
    today: sortByDueAsc(today),
    thisWeek: sortByDueAsc(thisWeek),
    later: sortByDueAsc(later),
    noDueDate: sortByDueAsc(noDueDate),
    doneToday: sortByDueAsc(doneToday),
    counts: {
      overdue: overdue.length,
      today: today.length,
      thisWeek: thisWeek.length,
      later: later.length,
      noDueDate: noDueDate.length,
      doneToday: doneToday.length,
    },
  };
}
