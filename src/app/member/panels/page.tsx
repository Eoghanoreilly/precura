"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberShell } from "@/components/member/MemberShell";
import { C, SYSTEM_FONT, DISPLAY_NUM, DOCTOR } from "@/components/member/tokens";
import { buildSidebar } from "@/components/member/data";
import {
  BLOOD_TEST_HISTORY,
  DOCTOR_NOTES,
  type BloodTestSession,
  type BloodMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// /member/panels - every blood panel Anna has had, newest first.
// Editorial voice: each panel is a card with eyebrow date, one-sentence
// summary, doctor-note pull-quote if present, and an expandable marker list.
// ============================================================================

const CATEGORY_MAP: Record<string, string> = {
  HbA1c: "Metabolic",
  "f-Glucose": "Metabolic",
  "f-Insulin": "Metabolic",
  TC: "Cardiovascular",
  HDL: "Cardiovascular",
  LDL: "Cardiovascular",
  TG: "Cardiovascular",
  TSH: "Thyroid",
  "Vit D": "Nutrition",
  Crea: "Kidney",
};

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function countFlagged(session: BloodTestSession): number {
  return session.results.filter((m) => m.status !== "normal").length;
}

function findNote(sessionDate: string): string | null {
  const sessionTime = new Date(sessionDate).getTime();
  const matched = DOCTOR_NOTES.find((n) => {
    const noteTime = new Date(n.date).getTime();
    const diffDays = (noteTime - sessionTime) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });
  return matched?.note ?? null;
}

function groupByCategory(
  results: BloodMarker[]
): { name: string; markers: BloodMarker[] }[] {
  const groups = new Map<string, BloodMarker[]>();
  for (const m of results) {
    const cat = CATEGORY_MAP[m.shortName] ?? "Other";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(m);
  }
  const order = ["Metabolic", "Cardiovascular", "Thyroid", "Nutrition", "Kidney", "Other"];
  return order
    .filter((o) => groups.has(o))
    .map((name) => ({ name, markers: groups.get(name)! }));
}

function statusColor(status: BloodMarker["status"]): string {
  if (status === "normal") return C.good;
  if (status === "borderline") return C.caution;
  return C.risk;
}

export default function PanelsPage() {
  return (
    <MemberShell sidebar={buildSidebar("/member/panels")} userInitials="A">
      <div
        style={{
          padding: "36px 28px 40px",
          fontFamily: SYSTEM_FONT,
          maxWidth: 780,
        }}
      >
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
            Your panels
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.028em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              marginBottom: 10,
            }}
          >
            Six panels since April 2021.{" "}
            <span
              style={{
                color: C.inkMuted,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 500,
              }}
            >
              The full trajectory of your health.
            </span>
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: C.inkMuted,
              margin: 0,
              marginBottom: 36,
              maxWidth: 560,
              fontStyle: "italic",
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            Every blood panel Dr. Tomas has reviewed, with the full marker
            list and notes. Tap any panel to open it.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {BLOOD_TEST_HISTORY.map((session, i) => (
            <PanelCard
              key={session.date}
              session={session}
              isLatest={i === 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

// ============================================================================
// PanelCard - one blood panel session
// ============================================================================

function PanelCard({
  session,
  isLatest,
  index,
}: {
  session: BloodTestSession;
  isLatest: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(isLatest);
  const flagged = countFlagged(session);
  const inRange = session.results.length - flagged;
  const note = findNote(session.date);
  const categories = groupByCategory(session.results);
  const year = new Date(session.date).getFullYear();

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
      {/* Header: date + latest badge + flagged count */}
      <div
        style={{
          padding: "22px 26px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: isLatest ? C.terracotta : C.inkMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {year} panel
          </div>
          {isLatest && (
            <span
              style={{
                padding: "3px 10px",
                background: C.terracotta,
                color: C.canvasSoft,
                borderRadius: 100,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Latest
            </span>
          )}
        </div>

        <h2
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            marginBottom: 14,
          }}
        >
          {formatLongDate(session.date)}
        </h2>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: C.inkSoft,
            margin: 0,
            marginBottom: note ? 18 : 14,
            letterSpacing: "-0.005em",
          }}
        >
          <span
            style={{
              ...DISPLAY_NUM,
              fontSize: 18,
              color: C.ink,
            }}
          >
            {session.results.length}
          </span>{" "}
          markers{flagged > 0 ? ", " : " "}
          {flagged > 0 && (
            <>
              <span
                style={{
                  ...DISPLAY_NUM,
                  fontSize: 18,
                  color: C.caution,
                }}
              >
                {flagged}
              </span>{" "}
              {flagged === 1 ? "flagged" : "flagged"},{" "}
            </>
          )}
          ordered{" "}
          {session.orderedBy.includes("Precura")
            ? "by Dr. Tomas"
            : `by ${session.orderedBy.split(",")[0]}`}
          , analysed at {session.lab.replace("Karolinska University Laboratory", "Karolinska")}.
        </p>

        {note && (
          <div
            style={{
              padding: "14px 18px",
              background: C.sageTint,
              border: `1px solid ${C.sageSoft}`,
              borderRadius: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.canvasSoft,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {DOCTOR.initials}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: C.sageDeep,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Note from Dr. Tomas
              </div>
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: C.inkSoft,
                fontStyle: "italic",
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              &ldquo;{note.split("\n")[0]}&rdquo;
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            color: C.inkSoft,
            cursor: "pointer",
            letterSpacing: "-0.005em",
            textDecoration: "underline",
            textDecorationColor: C.stone,
            textUnderlineOffset: 4,
          }}
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
            style={{
              overflow: "hidden",
              background: C.canvasSoft,
              borderTop: `1px solid ${C.lineSoft}`,
            }}
          >
            <div style={{ padding: "18px 26px 24px" }}>
              {categories.map((cat, ci) => (
                <div
                  key={cat.name}
                  style={{
                    marginTop: ci === 0 ? 0 : 20,
                    marginBottom: 8,
                  }}
                >
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
                    {cat.name}
                  </div>
                  {cat.markers.map((m) => (
                    <MarkerRow key={m.shortName} marker={m} />
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

// ============================================================================
// MarkerRow - single biomarker line
// ============================================================================

function MarkerRow({ marker }: { marker: BloodMarker }) {
  const color = statusColor(marker.status);
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
            {marker.plainName}
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: C.inkFaint,
            marginLeft: 15,
          }}
        >
          Normal range: {marker.refLow} to {marker.refHigh} {marker.unit}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span
          style={{
            ...DISPLAY_NUM,
            fontSize: 18,
            color: color,
          }}
        >
          {marker.value}
        </span>
        <span
          style={{
            fontSize: 11,
            color: C.inkFaint,
            marginLeft: 3,
          }}
        >
          {marker.unit}
        </span>
      </div>
    </div>
  );
}
