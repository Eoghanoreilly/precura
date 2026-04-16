"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DISPLAY_NUM, DOCTOR } from "@/components/member/tokens";
import { buildSidebar, rebrandDoctor, USE_REAL_DATA } from "@/components/member/data";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  type BloodTestSession,
  type BloodMarker,
} from "@/lib/v2/mock-patient";
import { getCurrentUser, getPanels } from "@/lib/data/panels";
import { getAnnotationsForPanel, createAnnotation } from "@/lib/data/annotations";
import type { Profile, PanelWithBiomarkers, Biomarker, Annotation } from "@/lib/data/types";

// ============================================================================
// /member/panels - every blood panel, newest first.
// Supports both real Supabase data and mock Anna data.
// ============================================================================

const CATEGORY_MAP: Record<string, string> = {
  HbA1c: "Metabolic",
  "fP-Glukos": "Metabolic",
  "f-Glucose": "Metabolic",
  "f-Insulin": "Metabolic",
  Kolesterol: "Cardiovascular",
  TC: "Cardiovascular",
  HDL: "Cardiovascular",
  LDL: "Cardiovascular",
  TG: "Cardiovascular",
  Triglycerider: "Cardiovascular",
  TSH: "Thyroid",
  "Vit D": "Nutrition",
  "D-vitamin": "Nutrition",
  Ferritin: "Nutrition",
  Crea: "Kidney",
  Kreatinin: "Kidney",
  ALAT: "Liver",
  Hb: "Blood",
  CRP: "Inflammation",
};

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PanelsPage() {
  if (USE_REAL_DATA) {
    return <RealPanelsView />;
  }
  return <MockPanelsView />;
}

// ============================================================================
// Real data view
// ============================================================================

