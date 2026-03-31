/**
 * Comprehensive mock patient data for Precura v2
 *
 * Anna Bergstrom - 40 years old, 5 years of health history
 * Her story: glucose slowly creeping up, cholesterol borderline,
 * family history of diabetes and CVD. Nobody has connected the dots yet.
 * This is exactly the person Precura is built for.
 */

// ============================================================================
// Patient Profile (from 1177 + BankID)
// ============================================================================

export const PATIENT = {
  id: "anna-bergstrom",
  name: "Anna Bergstrom",
  firstName: "Anna",
  personnummer: "198507220148",
  dateOfBirth: "1985-07-22",
  age: 40,
  sex: "female" as const,
  email: "anna.bergstrom@email.se",
  phone: "+46 70 123 4567",
  address: "Sveavagen 42, 113 34 Stockholm",
  vardcentral: "Cityakuten Vardcentral",
  memberSince: "2026-01-15",
  membershipTier: "annual" as const,
  membershipPrice: 2995,
  nextBloodTest: "2026-09-15",
  lastCheckIn: "2026-03-27",
};

// ============================================================================
// Medical History (from 1177)
// ============================================================================

export const CONDITIONS = [
  { name: "Mild hypertension", icd10: "I10", diagnosedDate: "2022-03-14", status: "active" as const, treatedBy: "Dr. Eriksson, Cityakuten Vardcentral" },
  { name: "Seasonal allergic rhinitis", icd10: "J30.1", diagnosedDate: "2015-05-20", status: "active" as const, treatedBy: "Dr. Nilsson, Cityakuten Vardcentral" },
  { name: "Lower back strain", icd10: "S39.012", diagnosedDate: "2023-09-10", status: "resolved" as const, treatedBy: "Dr. Eriksson, Cityakuten Vardcentral" },
];

export const MEDICATIONS = [
  { name: "Enalapril", dose: "5mg", frequency: "Once daily", purpose: "Blood pressure", startDate: "2022-03-20", prescribedBy: "Dr. Eriksson", active: true },
  { name: "Cetirizine", dose: "10mg", frequency: "As needed", purpose: "Allergies", startDate: "2015-06-01", prescribedBy: "Dr. Nilsson", active: true },
];

export const MEDICATION_HISTORY = [
  { name: "Naproxen", dose: "500mg", frequency: "Twice daily for 2 weeks", purpose: "Back pain", startDate: "2023-09-10", endDate: "2023-09-24", prescribedBy: "Dr. Eriksson" },
  { name: "Omeprazol", dose: "20mg", frequency: "Once daily for 2 weeks", purpose: "Stomach protection (with Naproxen)", startDate: "2023-09-10", endDate: "2023-09-24", prescribedBy: "Dr. Eriksson" },
];

export const VACCINATIONS = [
  { name: "COVID-19 booster (Comirnaty)", date: "2024-10-15", provider: "Cityakuten Vardcentral" },
  { name: "COVID-19 dose 3 (Comirnaty)", date: "2022-01-20", provider: "Stockholmsmassan vaccination center" },
  { name: "Influenza", date: "2025-11-05", provider: "Cityakuten Vardcentral" },
  { name: "Influenza", date: "2024-11-12", provider: "Cityakuten Vardcentral" },
  { name: "Tetanus-diphtheria booster", date: "2020-06-15", provider: "Cityakuten Vardcentral" },
];

export const ALLERGIES = [
  { substance: "Birch pollen", reaction: "Rhinitis, watery eyes", severity: "mild" as const },
  { substance: "Grass pollen", reaction: "Rhinitis", severity: "mild" as const },
  { substance: "No known drug allergies", reaction: "", severity: "none" as const },
];

