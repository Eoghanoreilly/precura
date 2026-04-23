"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getPanels, getMarkerHistory } from "@/lib/data/panels";
import { getAllAnnotations } from "@/lib/data/annotations";
import type {
  Annotation,
  MarkerHistory,
  PanelWithBiomarkers,
  Profile,
} from "@/lib/data/types";

// ============================================================================
// useHomeData - fetches the user, panels, annotations, and per-marker history
// series that the adaptive home page routes on. Kept identical to the legacy
// AdaptiveHomeView effect so state detection remains byte-for-byte equivalent.
// ============================================================================

export interface HomeData {
  user: Profile | null;
  panels: PanelWithBiomarkers[];
  annotations: Annotation[];
  markerHistories: Record<string, MarkerHistory[]>;
  loading: boolean;
}

export function useHomeData(): HomeData {
  const [user, setUser] = useState<Profile | null>(null);
  const [panels, setPanels] = useState<PanelWithBiomarkers[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [markerHistories, setMarkerHistories] = useState<
    Record<string, MarkerHistory[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) {
        setLoading(false);
        return;
      }
      setUser(u);

      const [p, a] = await Promise.all([getPanels(u.id), getAllAnnotations()]);
      setPanels(p);
      setAnnotations(a);

      if (p.length > 0) {
        const uniqueMarkers = new Set<string>();
        for (const panel of p) {
          for (const b of panel.biomarkers) uniqueMarkers.add(b.short_name);
        }
        const histories: Record<string, MarkerHistory[]> = {};
        await Promise.all(
          Array.from(uniqueMarkers).map(async (shortName) => {
            histories[shortName] = await getMarkerHistory(u.id, shortName);
          })
        );
        setMarkerHistories(histories);
      }

      setLoading(false);
    }
    load();
  }, []);

  return { user, panels, annotations, markerHistories, loading };
}
