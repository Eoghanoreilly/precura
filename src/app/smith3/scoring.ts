/**
 * Precura Health Score Engine
 *
 * Computes a single 0-100 health credit score from all available patient data.
 * Three sub-scores feed the composite:
 *   - Metabolic (40% weight): glucose trajectory, HbA1c, insulin, FINDRISC, metabolic syndrome criteria
 *   - Cardiovascular (35% weight): blood pressure, cholesterol panel, SCORE2, family CVD history
 *   - Lifestyle (25% weight): training adherence, BMI trend, mental health screens, vitamin D
 *
 * Scoring philosophy: 100 = optimal across all domains. Deductions for risk factors,
 * adverse trends, family history, borderline markers. Bonuses for protective factors
 * and active engagement (training plan adherence).
 */

import {
  BLOOD_TEST_HISTORY,
  BIOMETRICS_HISTORY,
  SCREENING_SCORES,
  RISK_ASSESSMENTS,
  TRAINING_PLAN,
  FAMILY_HISTORY,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";

// ---------------------------------------------------------------------------
// Sub-score: Metabolic
// ---------------------------------------------------------------------------

function computeMetabolicScore(): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];
  let score = 100;

  // 1. Fasting glucose position within reference range
  const glucose = getLatestMarker("f-Glucose");
  if (glucose) {
    const pct = (glucose.value - glucose.refLow) / (glucose.refHigh - glucose.refLow);
    if (pct > 0.85) {
      score -= 18;
      factors.push({ label: "Fasting glucose near upper limit (5.8)", impact: -18, changeable: true });
    } else if (pct > 0.7) {
      score -= 10;
      factors.push({ label: "Fasting glucose elevated", impact: -10, changeable: true });
    }
  }

  // 2. Glucose TREND over 5 years (the key Precura insight)
  const glucoseHistory = getMarkerHistory("f-Glucose");
  if (glucoseHistory.length >= 3) {
    const first = glucoseHistory[0].value;
    const last = glucoseHistory[glucoseHistory.length - 1].value;
    const delta = last - first;
    if (delta > 0.5) {
      score -= 14;
      factors.push({ label: `Glucose rising trend: ${first} to ${last} over 5 years`, impact: -14, changeable: true });
    } else if (delta > 0.3) {
      score -= 8;
      factors.push({ label: "Moderate glucose increase", impact: -8, changeable: true });
    }
  }

  // 3. HbA1c
  const hba1c = getLatestMarker("HbA1c");
  if (hba1c) {
    const pct = (hba1c.value - hba1c.refLow) / (hba1c.refHigh - hba1c.refLow);
    if (pct > 0.8) {
      score -= 10;
      factors.push({ label: "HbA1c approaching pre-diabetic threshold", impact: -10, changeable: true });
    } else if (pct > 0.6) {
      score -= 4;
      factors.push({ label: "HbA1c upper-normal", impact: -4, changeable: true });
    }
  }

  // 4. FINDRISC
  if (SCREENING_SCORES.findrisc.score >= 15) {
    score -= 12;
    factors.push({ label: "High FINDRISC diabetes risk", impact: -12, changeable: true });
  } else if (SCREENING_SCORES.findrisc.score >= 10) {
    score -= 6;
    factors.push({ label: `FINDRISC ${SCREENING_SCORES.findrisc.score}/26 (moderate)`, impact: -6, changeable: true });
  }

  // 5. Metabolic syndrome criteria proximity
  const metSyndrome = RISK_ASSESSMENTS.metabolicSyndrome;
  if (metSyndrome.metCount >= 3) {
    score -= 15;
    factors.push({ label: "Metabolic syndrome diagnosed", impact: -15, changeable: true });
  } else if (metSyndrome.metCount === 2) {
    score -= 8;
    factors.push({ label: `${metSyndrome.metCount}/5 metabolic syndrome criteria met`, impact: -8, changeable: true });
  }

  // 6. Family history of diabetes
  const diabetesFamily = FAMILY_HISTORY.filter(
    (f) => f.condition.toLowerCase().includes("diabetes")
  );
  if (diabetesFamily.length >= 2) {
    score -= 10;
    factors.push({ label: "Strong family history of diabetes (2+ relatives)", impact: -10, changeable: false });
  } else if (diabetesFamily.length === 1) {
    score -= 6;
    factors.push({ label: `Family history: ${diabetesFamily[0].relative} with T2D`, impact: -6, changeable: false });
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

// ---------------------------------------------------------------------------
// Sub-score: Cardiovascular
// ---------------------------------------------------------------------------

function computeCardiovascularScore(): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];
  let score = 100;

  // 1. Blood pressure (latest biometric)
  const latestBio = BIOMETRICS_HISTORY[0];
  if (latestBio) {
    const [sys, dia] = latestBio.bloodPressure.split("/").map(Number);
    if (sys >= 140 || dia >= 90) {
      score -= 15;
      factors.push({ label: `Blood pressure ${latestBio.bloodPressure} (high)`, impact: -15, changeable: true });
    } else if (sys >= 130 || dia >= 85) {
      score -= 7;
      factors.push({ label: `Blood pressure ${latestBio.bloodPressure} (borderline, medicated)`, impact: -7, changeable: true });
    }
  }

  // 2. Total cholesterol
  const tc = getLatestMarker("TC");
  if (tc) {
    if (tc.value > 5.5) {
      score -= 12;
      factors.push({ label: "Total cholesterol elevated", impact: -12, changeable: true });
    } else if (tc.value > 5.0) {
      score -= 5;
      factors.push({ label: `Total cholesterol borderline (${tc.value})`, impact: -5, changeable: true });
    }
  }

  // 3. HDL (protective)
  const hdl = getLatestMarker("HDL");
  if (hdl && hdl.value >= 1.5) {
    score += 5;
    factors.push({ label: `Good HDL cholesterol (${hdl.value})`, impact: 5, changeable: false });
  }

  // 4. LDL
  const ldl = getLatestMarker("LDL");
  if (ldl && ldl.value > 3.0) {
    score -= 8;
    factors.push({ label: "LDL cholesterol above target", impact: -8, changeable: true });
  }

  // 5. SCORE2 cardiovascular risk
  if (SCREENING_SCORES.score2.riskPercent >= 7.5) {
    score -= 15;
    factors.push({ label: "High SCORE2 cardiovascular risk", impact: -15, changeable: true });
  } else if (SCREENING_SCORES.score2.riskPercent >= 2.5) {
    score -= 5;
    factors.push({ label: `SCORE2 risk ${SCREENING_SCORES.score2.riskPercent}% (low-moderate)`, impact: -5, changeable: true });
  }

  // 6. Family CVD history
  const cvdFamily = FAMILY_HISTORY.filter(
    (f) =>
      f.condition.toLowerCase().includes("infarction") ||
      f.condition.toLowerCase().includes("stroke") ||
      f.condition.toLowerCase().includes("heart")
  );
  if (cvdFamily.length >= 2) {
    score -= 10;
    factors.push({ label: "Strong family history of cardiovascular disease", impact: -10, changeable: false });
  } else if (cvdFamily.length === 1) {
    score -= 5;
    factors.push({ label: `Family history: ${cvdFamily[0].relative} - ${cvdFamily[0].condition}`, impact: -5, changeable: false });
  }

  // 7. Non-smoker bonus
  score += 3;
  factors.push({ label: "Non-smoker", impact: 3, changeable: false });

  return { score: Math.max(0, Math.min(100, score)), factors };
}

