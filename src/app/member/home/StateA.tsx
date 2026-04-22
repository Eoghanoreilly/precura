"use client";

import React from "react";
import { EditorialColumn, Hero } from "@/components/layout";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
} from "@/lib/data/types";

export interface StateAProps {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  userName: string;
  // Optional props carried through the router for Task 14 to wire up.
  markerHistories?: Record<string, MarkerHistory[]>;
  systems?: { name: string; count: number; flagged: boolean }[];
  latestDoctorAnnotation?: Annotation | null;
}

export function StateA(_props: StateAProps) {
  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        display="State A (stub)"
        body={<p>State A will be implemented in Task 14.</p>}
      />
    </EditorialColumn>
  );
}
