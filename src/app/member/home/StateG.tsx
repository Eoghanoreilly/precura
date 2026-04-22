"use client";

import React from "react";
import { EditorialColumn, Hero } from "@/components/layout";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
} from "@/lib/data/types";

export interface StateGProps {
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  userName: string;
  // Optional props carried through the router for Task 20 to wire up.
  markerHistories?: Record<string, MarkerHistory[]>;
  systems?: { name: string; count: number; flagged: boolean }[];
  latestDoctorAnnotation?: Annotation | null;
}

export function StateG(_props: StateGProps) {
  return (
    <EditorialColumn>
      <Hero
        tone="warm"
        display="State G (stub)"
        body={<p>State G will be implemented in Task 20.</p>}
      />
    </EditorialColumn>
  );
}