function RealPanelsView() {
  const [user, setUser] = useState<Profile | null>(null);
  const [panels, setPanels] = useState<PanelWithBiomarkers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) { setLoading(false); return; }
      setUser(u);
      const p = await getPanels(u.id);
      setPanels(p);
      setLoading(false);
    }
    load();
  }, []);

  const userInitials = (user?.display_name || "M")[0].toUpperCase();

  if (loading) {
    return (
      <MemberShell sidebar={buildSidebar("/member/panels")} userInitials=".">
        <div style={{ padding: "60px 0", textAlign: "center", fontSize: 14, color: C.inkFaint, fontFamily: SYSTEM_FONT }}>
          Loading...
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell sidebar={buildSidebar("/member/panels")} userInitials={userInitials}>
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: C.terracotta, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
            Your panels
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: "-0.028em", fontWeight: 600, color: C.ink, margin: 0, marginBottom: 10 }}>
            {panels.length === 0 ? "No panels yet." : `${panels.length} panel${panels.length > 1 ? "s" : ""} on file.`}{" "}
            <span style={{ color: C.inkMuted, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 }}>
              {panels.length === 0 ? "Add your first one." : "Your health trajectory."}
            </span>
          </h1>
          {panels.length > 0 && (
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkMuted, margin: 0, marginBottom: 20, maxWidth: 560, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Every blood panel you've entered, with the full marker list. Tap any panel to open it.
            </p>
          )}
          <a
            href="/member/panels/new"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: C.terracotta,
              color: C.canvasSoft,
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: SYSTEM_FONT,
              textDecoration: "none",
              letterSpacing: "-0.005em",
              marginBottom: 32,
              boxShadow: "0 6px 14px -6px rgba(201,87,58,0.4), 0 2px 4px rgba(201,87,58,0.18)",
            }}
          >
            + Add panel
          </a>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {panels.map((panel, i) => (
            <RealPanelCard
              key={panel.id}
              panel={panel}
              isLatest={i === 0}
              index={i}
              currentUserId={user?.id || ""}
            />
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

// ============================================================================
// Real panel card with annotation support
// ============================================================================

function RealPanelCard({
  panel,
  isLatest,
  index,
  currentUserId,
}: {
  panel: PanelWithBiomarkers;
  isLatest: boolean;
  index: number;
  currentUserId: string;
}) {
  const [expanded, setExpanded] = useState(isLatest);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const flagged = panel.biomarkers.filter((b) => b.status !== "normal").length;
  const categories = groupByCategory(panel.biomarkers) as { name: string; markers: Biomarker[] }[];

  useEffect(() => {
    if (expanded) {
      getAnnotationsForPanel(panel.id).then(setAnnotations);
    }
  }, [expanded, panel.id]);

  async function handleAddNote() {
    if (!noteText.trim() || !currentUserId) return;
    setSavingNote(true);
    const note = await createAnnotation("panel", panel.id, currentUserId, noteText.trim());
    if (note) setAnnotations([...annotations, note]);
    setNoteText("");
    setSavingNote(false);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
      style={{
        background: C.paper,
        border: `1px solid ${isLatest ? C.terracottaSoft : C.lineCard}`,
        borderRadius: 22,
        boxShadow: isLatest ? C.shadowCard : C.shadowSoft,
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "22px 26px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: isLatest ? C.terracotta : C.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {new Date(panel.panel_date).getFullYear()} panel
          </div>
          {isLatest && (
            <span style={{ padding: "3px 10px", background: C.terracotta, color: C.canvasSoft, borderRadius: 100, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Latest
            </span>
          )}
        </div>

        <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600, color: C.ink, margin: 0, marginBottom: 14 }}>
          {formatLongDate(panel.panel_date)}
        </h2>

        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkSoft, margin: 0, marginBottom: 14, letterSpacing: "-0.005em" }}>
          <span style={{ ...DISPLAY_NUM, fontSize: 18, color: C.ink }}>
            {panel.biomarkers.length}
          </span>{" "}
          markers{flagged > 0 && (<>, <span style={{ ...DISPLAY_NUM, fontSize: 18, color: C.caution }}>{flagged}</span> flagged</>)}
          {panel.lab_name && <>, analysed at {panel.lab_name}</>}.
        </p>

        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: C.inkSoft, cursor: "pointer", letterSpacing: "-0.005em", textDecoration: "underline", textDecorationColor: C.stone, textUnderlineOffset: 4 }}
        >
          {expanded ? "Hide markers" : "See every marker"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="markers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            style={{ overflow: "hidden", background: C.canvasSoft, borderTop: `1px solid ${C.lineSoft}` }}
          >
            <div style={{ padding: "18px 26px 24px" }}>
              {categories.map((cat, ci) => (
                <div key={cat.name} style={{ marginTop: ci === 0 ? 0 : 20, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                    {cat.name}
                  </div>
                  {cat.markers.map((m) => (
                    <RealMarkerRow key={m.id} marker={m} />
                  ))}
                </div>
              ))}

              {/* Annotations */}
              <div style={{ marginTop: 24, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                  Notes ({annotations.length})
                </div>
                {annotations.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: "12px 16px",
                      background: C.paper,
                      border: `1px solid ${C.lineCard}`,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: a.author?.role === "doctor"
                          ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`
                          : `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: a.author?.role === "doctor" ? C.canvasSoft : C.ink,
                        fontSize: 8, fontWeight: 700,
                      }}>
                        {(a.author?.display_name || "?")[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{a.author?.display_name || "Unknown"}</span>
                      <span style={{ fontSize: 10, color: C.inkFaint, fontFamily: '"SF Mono", ui-monospace, monospace' }}>
                        {new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: C.inkSoft }}>{a.body}</div>
                  </div>
                ))}

                {/* Add note form */}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note on this panel..."
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddNote(); } }}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      fontSize: 13,
                      fontFamily: SYSTEM_FONT,
                      color: C.ink,
                      background: C.paper,
                      border: `1px solid ${C.lineCard}`,
                      borderRadius: 10,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={savingNote || !noteText.trim()}
                    style={{
                      padding: "10px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: SYSTEM_FONT,
                      color: C.canvasSoft,
                      background: savingNote || !noteText.trim() ? C.stone : C.sage,
                      border: "none",
                      borderRadius: 10,
                      cursor: savingNote || !noteText.trim() ? "default" : "pointer",
                    }}
                  >
                    {savingNote ? "..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function RealMarkerRow({ marker }: { marker: Biomarker }) {
  const color = marker.status === "normal" ? C.good : marker.status === "borderline" ? C.caution : C.risk;
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.lineSoft}`, gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, letterSpacing: "-0.005em" }}>
            {marker.plain_name || marker.name_eng || marker.short_name}
          </span>
        </div>
        {marker.ref_range_low !== null && marker.ref_range_high !== null && (
          <div style={{ fontSize: 11, color: C.inkFaint, marginLeft: 15 }}>
            Normal range: {marker.ref_range_low} to {marker.ref_range_high} {marker.unit}
          </div>
        )}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{ ...DISPLAY_NUM, fontSize: 18, color }}>{marker.value}</span>
        <span style={{ fontSize: 11, color: C.inkFaint, marginLeft: 3 }}>{marker.unit}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Shared helpers
// ============================================================================

function groupByCategory(results: (BloodMarker | Biomarker)[]): { name: string; markers: (BloodMarker | Biomarker)[] }[] {
  const groups = new Map<string, (BloodMarker | Biomarker)[]>();
  for (const m of results) {
    const key = "short_name" in m ? m.short_name : ("shortName" in m ? (m as BloodMarker).shortName : "");
    const cat = CATEGORY_MAP[key] ?? "Other";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(m);
  }
  const order = ["Metabolic", "Cardiovascular", "Thyroid", "Nutrition", "Kidney", "Liver", "Blood", "Inflammation", "Other"];
  return order.filter((o) => groups.has(o)).map((name) => ({ name, markers: groups.get(name)! }));
}

// ============================================================================
// Mock data view (kept for demo mode)
// ============================================================================

function MockPanelsView() {
  return (
    <MemberShell sidebar={buildSidebar("/member/panels")} userInitials="A">
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: C.terracotta, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
            Your panels
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: "-0.028em", fontWeight: 600, color: C.ink, margin: 0, marginBottom: 10 }}>
            Six panels since April 2021.{" "}
            <span style={{ color: C.inkMuted, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 }}>
              The full trajectory of your health.
            </span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkMuted, margin: 0, marginBottom: 36, maxWidth: 560, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Every blood panel Dr. Tomas has reviewed, with the full marker list and notes. Tap any panel to open it.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {BLOOD_TEST_HISTORY.map((session, i) => (
            <MockPanelCard key={session.date} session={session} isLatest={i === 0} index={i} />
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

function MockPanelCard({ session, isLatest, index }: { session: BloodTestSession; isLatest: boolean; index: number }) {
  const [expanded, setExpanded] = useState(isLatest);
  const flagged = session.results.filter((m) => m.status !== "normal").length;
  const note = DOCTOR_NOTES.find((n) => {
    const diffDays = (new Date(n.date).getTime() - new Date(session.date).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });
  const categories = groupByCategory(session.results);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
      style={{ background: C.paper, border: `1px solid ${isLatest ? C.terracottaSoft : C.lineCard}`, borderRadius: 22, boxShadow: isLatest ? C.shadowCard : C.shadowSoft, fontFamily: SYSTEM_FONT, overflow: "hidden" }}
    >
      <div style={{ padding: "22px 26px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: isLatest ? C.terracotta : C.inkMuted, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {new Date(session.date).getFullYear()} panel
          </div>
          {isLatest && <span style={{ padding: "3px 10px", background: C.terracotta, color: C.canvasSoft, borderRadius: 100, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Latest</span>}
        </div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600, color: C.ink, margin: 0, marginBottom: 14 }}>{formatLongDate(session.date)}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkSoft, margin: 0, marginBottom: note ? 18 : 14, letterSpacing: "-0.005em" }}>
          <span style={{ ...DISPLAY_NUM, fontSize: 18, color: C.ink }}>{session.results.length}</span>{" "}markers
          {flagged > 0 && <>, <span style={{ ...DISPLAY_NUM, fontSize: 18, color: C.caution }}>{flagged}</span> flagged</>}, analysed at {session.lab.replace("Karolinska University Laboratory", "Karolinska")}.
        </p>
        {note && (
          <div style={{ padding: "14px 18px", background: C.sageTint, border: `1px solid ${C.sageSoft}`, borderRadius: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.canvasSoft, fontSize: 10, fontWeight: 700 }}>{DOCTOR.initials}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.sageDeep, letterSpacing: "0.14em", textTransform: "uppercase" }}>Note from Dr. Tomas</div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: C.inkSoft, fontStyle: "italic", fontFamily: 'Georgia, "Times New Roman", serif' }}>
              &ldquo;{rebrandDoctor(note.note.split("\n")[0])}&rdquo;
            </div>
          </div>
        )}
        <button onClick={() => setExpanded((e) => !e)} style={{ background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: C.inkSoft, cursor: "pointer", letterSpacing: "-0.005em", textDecoration: "underline", textDecorationColor: C.stone, textUnderlineOffset: 4 }}>
          {expanded ? "Hide markers" : "See every marker"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="markers" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} style={{ overflow: "hidden", background: C.canvasSoft, borderTop: `1px solid ${C.lineSoft}` }}>
            <div style={{ padding: "18px 26px 24px" }}>
              {categories.map((cat, ci) => (
                <div key={cat.name} style={{ marginTop: ci === 0 ? 0 : 20, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{cat.name}</div>
                  {(cat.markers as BloodMarker[]).map((m) => (
                    <MockMarkerRow key={m.shortName} marker={m} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function MockMarkerRow({ marker }: { marker: BloodMarker }) {
  const color = marker.status === "normal" ? C.good : marker.status === "borderline" ? C.caution : C.risk;
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.lineSoft}`, gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, letterSpacing: "-0.005em" }}>{marker.plainName}</span>
        </div>
        <div style={{ fontSize: 11, color: C.inkFaint, marginLeft: 15 }}>Normal range: {marker.refLow} to {marker.refHigh} {marker.unit}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{ ...DISPLAY_NUM, fontSize: 18, color }}>{marker.value}</span>
        <span style={{ fontSize: 11, color: C.inkFaint, marginLeft: 3 }}>{marker.unit}</span>
      </div>
    </div>
  );
}
