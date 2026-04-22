import type { Biomarker } from "@/lib/data/types";

// Plain english names for common markers
export const PLAIN_NAMES: Record<string, string> = {
  HbA1c: "long-term blood sugar",
  "fP-Glukos": "fasting blood sugar",
  "f-Glucose": "fasting blood sugar",
  LDL: "bad cholesterol",
  HDL: "good cholesterol",
  Kolesterol: "total cholesterol",
  Triglycerider: "blood fats",
  TSH: "thyroid function",
  fT4: "thyroid hormone",
  fT3: "thyroid hormone",
  ALAT: "liver enzyme",
  ASAT: "liver enzyme",
  GGT: "liver enzyme",
  ALP: "liver enzyme",
  Bilirubin: "bile pigment",
  Kreatinin: "kidney function",
  eGFR: "kidney filtration",
  Hb: "hemoglobin",
  Ferritin: "iron stores",
  Jarn: "iron",
  B12: "vitamin B12",
  Folat: "folate",
  CRP: "inflammation",
  SR: "inflammation rate",
  Leukocyter: "white blood cells",
  Testosteron: "testosterone",
  SHBG: "hormone binding",
  "IGF-1": "growth factor",
  Kortisol: "stress hormone",
  PSA: "prostate marker",
  "D-vitamin": "stored levels",
  "25-OH-Vitamin-D": "stored levels",
};

export function getPlainName(shortName: string, biomarker?: Biomarker): string {
  if (biomarker?.plain_name) return biomarker.plain_name;
  return PLAIN_NAMES[shortName] || "";
}
