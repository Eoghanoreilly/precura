// Plain-English explanations for common Swedish biomarkers.
// Keyed by short_name (prefix-stripped). Each entry returns a structured
// explanation with context about the user's specific value.

export type Status = "normal" | "low" | "high" | "critical";

export interface ExplainArgs {
  value: number;
  refLow: number;
  refHigh: number;
  unit: string;
  status: Status;
}

export interface MarkerExplanation {
  what: string;
  why: (args: ExplainArgs) => string;
}

const MARKER_EXPLANATIONS: Record<string, MarkerExplanation> = {
  HbA1c: {
    what:
      "HbA1c reflects your average blood sugar over the past 2-3 months. It is the single most useful marker for tracking diabetes risk.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mmol/mol you are well within range. Below 42 is non-diabetic, 42-47 is pre-diabetic, 48 or more is diabetic.`;
      if (status === "high")
        return `At ${value} mmol/mol you are in the pre-diabetic or diabetic zone. Worth a conversation with your doctor.`;
      return `At ${value} mmol/mol this is lower than typical. Not usually concerning on its own but worth reviewing alongside your glucose.`;
    },
  },
  Glukos: {
    what:
      "Fasting glucose is your blood sugar level first thing in the morning. A single reading is less reliable than HbA1c but useful alongside it.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mmol/L you are within normal fasting range (under 6.0). 6.1-6.9 is impaired fasting glucose. 7.0 or more suggests diabetes.`;
      if (status === "high")
        return `At ${value} mmol/L you are above the normal range. A one-off reading is not a diagnosis. Retest after a clean fast.`;
      return `At ${value} mmol/L you are below the normal range. Usually benign, but worth noting if you had low energy or lightheadedness that morning.`;
    },
  },
  LDL: {
    what:
      "LDL is the 'bad' cholesterol. Higher levels over time can build plaque in your arteries and raise your cardiovascular risk.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mmol/L you are within range. The target depends on your overall cardiovascular risk. Most adults aim for under 3.0 mmol/L.`;
      if (status === "high")
        return `At ${value} mmol/L you are above range. Diet, activity, and sometimes medication all move this marker. Worth a conversation with your doctor.`;
      return `At ${value} mmol/L your LDL is low. Rarely concerning on its own.`;
    },
  },
  HDL: {
    what:
      "HDL is the 'good' cholesterol. Higher values are protective against cardiovascular disease.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mmol/L you are in a protective range. Higher is generally better. Regular aerobic exercise raises HDL.`;
      if (status === "low")
        return `At ${value} mmol/L your HDL is lower than typical. Aerobic exercise and reducing refined carbs often help.`;
      return `At ${value} mmol/L your HDL is high, which is protective.`;
    },
  },
  Kolesterol: {
    what:
      "Total cholesterol is the combined total of LDL, HDL, and other lipids. It is a coarse marker - the breakdown matters more than the total.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mmol/L your total cholesterol is within range. Look at LDL and HDL separately for a fuller picture.`;
      return `At ${value} mmol/L your total cholesterol is outside the typical range. The LDL and HDL components matter more than this single number.`;
    },
  },
  Triglycerid: {
    what:
      "Triglycerides are fats in your blood. High levels are linked to cardiovascular risk and metabolic syndrome.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mmol/L your triglycerides are within range.`;
      if (status === "high")
        return `At ${value} mmol/L your triglycerides are elevated. Often responds well to reducing refined carbs and alcohol.`;
      return `At ${value} mmol/L your triglycerides are low, which is typically fine.`;
    },
  },
  TSH: {
    what:
      "TSH is the signal your brain sends your thyroid. It moves in the opposite direction of your thyroid hormones, which makes it a sensitive early marker.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mIU/L your thyroid signalling is within range.`;
      if (status === "high")
        return `At ${value} mIU/L your TSH is elevated, which can suggest an underactive thyroid. Free T4 and T3 give the fuller picture.`;
      return `At ${value} mIU/L your TSH is lower than typical, which can suggest an overactive thyroid or other causes. Worth discussing.`;
    },
  },
  ALAT: {
    what:
      "ALAT (also called ALT) is a liver enzyme. Elevations suggest the liver is under some stress - fatty liver, alcohol, medications, or other causes.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} your liver enzymes look fine.`;
      return `At ${value} this is above range. Commonly caused by fatty liver, alcohol, recent heavy exercise, or certain medications. Worth a follow-up.`;
    },
  },
  ASAT: {
    what:
      "ASAT (also called AST) is another liver enzyme. It lives in the liver and in muscle, so heavy training can push it up too.",
    why: ({ value, status }) => {
      if (status === "normal") return `At ${value} your ASAT is within range.`;
      return `At ${value} this is above range. Heavy exercise in the 48 hours before the draw is a common cause. If ALAT is also elevated, that points at the liver.`;
    },
  },
  Hemoglobin: {
    what:
      "Hemoglobin is the protein in your red blood cells that carries oxygen. Low values can indicate anemia, high values can indicate dehydration or other conditions.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} your oxygen-carrying capacity is within range.`;
      if (status === "low")
        return `At ${value} your hemoglobin is low. Check ferritin alongside - iron deficiency is the most common cause.`;
      return `At ${value} your hemoglobin is above range. Hydration status and altitude can move this.`;
    },
  },
  Kreatinin: {
    what:
      "Kreatinin is a waste product your kidneys clear. Elevations suggest reduced kidney function. Muscle mass also moves this.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} your kidney clearance looks fine.`;
      if (status === "high")
        return `At ${value} this is above range. The eGFR calculation from this plus age and sex gives a clearer kidney function picture.`;
      return `At ${value} your kreatinin is below the typical range. Not usually concerning.`;
    },
  },
  Ferritin: {
    what:
      "Ferritin is how your body stores iron. It is usually the first marker to drop when iron is becoming depleted.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mcg/L your iron stores look fine.`;
      if (status === "low")
        return `At ${value} mcg/L your iron stores are low. Dietary or supplement correction usually addresses this in a few months.`;
      return `At ${value} mcg/L your ferritin is above range. Can be driven by inflammation or, rarely, iron overload. Worth investigating.`;
    },
  },
  CRP: {
    what:
      "CRP (C-reactive protein) is a marker of inflammation in your body. It rises with infections, injuries, and chronic low-grade inflammation.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} mg/L your inflammation level is low.`;
      return `At ${value} mg/L this is elevated. A mild elevation can just be a recent cold or exercise. Persistent elevation is worth investigating.`;
    },
  },
  Testosteron: {
    what:
      "Testosterone is the primary androgen in men and is relevant to energy, body composition, libido, and mood. Reference ranges depend on age and sex.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} nmol/L you are within typical adult male range (usually 10-30).`;
      if (status === "low")
        return `At ${value} nmol/L this is on the low end. Sleep, training, body composition, and stress all move this marker. If persistent, worth discussing.`;
      return `At ${value} nmol/L this is above range. Supplementation and certain conditions can elevate this.`;
    },
  },
  "25-OH Vitamin D": {
    what:
      "25-hydroxyvitamin D is the main circulating form of vitamin D. It reflects both sun exposure and diet or supplementation over the last ~2 months.",
    why: ({ value, status }) => {
      if (status === "normal")
        return `At ${value} nmol/L you are in a healthy range. Above 50 is usually the target, ideally 75+.`;
      if (status === "low")
        return `At ${value} nmol/L your vitamin D is below target. In the Swedish winter this is common. 1000-2000 IU daily usually moves this back within 2-3 months.`;
      return `At ${value} nmol/L your vitamin D is high but generally not concerning unless far above range.`;
    },
  },
};

const GENERIC_EXPLANATION: MarkerExplanation = {
  what:
    "This marker is part of a standard blood panel. Every marker has a reference range, which is the typical range for a healthy adult population.",
  why: ({ value, refLow, refHigh, unit, status }) => {
    if (status === "normal") {
      return `At ${value} ${unit} your value sits inside the reference range (${refLow} - ${refHigh}). No action needed on this one.`;
    }
    const direction = status === "high" ? "above" : status === "low" ? "below" : "outside";
    return `At ${value} ${unit} your value is ${direction} the reference range (${refLow} - ${refHigh} ${unit}). A single out-of-range marker is not a diagnosis. If your doctor's review has not landed yet, they will flag anything worth discussing.`;
  },
};

export function getMarkerExplanation(shortName: string): MarkerExplanation {
  // Strip known Swedish prefixes before lookup
  const stripped = shortName.replace(/^(P-|S-|fP-|B-|Hb-)/, "");
  return MARKER_EXPLANATIONS[stripped] ?? MARKER_EXPLANATIONS[shortName] ?? GENERIC_EXPLANATION;
}
