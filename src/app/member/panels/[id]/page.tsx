"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import {
  C,
  SYSTEM_FONT,
  MONO_FONT,
  DISPLAY_NUM,
  EYEBROW,
} from "@/components/member/tokens";
import { buildSidebar } from "@/components/member/data";
import { SystemTile } from "@/components/layout";
import { getPlainName } from "@/app/member/home/plainNames";
import { getCurrentUser } from "@/lib/data/panels";
import {
  getAnnotationsForPanel,
  createAnnotation,
} from "@/lib/data/annotations";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  PanelWithBiomarkers,
  Biomarker,
  Annotation,
} from "@/lib/data/types";

// ============================================================================
// /member/panels/[id] - single panel detail + analysis view.
// Full editorial layout: hero band, attention cards with range bars,
// all-clear summary, CTAs, expandable full marker list, annotations.
// ============================================================================

// ---- Category map (groups biomarkers into body systems) ----

const SYSTEM_MAP: [RegExp, string][] = [
  [/^(HbA1c|fP-Glukos|f-Glucose|f-Insulin|fp-glukos|p-glukos)$/i, "Blood sugar"],
  [/^(Kolesterol|TC|HDL|LDL|TG|Triglycerider)$/i, "Cholesterol"],
  [/^(TSH|fT4|fT3|ft4|ft3)$/i, "Thyroid"],
  [/^(ALAT|ASAT|GGT|ALP|Bilirubin)$/i, "Liver"],
  [/^(Kreatinin|eGFR|Cystatin|p-kreatinin)$/i, "Kidney"],
  [/^(Hb|Hemoglobin|Ferritin|Jarn|B12|Folat|p-ferritin|p-jarn|p-kobalamin|p-folat)$/i, "Iron / blood"],
  [/^(CRP|SR|Leukocyter|p-crp|b-leukocyter)$/i, "Inflammation"],
  [/^(Testosteron|SHBG|IGF-1|Kortisol|PSA|p-testosteron|p-kortisol|p-psa)$/i, "Hormones"],
  [/^(Natrium|Kalium|Kalcium|Urat|p-natrium|p-kalium|p-kalcium|p-urat)$/i, "Minerals"],
  [/^(D-vitamin|25-OH-Vitamin-D|Vit D)$/i, "Vitamins"],
];

function getSystem(shortName: string): string {
  for (const [re, sys] of SYSTEM_MAP) {
    if (re.test(shortName)) return sys;
  }
  return "Other";
}

const SYSTEM_ORDER = [
  "Blood sugar",
  "Cholesterol",
  "Thyroid",
  "Liver",
  "Kidney",
  "Iron / blood",
  "Inflammation",
  "Hormones",
  "Minerals",
  "Vitamins",
  "Other",
];

// ---- Plain English names for common markers ----

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
  fT4: "thyroid hormone",
  fT3: "thyroid hormone",
  "Vit D": "vitamin D",
  "D-vitamin": "vitamin D",
  "25-OH-Vitamin-D": "vitamin D",
  Ferritin: "iron stores",
  Hb: "oxygen carrier",
  Hemoglobin: "oxygen carrier",
  B12: "vitamin B12",
  Folat: "folate",
  Jarn: "iron",
  Kreatinin: "kidney function",
  eGFR: "kidney filtration rate",
  ALAT: "liver enzyme",
  ASAT: "liver enzyme",
  GGT: "liver enzyme",
  ALP: "bone / liver enzyme",
  Bilirubin: "bile pigment",
  CRP: "inflammation marker",
  Leukocyter: "white blood cells",
  SR: "sedimentation rate",
  Testosteron: "testosterone",
  SHBG: "hormone binding protein",
  "IGF-1": "growth factor",
  Kortisol: "stress hormone",
  PSA: "prostate marker",
  Natrium: "sodium",
  Kalium: "potassium",
  Kalcium: "calcium",
  Urat: "uric acid",
};

// ---- Marker-specific explanations and tips ----

