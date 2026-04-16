"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import {
  C,
  SYSTEM_FONT,
  DISPLAY_NUM,
  EYEBROW,
} from "@/components/member/tokens";
import { buildSidebar } from "@/components/member/data";
import { getCurrentUser } from "@/lib/data/panels";
import { getAnnotationsForPanel, createAnnotation } from "@/lib/data/annotations";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  PanelWithBiomarkers,
  Biomarker,
  Annotation,
} from "@/lib/data/types";

// ============================================================================
// /member/panels/[id] - single panel detail + analysis view.
// Shown after a user saves a new panel (the "meaningful moment").
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

const PLAIN_NAMES: Record<string, string> = {
  HbA1c: "long-term blood sugar",
  "fP-Glukos": "blood sugar",
  "f-Glucose": "blood sugar",
  "f-Insulin": "insulin",
  Kolesterol: "cholesterol",
  TC: "total cholesterol",
  HDL: "good cholesterol",
  LDL: "bad cholesterol",
  TG: "blood fats",
  Triglycerider: "blood fats",
  TSH: "thyroid function",
  "Vit D": "vitamin D",
  "D-vitamin": "vitamin D",
  Ferritin: "iron stores",
  Crea: "kidney function",
  Kreatinin: "kidney function",
  ALAT: "liver enzyme",
  Hb: "oxygen carrier",
  CRP: "inflammation marker",
};

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function groupByCategory(
  markers: Biomarker[]
): { name: string; markers: Biomarker[] }[] {
  const groups = new Map<string, Biomarker[]>();
  for (const m of markers) {
    const cat = CATEGORY_MAP[m.short_name] ?? "Other";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(m);
  }
  const order = [
    "Metabolic",
    "Cardiovascular",
    "Thyroid",
    "Nutrition",
    "Kidney",
    "Liver",
    "Blood",
    "Inflammation",
    "Other",
  ];
  return order
    .filter((o) => groups.has(o))
    .map((name) => ({ name, markers: groups.get(name)! }));
}

/** How far outside the ref range a marker is, as a percentage of the range span. */
function deviationPct(m: Biomarker): number | null {
  if (m.ref_range_low === null || m.ref_range_high === null) return null;
  const span = m.ref_range_high - m.ref_range_low;
  if (span <= 0) return null;
  if (m.value < m.ref_range_low) return ((m.ref_range_low - m.value) / span) * 100;
  if (m.value > m.ref_range_high) return ((m.value - m.ref_range_high) / span) * 100;
  return 0;
}

/** Is this marker "close" to a ref range boundary (within 10% of the range)? */
function isNearBoundary(m: Biomarker): boolean {
  if (m.ref_range_low === null || m.ref_range_high === null) return false;
  if (m.status !== "normal") return false;
  const span = m.ref_range_high - m.ref_range_low;
  if (span <= 0) return false;
  const lowProximity = (m.value - m.ref_range_low) / span;
  const highProximity = (m.ref_range_high - m.value) / span;
  return lowProximity < 0.1 || highProximity < 0.1;
}

function displayName(m: Biomarker): string {
  const plain = m.plain_name || PLAIN_NAMES[m.short_name] || "";
  const label = m.name_eng || m.short_name;
  if (plain && plain.toLowerCase() !== label.toLowerCase()) {
    return `${label} (${plain})`;
  }
  return label;
}

// ============================================================================
// Page component
// ============================================================================