export const DOCTOR_VISITS = [
  { date: "2026-01-15", provider: "Dr. Johansson (Precura)", type: "Initial consultation" as const, summary: "Onboarding consultation. Reviewed 1177 health history. Discussed risk factors - family history of diabetes and rising glucose trend. Recommended comprehensive blood panel and lifestyle modifications. Started Precura membership." },
  { date: "2025-11-20", provider: "Dr. Eriksson, Cityakuten", type: "Annual check-up" as const, summary: "Routine annual health check. Blood pressure 135/85, stable on Enalapril. Weight 78kg. Discussed diet and exercise. No changes to medication." },
  { date: "2025-03-15", provider: "Dr. Eriksson, Cityakuten", type: "Blood pressure follow-up" as const, summary: "Blood pressure 130/82, well controlled on Enalapril 5mg. Blood work ordered." },
  { date: "2024-11-10", provider: "Dr. Eriksson, Cityakuten", type: "Annual check-up" as const, summary: "Routine check. BP 138/86. Weight 79kg, up 1kg from last year. General health good. Flu vaccination given." },
  { date: "2023-10-20", provider: "Physiotherapist L. Holm", type: "Physiotherapy" as const, summary: "Session 4/6 for lower back strain. Good progress. Core strengthening exercises prescribed. Cleared for light jogging." },
  { date: "2023-09-10", provider: "Dr. Eriksson, Cityakuten", type: "Acute visit" as const, summary: "Lower back pain after lifting. No radiculopathy. Prescribed Naproxen 500mg x2/day for 2 weeks with Omeprazol. Referral to physiotherapy." },
  { date: "2023-03-10", provider: "Dr. Eriksson, Cityakuten", type: "Annual check-up" as const, summary: "Routine check. BP 132/84. Weight 77kg. Blood work normal except mildly elevated total cholesterol. Dietary advice given." },
  { date: "2022-03-14", provider: "Dr. Eriksson, Cityakuten", type: "Follow-up" as const, summary: "Elevated blood pressure confirmed on 3 readings. Started Enalapril 5mg daily. Lifestyle advice: reduce salt, increase activity." },
];

// ============================================================================
// Blood Test History (from 1177 + Precura)
// ============================================================================

export interface BloodTestSession {
  date: string;
  orderedBy: string;
  lab: string;
  results: BloodMarker[];
}

export interface BloodMarker {
  name: string;
  shortName: string;
  plainName: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  status: "normal" | "borderline" | "abnormal";
}