function getMarkerExplanation(m: Biomarker): string {
  const key = m.short_name.toLowerCase().replace(/^(fp-|f-p-|p-|b-|s-)/, "");
  const direction = m.ref_range_low !== null && m.value < m.ref_range_low ? "below" : "above";

  if (key.includes("d-vitamin") || key.includes("25-oh-vitamin") || key === "vit d") {
    if (direction === "below") {
      return "Common in Sweden, especially in winter when sunlight is limited. Most people supplement Oct through Apr.";
    }
    return "Above the upper reference range. Worth checking supplementation dose with Dr. Tomas.";
  }
  if (key.includes("kolesterol") || key === "tc" || key === "ldl") {
    return "Above the recommended level. Diet and exercise adjustments can often bring this down.";
  }
  if (key === "hdl") {
    if (direction === "below") {
      return "Lower than ideal. Regular aerobic exercise and reducing processed food can help raise HDL.";
    }
    return "Higher than the reference range - generally considered protective.";
  }
  if (key.includes("glukos") || key.includes("glucose")) {
    return "Slightly elevated fasting glucose. Worth monitoring over time, especially with family history.";
  }
  if (key === "hba1c") {
    return "Reflects average blood sugar over the past 2-3 months. A useful long-term trend marker.";
  }
  if (key === "ferritin" || key === "jarn") {
    if (direction === "below") {
      return "Low iron stores are common, particularly in women. Dietary changes or supplementation can help.";
    }
    return "Elevated iron stores. Worth investigating the underlying cause with Dr. Tomas.";
  }
  if (key === "crp") {
    return "An elevated inflammation marker. Can be caused by infection, stress, or chronic conditions.";
  }
  if (key === "tsh") {
    return "TSH outside the normal range may indicate thyroid under- or overactivity. Worth a follow-up.";
  }
  if (key === "alat" || key === "asat" || key === "ggt") {
    return "Liver enzymes outside range. Can be caused by alcohol, medication, or fatty liver.";
  }

  const label = m.name_eng || m.short_name;
  return `${label} is slightly ${direction} the normal range.`;
}

function getMarkerTip(m: Biomarker): string {
  const key = m.short_name.toLowerCase().replace(/^(fp-|f-p-|p-|b-|s-)/, "");
  const direction = m.ref_range_low !== null && m.value < m.ref_range_low ? "low" : "high";

  if (key.includes("d-vitamin") || key.includes("25-oh-vitamin") || key === "vit d") {
    return "Take 1000-2000 IU vitamin D3 daily from October through April. Retest in spring.";
  }
  if (key.includes("kolesterol") || key === "tc" || key === "ldl") {
    return "Increase fiber, oily fish, and nuts. Reduce saturated fat. Retest in 3-6 months.";
  }
  if (key === "hdl" && direction === "low") {
    return "30 minutes of brisk walking or cycling most days can raise HDL over 8-12 weeks.";
  }
  if (key.includes("glukos") || key.includes("glucose") || key === "hba1c") {
    return "Reduce refined carbs and added sugar. Regular exercise after meals helps. Retest in 3 months.";
  }
  if (key === "ferritin" || key === "jarn") {
    if (direction === "low") {
      return "Eat iron-rich foods (red meat, lentils, spinach) with vitamin C to boost absorption.";
    }
    return "Avoid iron supplements and limit red meat until reviewed by your doctor.";
  }
  if (key === "crp") {
    return "If you've been sick recently, retest in 4-6 weeks. Persistent elevation needs investigation.";
  }
  if (key === "tsh") {
    return "Your doctor may order fT4 and fT3 to get the full thyroid picture. Retest in 6-8 weeks.";
  }
  if (key === "alat" || key === "asat" || key === "ggt") {
    return "Avoid alcohol for 4 weeks and retest. If still elevated, an ultrasound may be recommended.";
  }

  return "Discuss this result with Dr. Tomas at your next review to understand what steps, if any, are needed.";
}

// ---- Helpers ----

function plainOnly(m: Biomarker): string {
  return m.plain_name || PLAIN_NAMES[m.short_name] || "";
}

function statusColor(m: Biomarker): string {
  if (m.status === "normal") return C.good;
  if (m.status === "borderline") return C.caution;
  return C.risk;
}

