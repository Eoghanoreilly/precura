import React from 'react';
import { StatusPill } from '@/components/doctor/v2/StatusPill';
import { EmptyState } from '@/components/doctor/v2/EmptyState';
import type { Case } from '@/lib/data/types';

function daysOverdue(openedAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(openedAt).getTime()) / (1000 * 60 * 60 * 24)));
}

export function OverviewActiveCases({ activeCases }: { activeCases: Case[] }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-faint, #9B958A)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
          fontFamily: 'var(--font-sans)',
        }}
      >
        Active cases
      </div>

      {activeCases.length === 0 ? (
        <EmptyState title="No active cases" tone="sage" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeCases.map((c) => {
            const days = daysOverdue(c.opened_at);
            const isOverdue = days > 3;
            return (
              <div
                key={c.id}
                style={{
                  background: 'var(--paper, #fff)',
                  border: `1px solid ${isOverdue ? 'var(--terracotta-soft, #EFB59B)' : 'var(--line-soft, #EEE9DB)'}`,
                  borderRadius: 10,
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, monospace",
                      fontSize: 10,
                      color: 'var(--ink-faint, #9B958A)',
                    }}
                  >
                    {c.case_id_short}
                  </span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isOverdue && (
                      <span
                        style={{
                          background: 'var(--terracotta-tint, #FCEFE7)',
                          color: 'var(--terracotta-deep, #9C3F25)',
                          padding: '1px 8px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {days}d overdue
                      </span>
                    )}
                    <StatusPill status={c.status} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--ink, #1C1A17)',
                    fontFamily: 'var(--font-sans)',
                    marginBottom: 2,
                  }}
                >
                  {c.title}
                </div>
                {c.summary && (
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ink-muted, #615C52)',
                      fontFamily: 'var(--font-sans)',
                      lineHeight: 1.4,
                    }}
                  >
                    {c.summary.slice(0, 80)}{c.summary.length > 80 ? '...' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
