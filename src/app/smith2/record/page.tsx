"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Pill,
  Stethoscope,
  Users,
  Syringe,
  AlertCircle,
  Clock,
  Calendar,
  FileText,
  CheckCircle,
} from "lucide-react";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  MEDICATION_HISTORY,
  DOCTOR_VISITS,
  FAMILY_HISTORY,
  VACCINATIONS,
  ALLERGIES,
  AI_PATIENT_SUMMARY,
} from "@/lib/v2/mock-patient";

const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type Section = "conditions" | "medications" | "visits" | "family" | "vaccinations" | "allergies";

export default function RecordPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("conditions");
  const [expandedVisit, setExpandedVisit] = useState<number | null>(0);

  const sections: { key: Section; label: string; count: number; icon: typeof Pill }[] = [
    { key: "conditions", label: "Conditions", count: CONDITIONS.length, icon: Stethoscope },
    { key: "medications", label: "Medications", count: MEDICATIONS.filter((m) => m.active).length, icon: Pill },
    { key: "visits", label: "Visits", count: DOCTOR_VISITS.length, icon: Calendar },
    { key: "family", label: "Family", count: FAMILY_HISTORY.length, icon: Users },
    { key: "vaccinations", label: "Vaccines", count: VACCINATIONS.length, icon: Syringe },
    { key: "allergies", label: "Allergies", count: ALLERGIES.length, icon: AlertCircle },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
          padding: "12px 20px",
        }}
      >
        <div style={{ maxWidth: 448, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/smith2")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Medical record</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{PATIENT.name} - What Dr. Johansson sees</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* ----------------------------------------------------------------- */}
        {/* PATIENT SUMMARY (what the doctor sees)                            */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in"
          style={{
            background: `linear-gradient(135deg, ${DOC_BG} 0%, #ecfdf5 100%)`,
            borderRadius: 18,
            padding: "18px",
            marginBottom: 20,
            border: `1px solid ${DOC_BORDER}`,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img
              src={DOC_AVATAR}
              alt=""
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `2px solid ${DOC_COLOR}` }}
            />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                Dr. Johansson's patient summary
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                This is the complete picture your doctor works from
              </p>
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              borderRadius: 12,
              padding: "14px",
              maxHeight: 200,
              overflow: "auto",
            }}
          >
            {AI_PATIENT_SUMMARY.split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}
                >
                  {line}
                </p>
              ))}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION TABS                                                      */}
        {/* ----------------------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 16,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap" as const,
                border: "1px solid",
                cursor: "pointer",
                flexShrink: 0,
                ...(activeSection === s.key
                  ? { background: DOC_COLOR, color: "#ffffff", borderColor: DOC_COLOR }
                  : { background: "var(--bg-card)", color: "var(--text-secondary)", borderColor: "var(--border)" }),
              }}
            >
              {s.label}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: 8,
                  background: activeSection === s.key ? "rgba(255,255,255,0.25)" : "var(--bg-elevated)",
                }}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* CONDITIONS                                                        */}
        {/* ----------------------------------------------------------------- */}
        {activeSection === "conditions" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONDITIONS.map((c, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{c.name}</p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: c.status === "active" ? "var(--amber-bg)" : "var(--green-bg)",
                      color: c.status === "active" ? "var(--amber-text)" : "var(--green-text)",
                    }}
                  >
                    {c.status === "active" ? "Active" : "Resolved"}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  ICD-10: {c.icd10} - Diagnosed {formatDate(c.diagnosedDate)}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {c.treatedBy}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* MEDICATIONS                                                       */}
        {/* ----------------------------------------------------------------- */}
        {activeSection === "medications" && (
          <div className="animate-fade-in">
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              Current medications
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {MEDICATIONS.filter((m) => m.active).map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      {m.name} {m.dose}
                    </p>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: DOC_BG,
                        color: DOC_COLOR,
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {m.frequency} - {m.purpose}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    Prescribed by {m.prescribedBy} on {formatDate(m.startDate)}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              Past medications
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MEDICATION_HISTORY.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    opacity: 0.75,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    {m.name} {m.dose}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {m.frequency} - {m.purpose}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    {formatDate(m.startDate)} to {formatDate(m.endDate!)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VISITS                                                            */}
        {/* ----------------------------------------------------------------- */}
        {activeSection === "visits" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DOCTOR_VISITS.map((v, i) => {
              const isExpanded = expandedVisit === i;
              const isPrecura = v.provider.includes("Precura");
              return (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setExpandedVisit(isExpanded ? null : i)}
                    style={{
                      width: "100%",
                      textAlign: "left" as const,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isPrecura ? DOC_COLOR : "var(--text-faint)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{v.type}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {formatDate(v.date)} - {v.provider}
                      </p>
                    </div>
                    {isPrecura && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: 6,
                          background: DOC_BG,
                          color: DOC_COLOR,
                        }}
                      >
                        Precura
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp size={14} style={{ color: "var(--text-faint)" }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: "var(--text-faint)" }} />
                    )}
                  </button>
                  {isExpanded && (
                    <div style={{ padding: "0 14px 12px" }}>
                      <div
                        style={{
                          background: "var(--bg-elevated)",
                          borderRadius: 10,
                          padding: "10px 12px",
                        }}
                      >
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                          {v.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* FAMILY HISTORY                                                    */}
        {/* ----------------------------------------------------------------- */}
        {activeSection === "family" && (
          <div className="animate-fade-in">
            <div
              style={{
                background: "var(--amber-bg)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #ffecb3",
              }}
            >
              <AlertCircle size={14} style={{ color: "var(--amber-text)" }} />
              <p style={{ fontSize: 12, color: "var(--amber-text)" }}>
                Family history is a non-changeable risk factor. Dr. Johansson weighs this in all assessments.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FAMILY_HISTORY.map((fh, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{fh.relative}</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 3 }}>
                    {fh.condition} - diagnosed at age {fh.ageAtDiagnosis}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{fh.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VACCINATIONS                                                      */}
        {/* ----------------------------------------------------------------- */}
        {activeSection === "vaccinations" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {VACCINATIONS.map((v, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <CheckCircle size={16} style={{ color: "var(--green)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{v.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {formatDate(v.date)} - {v.provider}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* ALLERGIES                                                         */}
        {/* ----------------------------------------------------------------- */}
        {activeSection === "allergies" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ALLERGIES.map((a, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{a.substance}</p>
                  {a.severity !== "none" && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "var(--amber-bg)",
                        color: "var(--amber-text)",
                        textTransform: "capitalize",
                      }}
                    >
                      {a.severity}
                    </span>
                  )}
                </div>
                {a.reaction && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{a.reaction}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
