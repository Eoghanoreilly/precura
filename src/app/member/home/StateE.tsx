"use client";

import React from "react";
import { EditorialColumn, Hero } from "@/components/layout";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
} from "@/lib/data/types";

export interface StateEProps {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  userName: string;
  // Optional props carried through the router for Task 18 to wire up.
  markerHistories?: Record<string, MarkerHistory[]>;
  systems?: { name: string; count: number; flagged: boolean }[];
  latestDoctorAnnotation?: Annotation | null;
}

export function StateE(_props: StateEProps) {
  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        display="State E (stub)"
        body={<p>State E will be implemented in Task 18.</p>}
      />
    </EditorialColumn>
  );
}
