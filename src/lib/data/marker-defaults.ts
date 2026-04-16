// Common Swedish blood test markers with their expected units and standard reference ranges.
// Used as a fallback when the model fails to extract unit or ref ranges from the report,
// and as a last-resort gap-filler before database insert in createPanel().
export const SWEDISH_MARKER_DEFAULTS: Record<
  string,
  { unit: string; ref_low: number | null; ref_high: number | null }
> = {
  "fp-glukos":       { unit: "mmol/L",   ref_low: 4.0,  ref_high: 6.0 },
  "p-glukos":        { unit: "mmol/L",   ref_low: 4.0,  ref_high: 6.0 },
  "hba1c":           { unit: "mmol/mol", ref_low: 27,   ref_high: 42 },
  "kolesterol":      { unit: "mmol/L",   ref_low: null,  ref_high: 5.0 },
  "ldl":             { unit: "mmol/L",   ref_low: null,  ref_high: 3.0 },
  "hdl":             { unit: "mmol/L",   ref_low: 1.0,  ref_high: 2.3 },
  "triglycerider":   { unit: "mmol/L",   ref_low: null,  ref_high: 1.7 },
  "tsh":             { unit: "mIE/L",    ref_low: 0.4,  ref_high: 4.0 },
  "ft4":             { unit: "pmol/L",   ref_low: 12,   ref_high: 22 },
  "ft3":             { unit: "pmol/L",   ref_low: 3.1,  ref_high: 6.8 },
  "p-psa":           { unit: "ug/L",     ref_low: null,  ref_high: 3.0 },
  "psa":             { unit: "ug/L",     ref_low: null,  ref_high: 3.0 },
  "hb":              { unit: "g/L",      ref_low: 120,  ref_high: 160 },
  "hemoglobin":      { unit: "g/L",      ref_low: 120,  ref_high: 160 },
  "ferritin":        { unit: "ug/L",     ref_low: 20,   ref_high: 300 },
  "p-ferritin":      { unit: "ug/L",     ref_low: 20,   ref_high: 300 },
  "jarn":            { unit: "umol/L",   ref_low: 9,    ref_high: 34 },
  "p-jarn":          { unit: "umol/L",   ref_low: 9,    ref_high: 34 },
  "b12":             { unit: "pmol/L",   ref_low: 150,  ref_high: 650 },
  "p-kobalamin":     { unit: "pmol/L",   ref_low: 150,  ref_high: 650 },
  "folat":           { unit: "nmol/L",   ref_low: 7,    ref_high: 45 },
  "p-folat":         { unit: "nmol/L",   ref_low: 7,    ref_high: 45 },
  "kreatinin":       { unit: "umol/L",   ref_low: 45,   ref_high: 105 },
  "p-kreatinin":     { unit: "umol/L",   ref_low: 45,   ref_high: 105 },
  "egfr":            { unit: "mL/min",   ref_low: 60,   ref_high: null },
  "alat":            { unit: "ukat/L",   ref_low: null,  ref_high: 0.76 },
  "asat":            { unit: "ukat/L",   ref_low: null,  ref_high: 0.76 },
  "ggt":             { unit: "ukat/L",   ref_low: null,  ref_high: 1.3 },
  "alp":             { unit: "ukat/L",   ref_low: 0.6,  ref_high: 1.8 },
  "bilirubin":       { unit: "umol/L",   ref_low: null,  ref_high: 26 },
  "p-bilirubin":     { unit: "umol/L",   ref_low: null,  ref_high: 26 },
  "crp":             { unit: "mg/L",     ref_low: null,  ref_high: 5.0 },
  "p-crp":           { unit: "mg/L",     ref_low: null,  ref_high: 5.0 },
  "sr":              { unit: "mm/h",     ref_low: null,  ref_high: 20 },
  "leukocyter":      { unit: "x10^9/L", ref_low: 3.5,  ref_high: 8.8 },
  "b-leukocyter":    { unit: "x10^9/L", ref_low: 3.5,  ref_high: 8.8 },
  "trombocyter":     { unit: "x10^9/L", ref_low: 145,  ref_high: 348 },
  "b-trombocyter":   { unit: "x10^9/L", ref_low: 145,  ref_high: 348 },
  "natrium":         { unit: "mmol/L",   ref_low: 137,  ref_high: 145 },
  "p-natrium":       { unit: "mmol/L",   ref_low: 137,  ref_high: 145 },
  "kalium":          { unit: "mmol/L",   ref_low: 3.5,  ref_high: 5.0 },
  "p-kalium":        { unit: "mmol/L",   ref_low: 3.5,  ref_high: 5.0 },
  "kalcium":         { unit: "mmol/L",   ref_low: 2.15, ref_high: 2.55 },
  "p-kalcium":       { unit: "mmol/L",   ref_low: 2.15, ref_high: 2.55 },
  "d-vitamin":       { unit: "nmol/L",   ref_low: 50,   ref_high: 150 },
  "25-oh-vitamin-d": { unit: "nmol/L",   ref_low: 50,   ref_high: 150 },
  "urat":            { unit: "umol/L",   ref_low: 155,  ref_high: 400 },
  "p-urat":          { unit: "umol/L",   ref_low: 155,  ref_high: 400 },
  "testosteron":     { unit: "nmol/L",   ref_low: 8.0,  ref_high: 29 },
  "p-testosteron":   { unit: "nmol/L",   ref_low: 8.0,  ref_high: 29 },
  "igf-1":           { unit: "ug/L",     ref_low: 80,   ref_high: 340 },
  "shbg":            { unit: "nmol/L",   ref_low: 18,   ref_high: 54 },
  "kortisol":        { unit: "nmol/L",   ref_low: 140,  ref_high: 690 },
  "p-kortisol":      { unit: "nmol/L",   ref_low: 140,  ref_high: 690 },
}

/**
 * Look up default unit and reference ranges for a marker short_name.
 * Tries exact lowercase match, then strips common prefixes (P-, fP-, B-, S-).
 */
export function lookupMarkerDefaults(shortName: string) {
  const key = shortName.toLowerCase().trim()
  if (SWEDISH_MARKER_DEFAULTS[key]) return SWEDISH_MARKER_DEFAULTS[key]

  // Strip Swedish specimen prefixes and try again
  const stripped = key.replace(/^(fp-|f-p-|p-|b-|s-|u-)/, "")
  if (SWEDISH_MARKER_DEFAULTS[stripped]) return SWEDISH_MARKER_DEFAULTS[stripped]

  return null
}
