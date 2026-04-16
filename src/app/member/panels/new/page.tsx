"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DISPLAY_NUM, DOCTOR } from "@/components/member/tokens";
import { buildSidebar } from "@/components/member/data";
import { createPanel, type NewBiomarkerRow } from "@/lib/data/panels";
import { getCurrentUser } from "@/lib/data/panels";

// ============================================================================
// Common Swedish blood panel marker presets
// ============================================================================

const PRESETS: Omit<NewBiomarkerRow, "value">[] = [
  { short_name: "fP-Glukos", name_eng: "Fasting glucose", plain_name: "blood sugar", unit: "mmol/L", ref_range_low: 4.0, ref_range_high: 6.0 },
  { short_name: "HbA1c", name_eng: "HbA1c", plain_name: "long-term blood sugar", unit: "mmol/mol", ref_range_low: 27, ref_range_high: 42 },
  { short_name: "Kolesterol", name_eng: "Total cholesterol", plain_name: "cholesterol", unit: "mmol/L", ref_range_low: 3.0, ref_range_high: 5.0 },
  { short_name: "LDL", name_eng: "LDL cholesterol", plain_name: "bad cholesterol", unit: "mmol/L", ref_range_low: 1.0, ref_range_high: 3.0 },
  { short_name: "HDL", name_eng: "HDL cholesterol", plain_name: "good cholesterol", unit: "mmol/L", ref_range_low: 1.0, ref_range_high: 2.0 },
  { short_name: "Triglycerider", name_eng: "Triglycerides", plain_name: "blood fats", unit: "mmol/L", ref_range_low: 0.5, ref_range_high: 2.0 },
  { short_name: "CRP", name_eng: "C-reactive protein", plain_name: "inflammation marker", unit: "mg/L", ref_range_low: 0, ref_range_high: 5 },
  { short_name: "TSH", name_eng: "TSH", plain_name: "thyroid function", unit: "mIU/L", ref_range_low: 0.4, ref_range_high: 4.0 },
  { short_name: "ALAT", name_eng: "ALT", plain_name: "liver enzyme", unit: "U/L", ref_range_low: 10, ref_range_high: 45 },
  { short_name: "Hb", name_eng: "Hemoglobin", plain_name: "oxygen carrier", unit: "g/L", ref_range_low: 120, ref_range_high: 170 },
  { short_name: "Kreatinin", name_eng: "Creatinine", plain_name: "kidney function", unit: "umol/L", ref_range_low: 50, ref_range_high: 100 },
  { short_name: "Ferritin", name_eng: "Ferritin", plain_name: "iron stores", unit: "ug/L", ref_range_low: 15, ref_range_high: 200 },
  { short_name: "D-vitamin", name_eng: "Vitamin D", plain_name: "vitamin D", unit: "nmol/L", ref_range_low: 50, ref_range_high: 125 },
];

interface MarkerRow {
  id: string;
  short_name: string;
  name_eng: string;
  plain_name: string;
  value: string;
  unit: string;
  ref_range_low: string;
  ref_range_high: string;
}

function emptyRow(): MarkerRow {
  return {
    id: crypto.randomUUID(),
    short_name: "",
    name_eng: "",
    plain_name: "",
    value: "",
    unit: "",
    ref_range_low: "",
    ref_range_high: "",
  };
}