export const BLOOD_TEST_HISTORY: BloodTestSession[] = [
  {
    date: "2026-03-27",
    orderedBy: "Dr. Johansson (Precura)",
    lab: "Karolinska University Laboratory",
    results: [
      { name: "HbA1c", shortName: "HbA1c", plainName: "Long-term blood sugar", value: 38, unit: "mmol/mol", refLow: 20, refHigh: 42, status: "normal" },
      { name: "Fasting Glucose", shortName: "f-Glucose", plainName: "Blood sugar (fasting)", value: 5.8, unit: "mmol/L", refLow: 3.9, refHigh: 6.0, status: "borderline" },
      { name: "Fasting Insulin", shortName: "f-Insulin", plainName: "Insulin level (fasting)", value: 12, unit: "mU/L", refLow: 2, refHigh: 25, status: "normal" },
      { name: "Total Cholesterol", shortName: "TC", plainName: "Total cholesterol", value: 5.1, unit: "mmol/L", refLow: 3.0, refHigh: 5.0, status: "borderline" },
      { name: "HDL Cholesterol", shortName: "HDL", plainName: "Good cholesterol", value: 1.6, unit: "mmol/L", refLow: 1.2, refHigh: 2.5, status: "normal" },
      { name: "LDL Cholesterol", shortName: "LDL", plainName: "Bad cholesterol", value: 2.9, unit: "mmol/L", refLow: 0, refHigh: 3.0, status: "normal" },
      { name: "Triglycerides", shortName: "TG", plainName: "Blood fats", value: 1.3, unit: "mmol/L", refLow: 0, refHigh: 1.7, status: "normal" },
      { name: "TSH", shortName: "TSH", plainName: "Thyroid function", value: 2.1, unit: "mIU/L", refLow: 0.4, refHigh: 4.0, status: "normal" },
      { name: "Vitamin D", shortName: "Vit D", plainName: "Vitamin D", value: 48, unit: "nmol/L", refLow: 50, refHigh: 125, status: "borderline" },
      { name: "Creatinine", shortName: "Crea", plainName: "Kidney function", value: 68, unit: "umol/L", refLow: 45, refHigh: 90, status: "normal" },
    ],
  },
  {
    date: "2025-03-20",
    orderedBy: "Dr. Eriksson, Cityakuten",
    lab: "Karolinska University Laboratory",
    results: [
      { name: "Fasting Glucose", shortName: "f-Glucose", plainName: "Blood sugar (fasting)", value: 5.5, unit: "mmol/L", refLow: 3.9, refHigh: 6.0, status: "normal" },
      { name: "HbA1c", shortName: "HbA1c", plainName: "Long-term blood sugar", value: 37, unit: "mmol/mol", refLow: 20, refHigh: 42, status: "normal" },
      { name: "Total Cholesterol", shortName: "TC", plainName: "Total cholesterol", value: 5.0, unit: "mmol/L", refLow: 3.0, refHigh: 5.0, status: "normal" },
      { name: "HDL Cholesterol", shortName: "HDL", plainName: "Good cholesterol", value: 1.6, unit: "mmol/L", refLow: 1.2, refHigh: 2.5, status: "normal" },
      { name: "LDL Cholesterol", shortName: "LDL", plainName: "Bad cholesterol", value: 2.8, unit: "mmol/L", refLow: 0, refHigh: 3.0, status: "normal" },
      { name: "Triglycerides", shortName: "TG", plainName: "Blood fats", value: 1.2, unit: "mmol/L", refLow: 0, refHigh: 1.7, status: "normal" },
      { name: "Creatinine", shortName: "Crea", plainName: "Kidney function", value: 65, unit: "umol/L", refLow: 45, refHigh: 90, status: "normal" },
    ],
  },
  {
    date: "2024-03-15",
    orderedBy: "Dr. Eriksson, Cityakuten",
    lab: "Karolinska University Laboratory",
    results: [
      { name: "Fasting Glucose", shortName: "f-Glucose", plainName: "Blood sugar (fasting)", value: 5.4, unit: "mmol/L", refLow: 3.9, refHigh: 6.0, status: "normal" },
      { name: "HbA1c", shortName: "HbA1c", plainName: "Long-term blood sugar", value: 36, unit: "mmol/mol", refLow: 20, refHigh: 42, status: "normal" },
      { name: "Total Cholesterol", shortName: "TC", plainName: "Total cholesterol", value: 5.0, unit: "mmol/L", refLow: 3.0, refHigh: 5.0, status: "normal" },
      { name: "HDL Cholesterol", shortName: "HDL", plainName: "Good cholesterol", value: 1.6, unit: "mmol/L", refLow: 1.2, refHigh: 2.5, status: "normal" },
    ],
  },
  {
    date: "2023-03-15",
    orderedBy: "Dr. Eriksson, Cityakuten",
    lab: "Karolinska University Laboratory",
    results: [
      { name: "Fasting Glucose", shortName: "f-Glucose", plainName: "Blood sugar (fasting)", value: 5.2, unit: "mmol/L", refLow: 3.9, refHigh: 6.0, status: "normal" },
      { name: "HbA1c", shortName: "HbA1c", plainName: "Long-term blood sugar", value: 36, unit: "mmol/mol", refLow: 20, refHigh: 42, status: "normal" },
      { name: "Total Cholesterol", shortName: "TC", plainName: "Total cholesterol", value: 4.9, unit: "mmol/L", refLow: 3.0, refHigh: 5.0, status: "normal" },
    ],
  },
  {
    date: "2022-03-20",
    orderedBy: "Dr. Eriksson, Cityakuten",
    lab: "Karolinska University Laboratory",
    results: [
      { name: "Fasting Glucose", shortName: "f-Glucose", plainName: "Blood sugar (fasting)", value: 5.1, unit: "mmol/L", refLow: 3.9, refHigh: 6.0, status: "normal" },
      { name: "HbA1c", shortName: "HbA1c", plainName: "Long-term blood sugar", value: 35, unit: "mmol/mol", refLow: 20, refHigh: 42, status: "normal" },
      { name: "Total Cholesterol", shortName: "TC", plainName: "Total cholesterol", value: 4.8, unit: "mmol/L", refLow: 3.0, refHigh: 5.0, status: "normal" },
    ],
  },
  {
    date: "2021-04-10",
    orderedBy: "Dr. Eriksson, Cityakuten",
    lab: "Karolinska University Laboratory",
    results: [
      { name: "Fasting Glucose", shortName: "f-Glucose", plainName: "Blood sugar (fasting)", value: 5.0, unit: "mmol/L", refLow: 3.9, refHigh: 6.0, status: "normal" },
      { name: "Total Cholesterol", shortName: "TC", plainName: "Total cholesterol", value: 4.6, unit: "mmol/L", refLow: 3.0, refHigh: 5.0, status: "normal" },
    ],
  },
];

// ============================================================================
// Family History
// ============================================================================

export const FAMILY_HISTORY = [
  { relative: "Mother", condition: "Type 2 Diabetes", ageAtDiagnosis: 58, status: "Living, managed with medication" },
  { relative: "Father", condition: "Myocardial infarction (heart attack)", ageAtDiagnosis: 65, status: "Living, stent placed, on medication" },
  { relative: "Maternal grandmother", condition: "Type 2 Diabetes", ageAtDiagnosis: 62, status: "Deceased at 78" },
  { relative: "Paternal grandfather", condition: "Stroke", ageAtDiagnosis: 71, status: "Deceased at 73" },
];

