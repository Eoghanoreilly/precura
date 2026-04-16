import Anthropic from "@anthropic-ai/sdk";
import { lookupMarkerDefaults } from "@/lib/data/marker-defaults";

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