// Maps Biomarker.status ("normal" | "borderline" | "abnormal") to the
// direction-aware status that SystemTile consumes. Borderline markers split
// into "high" or "low" based on where value sits relative to the ref range;
// abnormal maps to "critical".
function mapStatus(
  status: "normal" | "borderline" | "abnormal",
  value: number,
  refHigh: number,
): "normal" | "low" | "high" | "critical" {
  if (status === "normal") return "normal";
  if (status === "abnormal") return "critical";
  return value > refHigh ? "high" : "low";
}

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function groupBySystem(markers: Biomarker[]): { name: string; markers: Biomarker[] }[] {
  const groups = new Map<string, Biomarker[]>();
  for (const m of markers) {
    const sys = getSystem(m.short_name);
    if (!groups.has(sys)) groups.set(sys, []);
    groups.get(sys)!.push(m);
  }
  return SYSTEM_ORDER.filter((s) => groups.has(s)).map((name) => ({
    name,
    markers: groups.get(name)!,
  }));
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

  // Edit mode (panel metadata)
  const [editMode, setEditMode] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editLab, setEditLab] = useState("");

  // Shared saving flag for panel-metadata edit form
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Expandable all-markers section
  const [allMarkersOpen, setAllMarkersOpen] = useState(false);

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

      const a = await getAnnotationsForPanel(panelId);
      setAnnotations(a);
    }
    load();
  }, [panelId]);

  // ---- Analyzing animation (2s after data loads) ----
  useEffect(() => {
    if (loading || !panel) return;
    let frame: number;
    const start = Date.now();
    const duration = 2000;

    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
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

  async function handleDelete() {
    if (!panel) return;
    setDeleting(true);
    const supabase = createClient();
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

  // ---- Loading ----
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

  // ---- Error / not found ----
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
  const inRange = panel.biomarkers.filter((b) => b.status === "normal");
  const totalCount = panel.biomarkers.length;
  const flaggedCount = flagged.length;
  const inRangeCount = inRange.length;

  // Group in-range markers by system for the "All clear" card
  const inRangeSystems = groupBySystem(inRange);

  // Group ALL markers by system for the expandable section
  const allSystems = groupBySystem(panel.biomarkers);

  // Dynamic headline
  let headlineLine1 = "Your panel looks healthy.";
  let headlineLine2 = "Everything in range.";
  if (flaggedCount === 1) {
    headlineLine1 = "Most of your panel looks healthy.";
    headlineLine2 = "One marker to keep an eye on.";
  } else if (flaggedCount >= 2) {
    headlineLine1 = "Most of your panel looks healthy.";
    headlineLine2 = `${flaggedCount} markers need attention.`;
  }

  // ============================================================================
  // Analyzing animation
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
            {/* Pulsing ring - warm gradient */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.terracottaTint} 0%, ${C.butterTint} 50%, ${C.sageTint} 100%)`,
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
                  border: "2px solid transparent",
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
                {totalCount}
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

            {/* Progress track */}
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
  // Main content - results view
  // ============================================================================
  return (
    <MemberShell sidebar={buildSidebar("/member/panels")} userInitials={userInitials}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ fontFamily: SYSTEM_FONT }}
      >
        {/* Back link */}
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
            marginBottom: 24,
          }}
        >
          All panels
        </a>

        {/* ================================================================
            1. HERO BAND
            ================================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="panel-hero"
          style={{ marginBottom: 0 }}
        >
          {/* LEFT side */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            {/* Review status pill */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 14px",
                background: C.terracottaTint,
                border: `1px solid ${C.terracottaSoft}`,
                borderRadius: 100,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: C.terracottaDeep,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.terracottaDeep,
                  flexShrink: 0,
                }}
              />
              Pending doctor review
            </span>

            {/* Eyebrow: panel date */}
            {!editMode ? (
              <>
                <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 12 }}>
                  {formatLongDate(panel.panel_date)}
                  {panel.lab_name ? ` / ${panel.lab_name}` : ""}
                </div>

                {/* Headline */}
                <h1
                  style={{
                    fontSize: "clamp(26px, 4vw, 38px)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.028em",
                    fontWeight: 600,
                    color: C.ink,
                    margin: "0 0 6px",
                  }}
                >
                  {headlineLine1}
                  <br />
                  <span
                    style={{
                      fontStyle: "italic",
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: C.inkMuted,
                      fontWeight: 400,
                    }}
                  >
                    {headlineLine2}
                  </span>
                </h1>

                {/* Intro paragraph */}
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: C.inkMuted,
                    margin: "14px 0 0",
                    maxWidth: 480,
                  }}
                >
                  We reviewed{" "}
                  <strong style={{ color: C.ink, fontWeight: 600 }}>{totalCount}</strong>{" "}
                  markers from your {formatMonthYear(panel.panel_date)} blood panel.
                  Here&apos;s what stood out, what&apos;s looking good, and what to do next.
                </p>
              </>
            ) : (
              /* Edit mode for panel metadata */
              <div
                style={{
                  padding: "18px 22px",
                  background: C.paper,
                  border: `1px solid ${C.lineCard}`,
                  borderRadius: 18,
                  boxShadow: C.shadowSoft,
                }}
              >
                <div style={{ ...EYEBROW, color: C.inkMuted, marginBottom: 14 }}>
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
          </div>

          {/* RIGHT side - Score ring card */}
          <div
            className="panel-score-card"
            style={{
              flex: "0 0 auto",
              width: 220,
              padding: "24px 22px",
              background: C.paper,
              border: `1px solid ${C.lineCard}`,
              borderRadius: 20,
              boxShadow: C.shadowSoft,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <ScoreRing total={totalCount} good={inRangeCount} flagged={flaggedCount} />
            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.good,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: C.inkMuted }}>
                  In range{" "}
                  <strong style={{ ...DISPLAY_NUM, fontSize: 13, color: C.ink }}>
                    {inRangeCount}
                  </strong>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.caution,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: C.inkMuted }}>
                  Attention{" "}
                  <strong style={{ ...DISPLAY_NUM, fontSize: 13, color: C.ink }}>
                    {flaggedCount}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================================
            2. DIVIDER
            ================================================================ */}
        <div style={{ height: 1, background: C.lineSoft, margin: "32px 0" }} />

        {/* ================================================================
            3. TWO-COLUMN GRID: Attention + All Clear
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="panel-two-col"
          style={{ marginBottom: 32 }}
        >
          {/* LEFT COLUMN: Needs attention */}
          <div>
            <div style={{ ...EYEBROW, color: C.terracotta, marginBottom: 16 }}>
              Needs attention
            </div>

            {flaggedCount === 0 ? (
              /* Celebration card */
              <div
                style={{
                  padding: "28px 24px",
                  background: C.sageTint,
                  border: `1px solid ${C.sageSoft}`,
                  borderRadius: 22,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: C.sage,
                    margin: "0 auto 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M6 11.5L9.5 15L16 7"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: C.sageDeep,
                    marginBottom: 4,
                  }}
                >
                  Everything in range
                </div>
                <div style={{ fontSize: 14, color: C.sage }}>A clean sheet.</div>
              </div>
            ) : (
              /* Flagged marker cards */
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {flagged.map((m) => (
                  <AttentionCard key={m.id} marker={m} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: All clear */}
          <div>
            <div style={{ ...EYEBROW, color: C.sage, marginBottom: 16 }}>
              All clear
            </div>

            <div
              style={{
                padding: "24px 22px",
                background: C.sageTint,
                border: `1px solid ${C.sageSoft}`,
                borderRadius: 22,
              }}
            >
              {/* Title with green dot */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: C.good,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 17, fontWeight: 600, color: C.sageDeep }}>
                  {inRangeCount} marker{inRangeCount !== 1 ? "s" : ""} in healthy range
                </span>
              </div>

              {/* System pills - 2-col grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {inRangeSystems.map((sys) => (
                  <div
                    key={sys.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 10,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill={C.good} />
                      <path
                        d="M5 8.2L7.2 10.4L11 6"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, flex: 1 }}>
                      {sys.name}
                    </span>
                    <span
                      style={{
                        ...DISPLAY_NUM,
                        fontSize: 12,
                        color: C.inkFaint,
                      }}
                    >
                      {sys.markers.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================================
            4. EXPANDABLE: All markers by category
            ================================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
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
          <button
            onClick={() => setAllMarkersOpen(!allMarkersOpen)}
            style={{
              width: "100%",
              padding: "20px 24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: SYSTEM_FONT,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>
              See all {totalCount} markers by category
            </span>
            <motion.span
              animate={{ rotate: allMarkersOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 18, color: C.inkFaint, lineHeight: 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4.5 6.75L9 11.25L13.5 6.75"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </button>

          <AnimatePresence>
            {allMarkersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "0 24px 24px" }}>
                  {allSystems.map((sys, si) => (
                    <div key={sys.name} style={{ marginTop: si === 0 ? 0 : 28 }}>
                      <div
                        style={{
                          ...EYEBROW,
                          fontSize: 9,
                          color: C.inkFaint,
                          marginBottom: 12,
                        }}
                      >
                        {sys.name}
                      </div>
                      <div className="panel-allmarkers-grid">
                        {sys.markers.map((m) => (
                          <SystemTile
                            key={m.id}
                            system={sys.name}
                            marker={{
                              shortName: m.short_name,
                              value: m.value,
                              unit: m.unit,
                              refLow: m.ref_range_low ?? 0,
                              refHigh: m.ref_range_high ?? 1,
                              status: mapStatus(
                                m.status,
                                m.value,
                                m.ref_range_high ?? 1,
                              ),
                              plainName:
                                m.plain_name ||
                                getPlainName(m.short_name, m),
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ================================================================
            6. ANNOTATIONS
            ================================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            background: C.paper,
            border: `1px solid ${C.lineCard}`,
            borderRadius: 22,
            boxShadow: C.shadowSoft,
            padding: "20px 24px 24px",
            marginBottom: 28,
          }}
        >
          <div style={{ ...EYEBROW, color: C.inkMuted, marginBottom: 14 }}>
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
                    color: a.author?.role === "doctor" ? C.canvasSoft : C.ink,
                    fontSize: 8,
                    fontWeight: 700,
                  }}
                >
                  {(a.author?.display_name || "?")[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>
                  {a.author?.display_name || "Unknown"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: C.inkFaint,
                    fontFamily: MONO_FONT,
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
              <div style={{ fontSize: 14, lineHeight: 1.6, color: C.inkSoft }}>
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
                background: savingNote || !noteText.trim() ? C.stone : C.sage,
                border: "none",
                borderRadius: 10,
                cursor: savingNote || !noteText.trim() ? "default" : "pointer",
              }}
            >
              {savingNote ? "..." : "Add"}
            </button>
          </div>
        </motion.section>

        {/* ================================================================
            7. ACTION BAR: Edit / Delete
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
        </motion.div>

        {/* Responsive styles */}
        <style jsx global>{`
          html, body {
            background: ${C.stone};
          }
          .panel-hero {
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;
          }
          /* On mobile score card goes full-width */
          .panel-score-card {
            width: 100% !important;
            max-width: 340px;
          }
          .panel-two-col {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .panel-allmarkers-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }
          @media (min-width: 768px) {
            .panel-hero {
              flex-direction: row;
              gap: 32px;
              align-items: flex-start;
            }
            .panel-score-card {
              width: 220px !important;
              max-width: 220px;
            }
            .panel-two-col {
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .panel-allmarkers-grid {
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
          }
          @media (min-width: 1200px) {
            .panel-allmarkers-grid {
              grid-template-columns: 1fr 1fr 1fr;
            }
          }
        `}</style>
      </motion.div>
    </MemberShell>
  );
}

// ============================================================================
// Score Ring SVG
// ============================================================================

function ScoreRing({
  total,
  good,
  flagged,
}: {
  total: number;
  good: number;
  flagged: number;
}) {
  const size = 110;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const goodPct = total > 0 ? good / total : 1;
  const goodArc = goodPct * circumference;
  const flaggedArc = (1 - goodPct) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Good arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.good}
          strokeWidth={stroke}
          strokeDasharray={`${goodArc} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Flagged arc */}
        {flagged > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={C.caution}
            strokeWidth={stroke}
            strokeDasharray={`${flaggedArc} ${circumference}`}
            strokeDashoffset={-goodArc}
            strokeLinecap="round"
          />
        )}
      </svg>
      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ ...DISPLAY_NUM, fontSize: 28, color: C.ink }}>{total}</span>
        <span style={{ fontSize: 11, color: C.inkFaint, marginTop: -2 }}>markers</span>
      </div>
    </div>
  );
}

