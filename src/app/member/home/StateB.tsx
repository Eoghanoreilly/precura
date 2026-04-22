"use client";

import React from "react";
import { EditorialColumn, Hero } from "@/components/layout";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
} from "@/lib/data/types";

export interface StateBProps {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  userName: string;
  // Optional props carried through the router for Task 15 to wire up.
  markerHistories?: Record<string, MarkerHistory[]>;
  systems?: { name: string; count: number; flagged: boolean }[];
  latestDoctorAnnotation?: Annotation | null;
}

export function StateB(_props: StateBProps) {
  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        display="State B (stub)"
        body={<p>State B will be implemented in Task 15.</p>}
      />
    </EditorialColumn>
  );
}
