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
      "short_name": "Swedish abbreviation e.g. fP-Glukos, HbA1c, Kolesterol, LDL, HDL, TSH",
      "name_eng": "English name e.g. Fasting glucose",
      "plain_name": "plain English e.g. blood sugar",
      "value": number,
      "unit": "string e.g. mmol/L",
      "ref_range_low": number or null,
      "ref_range_high": number or null
    }
  ]
}

Rules:
- Extract every biomarker you can find with a numeric value
- Use standard Swedish short names where possible (fP-Glukos not Glucose, Kolesterol not Cholesterol)
- If the reference range is given as e.g. "4.0-6.0", split into ref_range_low: 4.0 and ref_range_high: 6.0
- If no reference range is shown, set both to null
- Parse the date from any format (Swedish, ISO, informal)
- Extract the lab name if mentioned (Synlab, Unilabs, Karolinska, Werlabs, etc.)
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

    const parsed: ParseResult = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (err) {
    console.error("[api/parse-panel] error", err);
    return Response.json(
      { error: "Failed to parse the report. Try pasting a cleaner version or enter markers manually." },
      { status: 500 }
    );
  }
}
