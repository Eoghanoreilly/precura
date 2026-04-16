import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic();

interface ParsedMarker {
  short_name: string;
  name_eng: string;
  plain_name: string;
  value: number;
  unit: string;
  ref_range_low: number | null;
  ref_range_high: number | null;
}

interface ParseResult {
  panel_date: string | null;
  lab_name: string | null;
  markers: ParsedMarker[];
  raw_markers_found: number;
  successfully_parsed: number;
  warnings: string[];
}

// Common Swedish blood test markers with their expected units and standard reference ranges.
// Used as a fallback when the model fails to extract unit or ref ranges from the report.
const SWEDISH_MARKER_DEFAULTS: Record<
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
};

/**
 * Look up default unit and reference ranges for a marker short_name.
 * Tries exact lowercase match, then strips common prefixes (P-, fP-, B-, S-).
 */
function lookupMarkerDefaults(shortName: string) {
  const key = shortName.toLowerCase().trim();
  if (SWEDISH_MARKER_DEFAULTS[key]) return SWEDISH_MARKER_DEFAULTS[key];

  // Strip Swedish specimen prefixes and try again
  const stripped = key.replace(/^(fp-|f-p-|p-|b-|s-|u-)/, "");
  if (SWEDISH_MARKER_DEFAULTS[stripped]) return SWEDISH_MARKER_DEFAULTS[stripped];

  return null;
}

export async function POST(req: Request) {
  let body: { text: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.text || body.text.trim().length < 10) {
    return Response.json({ error: "Paste at least a few lines of blood test data." }, { status: 400 });
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: `You extract structured blood test data from raw text. The text may be in Swedish or English, pasted from a lab report, PDF, email, or screenshot OCR.

Return ONLY valid JSON matching this schema, no other text:
{
  "panel_date": "YYYY-MM-DD" or null,
  "lab_name": "string" or null,
  "markers": [
    {
      "short_name": "Swedish abbreviation e.g. fP-Glukos, HbA1c, Kolesterol, LDL, HDL, TSH, P-PSA",
      "name_eng": "English name e.g. Fasting glucose",
      "plain_name": "plain English e.g. blood sugar",
      "value": number,
      "unit": "string e.g. mmol/L",
      "ref_range_low": number or null,
      "ref_range_high": number or null
    }
  ]
}

CRITICAL RULES - follow every one:
- Extract every biomarker you can find that has a numeric value.
- SKIP any marker where you cannot determine a numeric value. Do not include it.
- "value" and "unit" are REQUIRED for every marker. Never leave unit as "" or null.
- If the unit is not explicitly written next to the value, infer it from the marker name using standard Swedish lab conventions (e.g. P-PSA is always ug/L, HbA1c is mmol/mol, Hb is g/L, CRP is mg/L, TSH is mIE/L, Kreatinin is umol/L, Kolesterol/LDL/HDL is mmol/L, ALAT/ASAT is ukat/L).
- Use standard Swedish short names where possible (fP-Glukos not Glucose, Kolesterol not Cholesterol).
- If the reference range is given as e.g. "4.0-6.0", split into ref_range_low and ref_range_high.
- If the reference range is given as e.g. "<5.0", set ref_range_low to null and ref_range_high to 5.0.
- If the reference range is given as e.g. ">60", set ref_range_low to 60 and ref_range_high to null.
- If no reference range is explicitly shown, try to use standard Swedish reference ranges for common markers. For example: P-PSA ref_range_high 3.0, HbA1c ref_range 27-42, fP-Glukos ref_range 4.0-6.0, Kolesterol ref_range_high 5.0, TSH ref_range 0.4-4.0, Hb ref_range 120-160, CRP ref_range_high 5.0, Kreatinin ref_range 45-105.
- If you truly cannot determine the reference range, set both to null. But try hard first.
- Parse the date from any format (Swedish, ISO, informal).
- Extract the lab name if mentioned (Synlab, Unilabs, Karolinska, Werlabs, etc.).
- Return valid JSON only. No markdown fences, no explanation.`,
      messages: [
        { role: "user", content: body.text },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Strip markdown fences if the model wrapped it anyway
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const raw: { panel_date?: string | null; lab_name?: string | null; markers?: unknown[] } =
      JSON.parse(cleaned);

    const rawMarkers = Array.isArray(raw.markers) ? raw.markers : [];
    const rawMarkersFound = rawMarkers.length;
    const warnings: string[] = [];
    const validMarkers: ParsedMarker[] = [];

    for (const m of rawMarkers) {
      // Type guard - must be an object with at least short_name and value
      if (typeof m !== "object" || m === null) continue;
      const marker = m as Record<string, unknown>;

      const shortName = typeof marker.short_name === "string" ? marker.short_name.trim() : "";
      const nameEng = typeof marker.name_eng === "string" ? marker.name_eng.trim() : "";
      const plainName = typeof marker.plain_name === "string" ? marker.plain_name.trim() : "";

      // short_name is required
      if (!shortName) {
        warnings.push("Skipped a marker with no short_name");
        continue;
      }

      // value must be a valid number
      const rawValue = Number(marker.value);
      if (isNaN(rawValue) || !isFinite(rawValue)) {
        warnings.push(`${shortName}: skipped, no valid numeric value`);
        continue;
      }

      // Unit: use model output, fall back to lookup table
      let unit = typeof marker.unit === "string" ? marker.unit.trim() : "";
      const defaults = lookupMarkerDefaults(shortName);

      if (!unit && defaults) {
        unit = defaults.unit;
        warnings.push(`${shortName}: unit was missing, filled from lookup table (${unit})`);
      }

      // If unit is still empty after lookup, skip - the DB requires NOT NULL
      if (!unit) {
        warnings.push(`${shortName}: skipped, could not determine unit`);
        continue;
      }

      // Reference ranges: use model output, fall back to lookup table
      let refLow: number | null =
        typeof marker.ref_range_low === "number" && isFinite(marker.ref_range_low)
          ? marker.ref_range_low
          : null;
      let refHigh: number | null =
        typeof marker.ref_range_high === "number" && isFinite(marker.ref_range_high)
          ? marker.ref_range_high
          : null;

      if (refLow === null && refHigh === null && defaults) {
        refLow = defaults.ref_low;
        refHigh = defaults.ref_high;
        if (refLow !== null || refHigh !== null) {
          warnings.push(
            `${shortName}: reference range was missing, filled from Swedish standard defaults`
          );
        }
      }

      validMarkers.push({
        short_name: shortName,
        name_eng: nameEng || shortName,
        plain_name: plainName || nameEng || shortName,
        value: rawValue,
        unit,
        ref_range_low: refLow,
        ref_range_high: refHigh,
      });
    }

    const result: ParseResult = {
      panel_date: typeof raw.panel_date === "string" ? raw.panel_date : null,
      lab_name: typeof raw.lab_name === "string" ? raw.lab_name : null,
      markers: validMarkers,
      raw_markers_found: rawMarkersFound,
      successfully_parsed: validMarkers.length,
      warnings,
    };

    return Response.json(result);
  } catch (err) {
    console.error("[api/parse-panel] error", err);
    return Response.json(
      { error: "Failed to parse the report. Try pasting a cleaner version or enter markers manually." },
      { status: 500 }
    );
  }
}