// ============================================================================
// Biometrics History
// ============================================================================

export const BIOMETRICS_HISTORY = [
  { date: "2026-03-15", weight: 78, waist: 86, bmi: 27.6, bloodPressure: "132/82" },
  { date: "2025-11-20", weight: 78, waist: 86, bmi: 27.6, bloodPressure: "135/85" },
  { date: "2025-03-15", weight: 77, waist: 85, bmi: 27.3, bloodPressure: "130/82" },
  { date: "2024-11-10", weight: 79, waist: 87, bmi: 28.0, bloodPressure: "138/86" },
  { date: "2024-03-15", weight: 77, waist: 85, bmi: 27.3, bloodPressure: "134/84" },
  { date: "2023-03-10", weight: 77, waist: 84, bmi: 27.3, bloodPressure: "132/84" },
  { date: "2022-03-14", weight: 76, waist: 83, bmi: 26.9, bloodPressure: "142/88" },
  { date: "2021-04-10", weight: 74, waist: 81, bmi: 26.2, bloodPressure: "128/80" },
];

// ============================================================================
// Screening Scores
// ============================================================================

export const SCREENING_SCORES = {
  findrisc: { score: 12, maxScore: 26, level: "moderate" as const, date: "2026-03-15" },
  phq9: { score: 4, maxScore: 27, level: "minimal" as const, date: "2026-03-15", interpretation: "Minimal depression - no treatment needed" },
  gad7: { score: 3, maxScore: 21, level: "minimal" as const, date: "2026-03-15", interpretation: "Minimal anxiety" },
  auditC: { score: 3, maxScore: 12, level: "low_risk" as const, date: "2026-03-15", interpretation: "Low risk alcohol use" },
  eq5d: {
    mobility: 1, selfCare: 1, activities: 1, pain: 2, anxiety: 1,
    date: "2026-03-15",
    interpretation: "Good quality of life, some mild pain/discomfort",
  },
  score2: { riskPercent: 3, level: "low_moderate" as const, date: "2026-03-15", interpretation: "Low-moderate cardiovascular risk" },
};

// ============================================================================
// Risk Assessments (multi-model)
// ============================================================================

export const RISK_ASSESSMENTS = {
  diabetes: {
    riskLevel: "moderate" as const,
    riskLabel: "Moderate",
    trend: "worsening" as const,
    summary: "Your diabetes risk is moderate and has been gradually increasing. Fasting glucose has risen from 5.0 to 5.8 over 5 years. Family history (mother with T2D) is a significant non-modifiable factor. Activity level and weight are the main modifiable factors.",
    tenYearRisk: "~17%",
    keyFactors: [
      { name: "Family history", changeable: false, impact: "high" as const },
      { name: "Fasting glucose trend", changeable: true, impact: "high" as const },
      { name: "Activity level", changeable: true, impact: "medium" as const },
      { name: "Weight/BMI", changeable: true, impact: "medium" as const },
      { name: "Blood pressure", changeable: true, impact: "low" as const },
    ],
  },
  cardiovascular: {
    riskLevel: "low_moderate" as const,
    riskLabel: "Low-moderate",
    trend: "stable" as const,
    summary: "Your cardiovascular risk is low-moderate. Blood pressure is controlled with medication. Father's heart attack at 65 is a risk factor. Cholesterol is borderline but HDL is healthy. Main action: maintain blood pressure control and monitor cholesterol.",
    tenYearRisk: "~3%",
    keyFactors: [
      { name: "Family history (father CVD at 65)", changeable: false, impact: "medium" as const },
      { name: "Hypertension (controlled)", changeable: true, impact: "medium" as const },
      { name: "Total cholesterol borderline", changeable: true, impact: "low" as const },
      { name: "Non-smoker", changeable: false, impact: "positive" as const },
      { name: "Good HDL level", changeable: false, impact: "positive" as const },
    ],
  },
  bone: {
    riskLevel: "low" as const,
    riskLabel: "Low",
    trend: "stable" as const,
    summary: "Your bone health risk is low. Age 40, no major risk factors. Vitamin D is slightly below optimal (48 nmol/L, target >50). Supplementation recommended.",
    tenYearRisk: "<5%",
    keyFactors: [
      { name: "Age (40, pre-menopausal)", changeable: false, impact: "positive" as const },
      { name: "Vitamin D slightly low", changeable: true, impact: "low" as const },
    ],
  },
  metabolicSyndrome: {
    criteria: [
      { name: "Waist circumference >88cm (women)", met: false, value: "86 cm", note: "Close to threshold" },
      { name: "Blood pressure >130/85", met: true, value: "132/82 (on medication)", note: "Controlled with Enalapril" },
      { name: "Fasting glucose >5.6", met: true, value: "5.8 mmol/L", note: "Borderline and rising" },
      { name: "Triglycerides >1.7", met: false, value: "1.3 mmol/L", note: "Normal" },
      { name: "HDL <1.3 (women)", met: false, value: "1.6 mmol/L", note: "Healthy" },
    ],
    metCount: 2,
    threshold: 3,
    status: "2 of 5 criteria met (3 required for diagnosis)" as const,
    trend: "approaching" as const,
  },
};

