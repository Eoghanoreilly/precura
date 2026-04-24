"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CasePageData } from "@/components/doctor/case/CasePage";
import type { EmotionalSignal } from "@/lib/doctor/evaluateEmotionalSignal";
import type { PrecuraPreRead } from "@/lib/data/preReads";

export type UseCaseRollupResult = {
  data: CasePageData | null;
  emotionalSignal: EmotionalSignal | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const FLAG_PREFIX_MAP: Record<string, string> = {
  'S-Ferritin': 'Ferritin',
  'P-ALAT': 'Liver enzyme',
  'S-TSH': 'TSH (thyroid function)',
  'fP-Glukos': 'Fasting glucose',
  'fP-Triglycerid': 'Triglycerides',
  '25-OH-Vitamin D': 'Vitamin D',
  'P-Kolesterol': 'Cholesterol',
  'S-Kreatinin': 'Creatinine',
};

function isFlagged(b: { value: number; ref_range_low: number | null; ref_range_high: number | null }): boolean {
  if (b.ref_range_high !== null && b.value > b.ref_range_high) return true;
  if (b.ref_range_low !== null && b.value < b.ref_range_low) return true;
  return false;
}

function initials(name: string): string {
  return name.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function rangeDescription(low: number | null, high: number | null, unit: string): string {
  if (low !== null && high !== null) return `${low}-${high} ${unit}`;
  if (high !== null) return `under ${high} ${unit}`;
  if (low !== null) return `over ${low} ${unit}`;
  return unit;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    if (ct.includes('application/json')) {
      const body = await res.json().catch(() => null);
      throw new Error(`${url} returned ${res.status}: ${body?.error ?? 'no error body'}`);
    }
    const text = await res.text().catch(() => '');
    throw new Error(`${url} returned ${res.status} (${ct || 'no content-type'}): ${text.slice(0, 200)}`);
  }
  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(`${url} returned non-JSON response (${ct}): ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export function useCaseRollup(memberId: string | null, activeUserName: string): UseCaseRollupResult {
  const [data, setData] = useState<CasePageData | null>(null);
  const [emotionalSignal, setEmotionalSignal] = useState<EmotionalSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!memberId) { setData(null); setEmotionalSignal(null); return; }
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data: profile } = await supabase.from('profiles').select('id, display_name, created_at').eq('id', memberId).single();
        if (!profile) throw new Error('member not found');

        const { data: panels } = await supabase
          .from('panels')
          .select('id, created_at, biomarkers(short_name,value,unit,ref_range_low,ref_range_high)')
          .eq('user_id', memberId)
          .order('created_at', { ascending: false });
        const latestPanel = (panels ?? [])[0];
        if (!latestPanel) throw new Error('no panels for this member');

        const { data: latestAnno } = await supabase
          .from('annotations')
          .select('body, created_at, author_id, target_id')
          .eq('target_type', 'panel')
          .in('target_id', (panels ?? []).map((p: { id: string }) => p.id))
          .order('created_at', { ascending: false })
          .limit(1);
        const { data: latestMsg } = await supabase
          .from('chat_messages')
          .select('content, created_at, role, chat_sessions!inner(user_id)')
          .eq('chat_sessions.user_id', memberId)
          .eq('role', 'user')
          .order('created_at', { ascending: false })
          .limit(1);

        const continuityEvents: Array<{ date: string; kind: 'doctor-note' | 'new-panel' | 'member-message'; actor?: string; body: string }> = [];
        if (latestAnno?.[0]) {
          continuityEvents.push({ date: formatDate(latestAnno[0].created_at as string), kind: 'doctor-note', actor: activeUserName.split(/\s+/)[0], body: latestAnno[0].body as string });
        }
        const flagCount = ((latestPanel as { biomarkers?: Array<{ value: number; ref_range_low: number | null; ref_range_high: number | null }> }).biomarkers ?? []).filter((b) => isFlagged(b)).length;
        continuityEvents.push({ date: formatDate(latestPanel.created_at as string), kind: 'new-panel', body: `${flagCount} flag${flagCount === 1 ? '' : 's'}` });
        if (latestMsg?.[0]) {
          continuityEvents.push({ date: formatDate(latestMsg[0].created_at as string), kind: 'member-message', actor: (profile.display_name as string).split(/\s+/)[0], body: latestMsg[0].content as string });
        }

        const { preRead } = await fetchJson<{ preRead: PrecuraPreRead | null }>(`/api/pre-read/${latestPanel.id}`);

        const flaggedBiomarkers = ((latestPanel as { biomarkers?: Array<{ short_name: string; value: number; unit: string; ref_range_low: number | null; ref_range_high: number | null }> }).biomarkers ?? []).filter((b) => isFlagged(b));

        const flaggedMarkers = flaggedBiomarkers.map((b) => {
          const history = (panels ?? []).slice().reverse()
            .flatMap((p: { biomarkers?: Array<{ short_name: string; value: number }> }) => (p.biomarkers ?? []).filter((x) => x.short_name === b.short_name))
            .map((x) => x.value);
          return {
            plainEnglishName: FLAG_PREFIX_MAP[b.short_name] ?? b.short_name,
            swedishPrefix: b.short_name,
            value: b.value,
            unit: b.unit,
            refLow: b.ref_range_low,
            refHigh: b.ref_range_high,
            direction: (b.ref_range_high != null && b.value > b.ref_range_high) ? ('above' as const) : ('below' as const),
            history,
          };
        });

        const autoDraftedOpener = flaggedMarkers.map((m) => {
          const rangeText = m.refLow !== null && m.refHigh !== null
            ? `(${m.refLow}-${m.refHigh})`
            : m.refHigh !== null
              ? `(under ${m.refHigh})`
              : `(over ${m.refLow})`;
          return `Your ${m.plainEnglishName.toLowerCase()} was ${m.value} ${m.unit}, ${m.direction} the usual range ${rangeText}.`;
        }).join(' ');

        const { data: msgs } = await supabase
          .from('chat_messages')
          .select('content, created_at, role, chat_sessions!inner(user_id)')
          .eq('chat_sessions.user_id', memberId)
          .eq('role', 'user')
          .order('created_at', { ascending: false })
          .limit(10);
        const chatQuoteItems = (msgs ?? []).map((m: { content: string; created_at: string }, i: number) => ({
          id: String(i),
          label: m.content.slice(0, 80) + (m.content.length > 80 ? '...' : ''),
          insertText: `"${m.content}" (${formatDate(m.created_at)})`,
        }));
        const trendItems = flaggedMarkers.map((m, i) => ({
          id: String(i),
          label: `${m.plainEnglishName} trend`,
          insertText: `(Your ${m.plainEnglishName.toLowerCase()} went from ${m.history[0]} to ${m.history[m.history.length-1]} ${m.unit} across ${m.history.length} panels)`,
        }));
        const allMarkers = ((latestPanel as { biomarkers?: Array<{ short_name: string; ref_range_low: number | null; ref_range_high: number | null; unit: string }> }).biomarkers ?? []);
        const markerItems = allMarkers.map((b, i) => ({
          id: String(i),
          label: `${FLAG_PREFIX_MAP[b.short_name] ?? b.short_name} (${b.short_name})`,
          insertText: `${FLAG_PREFIX_MAP[b.short_name] ?? b.short_name} (${b.short_name}) is typically ${rangeDescription(b.ref_range_low, b.ref_range_high, b.unit)}`,
        }));

        const { signal } = await fetchJson<{ signal: EmotionalSignal }>(`/api/emotional-signal/${memberId}`);

        const { count: prevNoteCount } = await supabase
          .from('annotations')
          .select('*', { count: 'exact', head: true })
          .eq('target_id', latestPanel.id)
          .eq('target_type', 'panel');

        if (!alive) return;
        setEmotionalSignal(signal);
        setData({
          memberId,
          memberName: profile.display_name as string,
          memberInitials: initials(profile.display_name as string),
          memberAgeYears: null,
          memberJoinedAt: formatDate(profile.created_at as string),
          panelId: latestPanel.id,
          panelCount: (panels ?? []).length,
          continuityEvents,
          preRead: preRead ?? null,
          flaggedMarkers,
          autoDraftedOpener,
          chatQuoteItems,
          trendItems,
          markerItems,
          emotionalTriggered: Boolean(signal?.triggered),
          previousNoteCount: prevNoteCount ?? 0,
          openedByName: activeUserName,
          openedAtISO: new Date().toISOString(),
        });
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [memberId, activeUserName, version]);

  return { data, emotionalSignal, loading, error, reload: () => setVersion((v) => v + 1) };
}
