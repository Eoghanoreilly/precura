'use client';
import React from 'react';
import type { Task } from '@/lib/data/types';

export function CaseSubtasks({
  tasks,
  doctorName,
  onToggleTask,
  onAddSubtask,
}: {
  tasks: Task[];
  doctorName: string;
  onToggleTask?: (taskId: string, currentStatus: Task['status']) => void;
  onAddSubtask?: () => void;
}) {
  if (tasks.length === 0) {
    return (
      <section style={{ padding: '8px 24px 18px', fontFamily: 'var(--font-sans)' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Sub-tasks
        </div>
        <button type="button" onClick={onAddSubtask} style={addBtn}>+ Add sub-task</button>
      </section>
    );
  }
  const open = tasks.filter((t) => t.status === 'open' || t.status === 'in_progress');
  return (
    <section style={{ padding: '8px 24px 18px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        Sub-tasks {tasks.length - open.length} of {tasks.length} done
      </div>
      <div style={{ background: 'var(--paper, #fff)', border: '1px solid var(--line-soft, #EEE9DB)', borderRadius: 8 }}>
        {tasks.map((t, i) => (
          <div
            key={t.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 100px 80px',
              padding: '8px 14px',
              borderBottom: i < tasks.length - 1 ? '1px solid var(--line-soft, #EEE9DB)' : 'none',
              alignItems: 'center',
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={t.status === 'done'}
              onChange={() => onToggleTask?.(t.id, t.status)}
              aria-label={t.title}
            />
            <div style={{ color: t.status === 'done' ? 'var(--ink-faint, #9B958A)' : 'var(--ink, #1C1A17)', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>
              {t.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint, #9B958A)' }}>{doctorName.split(/\s+/)[0] ?? ''}</div>
            <div style={{ fontSize: 11, color: t.status === 'done' ? 'var(--sage-deep, #445A4A)' : 'var(--terracotta-deep, #9C3F25)', textTransform: 'capitalize' }}>
              {t.status.replace('_', ' ')}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAddSubtask} style={{ ...addBtn, marginTop: 8 }}>+ Add sub-task</button>
    </section>
  );
}

const addBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--ink-muted, #615C52)',
  fontSize: 12,
  cursor: 'pointer',
  padding: '4px 8px',
  fontFamily: 'inherit',
};
