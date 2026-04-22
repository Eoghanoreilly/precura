"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  EditorialColumn,
  Hero,
  Button,
} from "@/components/layout";
import type { PanelWithBiomarkers, Annotation } from "@/lib/data/types";
import { BodySystemsGrid } from "./blocks/BodySystemsGrid";
import { daysAgo, formatPanelDate } from "./categoryMap";
import { DOCTOR } from "@/components/member/tokens";

export interface StateGProps {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  userName?: string;
}

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: "var(--text-micro)",
  fontWeight: 600,
  color: "var(--ink-faint)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: "0 0 var(--sp-4)",
};

export function StateG({ panels, annotations }: StateGProps) {
  const latest = panels[0];
  if (!latest) return null;
  const biomarkers = latest.biomarkers ?? [];

  // Find the most recent doctor annotation
  const doctorNote = annotations
    .filter((a) => a.author?.role === "doctor")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  if (!doctorNote) return null;

  const [firstLine, ...rest] = String(doctorNote.body ?? "").split("\n");
  const bodyParagraphs = rest.filter((p) => p.trim().length > 0);

  const noteAge = daysAgo(doctorNote.created_at);
  const ageStr = noteAge === 0 ? "today" : noteAge === 1 ? "yesterday" : `${noteAge} days ago`;

  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        eyebrow={
          <>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                background: "var(--terracotta)",
                color: "var(--canvas-soft)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "var(--radius-pill)",
                marginRight: 6,
                display: "inline-block",
              }}
            >
              New
            </motion.span>
            <em
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--sage-deep)",
                fontStyle: "italic",
              }}
            >
              A note from Dr. {DOCTOR.firstName} · {ageStr}
            </em>
          </>
        }
        display={firstLine || "A note from your doctor."}
        body={bodyParagraphs.length > 0 ? bodyParagraphs.map((p, i) => <p key={i}>{p}</p>) : undefined}
        sig={<><b>{DOCTOR.name}</b> · licensed doctor</>}
        ctas={
          <>
            <Button tone="primary" href="/member/discuss">Reply</Button>
            <Button tone="secondary" href={`/member/panels/${latest.id}`}>View full panel</Button>
          </>
        }
      />

      <h2 style={SECTION_TITLE_STYLE}>
        Body systems · from your {formatPanelDate(latest.panel_date)} panel
      </h2>
      <BodySystemsGrid biomarkers={biomarkers} />
    </EditorialColumn>
  );
}
