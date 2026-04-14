"use client";

import Link from "next/link";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  DOCTOR_NOTES,
  FAMILY_HISTORY,
  BIOMETRICS_HISTORY,
  CONDITIONS,
  MEDICATIONS,
  getMarkerHistory,
  getLatestMarker,
} from "@/lib/v2/mock-patient";

// ============================================================================
// Dr. Johansson's Assessment
// The doctor's view of Anna's health, presented to Anna.
// Blood markers, risk models, family history, trajectory.
// ============================================================================

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "normal":
      return { bg: "#E8F5E9", text: "#7FA876" };
    case "borderline":
      return { bg: "#FFF3E0", text: "#E8A856" };
    case "abnormal":
      return { bg: "#FFEBEE", text: "#D45C5C" };
    default:
      return { bg: "#F5F1E8", text: "#6B5D52" };
  }
}

function riskColor(level: string): { bg: string; text: string; label: string } {
  switch (level) {
    case "low":
      return { bg: "#E8F5E9", text: "#7FA876", label: "Low risk" };
    case "low_moderate":
      return { bg: "#FFF8E1", text: "#E8A856", label: "Low-moderate risk" };
    case "moderate":
      return { bg: "#FFF3E0", text: "#E8A856", label: "Moderate risk" };
    case "high":
      return { bg: "#FFEBEE", text: "#D45C5C", label: "High risk" };
    default:
      return { bg: "#F5F1E8", text: "#6B5D52", label: level };
  }
}

