"use client";

import React, { useRef, useState } from "react";
import { InsertChipChooser, type ChooserItem, type ChooserKind } from "./InsertChipChooser";

export type ComposerProps = {
  autoDraftedOpener: string;
  chatQuoteItems: ChooserItem[];
  trendItems: ChooserItem[];
  markerItems: ChooserItem[];
  onChange: (text: string) => void;
  value: string;
};

export function Composer(props: ComposerProps) {
  const [chooser, setChooser] = useState<ChooserKind | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const acceptOpener = () => {
    const current = props.value;
    props.onChange(current ? `${props.autoDraftedOpener}\n\n${current}` : props.autoDraftedOpener + '\n\n');
  };

  const insertAtCursor = (text: string) => {
    const ta = taRef.current;
    if (!ta) { props.onChange(props.value + text); return; }
    const start = ta.selectionStart ?? props.value.length;
    const end = ta.selectionEnd ?? props.value.length;
    const next = props.value.slice(0, start) + text + props.value.slice(end);
    props.onChange(next);
    queueMicrotask(() => {
      ta.focus();
      ta.setSelectionRange(start + text.length, start + text.length);
    });
  };

  return (
    <div style={{
      background: '#FDFBF6', border: '1px solid #E0D9C8', borderRadius: 14,
      padding: '18px 22px 18px', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#615C52', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>Post a note</div>
      <div style={{ padding: '10px 14px', background: '#ECF1EC', border: '1px solid #CBDACC', borderRadius: 10, marginBottom: 12, fontSize: 12, color: '#445A4A', lineHeight: 1.55 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#445A4A', opacity: 0.8 }}>Auto-drafted opener</div>
          <button type="button" onClick={acceptOpener} style={{ fontSize: 11, fontWeight: 600, color: '#445A4A', background: '#FFFFFF', border: '1px solid #CBDACC', borderRadius: 999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>Accept to prepend</button>
        </div>
        {props.autoDraftedOpener}
      </div>
      <textarea
        ref={taRef} value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder="Write your note..."
        style={{
          width: '100%', minHeight: 80, background: '#FFFFFF', border: '1px solid #E0D9C8',
          borderRadius: 10, padding: '13px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1C1A17',
          resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.55,
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {(['chat-quote','trend','marker-reference'] as ChooserKind[]).map((k) => (
          <div key={k} style={{ position: 'relative' }}>
            <button
              type="button" onClick={() => setChooser(chooser === k ? null : k)}
              style={{ padding: '6px 12px', background: '#ECF1EC', border: '1px solid #CBDACC', borderRadius: 999, fontSize: 12, color: '#445A4A', cursor: 'pointer', fontFamily: 'inherit' }}
            >+ {k === 'chat-quote' ? 'Chat quote' : k === 'trend' ? 'Trend' : 'Marker reference'}</button>
            {chooser === k && (
              <InsertChipChooser
                kind={k}
                items={k === 'chat-quote' ? props.chatQuoteItems : k === 'trend' ? props.trendItems : props.markerItems}
                onInsert={insertAtCursor}
                onClose={() => setChooser(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