// ============================================================================
// Doctor-Patient Messages
// ============================================================================

export const MESSAGES = [
  {
    id: "msg-1",
    from: "patient" as const,
    date: "2026-03-28T09:15:00",
    text: "Hi Dr. Johansson, I got my blood test results yesterday. The glucose is 5.8 which seems high? Should I be worried?",
  },
  {
    id: "msg-2",
    from: "doctor" as const,
    date: "2026-03-28T11:30:00",
    text: "Hi Anna, thanks for reaching out. Your fasting glucose at 5.8 is in the upper normal range - not diabetic, but worth watching. Looking at your Precura history, it's been gradually rising from 5.0 in 2021. Combined with your family history, I'd recommend we keep a close eye on this. The good news is that lifestyle changes can make a real difference here. Your training plan is designed with this in mind. Let's retest in 6 months.",
  },
  {
    id: "msg-3",
    from: "patient" as const,
    date: "2026-03-28T12:05:00",
    text: "That makes sense. My mum was diagnosed at 58 so I've always worried about it. Is there anything specific I should be doing beyond the training plan?",
  },
  {
    id: "msg-4",
    from: "doctor" as const,
    date: "2026-03-28T14:20:00",
    text: "Your concern is completely understandable given your family history. Beyond the training plan, I'd suggest: 1) Try to get your daily steps up - even a 20-minute walk after dinner helps blood sugar regulation. 2) Your Vitamin D is slightly low (48, we want >50) - I'd recommend a D3 supplement, especially through the Swedish winter. 3) Continue the Enalapril as prescribed. We'll track everything through Precura and I'll flag if anything needs attention before your next test.",
  },
];

// ============================================================================
// Doctor's Notes (from Precura consultations)
// ============================================================================

export const DOCTOR_NOTES = [
  {
    date: "2026-03-28",
    author: "Dr. Marcus Johansson",
    type: "Blood test review" as const,
    note: "Reviewed comprehensive blood panel from 2026-03-27. Key findings: fasting glucose 5.8 mmol/L - upper normal range, continuing upward trend from 5.0 (2021) through 5.2, 5.4, 5.5 to current 5.8. HbA1c 38 - still within normal range but approaching pre-diabetic threshold (42). Total cholesterol 5.1 - marginally above recommended. Vitamin D 48 - slightly below optimal.\n\nAssessment: Patient's metabolic trajectory is concerning given strong family history of T2D (mother dx at 58) and cardiovascular disease (father MI at 65). Currently meeting 2 of 5 metabolic syndrome criteria with waist circumference approaching third.\n\nPlan: Continue current training plan targeting metabolic health. Recommend Vitamin D3 supplementation 2000 IU daily. Retest comprehensive panel in 6 months (September 2026). Consider OGTT if fasting glucose continues to rise. Patient counselled and reassured.",
  },
  {
    date: "2026-01-15",
    author: "Dr. Marcus Johansson",
    type: "Initial consultation" as const,
    note: "New Precura member. Reviewed complete 1177 health history. Patient is a 40-year-old woman with mild hypertension (well controlled on Enalapril 5mg) and a significant family history of T2D and CVD. Has been attending Cityakuten Vardcentral for routine care.\n\nReview of historical blood work shows a clear 5-year trend of gradually rising fasting glucose (5.0 -> 5.8) and cholesterol (4.6 -> 5.1). These changes are individually small but the trajectory is consistent and, combined with family history, warrants active monitoring and preventive intervention.\n\nThe patient's previous GP documented these individual results as 'normal' at each visit but did not flag the multi-year trend. This is exactly the kind of pattern Precura is designed to catch.\n\nPlan: Comprehensive blood panel ordered. FINDRISC assessment completed (score 12 - moderate risk). PHQ-9 score 4 (minimal). Started on personalized training plan. Will review results and schedule follow-up.",
  },
];

