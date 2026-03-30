"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Activity, Loader2 } from "lucide-react";
import { FindriscInputs, calculateFindrisc } from "@/lib/findrisc";
import { saveOnboardingData } from "@/lib/mock-data";
import { updateUser } from "@/lib/auth";

const TOTAL_STEPS = 8;

type AgeRange = "under45" | "45-54" | "55-64" | "65+";

function ageFromRange(range: AgeRange): number {
  switch (range) {
    case "under45": return 35;
    case "45-54": return 50;
    case "55-64": return 60;
    case "65+": return 68;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [calculating, setCalculating] = useState(false);

  // Form state
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [physicalActivity, setPhysicalActivity] = useState<boolean | null>(null);
  const [dailyFruitVeg, setDailyFruitVeg] = useState<boolean | null>(null);
  const [bloodPressureMeds, setBloodPressureMeds] = useState<boolean | null>(null);
  const [highGlucose, setHighGlucose] = useState<boolean | null>(null);
  const [familyDiabetes, setFamilyDiabetes] = useState<FindriscInputs["familyDiabetes"] | null>(null);

  const bmi = heightCm && weightKg
    ? (parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)).toFixed(1)
    : null;

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 0: return ageRange !== null;
      case 1: return sex !== null;
      case 2: return heightCm !== "" && weightKg !== "" && parseFloat(heightCm) > 0 && parseFloat(weightKg) > 0;
      case 3: return waistCm !== "" && parseFloat(waistCm) > 0;
      case 4: return physicalActivity !== null;
      case 5: return dailyFruitVeg !== null;
      case 6: return bloodPressureMeds !== null && highGlucose !== null;
      case 7: return familyDiabetes !== null;
      default: return false;
    }
  }, [step, ageRange, sex, heightCm, weightKg, waistCm, physicalActivity, dailyFruitVeg, bloodPressureMeds, highGlucose, familyDiabetes]);

  function handleComplete() {
    if (!ageRange || !sex || !familyDiabetes || bloodPressureMeds === null || highGlucose === null || physicalActivity === null || dailyFruitVeg === null) return;

    setCalculating(true);
    const inputs: FindriscInputs = {
      age: ageFromRange(ageRange),
      sex,
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      waistCm: parseFloat(waistCm),
      physicalActivity,
      dailyFruitVeg,
      bloodPressureMeds,
      highBloodGlucoseHistory: highGlucose,
      familyDiabetes,
    };

    const result = calculateFindrisc(inputs);
    saveOnboardingData(inputs);
    updateUser({ onboardingComplete: true });

    // Brief delay for the animation, then go to results reveal
    setTimeout(() => {
      void result;
      router.push("/results");
    }, 1500);
  }

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  if (calculating) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5" style={{ background: "var(--bg)" }}>
        <div className="animate-scale-in flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "var(--purple-bg)" }}>
            <Loader2 size={28} className="animate-spin" style={{ color: "var(--purple)" }} />
          </div>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Calculating your risk profile</p>
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Running FINDRISC assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button onClick={step > 0 ? back : () => router.push("/login")} className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={16} />
            {step > 0 ? "Back" : "Exit"}
          </button>
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
              background: "var(--purple)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pt-4 pb-6 max-w-lg mx-auto w-full">
        <div key={step} className="animate-fade-in flex-1 flex flex-col">
          {step === 0 && (
            <>
              <StepHeader title="How old are you?" why="Age is one of the strongest predictors of diabetes risk. Risk increases significantly after 45." />
              <div className="grid grid-cols-2 gap-3 mt-6">
                {([["under45", "Under 45"], ["45-54", "45 - 54"], ["55-64", "55 - 64"], ["65+", "65 or older"]] as const).map(([value, label]) => (
                  <OptionCard key={value} selected={ageRange === value} onClick={() => setAgeRange(value)} label={label} />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <StepHeader title="What is your biological sex?" why="Diabetes risk factors differ between biological sexes, particularly around waist circumference thresholds." />
              <div className="grid grid-cols-2 gap-3 mt-6">
                <OptionCard selected={sex === "male"} onClick={() => setSex("male")} label="Male" />
                <OptionCard selected={sex === "female"} onClick={() => setSex("female")} label="Female" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeader title="Height and weight" why="We use these to calculate your BMI, which is a key indicator in diabetes risk assessment." />
              <div className="flex flex-col gap-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="170"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border-input)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "16px" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="75"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border-input)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "16px" }}
                  />
                </div>
                {bmi && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Your BMI:</span>
                    <span className="text-sm font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>{bmi}</span>
                    <span className="text-xs" style={{ color: parseFloat(bmi) < 25 ? "var(--teal-text)" : parseFloat(bmi) <= 30 ? "var(--amber-text)" : "var(--red-text)" }}>
                      {parseFloat(bmi) < 25 ? "Normal" : parseFloat(bmi) <= 30 ? "Overweight" : "Obese"}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeader title="Waist circumference" why="Abdominal fat distribution is a strong predictor of metabolic risk, independent of overall weight." />
              <p className="text-xs leading-relaxed mt-2 mb-6" style={{ color: "var(--text-muted)" }}>
                Measure around your midsection at the level of your navel, standing up, breathing normally. Keep the tape snug but not tight.
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Waist (cm)</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  placeholder={sex === "female" ? "80" : "94"}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border-input)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "16px" }}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <StepHeader title="Physical activity" why="Regular physical activity significantly reduces diabetes risk, even without weight loss." />
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Do you get at least 30 minutes of physical activity daily?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <OptionCard selected={physicalActivity === true} onClick={() => setPhysicalActivity(true)} label="Yes" />
                <OptionCard selected={physicalActivity === false} onClick={() => setPhysicalActivity(false)} label="No" />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <StepHeader title="Diet" why="Daily fruit and vegetable intake is associated with better blood sugar regulation and lower diabetes risk." />
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Do you eat fruits or vegetables every day?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <OptionCard selected={dailyFruitVeg === true} onClick={() => setDailyFruitVeg(true)} label="Yes" />
                <OptionCard selected={dailyFruitVeg === false} onClick={() => setDailyFruitVeg(false)} label="No" />
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <StepHeader title="Medical history" why="Previous indicators of metabolic issues are important signals for future risk." />
              <div className="flex flex-col gap-5 mt-4">
                <div>
                  <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
                    Have you ever taken blood pressure medication?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionCard selected={bloodPressureMeds === true} onClick={() => setBloodPressureMeds(true)} label="Yes" />
                    <OptionCard selected={bloodPressureMeds === false} onClick={() => setBloodPressureMeds(false)} label="No" />
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--divider)", paddingTop: "20px" }}>
                  <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
                    Have you ever been told you have high blood glucose?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionCard selected={highGlucose === true} onClick={() => setHighGlucose(true)} label="Yes" />
                    <OptionCard selected={highGlucose === false} onClick={() => setHighGlucose(false)} label="No" />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <StepHeader title="Family history" why="Genetic factors play a significant role in diabetes risk. Closer relatives mean higher shared risk." />
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Has anyone in your family been diagnosed with diabetes (Type 1 or Type 2)?
              </p>
              <div className="flex flex-col gap-3">
                <OptionCard selected={familyDiabetes === "none"} onClick={() => setFamilyDiabetes("none")} label="No family history" />
                <OptionCard selected={familyDiabetes === "grandparent_aunt_uncle_cousin"} onClick={() => setFamilyDiabetes("grandparent_aunt_uncle_cousin")} label="Grandparent, aunt, uncle, or cousin" />
                <OptionCard selected={familyDiabetes === "parent_sibling_child"} onClick={() => setFamilyDiabetes("parent_sibling_child")} label="Parent, sibling, or child" />
              </div>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Next button */}
          <button
            onClick={next}
            disabled={!canProceed()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold mt-6"
            style={{
              background: canProceed() ? "var(--purple)" : "var(--bg-elevated)",
              color: canProceed() ? "white" : "var(--text-faint)",
              border: canProceed() ? "none" : "1px solid var(--border)",
              cursor: canProceed() ? "pointer" : "default",
            }}
          >
            {step === TOTAL_STEPS - 1 ? "Calculate my risk" : "Continue"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ title, why }: { title: string; why: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-2" style={{ color: "var(--text)" }}>{title}</h2>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{why}</p>
    </div>
  );
}

function OptionCard({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3.5 rounded-xl text-sm font-semibold text-left"
      style={{
        background: selected ? "var(--purple-bg)" : "var(--bg-card)",
        border: selected ? "1.5px solid var(--purple)" : "1px solid var(--border)",
        color: selected ? "var(--purple-text)" : "var(--text)",
      }}
    >
      {label}
    </button>
  );
}