// ---------------------------------------------------------------------------
// Sub-score: Lifestyle
// ---------------------------------------------------------------------------

function computeLifestyleScore(): { score: number; factors: Factor[] } {
  const factors: Factor[] = [];
  let score = 100;

  // 1. Training plan adherence
  const adherenceRate = TRAINING_PLAN.totalCompleted / (TRAINING_PLAN.currentWeek * 3);
  if (adherenceRate >= 0.9) {
    score += 5;
    factors.push({ label: `Training adherence ${Math.round(adherenceRate * 100)}% (excellent)`, impact: 5, changeable: true });
  } else if (adherenceRate >= 0.75) {
    score += 2;
    factors.push({ label: `Training adherence ${Math.round(adherenceRate * 100)}% (good)`, impact: 2, changeable: true });
  } else if (adherenceRate < 0.5) {
    score -= 10;
    factors.push({ label: "Low training adherence", impact: -10, changeable: true });
  }

  // 2. BMI
  const latestBio = BIOMETRICS_HISTORY[0];
  if (latestBio) {
    if (latestBio.bmi >= 30) {
      score -= 15;
      factors.push({ label: `BMI ${latestBio.bmi} (obese range)`, impact: -15, changeable: true });
    } else if (latestBio.bmi >= 25) {
      score -= 8;
      factors.push({ label: `BMI ${latestBio.bmi} (overweight range)`, impact: -8, changeable: true });
    }
  }

  // 3. Weight trend
  if (BIOMETRICS_HISTORY.length >= 3) {
    const oldest = BIOMETRICS_HISTORY[BIOMETRICS_HISTORY.length - 1].weight;
    const newest = BIOMETRICS_HISTORY[0].weight;
    const delta = newest - oldest;
    if (delta > 3) {
      score -= 6;
      factors.push({ label: `Weight trend: +${delta}kg over tracking period`, impact: -6, changeable: true });
    } else if (delta < -2) {
      score += 3;
      factors.push({ label: "Weight trending down", impact: 3, changeable: true });
    }
  }

  // 4. Mental health (PHQ-9, GAD-7)
  if (SCREENING_SCORES.phq9.score <= 4 && SCREENING_SCORES.gad7.score <= 4) {
    score += 4;
    factors.push({ label: "Mental health screens normal (PHQ-9, GAD-7)", impact: 4, changeable: true });
  } else if (SCREENING_SCORES.phq9.score >= 10 || SCREENING_SCORES.gad7.score >= 10) {
    score -= 12;
    factors.push({ label: "Elevated mental health screening scores", impact: -12, changeable: true });
  }

  // 5. Alcohol
  if (SCREENING_SCORES.auditC.score <= 3) {
    score += 2;
    factors.push({ label: "Low-risk alcohol use (AUDIT-C)", impact: 2, changeable: true });
  } else if (SCREENING_SCORES.auditC.score >= 8) {
    score -= 10;
    factors.push({ label: "High-risk alcohol use", impact: -10, changeable: true });
  }

  // 6. Vitamin D
  const vitD = getLatestMarker("Vit D");
  if (vitD) {
    if (vitD.value < vitD.refLow) {
      score -= 5;
      factors.push({ label: `Vitamin D low (${vitD.value} nmol/L, target >${vitD.refLow})`, impact: -5, changeable: true });
    }
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

// ---------------------------------------------------------------------------
// Composite Score
// ---------------------------------------------------------------------------

export interface Factor {
  label: string;
  impact: number;
  changeable: boolean;
}

export interface SubScore {
  name: string;
  shortName: string;
  score: number;
  weight: number;
  factors: Factor[];
}

export interface HealthScore {
  composite: number;
  subScores: SubScore[];
  allFactors: Factor[];
  lastUpdated: string;
}

export function computeHealthScore(): HealthScore {
  const metabolic = computeMetabolicScore();
  const cardiovascular = computeCardiovascularScore();
  const lifestyle = computeLifestyleScore();

  const METABOLIC_WEIGHT = 0.40;
  const CARDIOVASCULAR_WEIGHT = 0.35;
  const LIFESTYLE_WEIGHT = 0.25;

  const composite = Math.round(
    metabolic.score * METABOLIC_WEIGHT +
    cardiovascular.score * CARDIOVASCULAR_WEIGHT +
    lifestyle.score * LIFESTYLE_WEIGHT
  );

  const subScores: SubScore[] = [
    { name: "Metabolic", shortName: "MET", score: metabolic.score, weight: METABOLIC_WEIGHT, factors: metabolic.factors },
    { name: "Cardiovascular", shortName: "CVD", score: cardiovascular.score, weight: CARDIOVASCULAR_WEIGHT, factors: cardiovascular.factors },
    { name: "Lifestyle", shortName: "LIF", score: lifestyle.score, weight: LIFESTYLE_WEIGHT, factors: lifestyle.factors },
  ];

  const allFactors = [
    ...metabolic.factors,
    ...cardiovascular.factors,
    ...lifestyle.factors,
  ].sort((a, b) => a.impact - b.impact);

  const latestTest = BLOOD_TEST_HISTORY[0]?.date || "2026-03-27";

  return {
    composite,
    subScores,
    allFactors,
    lastUpdated: latestTest,
  };
}
