"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Pill, Syringe, AlertTriangle, Heart,
  Activity, Scale, ChevronDown, ChevronUp, CheckCircle,
  XCircle, Clock,
} from "lucide-react";
import {
  PATIENT, CONDITIONS, MEDICATIONS, MEDICATION_HISTORY,
  VACCINATIONS, ALLERGIES, BIOMETRICS_HISTORY, FAMILY_HISTORY,
} from "@/lib/v2/mock-patient";

const HEALTHCARE_BLUE = "#1862a5";
const HEALTHCARE_BLUE_LIGHT = "#e8f0fb";
const HEALTHCARE_BLUE_DARK = "#0f4c81";
const WARM_BG = "#f7f8fa";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_SECONDARY = "#4a5568";
const TEXT_MUTED = "#718096";
const BORDER_COLOR = "#e2e8f0";
const SUCCESS_GREEN = "#16a34a";
const WARNING_AMBER = "#d97706";
const RISK_RED = "#dc2626";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Section tab type
type TabId = "diagnoser" | "lakemedel" | "vaccinationer" | "allergier" | "biometri" | "arftlighet";

export default function Smith6Halsodata() {
  const [activeTab, setActiveTab] = useState<TabId>("diagnoser");
  const [showPastMeds, setShowPastMeds] = useState(false);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "diagnoser", label: "Diagnoser", count: CONDITIONS.length },
    { id: "lakemedel", label: "Lakemedel", count: MEDICATIONS.length },
    { id: "vaccinationer", label: "Vaccinationer", count: VACCINATIONS.length },
    { id: "allergier", label: "Allergier", count: ALLERGIES.length },
    { id: "biometri", label: "Biometri", count: BIOMETRICS_HISTORY.length },
    { id: "arftlighet", label: "Arftlighet", count: FAMILY_HISTORY.length },
  ];

  return (
    <div style={{ background: WARM_BG, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: HEALTHCARE_BLUE,
          color: "white",
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link
            href="/smith6"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={22} />
          </Link>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Halsodata</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Din samlade medicinska information
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "20px 20px 80px",
        }}
      >
        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 20,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: `2px solid ${
                  activeTab === tab.id ? HEALTHCARE_BLUE : BORDER_COLOR
                }`,
                background:
                  activeTab === tab.id ? HEALTHCARE_BLUE : CARD_BG,
                color:
                  activeTab === tab.id ? "white" : TEXT_SECONDARY,
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      activeTab === tab.id
                        ? "rgba(255,255,255,0.25)"
                        : "#f1f5f9",
                    padding: "1px 7px",
                    borderRadius: 10,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Diagnoser */}
        {activeTab === "diagnoser" && (
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: TEXT_MUTED,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
                borderBottom: `1px solid ${BORDER_COLOR}`,
              }}
            >
              Registrerade diagnoser
            </div>

            {CONDITIONS.map((c, i) => (
              <div
                key={c.name}
                style={{
                  padding: "18px 20px",
                  borderBottom:
                    i < CONDITIONS.length - 1
                      ? `1px solid ${BORDER_COLOR}`
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                        marginBottom: 4,
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 14, color: TEXT_MUTED }}>
                      ICD-10: {c.icd10}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        c.status === "active"
                          ? HEALTHCARE_BLUE
                          : SUCCESS_GREEN,
                      background:
                        c.status === "active"
                          ? HEALTHCARE_BLUE_LIGHT
                          : "#ecfdf5",
                      padding: "4px 12px",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {c.status === "active" ? (
                      <Clock size={13} />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    {c.status === "active" ? "Aktiv" : "Utlakt"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: TEXT_SECONDARY,
                    lineHeight: 1.5,
                  }}
                >
                  <div>Diagnostiserad: {formatDate(c.diagnosedDate)}</div>
                  <div>Av: {c.treatedBy}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lakemedel */}
        {activeTab === "lakemedel" && (
          <div>
            {/* Active meds */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.5,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: SUCCESS_GREEN,
                  }}
                />
                Aktuella lakemedel
              </div>

              {MEDICATIONS.filter((m) => m.active).map((m, i) => (
                <div
                  key={m.name}
                  style={{
                    padding: "18px 20px",
                    borderBottom:
                      i < MEDICATIONS.filter((med) => med.active).length - 1
                        ? `1px solid ${BORDER_COLOR}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: "#f0fdf4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Pill size={22} color={SUCCESS_GREEN} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 600,
                          color: TEXT_PRIMARY,
                          marginBottom: 4,
                        }}
                      >
                        {m.name} {m.dose}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          color: TEXT_SECONDARY,
                          lineHeight: 1.5,
                        }}
                      >
                        {m.frequency} - {m.purpose}
                      </div>
                      <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 4 }}>
                        Forskrivet av {m.prescribedBy} - sedan{" "}
                        {formatDate(m.startDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Past medications */}
            <button
              onClick={() => setShowPastMeds(!showPastMeds)}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: showPastMeds ? 0 : 0,
                borderBottomLeftRadius: showPastMeds ? 0 : 12,
                borderBottomRightRadius: showPastMeds ? 0 : 12,
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: TEXT_SECONDARY,
                }}
              >
                Tidigare lakemedel ({MEDICATION_HISTORY.length})
              </span>
              {showPastMeds ? (
                <ChevronUp size={20} color={TEXT_MUTED} />
              ) : (
                <ChevronDown size={20} color={TEXT_MUTED} />
              )}
            </button>

            {showPastMeds && (
              <div
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER_COLOR}`,
                  borderTop: "none",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  overflow: "hidden",
                }}
              >
                {MEDICATION_HISTORY.map((m, i) => (
                  <div
                    key={m.name + m.startDate}
                    style={{
                      padding: "16px 20px",
                      borderBottom:
                        i < MEDICATION_HISTORY.length - 1
                          ? `1px solid ${BORDER_COLOR}`
                          : "none",
                      opacity: 0.75,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                        marginBottom: 4,
                      }}
                    >
                      {m.name} {m.dose}
                    </div>
                    <div style={{ fontSize: 14, color: TEXT_SECONDARY }}>
                      {m.frequency} - {m.purpose}
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                      {formatDate(m.startDate)} - {formatDate(m.endDate!)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vaccinationer */}
        {activeTab === "vaccinationer" && (
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: TEXT_MUTED,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
                borderBottom: `1px solid ${BORDER_COLOR}`,
              }}
            >
              Vaccinationshistorik
            </div>

            {VACCINATIONS.map((v, i) => (
              <div
                key={v.name + v.date}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    i < VACCINATIONS.length - 1
                      ? `1px solid ${BORDER_COLOR}`
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: HEALTHCARE_BLUE_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Syringe size={20} color={HEALTHCARE_BLUE} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                      marginBottom: 2,
                    }}
                  >
                    {v.name}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED }}>
                    {formatDate(v.date)} - {v.provider}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Allergier */}
        {activeTab === "allergier" && (
          <div
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: TEXT_MUTED,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
                borderBottom: `1px solid ${BORDER_COLOR}`,
              }}
            >
              Registrerade allergier
            </div>

            {ALLERGIES.map((a, i) => (
              <div
                key={a.substance}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    i < ALLERGIES.length - 1
                      ? `1px solid ${BORDER_COLOR}`
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                      marginBottom: 2,
                    }}
                  >
                    {a.substance}
                  </div>
                  {a.reaction && (
                    <div style={{ fontSize: 14, color: TEXT_SECONDARY }}>
                      Reaktion: {a.reaction}
                    </div>
                  )}
                </div>
                {a.severity !== "none" && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        a.severity === "mild"
                          ? WARNING_AMBER
                          : a.severity === "moderate"
                          ? "#ea580c"
                          : RISK_RED,
                      background:
                        a.severity === "mild"
                          ? "#fffbeb"
                          : a.severity === "moderate"
                          ? "#fff7ed"
                          : "#fef2f2",
                      padding: "4px 12px",
                      borderRadius: 10,
                    }}
                  >
                    {a.severity === "mild"
                      ? "Mild"
                      : a.severity === "moderate"
                      ? "Mattlig"
                      : "Allvarlig"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Biometri */}
        {activeTab === "biometri" && (
          <div>
            {/* Latest measurements */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.5,
                  marginBottom: 16,
                }}
              >
                Senaste matning - {formatShortDate(BIOMETRICS_HISTORY[0].date)}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  {
                    label: "Vikt (weight)",
                    value: `${BIOMETRICS_HISTORY[0].weight} kg`,
                    icon: <Scale size={18} color={HEALTHCARE_BLUE} />,
                  },
                  {
                    label: "BMI",
                    value: `${BIOMETRICS_HISTORY[0].bmi}`,
                    icon: <Activity size={18} color={HEALTHCARE_BLUE} />,
                  },
                  {
                    label: "Midjematt (waist)",
                    value: `${BIOMETRICS_HISTORY[0].waist} cm`,
                    icon: <Activity size={18} color={HEALTHCARE_BLUE} />,
                  },
                  {
                    label: "Blodtryck (blood pressure)",
                    value: BIOMETRICS_HISTORY[0].bloodPressure,
                    icon: <Heart size={18} color={HEALTHCARE_BLUE} />,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "14px",
                      borderRadius: 10,
                      background: "#f8fafc",
                      border: `1px solid ${BORDER_COLOR}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      {item.icon}
                      <span
                        style={{
                          fontSize: 13,
                          color: TEXT_MUTED,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical table */}
            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.5,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                }}
              >
                Historik
              </div>

              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr",
                  padding: "10px 20px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  background: "#f8fafc",
                }}
              >
                <div>Datum</div>
                <div>Vikt</div>
                <div>BMI</div>
                <div>Midja</div>
                <div>Blodtryck</div>
              </div>

              {BIOMETRICS_HISTORY.map((b, i) => (
                <div
                  key={b.date}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr",
                    padding: "12px 20px",
                    fontSize: 14,
                    color: TEXT_PRIMARY,
                    borderBottom:
                      i < BIOMETRICS_HISTORY.length - 1
                        ? `1px solid ${BORDER_COLOR}`
                        : "none",
                    background: i === 0 ? HEALTHCARE_BLUE_LIGHT + "44" : "transparent",
                  }}
                >
                  <div style={{ fontWeight: i === 0 ? 600 : 400 }}>
                    {formatShortDate(b.date)}
                  </div>
                  <div>{b.weight} kg</div>
                  <div>{b.bmi}</div>
                  <div>{b.waist} cm</div>
                  <div>{b.bloodPressure}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Arftlighet (Family history) */}
        {activeTab === "arftlighet" && (
          <div>
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 16,
                fontSize: 15,
                color: "#92400e",
                lineHeight: 1.5,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                Din arftlighet visar att diabetes och hjart-karlsjukdom
                forekommit i familjen. Det okar din risk, men livsstilsforandringar
                kan gora stor skillnad. Din lakare bevakar detta.
              </div>
            </div>

            <div
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.5,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                }}
              >
                Familjehistorik
              </div>

              {FAMILY_HISTORY.map((f, i) => (
                <div
                  key={f.relative}
                  style={{
                    padding: "18px 20px",
                    borderBottom:
                      i < FAMILY_HISTORY.length - 1
                        ? `1px solid ${BORDER_COLOR}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {f.relative}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: TEXT_MUTED,
                      }}
                    >
                      Diagnostiserad vid {f.ageAtDiagnosis} ars alder
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: TEXT_SECONDARY,
                      marginBottom: 4,
                    }}
                  >
                    {f.condition}
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_MUTED }}>
                    Status: {f.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
