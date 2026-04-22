"use client";

import React from "react";
import { EditorialColumn, Hero } from "@/components/layout";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
} from "@/lib/data/types";

export interface StateDProps {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  userName: string;
  // Optional props carried through the router for Task 17 to wire up.
  markerHistories?: Record<string, MarkerHistory[]>;
  systems?: { name: string; count: number; flagged: boolean }[];
  latestDoctorAnnotation?: Annotation | null;
}

export function StateD(_props: StateDProps) {
  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        display="State D (stub)"
        body={<p>State D will be implemented in Task 17.</p>}
      />
    </EditorialColumn>
  );
}
