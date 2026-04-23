import type { Biomarker, PanelWithBiomarkers } from "@/lib/data/types";

// ============================================================================
// Category grouping map for body systems
// ============================================================================

export const CATEGORY_MAP: Record<string, string> = {
  HbA1c: "Blood sugar",
  "fP-Glukos": "Blood sugar",
  "f-Glucose": "Blood sugar",
  Kolesterol: "Cholesterol",
  LDL: "Cholesterol",
  HDL: "Cholesterol",
  Triglycerider: "Cholesterol",
  TSH: "Thyroid",
  fT4: "Thyroid",
  fT3: "Thyroid",
  ALAT: "Liver",
  ASAT: "Liver",
  GGT: "Liver",
  ALP: "Liver",
  Bilirubin: "Liver",
  Kreatinin: "Kidney",
  eGFR: "Kidney",
  Hb: "Iron / blood",
  Ferritin: "Iron / blood",
  Jarn: "Iron / blood",
  B12: "Iron / blood",
  Folat: "Iron / blood",
  CRP: "Inflammation",
  SR: "Inflammation",
  Leukocyter: "Inflammation",
  Testosteron: "Hormones",
  SHBG: "Hormones",
  "IGF-1": "Hormones",
  Kortisol: "Hormones",
  PSA: "Hormones",
  "D-vitamin": "Vitamins",
  "25-OH-Vitamin-D": "Vitamins",
};

export const ALL_SYSTEMS = [
  "Blood sugar",
  "Cholesterol",
  "Thyroid",
  "Liver",
  "Kidney",
  "Iron / blood",
  "Inflammation",
  "Hormones",
  "Vitamins",
  "Minerals",
];

export function getCategoryForMarker(shortName: string): string {
  // Direct match first
  if (CATEGORY_MAP[shortName]) return CATEGORY_MAP[shortName];

  // Strip Swedish specimen prefixes (P-, fP-, S-, B-, Pt-, Erc(B)-) and try again
  const stripped = shortName
    .replace(/^(fP-|Erc\(B\)-|Pt-|P-|S-|B-|U-)/, "")
    .trim();
  if (CATEGORY_MAP[stripped]) return CATEGORY_MAP[stripped];

  // Lowercase fuzzy matching for common variants
  const lower = stripped.toLowerCase();
  const FUZZY: Record<string, string> = {
    "alat": "Liver",
    "asat": "Liver",
    "ggt": "Liver",
    "alp": "Liver",
    "bilirubin": "Liver",
    "kolesterol": "Cholesterol",
    "ldl-kolesterol": "Cholesterol",
    "hdl-kolesterol": "Cholesterol",
    "triglycerid": "Cholesterol",
    "triglycerider": "Cholesterol",
    "apolipoprotein a1": "Cholesterol",
    "apolipoprotein b": "Cholesterol",
    "apo b/apo a1": "Cholesterol",
    "glukos": "Blood sugar",
    "hba1c": "Blood sugar",
    "tsh": "Thyroid",
    "t4, fritt": "Thyroid",
    "t3, fritt": "Thyroid",
    "ft4": "Thyroid",
    "ft3": "Thyroid",
    "kreatinin": "Kidney",
    "egfr": "Kidney",
    "cystatin": "Kidney",
    "hemoglobin": "Iron / blood",
    "ferritin": "Iron / blood",
    "järn": "Iron / blood",
    "jarn": "Iron / blood",
    "kobalamin": "Iron / blood",
    "b12": "Iron / blood",
    "folat": "Iron / blood",
    "erytrocyter": "Iron / blood",
    "evf": "Iron / blood",
    "mch": "Iron / blood",
    "mcv": "Iron / blood",
    "leukocyter": "Iron / blood",
    "trombocyter": "Iron / blood",
    "crp": "Inflammation",
    "sr": "Inflammation",
    "testosteron": "Hormones",
    "shbg": "Hormones",
    "igf-1": "Hormones",
    "kortisol": "Hormones",
    "psa": "Hormones",
    "25-oh vitamin d": "Vitamins",
    "d-vitamin": "Vitamins",
    "vitamin d": "Vitamins",
    "natrium": "Minerals",
    "kalium": "Minerals",
    "kalcium": "Minerals",
    "calcium": "Minerals",
    "magnesium": "Minerals",
    "urat": "Minerals",
    "homocystein": "Other",
  };

  if (FUZZY[lower]) return FUZZY[lower];
  return "Other";
}

export function groupBiomarkersBySystem(
  biomarkers: Biomarker[]
): { name: string; count: number; flagged: boolean }[] {
  const systemCounts: Record<string, { total: number; flagged: number }> = {};

  for (const b of biomarkers) {
    const sys = getCategoryForMarker(b.short_name);
    if (!systemCounts[sys]) systemCounts[sys] = { total: 0, flagged: 0 };
    systemCounts[sys].total++;
    if (b.status !== "normal") systemCounts[sys].flagged++;
  }

  return ALL_SYSTEMS.map((name) => ({
    name,
    count: systemCounts[name]?.total || 0,
    flagged: (systemCounts[name]?.flagged || 0) > 0,
  })).filter((s) => s.count > 0);
}

export function getFlaggedMarkers(biomarkers: Biomarker[]): Biomarker[] {
  return biomarkers.filter((b) => b.status !== "normal");
}

export function getKeyMarker(markers: Biomarker[]): Biomarker | null {
  // Return the "most interesting" marker: flagged first, then the one closest to range edge
  const flagged = markers.filter((m) => m.status !== "normal");
  if (flagged.length > 0) return flagged[0];
  if (markers.length === 0) return null;
  // Pick the marker closest to its range boundary
  let closest = markers[0];
  let closestDist = Infinity;
  for (const m of markers) {
    if (m.ref_range_low != null && m.ref_range_high != null) {
      const range = m.ref_range_high - m.ref_range_low;
      if (range > 0) {
        const distLow = Math.abs(m.value - m.ref_range_low) / range;
        const distHigh = Math.abs(m.value - m.ref_range_high) / range;
        const dist = Math.min(distLow, distHigh);
        if (dist < closestDist) { closestDist = dist; closest = m; }
      }
    }
  }
  return closest;
}

export function formatPanelDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function getPanelYearRange(panels: PanelWithBiomarkers[]): string {
  if (panels.length === 0) return "";
  const sorted = [...panels].sort(
    (a, b) =>
      new Date(a.panel_date).getTime() - new Date(b.panel_date).getTime()
  );
  const first = new Date(sorted[0].panel_date).getFullYear();
  const last = new Date(sorted[sorted.length - 1].panel_date).getFullYear();
  return first === last ? `${first}` : `${first} - ${last}`;
}

export function shortPanelLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const mon = d
    .toLocaleDateString("en-GB", { month: "short" })
    .slice(0, 3);
  const yr = String(d.getFullYear()).slice(2);
  return `${mon} ${yr}`;
}
