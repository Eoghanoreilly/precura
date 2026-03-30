export interface BloodTestPanel {
  id: string;
  name: string;
  description: string;
  price: number; // SEK
  tests: BloodTestItem[];
}

export interface BloodTestItem {
  name: string;
  shortName: string;
  description: string;
}

export interface BloodTestResult {
  testName: string;
  shortName: string;
  value: number;
  unit: string;
  refRangeLow: number;
  refRangeHigh: number;
  status: "normal" | "borderline" | "abnormal";
  interpretation: string;
}

export const PANELS: BloodTestPanel[] = [
  {
    id: "diabetes-focus",
    name: "Diabetes Focus Panel",
    description:
      "Comprehensive diabetes screening including blood sugar markers, insulin levels, and lipid profile. Recommended based on your FINDRISC assessment.",
    price: 795,
    tests: [
      {
        name: "HbA1c (Glycated Hemoglobin)",
        shortName: "HbA1c",
        description: "Average blood sugar over the past 2-3 months",
      },
      {
        name: "Fasting Glucose",
        shortName: "f-Glucose",
        description: "Blood sugar level after 8+ hours of fasting",
      },
      {
        name: "Fasting Insulin",
        shortName: "f-Insulin",
        description: "Insulin level after fasting - helps detect insulin resistance early",
      },
      {
        name: "Total Cholesterol",
        shortName: "TC",
        description: "Overall cholesterol level",
      },
      {
        name: "HDL Cholesterol",
        shortName: "HDL",
        description: "The protective cholesterol - higher is better",
      },
      {
        name: "LDL Cholesterol",
        shortName: "LDL",
        description: "The cholesterol to watch - lower is generally better",
      },
      {
        name: "Triglycerides",
        shortName: "TG",
        description: "Fat in the blood - elevated levels linked to diabetes risk",
      },
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive Health Check",
    description:
      "Full blood panel covering metabolic, cardiovascular, thyroid, and vitamin levels. Our most complete screening.",
    price: 1495,
    tests: [
      { name: "HbA1c", shortName: "HbA1c", description: "Average blood sugar" },
      { name: "Fasting Glucose", shortName: "f-Glucose", description: "Fasting blood sugar" },
      { name: "Full Lipid Panel", shortName: "Lipids", description: "Complete cholesterol breakdown" },
      { name: "Thyroid (TSH, T3, T4)", shortName: "Thyroid", description: "Thyroid function" },
      { name: "Vitamin D", shortName: "Vit D", description: "Essential for bones and immunity" },
      { name: "Vitamin B12", shortName: "B12", description: "Energy and nerve function" },
      { name: "Iron & Ferritin", shortName: "Iron", description: "Iron stores and transport" },
      { name: "Kidney Function (Creatinine, eGFR)", shortName: "Kidney", description: "Kidney health markers" },
      { name: "Liver Function (ALT, AST)", shortName: "Liver", description: "Liver enzyme levels" },
    ],
  },
];

/**
 * Mock blood test results for Anna Bergstrom
 * Designed to show mostly normal with a couple borderline values
 */
export const MOCK_BLOOD_RESULTS: BloodTestResult[] = [
  {
    testName: "HbA1c",
    shortName: "HbA1c",
    value: 38,
    unit: "mmol/mol",
    refRangeLow: 20,
    refRangeHigh: 42,
    status: "normal",
    interpretation: "Your HbA1c is within normal range, indicating good blood sugar control over the past 2-3 months.",
  },
  {
    testName: "Fasting Glucose",
    shortName: "f-Glucose",
    value: 5.8,
    unit: "mmol/L",
    refRangeLow: 3.9,
    refRangeHigh: 6.0,
    status: "borderline",
    interpretation:
      "Your fasting glucose is in the upper normal range. Values between 5.6-6.0 are worth watching over time. This is not a concern right now but is something to monitor.",
  },
  {
    testName: "Fasting Insulin",
    shortName: "f-Insulin",
    value: 12,
    unit: "mU/L",
    refRangeLow: 2,
    refRangeHigh: 25,
    status: "normal",
    interpretation: "Insulin levels are within normal range, suggesting your body is processing sugar effectively.",
  },
  {
    testName: "Total Cholesterol",
    shortName: "TC",
    value: 5.1,
    unit: "mmol/L",
    refRangeLow: 3.0,
    refRangeHigh: 5.0,
    status: "borderline",
    interpretation:
      "Slightly above the recommended upper limit. Not a concern on its own but worth looking at in the context of your HDL and LDL values.",
  },
  {
    testName: "HDL Cholesterol",
    shortName: "HDL",
    value: 1.6,
    unit: "mmol/L",
    refRangeLow: 1.2,
    refRangeHigh: 2.5,
    status: "normal",
    interpretation: "Good HDL level. This is the protective cholesterol - your level is healthy.",
  },
  {
    testName: "LDL Cholesterol",
    shortName: "LDL",
    value: 2.9,
    unit: "mmol/L",
    refRangeLow: 0,
    refRangeHigh: 3.0,
    status: "normal",
    interpretation: "LDL is within recommended range. Combined with your good HDL, your cholesterol profile looks balanced.",
  },
  {
    testName: "Triglycerides",
    shortName: "TG",
    value: 1.3,
    unit: "mmol/L",
    refRangeLow: 0,
    refRangeHigh: 1.7,
    status: "normal",
    interpretation: "Triglyceride levels are normal. Elevated triglycerides are linked to insulin resistance, so this is a positive sign.",
  },
];

export const MOCK_RESULTS_SUMMARY =
  "Overall, your blood work looks reassuring. Most values are within normal range. Two markers are worth noting: your fasting glucose (5.8 mmol/L) is in the upper normal range, and your total cholesterol (5.1 mmol/L) is slightly above recommended. Neither is a concern right now, but they're good markers to track over time, especially given your family history of diabetes. Your healthy HDL and normal triglycerides are positive signs. We'd suggest retesting in 6-12 months to monitor the trend.";
