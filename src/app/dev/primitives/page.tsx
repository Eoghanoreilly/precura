"use client";

import React from "react";
import {
  PageShell,
  SideRail,
  Wordmark,
  IdentityCard,
  NextPanelHint,
  RailNav,
  EditorialColumn,
  Hero,
  Button,
  SubGrid,
  NarrativeCard,
  SystemTile,
  ActionList,
} from "@/components/layout";

export default function PrimitivesDevPage() {
  const sampleMarker = {
    shortName: "HbA1c",
    value: 35,
    unit: "mmol/mol",
    refLow: 20,
    refHigh: 42,
    status: "normal" as const,
    plainName: "long-term blood sugar",
  };
  const markerHigh = { ...sampleMarker, shortName: "LDL", value: 3.8, unit: "mmol/L", refLow: 1.2, refHigh: 3.0, status: "high" as const, plainName: "bad cholesterol" };
  const markerTsh  = { ...sampleMarker, shortName: "TSH",  value: 1.8, unit: "mIU/L",    refLow: 0.4, refHigh: 4.0, plainName: "thyroid activity" };
  const markerCrp  = { ...sampleMarker, shortName: "CRP",  value: 1.1, unit: "mg/L",     refLow: 0.0, refHigh: 5.0, plainName: "inflammation" };

  const sideRail = (
    <SideRail
      logo={<Wordmark href="/dev/primitives" />}
      sections={[
        <IdentityCard
          key="id"
          user={{ name: "Eoghan O'Reilly", initials: "EO", memberSince: "Member since Jan 2026" }}
          doctor={{ name: "Dr. Tomas Kurakovas", initials: "TK", title: "Your licensed doctor" }}
        />,
        <NextPanelHint key="np" eyebrow="Next panel" headline="26 July 2026" subtext="Kit ships 19 July" />,
        <RailNav
          key="nav"
          activeHref="/dev/primitives"
          items={[
            { label: "Primitives", href: "/dev/primitives" },
            { label: "Home", href: "/member" },
            { label: "Panels", href: "/member/panels" },
          ]}
        />,
      ]}
    />
  );

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "var(--text-title)",
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    margin: "var(--sp-8) 0 var(--sp-4)",
    fontWeight: 600,
  };

  return (
    <PageShell sideRail={sideRail} userInitials="EO" activeHref="/dev/primitives">
      <EditorialColumn>
        <Hero
          tone="warm"
          eyebrow={<em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>Dev kitchen sink</em>}
          display="Layout primitives at every viewport."
          body={<p>Resize the window to 390, 900, 1024, 1280, 1440, and 1920. Hero type clamps, SubGrid collapses on container width, the rail appears at 1024.</p>}
          ctas={
            <>
              <Button tone="primary">Primary</Button>
              <Button tone="secondary">Secondary</Button>
              <Button tone="sage">Sage</Button>
            </>
          }
        />

        <h2 style={{ ...sectionTitleStyle, marginTop: 0 }}>Quiet hero</h2>
        <Hero
          tone="quiet"
          display="This one uses the quiet tone."
          body={<p>Used for Home states B, D, E where the page shouldn&apos;t scream.</p>}
        />

        <h2 style={sectionTitleStyle}>SubGrid columns=2</h2>
        <SubGrid columns={2}>
          <SystemTile system="Metabolic" marker={sampleMarker} />
          <SystemTile system="Lipid" marker={markerHigh} />
        </SubGrid>

        <h2 style={sectionTitleStyle}>SubGrid columns=3</h2>
        <SubGrid columns={3}>
          <SystemTile system="Metabolic" marker={sampleMarker} />
          <SystemTile system="Lipid" marker={markerHigh} />
          <SystemTile system="Thyroid" marker={markerTsh} />
        </SubGrid>

        <h2 style={sectionTitleStyle}>SubGrid columns=4</h2>
        <SubGrid columns={4}>
          <SystemTile system="Metabolic" marker={sampleMarker} />
          <SystemTile system="Lipid" marker={markerHigh} />
          <SystemTile system="Thyroid" marker={markerTsh} />
          <SystemTile system="Inflammation" marker={markerCrp} />
        </SubGrid>

        <h2 style={sectionTitleStyle}>NarrativeCard + ActionList (2-up)</h2>
        <SubGrid columns={2}>
          <NarrativeCard title="What changed since last panel">
            <p>LDL came down from 3.8 to 3.4 mmol/L. Direction is right.</p>
            <p>HbA1c unchanged at 35. Excellent for your age bracket.</p>
          </NarrativeCard>
          <ActionList
            title="Next steps"
            items={[
              { label: "Keep walking 3x weekly" },
              { label: "Order July blood panel" },
              { label: "Discuss LDL with Dr. Tomas", checked: true },
            ]}
          />
        </SubGrid>
      </EditorialColumn>
    </PageShell>
  );
}