// ============================================================================
// Attention Card - flagged marker with range bar
// ============================================================================

function AttentionCard({ marker }: { marker: Biomarker }) {
  const m = marker;
  const color = statusColor(m);
  const plain = plainOnly(m);
  const label = m.name_eng || m.short_name;

  // Range bar calculations
  const hasRange = m.ref_range_low !== null && m.ref_range_high !== null;
  const low = m.ref_range_low ?? 0;
  const high = m.ref_range_high ?? 100;
  const rangeSpan = high - low;

  // Extend the visual track to show values outside range
  const trackMin = Math.min(low - rangeSpan * 0.3, m.value - rangeSpan * 0.1);
  const trackMax = Math.max(high + rangeSpan * 0.3, m.value + rangeSpan * 0.1);
  const trackSpan = trackMax - trackMin;

  // Position the marker dot as a percentage of the track
  const markerPct = trackSpan > 0 ? ((m.value - trackMin) / trackSpan) * 100 : 50;
  // Position of the normal range within the track
  const normalStartPct = trackSpan > 0 ? ((low - trackMin) / trackSpan) * 100 : 20;
  const normalEndPct = trackSpan > 0 ? ((high - trackMin) / trackSpan) * 100 : 80;

  return (
    <div
      style={{
        padding: "22px 24px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowSoft,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>
            {label}
          </span>
          {plain && (
            <span style={{ fontSize: 14, color: C.inkFaint, marginLeft: 6 }}>
              ({plain})
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
          <span style={{ ...DISPLAY_NUM, fontSize: 28, color }}>{m.value}</span>
          <span style={{ fontSize: 12, color: C.inkFaint }}>{m.unit}</span>
        </div>
      </div>

      {/* Range bar visualization */}
      {hasRange && (
        <div style={{ marginBottom: 18 }}>
          {/* Track container */}
          <div style={{ position: "relative", height: 32, marginBottom: 6 }}>
            {/* Track */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 28,
                borderRadius: 14,
                background: C.canvasDeep,
                overflow: "hidden",
              }}
            >
              {/* Normal range band with green gradient */}
              <div
                style={{
                  position: "absolute",
                  left: `${normalStartPct}%`,
                  width: `${normalEndPct - normalStartPct}%`,
                  top: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, rgba(78,142,92,0.22) 0%, rgba(78,142,92,0.06) 100%)",
                  borderLeft: `2px dashed ${C.good}`,
                }}
              />
            </div>

            {/* Marker dot */}
            <div
              style={{
                position: "absolute",
                left: `${markerPct}%`,
                top: 4,
                transform: "translateX(-50%)",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: color,
                border: "3px solid #fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                zIndex: 2,
              }}
            />
          </div>

          {/* Range labels below track */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: C.inkFaint,
              fontFamily: MONO_FONT,
            }}
          >
            <span>{Math.round(trackMin * 10) / 10}</span>
            <span>{low} - normal range</span>
            <span>{high}</span>
          </div>
        </div>
      )}

      {/* Explanation */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: C.inkMuted,
          margin: "0 0 14px",
        }}
      >
        {getMarkerExplanation(m)}
      </p>

      {/* Tip box */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "14px 16px",
          background: C.butterTint,
          borderRadius: 12,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: C.butter,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>i</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 3 }}>
            What most people do:
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: C.inkMuted }}>
            {getMarkerTip(m)}
          </div>
        </div>
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
