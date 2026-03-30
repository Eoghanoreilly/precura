/**
 * FINDRISC - Finnish Diabetes Risk Score
 * Validated clinical tool for assessing 10-year Type 2 diabetes risk
 * Reference: https://www.mdcalc.com/calc/10075/finnish-diabetes-risk-score-findrisc
 *
 * Score range: 0-26
 * Risk levels:
 *   < 7   : Low (~1% 10-year risk)
 *   7-11  : Slightly elevated (~4%)
 *   12-14 : Moderate (~17%)
 *   15-20 : High (~33%)
 *   > 20  : Very high (~50%)
 */

export interface FindriscInputs {
  age: number;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  sex: "male" | "female";
  physicalActivity: boolean; // true = at least 30 min/day
  dailyFruitVeg: boolean; // true = eats daily
  bloodPressureMeds: boolean;
  highBloodGlucoseHistory: boolean;
  familyDiabetes: "none" | "grandparent_aunt_uncle_cousin" | "parent_sibling_child";
}

export interface FindriscResult {
  score: number;
  riskLevel: "low" | "slightly_elevated" | "moderate" | "high" | "very_high";
  riskLabel: string;
  tenYearRisk: string;
  breakdown: FindriscBreakdown;
}

export interface FindriscBreakdown {
  age: { value: number; points: number; label: string };
  bmi: { value: number; points: number; label: string };
  waist: { value: number; points: number; label: string };
  activity: { value: boolean; points: number; label: string };
  diet: { value: boolean; points: number; label: string };
  bloodPressure: { value: boolean; points: number; label: string };
  glucose: { value: boolean; points: number; label: string };
  family: { value: string; points: number; label: string };
}

function scoreAge(age: number): number {
  if (age < 45) return 0;
  if (age <= 54) return 2;
  if (age <= 64) return 3;
  return 4;
}

function scoreBmi(heightCm: number, weightKg: number): { bmi: number; points: number } {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  if (bmi < 25) return { bmi, points: 0 };
  if (bmi <= 30) return { bmi, points: 1 };
  return { bmi, points: 3 };
}

function scoreWaist(waistCm: number, sex: "male" | "female"): number {
  if (sex === "male") {
    if (waistCm < 94) return 0;
    if (waistCm <= 102) return 3;
    return 4;
  }
  if (waistCm < 80) return 0;
  if (waistCm <= 88) return 3;
  return 4;
}

function scoreActivity(active: boolean): number {
  return active ? 0 : 2;
}

function scoreDiet(dailyFruitVeg: boolean): number {
  return dailyFruitVeg ? 0 : 1;
}

function scoreBloodPressure(onMeds: boolean): number {
  return onMeds ? 2 : 0;
}

function scoreGlucose(history: boolean): number {
  return history ? 5 : 0;
}

function scoreFamily(history: FindriscInputs["familyDiabetes"]): number {
  if (history === "parent_sibling_child") return 5;
  if (history === "grandparent_aunt_uncle_cousin") return 3;
  return 0;
}

export function calculateFindrisc(inputs: FindriscInputs): FindriscResult {
  const bmiResult = scoreBmi(inputs.heightCm, inputs.weightKg);
  const agePoints = scoreAge(inputs.age);
  const waistPoints = scoreWaist(inputs.waistCm, inputs.sex);
  const activityPoints = scoreActivity(inputs.physicalActivity);
  const dietPoints = scoreDiet(inputs.dailyFruitVeg);
  const bpPoints = scoreBloodPressure(inputs.bloodPressureMeds);
  const glucosePoints = scoreGlucose(inputs.highBloodGlucoseHistory);
  const familyPoints = scoreFamily(inputs.familyDiabetes);

  const score =
    agePoints +
    bmiResult.points +
    waistPoints +
    activityPoints +
    dietPoints +
    bpPoints +
    glucosePoints +
    familyPoints;

  const breakdown: FindriscBreakdown = {
    age: { value: inputs.age, points: agePoints, label: "Age" },
    bmi: { value: Math.round(bmiResult.bmi * 10) / 10, points: bmiResult.points, label: "BMI" },
    waist: { value: inputs.waistCm, points: waistPoints, label: "Waist circumference" },
    activity: { value: inputs.physicalActivity, points: activityPoints, label: "Physical activity" },
    diet: { value: inputs.dailyFruitVeg, points: dietPoints, label: "Daily fruit & vegetables" },
    bloodPressure: { value: inputs.bloodPressureMeds, points: bpPoints, label: "Blood pressure medication" },
    glucose: { value: inputs.highBloodGlucoseHistory, points: glucosePoints, label: "High blood glucose history" },
    family: { value: inputs.familyDiabetes, points: familyPoints, label: "Family history of diabetes" },
  };

  let riskLevel: FindriscResult["riskLevel"];
  let riskLabel: string;
  let tenYearRisk: string;

  if (score < 7) {
    riskLevel = "low";
    riskLabel = "Low";
    tenYearRisk = "~1%";
  } else if (score <= 11) {
    riskLevel = "slightly_elevated";
    riskLabel = "Slightly elevated";
    tenYearRisk = "~4%";
  } else if (score <= 14) {
    riskLevel = "moderate";
    riskLabel = "Moderate";
    tenYearRisk = "~17%";
  } else if (score <= 20) {
    riskLevel = "high";
    riskLabel = "High";
    tenYearRisk = "~33%";
  } else {
    riskLevel = "very_high";
    riskLabel = "Very high";
    tenYearRisk = "~50%";
  }

  return { score, riskLevel, riskLabel, tenYearRisk, breakdown };
}

