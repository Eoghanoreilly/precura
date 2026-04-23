"use client";

import React from "react";
import {
  EditorialColumn,
  Hero,
  Button,
  SubGrid,
  NarrativeCard,
  ActionList,
} from "@/components/layout";
import type { PanelWithBiomarkers, Annotation } from "@/lib/data/types";
import { BodySystemsGrid } from "./blocks/BodySystemsGrid";
import { daysAgo, formatPanelDate } from "./categoryMap";
import { DOCTOR } from "@/components/member/tokens";

export interface StateCProps {
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

export function StateC({ panels, annotations }: StateCProps) {
  const latest = panels[0];
  if (!latest) return null;
  const biomarkers = latest.biomarkers ?? [];

  // Find the most recent doctor annotation on this panel
  const doctorNote = annotations
    .filter((a) => isDoctor(a) && annotationTargetsPanel(a, latest.id))
    .sort(byNewest)[0];

  if (!doctorNote) return null;

  const noteBody = doctorNote.body ?? "";
  const [firstLine, ...rest] = String(noteBody).split("\n");
  const bodyParagraphs = rest.filter((p) => p.trim().length > 0);

  const noteAge = daysAgo(doctorNote.created_at);
  const ageStr = noteAge === 0 ? "today" : noteAge === 1 ? "yesterday" : `${noteAge} days ago`;

  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        eyebrow={
          <>
            <span
              aria-hidden="true"
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--sage), var(--sage-deep))",
                color: "var(--canvas-soft)",
                fontSize: 10,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {DOCTOR.initials}
            </span>
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

      <section style={{ marginBottom: "var(--sp-8)" }}>
        <h2 style={SECTION_TITLE_STYLE}>
          Body systems · from your {formatPanelDate(latest.panel_date)} panel
        </h2>
        <BodySystemsGrid biomarkers={biomarkers} />
      </section>

      <SubGrid columns={2}>
        <NarrativeCard title="What changed since last panel">
          <p>Check the full panel page for marker-by-marker detail.</p>
        </NarrativeCard>
        <ActionList
          title="Next steps"
          items={[
            { label: "Reply to your doctor", href: "/member/discuss" },
            { label: "Book your next panel", href: "/member/panels/new" },
          ]}
        />
      </SubGrid>
    </EditorialColumn>
  );
}

// --- helpers -----------------------------------------------------------------

function isDoctor(a: Annotation): boolean {
  return a.author?.role === "doctor";
}

function annotationTargetsPanel(a: Annotation, panelId: string): boolean {
  return a.target_type === "panel" && a.target_id === panelId;
}

function byNewest(a: Annotation, b: Annotation): number {
  const ta = new Date(a.created_at).getTime();
  const tb = new Date(b.created_at).getTime();
  return tb - ta;
}
