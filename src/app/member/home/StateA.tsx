"use client";

import React from "react";
import { EditorialColumn, Hero, Button } from "@/components/layout";
import type { PanelWithBiomarkers, Annotation } from "@/lib/data/types";

export interface StateAProps {
  panels?: PanelWithBiomarkers[];
  annotations?: Annotation[];
  userName: string;
}

export function StateA({ userName }: StateAProps) {
  const first = userName.split(" ")[0] || userName;

  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        eyebrow={<em style={{ fontFamily: "var(--font-serif)", color: "var(--sage-deep)" }}>Welcome</em>}
        display={`Welcome, ${first}.`}
        body={
          <p>
            Precura makes your blood-panel history readable, tracks what moves over time, and puts your doctor in the loop automatically. Start by adding your first panel. You can enter values manually or paste a lab report and we will pull the values out for you.
          </p>
        }
        ctas={
          <>
            <Button tone="primary" href="/member/panels/new">Upload your first panel</Button>
            <Button tone="secondary" href="/member/discuss">What we track</Button>
          </>
        }
      />
    </EditorialColumn>
  );
}
