"use client";

import React from "react";
import { SubGrid, SystemTile } from "@/components/layout";
import type { Biomarker } from "@/lib/data/types";
import type { SystemTileMarker } from "@/components/layout";
import { groupBiomarkersBySystem, getKeyMarker, getCategoryForMarker } from "../categoryMap";
import { getPlainName } from "../plainNames";

// ============================================================================
// BodySystemsGrid - layout-primitive based grid of body-system tiles.
// Uses SubGrid (container-query responsive) + SystemTile from the layout primitives.
// ============================================================================

function mapStatus(
  marker: Biomarker
): SystemTileMarker["status"] {
  if (marker.status === "normal") return "normal";
  // Biomarker.status uses "borderline" | "abnormal". SystemTile expects
  // "low" | "high" | "critical". Translate by comparing value to the ref
  // range so we can show direction (above / below) when known.
  const low = marker.ref_range_low;
  const high = marker.ref_range_high;
  if (marker.status === "abnormal") {
    // Severely out of range is shown as critical when direction is unclear.
    if (high != null && marker.value > high) return "critical";
    if (low != null && marker.value < low) return "critical";
    return "critical";
  }
  // borderline
  if (high != null && marker.value > high) return "high";
  if (low != null && marker.value < low) return "low";
  return "high";
}

export function BodySystemsGrid({ biomarkers }: { biomarkers: Biomarker[] }) {
  const systems = groupBiomarkersBySystem(biomarkers);

  const tiles = systems
    .map((s) => {
      const markers = biomarkers.filter(
        (b) => getCategoryForMarker(b.short_name) === s.name
      );
      const key = getKeyMarker(markers);
      if (!key) return null;
      return (
        <SystemTile
          key={s.name}
          system={s.name}
          marker={{
            shortName: key.short_name,
            value: key.value,
            unit: key.unit,
            refLow: key.ref_range_low ?? 0,
            refHigh: key.ref_range_high ?? 1,
            status: mapStatus(key),
            plainName: getPlainName(key.short_name, key),
          }}
        />
      );
    })
    .filter(Boolean);

  return <SubGrid columns={3}>{tiles}</SubGrid>;
}
