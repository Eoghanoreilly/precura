import React from 'react';

export function EmptyState({
  title,
  body,
  tone = 'neutral',
}: {
  title: string;
  body?: string;
  tone?: 'neutral' | 'error' | 'sage';
}) {
  const tones = {
    neutral: { bg: 'var(--canvas-soft, #FDFBF6)', border: 'var(--line-card, #E0D9C8)', titleColor: 'var(--ink, #1C1A17)' },
    error: { bg: 'var(--terracotta-tint, #FCEFE7)', border: 'var(--terracotta-soft, #EFB59B)', titleColor: 'var(--terracotta-deep, #9C3F25)' },
    sage: { bg: 'var(--sage-tint, #E5EDE7)', border: 'var(--sage-soft, #A8C0AE)', titleColor: 'var(--sage-deep, #445A4A)' },
  } as const;
  const t = tones[tone];
  return (
    <div
      style={{
        margin: 24,
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: '40px 28px',
        fontFamily: 'var(--font-sans)',
        textAlign: 'center',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, color: t.titleColor, letterSpacing: '-0.02em' }}>{title}</div>
      {body && (
        <div style={{ fontSize: 13, color: 'var(--ink-muted, #615C52)', maxWidth: 420, lineHeight: 1.55 }}>{body}</div>
      )}
    </div>
  );
}