export default function AssessmentPage() {
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const latestNote = DOCTOR_NOTES[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const cholesterolHistory = getMarkerHistory("TC");
  const hba1cHistory = getMarkerHistory("HbA1c");
  const latestBio = BIOMETRICS_HISTORY[0];

  return (
    <div
      style={{
        background: "#F5F1E8",
        color: "#2C2416",
        minHeight: "100dvh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#F5F1E8",
          borderBottom: "1px solid #E8DFD3",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "14px 20px",
          }}
        >
          <Link
            href="/smith2"
            style={{
              textDecoration: "none",
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            &lsaquo; Home
          </Link>
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 16,
              fontWeight: 700,
              color: "#2C2416",
            }}
          >
            Precura
          </span>
          <div style={{ width: 40 }} />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {/* Page title */}
        <div style={{ paddingTop: 24, paddingBottom: 4 }}>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 24,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Dr. Johansson's Assessment
          </h1>
          <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 4 }}>
            Last updated {formatDate(latestNote.date)}
          </p>
        </div>

        {/* ================================================================
            DOCTOR'S SUMMARY - The headline finding
            ================================================================ */}
        <div
          style={{
            background: "#FBF9F6",
            border: "1px solid #E8DFD3",
            borderRadius: 8,
            padding: "20px",
            marginTop: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2C2416 0%, #6B5D52 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FBF9F6",
                fontSize: 13,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              MJ
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                Summary from Dr. Johansson
              </p>
            </div>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.65, color: "#2C2416", margin: 0 }}>
            Your blood sugar (fasting glucose) has been slowly rising over 5 years, from 5.0 to 5.8.
            Each individual test looked normal. But the pattern tells a different story. Combined with
            your family history of diabetes, this puts you at moderate risk. The good news: this is
            exactly the stage where lifestyle changes make the biggest difference.
          </p>
        </div>

        {/* ================================================================
            RISK OVERVIEW
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Risk assessment
          </h2>

          {/* Risk cards */}
          {(
            [
              { key: "diabetes" as const, label: "Diabetes (type 2)", data: RISK_ASSESSMENTS.diabetes },
              { key: "cardiovascular" as const, label: "Cardiovascular disease", data: RISK_ASSESSMENTS.cardiovascular },
              { key: "bone" as const, label: "Bone health", data: RISK_ASSESSMENTS.bone },
            ] as const
          ).map((risk) => {
            const colors = riskColor(risk.data.riskLevel);
            return (
              <div
                key={risk.key}
                style={{
                  background: "#FBF9F6",
                  border: "1px solid #E8DFD3",
                  borderRadius: 8,
                  padding: "18px 20px",
                  marginBottom: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                      {risk.label}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                      10-year risk: {risk.data.tenYearRisk}
                    </p>
                  </div>
                  <div
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {colors.label}
                  </div>
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.55, color: "#6B5D52", margin: 0, marginBottom: 12 }}>
                  {risk.data.summary}
                </p>

                {/* Key factors */}
                <div className="flex flex-col" style={{ gap: 6 }}>
                  {risk.data.keyFactors.map((factor, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                      style={{ fontSize: 13 }}
                    >
                      <span style={{ color: "#2C2416" }}>{factor.name}</span>
                      <div className="flex items-center" style={{ gap: 6 }}>
                        {!factor.changeable && (
                          <span style={{ fontSize: 10, color: "#6B5D52", fontStyle: "italic" }}>
                            not modifiable
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 3,
                            background:
                              factor.impact === "positive"
                                ? "#E8F5E9"
                                : factor.impact === "high"
                                ? "#FFF3E0"
                                : factor.impact === "medium"
                                ? "#FFF8E1"
                                : "#F5F1E8",
                            color:
                              factor.impact === "positive"
                                ? "#7FA876"
                                : factor.impact === "high"
                                ? "#E8A856"
                                : factor.impact === "medium"
                                ? "#E8A856"
                                : "#6B5D52",
                          }}
                        >
                          {factor.impact === "positive" ? "protective" : `${factor.impact} impact`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================
            METABOLIC SYNDROME TRACKER
            ================================================================ */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              background: "#FBF9F6",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                  Metabolic syndrome criteria
                </p>
                <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                  {RISK_ASSESSMENTS.metabolicSyndrome.status}
                </p>
              </div>
              <div
                style={{
                  background: "#FFF3E0",
                  color: "#E8A856",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                {RISK_ASSESSMENTS.metabolicSyndrome.metCount}/5
              </div>
            </div>

            {/* Criteria checklist */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              {RISK_ASSESSMENTS.metabolicSyndrome.criteria.map((c, i) => (
                <div key={i} className="flex items-start" style={{ gap: 10 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: c.met ? "#E8A856" : "#E8DFD3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: c.met ? "#FBF9F6" : "#6B5D52",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {c.met ? "!" : " "}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                      {c.name}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 1 }}>
                      Your value: {c.value}
                      {c.note ? ` - ${c.note}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            BLOOD MARKERS - Latest panel
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 18,
                fontWeight: 700,
                color: "#2C2416",
                margin: 0,
              }}
            >
              Blood markers
            </h2>
            <p style={{ fontSize: 12, color: "#6B5D52", margin: 0 }}>
              {formatDate(latestBlood.date)}
            </p>
          </div>

          <div className="flex flex-col" style={{ gap: 8 }}>
            {latestBlood.results.map((marker) => {
              const colors = statusColor(marker.status);
              const history = getMarkerHistory(marker.shortName);
              const rangeWidth = marker.refHigh - marker.refLow;
              const position = Math.min(
                100,
                Math.max(0, ((marker.value - marker.refLow) / rangeWidth) * 100)
              );

              return (
                <div
                  key={marker.shortName}
                  style={{
                    background: "#FBF9F6",
                    border: "1px solid #E8DFD3",
                    borderRadius: 8,
                    padding: "14px 16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                        {marker.plainName}
                      </p>
                      <p style={{ fontSize: 11, color: "#6B5D52", margin: 0, marginTop: 1 }}>
                        {marker.name} ({marker.shortName})
                      </p>
                    </div>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#2C2416",
                        }}
                      >
                        {marker.value}
                      </span>
                      <span style={{ fontSize: 12, color: "#6B5D52" }}>
                        {marker.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range bar */}
                  <div style={{ position: "relative", marginBottom: 6 }}>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: "#E8DFD3",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Normal range highlight */}
                      <div
                        style={{
                          position: "absolute",
                          left: "10%",
                          right: "10%",
                          top: 0,
                          bottom: 0,
                          background: "#7FA876",
                          opacity: 0.3,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    {/* Marker position */}
                    <div
                      style={{
                        position: "absolute",
                        top: -2,
                        left: `calc(${Math.min(95, Math.max(5, 10 + position * 0.8))}% - 5px)`,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: colors.text,
                        border: "2px solid #FBF9F6",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between" style={{ fontSize: 11, color: "#6B5D52" }}>
                    <span>Ref: {marker.refLow}-{marker.refHigh}</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: colors.text,
                        background: colors.bg,
                        padding: "1px 6px",
                        borderRadius: 3,
                        fontSize: 10,
                      }}
                    >
                      {marker.status}
                    </span>
                  </div>

                  {/* Mini history if more than 1 data point */}
                  {history.length > 1 && (
                    <div className="flex items-center" style={{ gap: 4, marginTop: 8 }}>
                      <span style={{ fontSize: 10, color: "#6B5D52", flexShrink: 0 }}>Trend:</span>
                      <div className="flex items-center" style={{ gap: 2 }}>
                        {history.map((h, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 10,
                              color: i === history.length - 1 ? colors.text : "#6B5D52",
                              fontWeight: i === history.length - 1 ? 700 : 400,
                            }}
                          >
                            {h.value}
                            {i < history.length - 1 ? " / " : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================
            FAMILY HISTORY
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Family history
          </h2>

          <div
            style={{
              background: "#FBF9F6",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex flex-col" style={{ gap: 12 }}>
              {FAMILY_HISTORY.map((f, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div style={{ borderTop: "1px solid #E8DFD3", marginBottom: 12 }} />
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                        {f.relative}
                      </p>
                      <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                        {f.condition} - diagnosed at {f.ageAtDiagnosis}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                    {f.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            CURRENT MEDICATIONS
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Current medications
          </h2>

          <div className="flex flex-col" style={{ gap: 8 }}>
            {MEDICATIONS.filter((m) => m.active).map((med, i) => (
              <div
                key={i}
                style={{
                  background: "#FBF9F6",
                  border: "1px solid #E8DFD3",
                  borderRadius: 8,
                  padding: "14px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                      {med.name} {med.dose}
                    </p>
                    <p style={{ fontSize: 13, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                      {med.frequency} - {med.purpose}
                    </p>
                  </div>
                  <p style={{ fontSize: 11, color: "#6B5D52", margin: 0 }}>
                    by {med.prescribedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================
            BIOMETRICS
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Biometrics
          </h2>

          <div
            style={{
              background: "#FBF9F6",
              border: "1px solid #E8DFD3",
              borderRadius: 8,
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginBottom: 2 }}>Weight</p>
                <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 22, fontWeight: 700, color: "#2C2416", margin: 0 }}>
                  {latestBio.weight}<span style={{ fontSize: 13, fontWeight: 400, color: "#6B5D52" }}> kg</span>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginBottom: 2 }}>BMI</p>
                <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 22, fontWeight: 700, color: "#2C2416", margin: 0 }}>
                  {latestBio.bmi}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginBottom: 2 }}>Blood pressure</p>
                <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 22, fontWeight: 700, color: "#2C2416", margin: 0 }}>
                  {latestBio.bloodPressure}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginBottom: 2 }}>Waist</p>
                <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 22, fontWeight: 700, color: "#2C2416", margin: 0 }}>
                  {latestBio.waist}<span style={{ fontSize: 13, fontWeight: 400, color: "#6B5D52" }}> cm</span>
                </p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 12 }}>
              Last measured {formatDate(latestBio.date)}
            </p>
          </div>
        </div>

        {/* ================================================================
            ACTIVE CONDITIONS
            ================================================================ */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 18,
              fontWeight: 700,
              color: "#2C2416",
              margin: 0,
              marginBottom: 12,
            }}
          >
            Active conditions
          </h2>

          <div className="flex flex-col" style={{ gap: 8 }}>
            {CONDITIONS.filter((c) => c.status === "active").map((cond, i) => (
              <div
                key={i}
                style={{
                  background: "#FBF9F6",
                  border: "1px solid #E8DFD3",
                  borderRadius: 8,
                  padding: "14px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", margin: 0 }}>
                  {cond.name}
                </p>
                <p style={{ fontSize: 12, color: "#6B5D52", margin: 0, marginTop: 2 }}>
                  Diagnosed {formatDate(cond.diagnosedDate)} - {cond.treatedBy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav back */}
        <div style={{ marginTop: 32, textAlign: "center" as const }}>
          <Link
            href="/smith2"
            style={{
              color: "#C97D5C",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            &lsaquo; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