// ============================================================================
// Training Plan
// ============================================================================

export const TRAINING_PLAN = {
  name: "Metabolic Health Program",
  createdBy: "Eoghan O'Reilly, Certified Personal Trainer",
  reviewedBy: "Dr. Marcus Johansson",
  startDate: "2026-01-20",
  goal: "Improve insulin sensitivity, support weight management, reduce cardiovascular risk factors",
  weeklySchedule: [
    { day: "Monday", activity: "Brisk walk 30 min + bodyweight strength (squats, lunges, push-ups) 15 min", intensity: "Moderate", notes: "Can split into two 20-min sessions if needed" },
    { day: "Tuesday", activity: "Rest or gentle stretching/yoga 20 min", intensity: "Light", notes: "Focus on lower back and hip flexibility (history of back strain)" },
    { day: "Wednesday", activity: "Interval walking 25 min (2 min brisk, 1 min easy pace) + core work 10 min", intensity: "Moderate-High", notes: "Core work supports back health" },
    { day: "Thursday", activity: "Rest day", intensity: "None", notes: "" },
    { day: "Friday", activity: "Resistance band workout 30 min (full body)", intensity: "Moderate", notes: "Focus on compound movements for metabolic benefit" },
    { day: "Saturday", activity: "Outdoor activity 45-60 min (walk, cycle, swim)", intensity: "Moderate", notes: "Choose something enjoyable - consistency matters more than intensity" },
    { day: "Sunday", activity: "Rest or gentle walk 20 min", intensity: "Light", notes: "" },
  ],
  medicalConsiderations: [
    "Blood pressure: monitored by Precura. Current Enalapril keeps it controlled. Avoid heavy overhead pressing.",
    "Lower back history: core strengthening included. Avoid loaded spinal flexion. Consult physio if pain returns.",
    "Pre-diabetic trajectory: focus on post-meal walks (blood sugar regulation). Strength training improves insulin sensitivity.",
  ],
  progressMetrics: [
    { metric: "Weekly active minutes", target: 150, current: 95, unit: "min" },
    { metric: "Daily steps average", target: 8000, current: 5200, unit: "steps" },
    { metric: "Strength sessions completed", target: 3, current: 2, unit: "/week" },
  ],
};

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Get all values for a specific blood marker across all test sessions
 */
export function getMarkerHistory(shortName: string): { date: string; value: number }[] {
  return BLOOD_TEST_HISTORY
    .flatMap((session) =>
      session.results
        .filter((r) => r.shortName === shortName)
        .map((r) => ({ date: session.date, value: r.value }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get the latest result for a specific blood marker
 */
export function getLatestMarker(shortName: string): BloodMarker | null {
  for (const session of BLOOD_TEST_HISTORY) {
    const found = session.results.find((r) => r.shortName === shortName);
    if (found) return found;
  }
  return null;
}

/**
 * AI summary of the patient for the doctor view
 */
export const AI_PATIENT_SUMMARY = `Anna Bergstrom, 40, Stockholm. Precura member since January 2026.

Active conditions: Mild hypertension (controlled, Enalapril 5mg daily), seasonal allergies.

Key concern: Diabetes risk trajectory. Fasting glucose has risen steadily over 5 years (5.0 -> 5.8 mmol/L). HbA1c 38 mmol/mol - normal but approaching pre-diabetic range (42+). FINDRISC score 12/26 (moderate risk). Strong family history: mother with T2D at 58, maternal grandmother with T2D at 62.

Cardiovascular: Low-moderate risk. Father had MI at 65. BP controlled on Enalapril. Total cholesterol borderline (5.1), but HDL is healthy (1.6). SCORE2 estimate ~3%.

Mental health: PHQ-9 score 4 (minimal depression). GAD-7 score 3 (minimal anxiety). AUDIT-C score 3 (low risk).

Metabolic syndrome: 2 of 5 criteria currently met (BP on medication, fasting glucose >5.6). Waist 86cm is approaching the 88cm threshold.

Recent: Blood test March 2026 showed continued glucose rise and new Vitamin D deficiency. Doctor recommended supplementation and retest in 6 months.

Training plan active since January 2026. Adherence moderate - hitting 2/3 strength sessions and averaging 5,200 steps (target 8,000).`;