/**
 * Recalculate with modified inputs for "what if" scenarios
 */
export function whatIf(
  current: FindriscInputs,
  overrides: Partial<FindriscInputs>
): FindriscResult {
  return calculateFindrisc({ ...current, ...overrides });
}

export function getRiskColor(level: FindriscResult["riskLevel"]): string {
  switch (level) {
    case "low":
      return "teal";
    case "slightly_elevated":
      return "green";
    case "moderate":
      return "amber";
    case "high":
      return "red";
    case "very_high":
      return "red";
  }
}

export const MAX_SCORE = 26;

/**
 * Plain-language summary for the home screen - no jargon, no numbers
 */
export function getPlainLanguageSummary(result: FindriscResult): {
  headline: string;
  statusPill: string;
  statusColor: string;
  bgGradient: string;
} {
  switch (result.riskLevel) {
    case "low":
      return {
        headline: "Your health outlook looks great. Keep doing what you're doing.",
        statusPill: "Looking good",
        statusColor: "teal",
        bgGradient: "linear-gradient(135deg, #e0f2f1 0%, #f0fdf4 50%, #e8f5e9 100%)",
      };
    case "slightly_elevated":
      return {
        headline: "Your health outlook is positive, with a small area to watch.",
        statusPill: "1 thing to watch",
        statusColor: "green",
        bgGradient: "linear-gradient(135deg, #f0fdf4 0%, #fef7ee 50%, #e8f5e9 100%)",
      };
    case "moderate":
      return {
        headline: "Your health outlook is mostly positive, with a couple of things to keep an eye on.",
        statusPill: "2 things to watch",
        statusColor: "amber",
        bgGradient: "linear-gradient(135deg, #fef7ee 0%, #fff8e1 50%, #f0f4ff 100%)",
      };
    case "high":
      return {
        headline: "You have some areas where small changes could make a big difference. Let's look at what's in your control.",
        statusPill: "Room to improve",
        statusColor: "amber",
        bgGradient: "linear-gradient(135deg, #fff8e1 0%, #fef7ee 50%, #f0f4ff 100%)",
      };
    case "very_high":
      return {
        headline: "We'd recommend chatting with a doctor to make the most of your health data. Here's what we found.",
        statusPill: "Doctor recommended",
        statusColor: "amber",
        bgGradient: "linear-gradient(135deg, #fff8e1 0%, #fef7ee 50%, #f0f4ff 100%)",
      };
  }
}

/**
 * Plain-language risk summary for insight cards - no raw score
 */
export function getRiskSummaryText(result: FindriscResult): string {
  const topFactors = Object.values(result.breakdown)
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 2);

  const factorNames = topFactors.map((f) => {
    switch (f.label) {
      case "Family history of diabetes": return "family history";
      case "Physical activity": return "activity level";
      case "Daily fruit & vegetables": return "diet";
      case "Waist circumference": return "waist measurement";
      case "BMI": return "weight";
      case "Age": return "age";
      case "Blood pressure medication": return "blood pressure history";
      case "High blood glucose history": return "blood sugar history";
      default: return f.label.toLowerCase();
    }
  });

  const comparison =
    result.riskLevel === "low"
      ? "lower than average"
      : result.riskLevel === "slightly_elevated"
        ? "about average"
        : result.riskLevel === "moderate"
          ? "slightly higher than average"
          : "higher than average";

  if (factorNames.length === 0) {
    return `Based on your answers, your diabetes risk is ${comparison}. No major contributing factors were identified.`;
  }

  return `Based on your answers, your diabetes risk is ${comparison}. The main factors are ${factorNames.join(" and ")}.`;
}

/**
 * Actionable advice based on modifiable factors that scored points
 */
export function getModifiableAdvice(breakdown: FindriscBreakdown): string[] {
  const advice: string[] = [];

  if (breakdown.activity.points > 0) {
    advice.push("Adding 30 minutes of daily movement - even walking - can make a real difference");
  }
  if (breakdown.diet.points > 0) {
    advice.push("Eating fruit or vegetables daily is linked to better blood sugar control");
  }
  if (breakdown.bmi.points > 0) {
    advice.push("Even a small weight change (5-7%) can meaningfully reduce your risk");
  }
  if (breakdown.waist.points > 0 && breakdown.bmi.points === 0) {
    advice.push("Reducing waist circumference, even slightly, can improve metabolic health");
  }

  return advice;
}