export default function NewPanelPage() {
  const router = useRouter();
  const [panelDate, setPanelDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [labName, setLabName] = useState("");
  const [rows, setRows] = useState<MarkerRow[]>([emptyRow()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [parsing, setParsing] = useState(false);

  function addPreset(preset: Omit<NewBiomarkerRow, "value">) {
    // If there's already a row for this marker, skip
    if (rows.some((r) => r.short_name === preset.short_name)) return;

    // If the last row is empty, replace it
    const last = rows[rows.length - 1];
    if (last && !last.short_name && !last.value) {
      setRows([
        ...rows.slice(0, -1),
        {
          id: last.id,
          short_name: preset.short_name,
          name_eng: preset.name_eng,
          plain_name: preset.plain_name,
          value: "",
          unit: preset.unit,
          ref_range_low: preset.ref_range_low?.toString() ?? "",
          ref_range_high: preset.ref_range_high?.toString() ?? "",
        },
      ]);
    } else {
      setRows([
        ...rows,
        {
          id: crypto.randomUUID(),
          short_name: preset.short_name,
          name_eng: preset.name_eng,
          plain_name: preset.plain_name,
          value: "",
          unit: preset.unit,
          ref_range_low: preset.ref_range_low?.toString() ?? "",
          ref_range_high: preset.ref_range_high?.toString() ?? "",
        },
      ]);
    }
  }

  function updateRow(id: string, field: keyof MarkerRow, val: string) {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  }

  function removeRow(id: string) {
    if (rows.length === 1) return;
    setRows(rows.filter((r) => r.id !== id));
  }

  async function handleParse() {
    if (!pasteText.trim()) return;
    setParsing(true);
    setError("");

    try {
      const res = await fetch("/api/parse-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to parse.");
        setParsing(false);
        return;
      }

      // Fill in date and lab if parsed
      if (data.panel_date) setPanelDate(data.panel_date);
      if (data.lab_name) setLabName(data.lab_name);

      // Convert parsed markers to form rows
      if (data.markers && data.markers.length > 0) {
        const newRows: MarkerRow[] = data.markers.map((m: {
          short_name: string;
          name_eng: string;
          plain_name: string;
          value: number;
          unit: string;
          ref_range_low: number | null;
          ref_range_high: number | null;
        }) => ({
          id: crypto.randomUUID(),
          short_name: m.short_name,
          name_eng: m.name_eng,
          plain_name: m.plain_name,
          value: m.value.toString(),
          unit: m.unit,
          ref_range_low: m.ref_range_low?.toString() ?? "",
          ref_range_high: m.ref_range_high?.toString() ?? "",
        }));
        setRows(newRows);
      }

      setPasteMode(false);
      setPasteText("");
    } catch {
      setError("Failed to parse the report. Try again or enter markers manually.");
    }
    setParsing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validRows = rows.filter((r) => r.short_name && r.value);
    if (validRows.length === 0) {
      setError("Add at least one marker with a value.");
      return;
    }

    setSaving(true);
    const user = await getCurrentUser();
    if (!user) {
      setError("Not signed in.");
      setSaving(false);
      return;
    }

    const biomarkers: NewBiomarkerRow[] = validRows.map((r) => ({
      short_name: r.short_name,
      name_eng: r.name_eng,
      plain_name: r.plain_name,
      value: parseFloat(r.value),
      unit: r.unit,
      ref_range_low: r.ref_range_low ? parseFloat(r.ref_range_low) : null,
      ref_range_high: r.ref_range_high ? parseFloat(r.ref_range_high) : null,
    }));

    const result = await createPanel(user.id, panelDate, labName, biomarkers);

    if ("error" in result) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/member/panels");
    }
  }

  // Presets not yet added
  const availablePresets = PRESETS.filter(
    (p) => !rows.some((r) => r.short_name === p.short_name)
  );

  return (
    <MemberShell sidebar={buildSidebar("/member/panels")} userInitials=".">
      <div style={{ fontFamily: SYSTEM_FONT }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.terracotta,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            New panel
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.028em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              marginBottom: 8,
            }}
          >
            Add a blood panel
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: C.inkMuted,
              margin: 0,
              marginBottom: 32,
              maxWidth: 520,
            }}
          >
            Use the presets for common markers or type your own. Only the marker
            name and value are required.
          </p>
        </motion.div>

        {/* Paste or manual toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setPasteMode(false)}
            style={{
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: SYSTEM_FONT,
              color: !pasteMode ? C.canvasSoft : C.inkSoft,
              background: !pasteMode ? C.ink : "transparent",
              border: `1px solid ${!pasteMode ? C.ink : C.lineCard}`,
              borderRadius: 100,
              cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
          >
            Manual entry
          </button>
          <button
            type="button"
            onClick={() => setPasteMode(true)}
            style={{
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: SYSTEM_FONT,
              color: pasteMode ? C.canvasSoft : C.inkSoft,
              background: pasteMode ? C.ink : "transparent",
              border: `1px solid ${pasteMode ? C.ink : C.lineCard}`,
              borderRadius: 100,
              cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
          >
            Paste report
          </button>
        </div>

        {pasteMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "22px 24px",
              background: C.paper,
              border: `1px solid ${C.lineCard}`,
              borderRadius: 18,
              boxShadow: C.shadowSoft,
              marginBottom: 28,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              Paste your blood test report
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: C.inkMuted, margin: "0 0 14px" }}>
              Paste the text from your lab report, email, PDF, or screenshot. AI will extract the markers, values, and reference ranges.
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={"Paste your blood test results here...\n\nExample:\nfP-Glukos  5.4 mmol/L  (ref 4.0-6.0)\nHbA1c  38 mmol/mol  (ref 27-42)\nKolesterol  5.2 mmol/L  (ref 3.0-5.0)"}
              rows={8}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 14,
                fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace',
                color: C.ink,
                background: C.canvasSoft,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 12,
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
                lineHeight: 1.6,
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                onClick={handleParse}
                disabled={parsing || !pasteText.trim()}
                style={{
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: SYSTEM_FONT,
                  color: C.canvasSoft,
                  background: parsing || !pasteText.trim() ? C.stone : C.terracotta,
                  border: "none",
                  borderRadius: 100,
                  cursor: parsing || !pasteText.trim() ? "default" : "pointer",
                  boxShadow: parsing || !pasteText.trim() ? "none" : "0 6px 14px -6px rgba(201,87,58,0.4)",
                }}
              >
                {parsing ? "Parsing..." : "Extract markers"}
              </button>
              <button
                type="button"
                onClick={() => { setPasteMode(false); setPasteText(""); }}
                style={{
                  padding: "12px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: SYSTEM_FONT,
                  color: C.inkMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: C.stone,
                  textUnderlineOffset: 3,
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Panel metadata */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <Field label="Panel date" style={{ flex: "1 1 180px" }}>
              <input
                type="date"
                value={panelDate}
                onChange={(e) => setPanelDate(e.target.value)}
                required
                style={inputStyle}
              />
            </Field>
            <Field label="Lab" style={{ flex: "1 1 180px" }}>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                placeholder="e.g. Synlab, Unilabs, Karolinska"
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Preset buttons */}
          {availablePresets.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: C.inkMuted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Quick add
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {availablePresets.map((p) => (
                  <button
                    key={p.short_name}
                    type="button"
                    onClick={() => addPreset(p)}
                    style={{
                      padding: "7px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: SYSTEM_FONT,
                      color: C.ink,
                      background: C.canvasSoft,
                      border: `1px solid ${C.lineCard}`,
                      borderRadius: 100,
                      cursor: "pointer",
                      letterSpacing: "-0.005em",
                      transition: "background 0.15s ease",
                    }}
                  >
                    + {p.short_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marker rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {rows.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                style={{
                  padding: "16px 18px",
                  background: C.paper,
                  border: `1px solid ${C.lineCard}`,
                  borderRadius: 16,
                  boxShadow: C.shadowSoft,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 10,
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                  }}
                >
                  <Field label="Marker" style={{ flex: "2 1 140px" }}>
                    <input
                      type="text"
                      value={row.short_name}
                      onChange={(e) =>
                        updateRow(row.id, "short_name", e.target.value)
                      }
                      placeholder="e.g. HbA1c"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Value" style={{ flex: "1 1 80px" }}>
                    <input
                      type="number"
                      step="any"
                      value={row.value}
                      onChange={(e) =>
                        updateRow(row.id, "value", e.target.value)
                      }
                      placeholder="0.0"
                      style={{ ...inputStyle, ...DISPLAY_NUM, fontSize: 16 }}
                    />
                  </Field>
                  <Field label="Unit" style={{ flex: "1 1 80px" }}>
                    <input
                      type="text"
                      value={row.unit}
                      onChange={(e) =>
                        updateRow(row.id, "unit", e.target.value)
                      }
                      placeholder="mmol/L"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                  }}
                >
                  <Field label="English name" style={{ flex: "2 1 140px" }}>
                    <input
                      type="text"
                      value={row.name_eng}
                      onChange={(e) =>
                        updateRow(row.id, "name_eng", e.target.value)
                      }
                      placeholder="Fasting glucose"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Plain name" style={{ flex: "1 1 100px" }}>
                    <input
                      type="text"
                      value={row.plain_name}
                      onChange={(e) =>
                        updateRow(row.id, "plain_name", e.target.value)
                      }
                      placeholder="blood sugar"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Ref low" style={{ flex: "0 1 70px" }}>
                    <input
                      type="number"
                      step="any"
                      value={row.ref_range_low}
                      onChange={(e) =>
                        updateRow(row.id, "ref_range_low", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Ref high" style={{ flex: "0 1 70px" }}>
                    <input
                      type="number"
                      step="any"
                      value={row.ref_range_high}
                      onChange={(e) =>
                        updateRow(row.id, "ref_range_high", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </Field>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      style={{
                        padding: "8px 12px",
                        background: "none",
                        border: "none",
                        fontSize: 12,
                        color: C.inkFaint,
                        cursor: "pointer",
                        fontFamily: SYSTEM_FONT,
                        textDecoration: "underline",
                        textDecorationColor: C.stone,
                        textUnderlineOffset: 3,
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setRows([...rows, emptyRow()])}
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: SYSTEM_FONT,
              color: C.inkSoft,
              background: "none",
              border: `1px dashed ${C.stoneDeep}`,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 28,
              letterSpacing: "-0.005em",
            }}
          >
            + Add another marker
          </button>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: C.terracottaTint,
                border: `1px solid ${C.terracottaSoft}`,
                borderRadius: 12,
                fontSize: 13,
                color: C.terracottaDeep,
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: SYSTEM_FONT,
              color: C.canvasSoft,
              background: saving ? C.stone : C.terracotta,
              border: "none",
              borderRadius: 100,
              cursor: saving ? "default" : "pointer",
              letterSpacing: "-0.005em",
              boxShadow: saving
                ? "none"
                : "0 8px 18px -8px rgba(201,87,58,0.42), 0 2px 6px rgba(201,87,58,0.2)",
              transition: "background 0.2s ease",
            }}
          >
            {saving ? "Saving..." : "Save panel"}
          </button>
        </form>
      </div>
    </MemberShell>
  );
}

// ============================================================================
// Shared field wrapper
// ============================================================================

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.inkMuted,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  color: "#1C1A17",
  background: "#FDFBF6",
  border: "1px solid #E0D9C8",
  borderRadius: 10,
  outline: "none",
  boxSizing: "border-box",
  letterSpacing: "-0.005em",
};
