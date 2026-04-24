"use client";

import React from "react";

export function QueueSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#615C52', fontWeight: 700, padding: '12px 10px 6px' }}>
        {title} - {count}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #E5DFD0' }}>
        {children}
      </div>
    </div>
  );
}