export default function PanelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const panelId = params.id as string;

  const [user, setUser] = useState<Profile | null>(null);
  const [panel, setPanel] = useState<PanelWithBiomarkers | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(true);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [error, setError] = useState("");

  // Annotations
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editLab, setEditLab] = useState("");
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);
  const [editingMarkerValue, setEditingMarkerValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ---- Data fetching ----
  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) {
        setLoading(false);
        setAnalyzing(false);
        return;
      }
      setUser(u);

      const supabase = createClient();
      const { data, error: fetchErr } = await supabase
        .from("panels")
        .select("*, biomarkers(*)")
        .eq("id", panelId)
        .single();

      if (fetchErr || !data) {
        setError("Panel not found.");
        setLoading(false);
        setAnalyzing(false);
        return;
      }

      const p = data as PanelWithBiomarkers;
      setPanel(p);
      setEditDate(p.panel_date);
      setEditLab(p.lab_name || "");
      setLoading(false);

      // Load annotations
      const a = await getAnnotationsForPanel(panelId);
      setAnnotations(a);
    }
    load();
  }, [panelId]);

  // ---- Analyzing animation (runs for ~2.5s after data loads) ----
  useEffect(() => {
    if (loading || !panel) return;
    let frame: number;
    const start = Date.now();
    const duration = 2500;

    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      // Ease-out curve: fast start, slow finish
      const eased = 1 - Math.pow(1 - pct, 3);
      setAnalyzeProgress(eased);
      if (pct < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setAnalyzing(false);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loading, panel]);

  // ---- Handlers ----
  const handleAddNote = useCallback(async () => {
    if (!noteText.trim() || !user) return;
    setSavingNote(true);
    const note = await createAnnotation("panel", panelId, user.id, noteText.trim());
    if (note) setAnnotations((prev) => [...prev, note]);
    setNoteText("");
    setSavingNote(false);
  }, [noteText, user, panelId]);

  async function handleSavePanelEdit() {
    if (!panel) return;
    setSavingEdit(true);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("panels")
      .update({ panel_date: editDate, lab_name: editLab || null })
      .eq("id", panel.id);
    if (!err) {
      setPanel({ ...panel, panel_date: editDate, lab_name: editLab || null });
      setEditMode(false);
    }
    setSavingEdit(false);
  }

  async function handleSaveMarkerEdit(markerId: string) {
    if (!panel) return;
    const val = parseFloat(editingMarkerValue);
    if (isNaN(val)) return;
    setSavingEdit(true);
    const supabase = createClient();

    // Recalculate status
    const marker = panel.biomarkers.find((b) => b.id === markerId);
    let status: "normal" | "borderline" | "abnormal" = "normal";
    if (marker && marker.ref_range_low !== null && marker.ref_range_high !== null) {
      const low = marker.ref_range_low;
      const high = marker.ref_range_high;
      if (val < low || val > high) {
        const range = high - low;
        const overshoot = val < low ? low - val : val - high;
        status = overshoot > range * 0.2 ? "abnormal" : "borderline";
      }
    }

    const { error: err } = await supabase
      .from("biomarkers")
      .update({ value: val, status })
      .eq("id", markerId);

    if (!err) {
      setPanel({
        ...panel,
        biomarkers: panel.biomarkers.map((b) =>
          b.id === markerId ? { ...b, value: val, status } : b
        ),
      });
    }
    setEditingMarkerId(null);
    setEditingMarkerValue("");
    setSavingEdit(false);
  }

  async function handleDelete() {
    if (!panel) return;
    setDeleting(true);
    const supabase = createClient();
    // Delete biomarkers first, then panel
    await supabase.from("biomarkers").delete().eq("panel_id", panel.id);
    await supabase.from("annotations").delete().eq("target_id", panel.id);
    const { error: err } = await supabase.from("panels").delete().eq("id", panel.id);
    if (!err) {
      router.push("/member/panels");
    } else {
      setDeleting(false);
    }
  }

  const userInitials = (user?.display_name || "M")[0].toUpperCase();

  // ---- Loading state ----
  if (loading) {
    return (
      <MemberShell sidebar={buildSidebar("/member/panels")} userInitials=".">
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            fontSize: 14,
            color: C.inkFaint,
            fontFamily: SYSTEM_FONT,
          }}
        >
          Loading...
        </div>
      </MemberShell>
    );
  }

  // ---- Error state ----
  if (error || !panel) {
    return (
      <MemberShell sidebar={buildSidebar("/member/panels")} userInitials={userInitials}>
        <div style={{ fontFamily: SYSTEM_FONT, padding: "40px 0" }}>
          <p style={{ fontSize: 15, color: C.inkMuted, marginBottom: 20 }}>
            {error || "Panel not found."}
          </p>
          <a
            href="/member/panels"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.terracotta,
              textDecoration: "underline",
              textDecorationColor: C.terracottaSoft,
              textUnderlineOffset: 3,
            }}
          >
            Back to panels
          </a>
        </div>
      </MemberShell>
    );
  }

  // ---- Derived data ----
  const flagged = panel.biomarkers.filter((b) => b.status !== "normal");
  const abnormal = panel.biomarkers.filter((b) => b.status === "abnormal");
  const borderline = panel.biomarkers.filter((b) => b.status === "borderline");
  const nearBoundary = panel.biomarkers.filter(isNearBoundary);
  const inRange = panel.biomarkers.filter((b) => b.status === "normal");
  const categories = groupByCategory(panel.biomarkers);
  const hasFindings = abnormal.length > 0 || borderline.length > 0 || nearBoundary.length > 0;

  // ============================================================================
  // Analyzing state
  // ============================================================================
  if (analyzing) {
    return (
      <MemberShell sidebar={buildSidebar("/member/panels")} userInitials={userInitials}>
        <div
          style={{
            fontFamily: SYSTEM_FONT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 400, width: "100%" }}
          >
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.terracottaTint} 0%, ${C.sageTint} 100%)`,
                border: `2px solid ${C.terracottaSoft}`,
                margin: "0 auto 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `2px solid transparent`,
                  borderTopColor: C.terracotta,
                  borderRightColor: C.terracottaSoft,
                }}
              />
            </motion.div>

            <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 12 }}>
              Analyzing your panel
            </div>

            <h1
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                color: C.ink,
                margin: "0 0 10px",
              }}
            >
              Reviewing{" "}
              <span
                style={{
                  ...DISPLAY_NUM,
                  fontSize: "inherit",
                  color: C.terracotta,
                }}
              >
                {panel.biomarkers.length}
              </span>{" "}
              markers...
            </h1>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: C.inkMuted,
                margin: "0 0 32px",
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              Checking each value against reference ranges and flagging anything
              that needs attention.
            </p>

            {/* Editorial progress track */}
            <div
              style={{
                width: "100%",
                maxWidth: 280,
                margin: "0 auto",
                height: 3,
                background: C.lineSoft,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${C.terracottaSoft} 0%, ${C.terracotta} 100%)`,
                  transformOrigin: "left",
                }}
                animate={{ scaleX: analyzeProgress }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </div>
      </MemberShell>
    );
  }

  // ============================================================================
  // Analysis complete - main content
  // ============================================================================
  return (
    <MemberShell sidebar={buildSidebar("/member/panels")} userInitials={userInitials}>
      <div style={{ fontFamily: SYSTEM_FONT }}>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="/member/panels"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.inkMuted,
              textDecoration: "underline",
              textDecorationColor: C.stone,
              textUnderlineOffset: 3,
              letterSpacing: "-0.005em",
              display: "inline-block",
              marginBottom: 20,
            }}
          >
            All panels
          </a>
        </motion.div>

        {/* NOT DOCTOR REVIEWED badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{ marginBottom: 16 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              background: C.terracottaTint,
              border: `1px solid ${C.terracottaSoft}`,
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.terracottaDeep,
            }}
          >
            Not doctor reviewed
          </span>
        </motion.div>

        {/* Headline: date and lab */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: 24 }}
        >
          {!editMode ? (
            <>
              <div
                style={{
                  ...EYEBROW,
                  color: C.terracotta,
                  marginBottom: 10,
                }}
              >
                Panel analysis
              </div>
              <h1
                style={{
                  fontSize: "clamp(28px, 4.5vw, 42px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.028em",
                  fontWeight: 600,
                  color: C.ink,
                  margin: 0,
                  marginBottom: 6,
                }}
              >
                {formatLongDate(panel.panel_date)}
              </h1>
              {panel.lab_name && (
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: C.inkMuted,
                    margin: 0,
                    fontStyle: "italic",
                    fontFamily: 'Georgia, "Times New Roman", serif',
                  }}
                >
                  Analysed at {panel.lab_name}
                </p>
              )}
            </>
          ) : (
            <div
              style={{
                padding: "18px 22px",
                background: C.paper,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 18,
                boxShadow: C.shadowSoft,
              }}
            >
              <div
                style={{
                  ...EYEBROW,
                  color: C.inkMuted,
                  marginBottom: 14,
                }}
              >
                Edit panel details
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                <div style={{ flex: "1 1 160px" }}>
                  <div style={{ ...EYEBROW, fontSize: 9, color: C.inkFaint, marginBottom: 6 }}>
                    Date
                  </div>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: "1 1 160px" }}>
                  <div style={{ ...EYEBROW, fontSize: 9, color: C.inkFaint, marginBottom: 6 }}>
                    Lab
                  </div>
                  <input
                    type="text"
                    value={editLab}
                    onChange={(e) => setEditLab(e.target.value)}
                    placeholder="Lab name"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleSavePanelEdit}
                  disabled={savingEdit}
                  style={{
                    ...pillButton,
                    background: savingEdit ? C.stone : C.sage,
                    color: C.canvasSoft,
                  }}
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditDate(panel.panel_date);
                    setEditLab(panel.lab_name || "");
                  }}
                  style={{
                    ...pillButton,
                    background: "transparent",
                    color: C.inkMuted,
                    border: `1px solid ${C.lineCard}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Summary card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            padding: "20px 24px",
            background: C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 20,
            boxShadow: C.shadowCard,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "baseline",
            }}
          >
            <SummaryStat
              value={panel.biomarkers.length}
              label="markers"
              color={C.ink}
            />
            <span
              style={{ color: C.lineSoft, fontSize: 20, fontWeight: 300 }}
            >
              /
            </span>
            <SummaryStat
              value={flagged.length}
              label="flagged"
              color={flagged.length > 0 ? C.terracotta : C.inkFaint}
            />
            <span
              style={{ color: C.lineSoft, fontSize: 20, fontWeight: 300 }}
            >
              /
            </span>
            <SummaryStat
              value={inRange.length}
              label="in range"
              color={C.good}
            />
          </div>
        </motion.section>

        {/* Quick findings */}
        {hasFindings && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            style={{ marginBottom: 28 }}
          >
            <div
              style={{
                ...EYEBROW,
                color: C.terracotta,
                marginBottom: 14,
              }}
            >
              Quick findings
            </div>

            {abnormal.length > 0 && (
              <FindingsGroup
                label="Outside range"
                color={C.risk}
                markers={abnormal}
              />
            )}
            {borderline.length > 0 && (
              <FindingsGroup
                label="Borderline"
                color={C.caution}
                markers={borderline}
              />
            )}
            {nearBoundary.length > 0 && (
              <FindingsGroup
                label="Worth watching (within 10% of range edge)"
                color={C.inkMuted}
                markers={nearBoundary}
              />
            )}
          </motion.section>
        )}

        {/* All markers by category */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 22,
            boxShadow: C.shadowSoft,
            overflow: "hidden",
            marginBottom: 28,
          }}
        >
          <div style={{ padding: "20px 24px 6px" }}>
            <div
              style={{
                ...EYEBROW,
                color: C.inkMuted,
                marginBottom: 4,
              }}
            >
              All markers
            </div>
          </div>
          <div style={{ padding: "0 24px 24px" }}>
            {categories.map((cat, ci) => (
              <div
                key={cat.name}
                style={{ marginTop: ci === 0 ? 8 : 22, marginBottom: 8 }}
              >
                <div
                  style={{
                    ...EYEBROW,
                    fontSize: 9,
                    color: C.inkFaint,
                    marginBottom: 10,
                  }}
                >
                  {cat.name}
                </div>
                {cat.markers.map((m) => (
                  <MarkerRow
                    key={m.id}
                    marker={m}
                    isEditing={editingMarkerId === m.id}
                    editValue={editingMarkerValue}
                    onStartEdit={() => {
                      setEditingMarkerId(m.id);
                      setEditingMarkerValue(m.value.toString());
                    }}
                    onChangeEdit={setEditingMarkerValue}
                    onSaveEdit={() => handleSaveMarkerEdit(m.id)}
                    onCancelEdit={() => {
                      setEditingMarkerId(null);
                      setEditingMarkerValue("");
                    }}
                    saving={savingEdit}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Annotations */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          style={{
            background: C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 22,
            boxShadow: C.shadowSoft,
            padding: "20px 24px 24px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              ...EYEBROW,
              color: C.inkMuted,
              marginBottom: 14,
            }}
          >
            Notes ({annotations.length})
          </div>
          {annotations.map((a) => (
            <div
              key={a.id}
              style={{
                padding: "12px 16px",
                background: C.canvasSoft,
                border: `1px solid ${C.lineSoft}`,
                borderRadius: 14,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background:
                      a.author?.role === "doctor"
                        ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`
                        : `linear-gradient(135deg, ${C.butter} 0%, ${C.terracottaSoft} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      a.author?.role === "doctor" ? C.canvasSoft : C.ink,
                    fontSize: 8,
                    fontWeight: 700,
                  }}
                >
                  {(a.author?.display_name || "?")[0].toUpperCase()}
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: C.ink }}
                >
                  {a.author?.display_name || "Unknown"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: C.inkFaint,
                    fontFamily:
                      '"SF Mono", ui-monospace, monospace',
                  }}
                >
                  {new Date(a.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: C.inkSoft,
                }}
              >
                {a.body}
              </div>
            </div>
          ))}

          {/* Add note form */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note on this panel..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddNote();
                }
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: 13,
                fontFamily: SYSTEM_FONT,
                color: C.ink,
                background: C.canvasSoft,
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
                background:
                  savingNote || !noteText.trim() ? C.stone : C.sage,
                border: "none",
                borderRadius: 10,
                cursor:
                  savingNote || !noteText.trim()
                    ? "default"
                    : "pointer",
              }}
            >
              {savingNote ? "..." : "Add"}
            </button>
          </div>
        </motion.section>

        {/* Action bar: Edit / Delete / Add another */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{
                ...pillButton,
                background: "transparent",
                color: C.inkSoft,
                border: `1px solid ${C.lineCard}`,
              }}
            >
              Edit panel
            </button>
          )}

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                ...pillButton,
                background: "transparent",
                color: C.inkFaint,
                border: `1px solid ${C.lineSoft}`,
              }}
            >
              Delete panel
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                background: C.terracottaTint,
                border: `1px solid ${C.terracottaSoft}`,
                borderRadius: 14,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: C.terracottaDeep,
                  fontWeight: 500,
                }}
              >
                Delete this panel and all its markers?
              </span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  ...pillButton,
                  background: C.risk,
                  color: C.canvasSoft,
                  fontSize: 12,
                }}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  ...pillButton,
                  background: "transparent",
                  color: C.inkMuted,
                  fontSize: 12,
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <a
            href="/member/panels/new"
            style={{
              ...pillButton,
              background: C.terracotta,
              color: C.canvasSoft,
              textDecoration: "none",
              boxShadow:
                "0 6px 14px -6px rgba(201,87,58,0.4), 0 2px 4px rgba(201,87,58,0.18)",
            }}
          >
            + Add another panel
          </a>
        </motion.div>
      </div>
    </MemberShell>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function SummaryStat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ ...DISPLAY_NUM, fontSize: 28, color }}>{value}</span>
      <span style={{ fontSize: 14, color: C.inkMuted, fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

function FindingsGroup({
  label,
  color,
  markers,
}: {
  label: string;
  color: string;
  markers: Biomarker[];
}) {
  return (
    <div
      style={{
        padding: "16px 20px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 18,
        boxShadow: C.shadowSoft,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color,
            letterSpacing: "-0.005em",
          }}
        >
          {label}
        </span>
      </div>
      {markers.map((m) => {
        const dev = deviationPct(m);
        const devLabel =
          dev !== null && dev > 0
            ? `${dev.toFixed(0)}% outside range`
            : null;

        return (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: `1px solid ${C.lineSoft}`,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                  marginBottom: 2,
                }}
              >
                {displayName(m)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.inkFaint,
                }}
              >
                {m.ref_range_low !== null && m.ref_range_high !== null
                  ? `Range: ${m.ref_range_low} to ${m.ref_range_high} ${m.unit}`
                  : `${m.unit}`}
                {devLabel && (
                  <span style={{ color, fontWeight: 600, marginLeft: 8 }}>
                    {devLabel}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ ...DISPLAY_NUM, fontSize: 18, color }}>
                {m.value}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: C.inkFaint,
                  marginLeft: 3,
                }}
              >
                {m.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MarkerRow({
  marker,
  isEditing,
  editValue,
  onStartEdit,
  onChangeEdit,
  onSaveEdit,
  onCancelEdit,
  saving,
}: {
  marker: Biomarker;
  isEditing: boolean;
  editValue: string;
  onStartEdit: () => void;
  onChangeEdit: (v: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  saving: boolean;
}) {
  const color =
    marker.status === "normal"
      ? C.good
      : marker.status === "borderline"
        ? C.caution
        : C.risk;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: `1px solid ${C.lineSoft}`,
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: C.ink,
              letterSpacing: "-0.005em",
            }}
          >
            {displayName(marker)}
          </span>
        </div>
        {marker.ref_range_low !== null && marker.ref_range_high !== null && (
          <div style={{ fontSize: 11, color: C.inkFaint, marginLeft: 15 }}>
            Normal range: {marker.ref_range_low} to {marker.ref_range_high}{" "}
            {marker.unit}
          </div>
        )}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {isEditing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="number"
              step="any"
              value={editValue}
              onChange={(e) => onChangeEdit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSaveEdit();
                }
                if (e.key === "Escape") onCancelEdit();
              }}
              autoFocus
              style={{
                width: 80,
                padding: "5px 8px",
                fontSize: 15,
                ...DISPLAY_NUM,
                color,
                background: C.canvasSoft,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 8,
                outline: "none",
                textAlign: "right",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: C.inkFaint,
              }}
            >
              {marker.unit}
            </span>
            <button
              onClick={onSaveEdit}
              disabled={saving}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: SYSTEM_FONT,
                color: C.canvasSoft,
                background: saving ? C.stone : C.sage,
                border: "none",
                borderRadius: 6,
                cursor: saving ? "default" : "pointer",
              }}
            >
              {saving ? "..." : "OK"}
            </button>
            <button
              onClick={onCancelEdit}
              style={{
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: SYSTEM_FONT,
                color: C.inkFaint,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationColor: C.stone,
                textUnderlineOffset: 2,
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onStartEdit}
            title="Click to edit value"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "baseline",
              gap: 3,
            }}
          >
            <span style={{ ...DISPLAY_NUM, fontSize: 18, color }}>
              {marker.value}
            </span>
            <span style={{ fontSize: 11, color: C.inkFaint }}>
              {marker.unit}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Shared styles
// ============================================================================

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: SYSTEM_FONT,
  color: C.ink,
  background: C.canvasSoft,
  border: `1px solid ${C.lineCard}`,
  borderRadius: 10,
  outline: "none",
  boxSizing: "border-box",
  letterSpacing: "-0.005em",
};

const pillButton: React.CSSProperties = {
  padding: "9px 18px",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: SYSTEM_FONT,
  border: "none",
  borderRadius: 100,
  cursor: "pointer",
  letterSpacing: "-0.005em",
  display: "inline-block",
  textAlign: "center",
};
