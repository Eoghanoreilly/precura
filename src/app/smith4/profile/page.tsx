"use client";

import {
  PATIENT,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
  MEDICATIONS,
  CONDITIONS,
  FAMILY_HISTORY,
  BLOOD_TEST_HISTORY,
} from "@/lib/v2/mock-patient";

const latestBio = BIOMETRICS_HISTORY[0];

export default function ProfilePage() {
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px" }}>
      {/* Header */}
      <div style={{ paddingTop: "20px", marginBottom: "24px", textAlign: "center" }}>
        {/* Avatar */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "40px",
          background: "linear-gradient(135deg, #FA6847, #FF9A56)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
          boxShadow: "0 4px 16px rgba(250,104,71,0.3)",
        }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "32px" }}>
            {PATIENT.firstName[0]}
          </span>
        </div>
        <h1 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "24px", margin: "0 0 4px" }}>
          {PATIENT.name}
        </h1>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "14px", margin: 0 }}>
          Member since {new Date(PATIENT.memberSince).toLocaleDateString("en-SE", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { value: TRAINING_PLAN.totalCompleted.toString(), label: "Workouts" },
          { value: BLOOD_TEST_HISTORY.length.toString(), label: "Blood Tests" },
          { value: `W${TRAINING_PLAN.currentWeek}`, label: "Current" },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              background: "#FFFBF9",
              border: "2px solid #FFD4C4",
              borderRadius: "20px",
              padding: "16px 12px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#FA6847", fontWeight: 900, fontSize: "22px", margin: 0 }}>
              {stat.value}
            </p>
            <p style={{ color: "#A0674A", fontWeight: 700, fontSize: "12px", margin: "4px 0 0" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Membership card */}
      <div style={{
        background: "linear-gradient(135deg, #FA6847, #FF6B4A)",
        borderRadius: "20px",
        padding: "24px 20px",
        marginBottom: "16px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: "-10px", left: "30%", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "13px", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Annual Membership
              </p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: "28px", margin: "4px 0 0" }}>
                {PATIENT.membershipPrice.toLocaleString()} SEK/yr
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "6px 12px",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "13px" }}>Active</span>
            </div>
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "12px", margin: 0 }}>Includes</p>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "13px", margin: "2px 0 0" }}>
                Blood tests + Training + Doctor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your trainer */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          Your Trainer
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #FA6847, #FF9A56)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "22px" }}>E</span>
          </div>
          <div>
            <p style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "16px", margin: 0 }}>
              Eoghan O&apos;Reilly
            </p>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "2px 0 0" }}>
              Certified Personal Trainer
            </p>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "4px 0 0", lineHeight: 1.4 }}>
              Your program is designed around your blood work and metabolic risk. Every exercise targets insulin sensitivity and cardiovascular health.
            </p>
          </div>
        </div>
      </div>

      {/* Your doctor */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          Your Doctor
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            background: "rgba(250,104,71,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FA6847" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "16px", margin: 0 }}>
              Dr. Marcus Johansson
            </p>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "2px 0 0" }}>
              Precura Medical Director
            </p>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "4px 0 0" }}>
              Reviews your blood work, coordinates with your trainer
            </p>
          </div>
        </div>
      </div>

      {/* Health snapshot */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          Health Snapshot
        </h3>
        {[
          { label: "Age", value: `${PATIENT.age} years` },
          { label: "Weight", value: `${latestBio.weight} kg` },
          { label: "BMI", value: `${latestBio.bmi}` },
          { label: "Blood Pressure", value: `${latestBio.bloodPressure} (on medication)` },
          { label: "Waist", value: `${latestBio.waist} cm` },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: idx < 4 ? "1px solid #FFE8E0" : "none",
            }}
          >
            <span style={{ color: "#A0674A", fontWeight: 700, fontSize: "14px" }}>
              {item.label}
            </span>
            <span style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Current conditions */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          Active Conditions
        </h3>
        {CONDITIONS.filter((c) => c.status === "active").map((condition, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 0",
              borderBottom: idx < CONDITIONS.filter((c) => c.status === "active").length - 1 ? "1px solid #FFE8E0" : "none",
            }}
          >
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              background: "#FF9A56",
              flexShrink: 0,
            }} />
            <div>
              <p style={{ color: "#5A1A1A", fontWeight: 700, fontSize: "14px", margin: 0 }}>
                {condition.name}
              </p>
              <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "2px 0 0" }}>
                Since {condition.diagnosedDate}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Medications */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 16px" }}>
          Current Medications
        </h3>
        {MEDICATIONS.filter((m) => m.active).map((med, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px 0",
              borderBottom: idx < MEDICATIONS.filter((m) => m.active).length - 1 ? "1px solid #FFE8E0" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "14px", margin: 0 }}>
                {med.name} {med.dose}
              </p>
              <span style={{
                color: "#47B881",
                fontWeight: 700,
                fontSize: "11px",
                background: "rgba(71,184,129,0.1)",
                padding: "2px 8px",
                borderRadius: "6px",
              }}>
                Active
              </span>
            </div>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "4px 0 0" }}>
              {med.frequency} / {med.purpose}
            </p>
          </div>
        ))}
      </div>

      {/* Family history */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <h3 style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "17px", margin: "0 0 12px" }}>
          Family History
        </h3>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "0 0 16px", lineHeight: 1.5 }}>
          This is why prevention matters. Training targets the risks you inherited.
        </p>
        {FAMILY_HISTORY.map((member, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "10px 0",
              borderBottom: idx < FAMILY_HISTORY.length - 1 ? "1px solid #FFE8E0" : "none",
            }}
          >
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              background: "#FF5555",
              marginTop: "6px",
              flexShrink: 0,
            }} />
            <div>
              <p style={{ color: "#5A1A1A", fontWeight: 700, fontSize: "14px", margin: 0 }}>
                {member.relative}: {member.condition}
              </p>
              <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "2px 0 0" }}>
                Diagnosed at {member.ageAtDiagnosis} / {member.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Next blood test */}
      <div style={{
        background: "#FFFBF9",
        border: "2px solid #FFD4C4",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: "rgba(250,104,71,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FA6847" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p style={{ color: "#5A1A1A", fontWeight: 800, fontSize: "15px", margin: 0 }}>
              Next Blood Test
            </p>
            <p style={{ color: "#FA6847", fontWeight: 700, fontSize: "14px", margin: "2px 0 0" }}>
              September 15, 2026
            </p>
            <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: "2px 0 0" }}>
              6-month follow-up to check if training is bending the glucose curve
            </p>
          </div>
        </div>
      </div>

      {/* App info */}
      <div style={{
        textAlign: "center",
        padding: "20px 0 24px",
      }}>
        <p style={{ color: "#5A1A1A", fontWeight: 900, fontSize: "18px", margin: "0 0 4px" }}>
          Precura
        </p>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "13px", margin: "0 0 2px" }}>
          Train to Prevent
        </p>
        <p style={{ color: "#A0674A", fontWeight: 600, fontSize: "12px", margin: 0 }}>
          {PATIENT.membershipPrice.toLocaleString()} SEK/year
        </p>
      </div>
    </div>
  );
}
