"use client";

import React, { useEffect, useState } from "react";

type View = { id: string; opened_at: string; viewer_id: string };

export function ViewHistoryModal({ panelId, onClose }: { panelId: string; onClose: () => void }) {
  const [views, setViews] = useState<View[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(`/api/panel/${panelId}/views`);
      const data = await res.json();
      if (alive) { setViews(data.views ?? []); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [panelId]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,26,23,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#FFFFFF', borderRadius: 14, width: 480, maxWidth: '90vw',
        maxHeight: '80vh', overflow: 'auto', padding: '22px 24px', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1A17' }}>Panel view history</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 14, color: '#8B8579', cursor: 'pointer' }}>Close</button>
        </div>
        {loading ? (
          <div style={{ color: '#8B8579', fontSize: 13 }}>Loading...</div>
        ) : views.length === 0 ? (
          <div style={{ color: '#8B8579', fontSize: 13 }}>No views recorded yet.</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#615C52' }}>
            {views.map((v) => (
              <li key={v.id} style={{ padding: '6px 0', borderBottom: '1px solid #EEE9DB' }}>
                {new Date(v.opened_at).toLocaleString('en-GB')} - viewer {v.viewer_id.slice(0, 8)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
