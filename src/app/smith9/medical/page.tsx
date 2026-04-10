"use client";

import Link from "next/link";
import {
  ArrowLeft, Stethoscope, Pill, Syringe, AlertTriangle,
  FileText, Clock, CheckCircle, XCircle, Calendar,
} from "lucide-react";
import {
  CONDITIONS, MEDICATIONS, MEDICATION_HISTORY,
  VACCINATIONS, ALLERGIES, DOCTOR_VISITS, PATIENT,
} from "@/lib/v2/mock-patient";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MedicalPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Top Bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248, 249, 250, 0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Link href="/smith9" style={{
            width: 36, height: 36, borderRadius: 12,
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            <ArrowLeft size={16} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Medical Record</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{PATIENT.name} - from 1177 + Precura</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Conditions */}
        <div className="animate-fade-in" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 20px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Stethoscope size={16} style={{ color: "#3730a3" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Conditions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CONDITIONS.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 14px", borderRadius: 12,
                background: c.status === "active" ? "var(--bg-elevated)" : "var(--bg)",
                border: "1px solid var(--divider)",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: c.status === "active" ? "var(--amber-bg)" : "var(--green-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {c.status === "active" ? (
                    <AlertTriangle size={14} style={{ color: "var(--amber-text)" }} />
                  ) : (
                    <CheckCircle size={14} style={{ color: "var(--green-text)" }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    ICD-10: {c.icd10} / Diagnosed: {formatDate(c.diagnosedDate)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Treated by: {c.treatedBy}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 8px",
                    borderRadius: 5, marginTop: 4, display: "inline-block",
                    background: c.status === "active" ? "var(--amber-bg)" : "var(--green-bg)",
                    color: c.status === "active" ? "var(--amber-text)" : "var(--green-text)",
                    textTransform: "uppercase",
                  }}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Medications */}
        <div className="animate-fade-in stagger-1" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 20px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Pill size={16} style={{ color: "var(--blue-text)" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Active Medications</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MEDICATIONS.filter((m) => m.active).map((m, i) => (
              <div key={i} style={{
                padding: "14px 16px", borderRadius: 12,
                background: "var(--blue-bg)", border: "1px solid rgba(66, 165, 245, 0.15)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{m.name} {m.dose}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 8px",
                    borderRadius: 5, background: "var(--green-bg)", color: "var(--green-text)",
                    textTransform: "uppercase",
                  }}>
                    Active
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Frequency</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.frequency}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Purpose</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.purpose}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Started</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatDate(m.startDate)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Prescribed by</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.prescribedBy}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Medications */}
        <div className="animate-fade-in stagger-2" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 20px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Clock size={16} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Past Medications</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MEDICATION_HISTORY.map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 0",
                borderBottom: i < MEDICATION_HISTORY.length - 1 ? "1px solid var(--divider)" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: "var(--bg-elevated)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Pill size={13} style={{ color: "var(--text-muted)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{m.name} {m.dose}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {m.frequency} - {m.purpose}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {formatDate(m.startDate)} to {formatDate(m.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="animate-fade-in stagger-3" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 20px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} style={{ color: "var(--amber-text)" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Allergies</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ALLERGIES.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 10,
                background: a.severity !== "none" ? "var(--amber-bg)" : "var(--green-bg)",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: a.severity !== "none" ? "var(--amber)" : "var(--green)",
                }} />
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 500,
                    color: a.severity !== "none" ? "var(--amber-text)" : "var(--green-text)",
                  }}>
                    {a.substance}
                  </div>
                  {a.reaction && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Reaction: {a.reaction} ({a.severity})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccinations */}
        <div className="animate-fade-in stagger-4" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 20px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Syringe size={16} style={{ color: "var(--teal-text)" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Vaccinations</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {VACCINATIONS.map((v, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                borderBottom: i < VACCINATIONS.length - 1 ? "1px solid var(--divider)" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: "var(--teal-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Syringe size={13} style={{ color: "var(--teal-text)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.provider}</div>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(v.date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Visits Timeline */}
        <div className="animate-fade-in stagger-5" style={{
          background: "var(--bg-card)", borderRadius: 18,
          border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: "20px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Calendar size={16} style={{ color: "#3730a3" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Doctor Visits</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
              {DOCTOR_VISITS.length} visits
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute", left: 13, top: 20, bottom: 20,
              width: 2, background: "var(--divider)",
            }} />

            {DOCTOR_VISITS.map((visit, i) => {
              const isPrecura = visit.provider.includes("Precura");
              return (
                <div key={i} style={{
                  display: "flex", gap: 16,
                  padding: "12px 0",
                  position: "relative",
                }}>
                  {/* Timeline dot */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                    background: isPrecura ? "#3730a3" : "var(--bg-elevated)",
                    border: `2px solid ${isPrecura ? "#3730a3" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1,
                  }}>
                    <FileText size={12} style={{ color: isPrecura ? "#fff" : "var(--text-muted)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{visit.type}</span>
                      {isPrecura && (
                        <span style={{
                          fontSize: 9, fontWeight: 600, padding: "2px 6px",
                          borderRadius: 4, background: "#3730a3", color: "#fff",
                        }}>
                          PRECURA
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                      {visit.provider} - {formatDate(visit.date)}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {visit.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
