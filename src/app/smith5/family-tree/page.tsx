"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  User,
  ChevronDown,
  Activity,
} from "lucide-react";
import {
  PATIENT,
  FAMILY_HISTORY,
} from "@/lib/v2/mock-patient";

const PURPLE = {
  deep: "#4a148c",
  primary: "#6a1b9a",
  mid: "#8e24aa",
  light: "#ce93d8",
  pale: "#f3e5f5",
  wash: "#faf5ff",
  accent: "#7c4dff",
};

// Expanded family data for the deep-dive page
const FAMILY_MEMBERS = [
  {
    id: "maternal-grandmother",
    name: "Elsa Lindqvist",
    relation: "Maternal Grandmother (Mormor)",
    born: 1940,
    died: 2018,
    conditions: [
      {
        name: "Type 2 Diabetes (blood sugar disease)",
        ageAtDiagnosis: 62,
        yearDiagnosed: 2002,
        details: "Managed with metformin, later required insulin. Developed peripheral neuropathy (nerve damage in feet) at 70.",
      },
      {
        name: "Hypertension (high blood pressure)",
        ageAtDiagnosis: 55,
        yearDiagnosed: 1995,
        details: "On medication from age 55 onward.",
      },
    ],
    relevance: "Diabetes at 62 is 22 years older than you are now. She also had high blood pressure, which you already have at 40.",
    riskGenes: ["Blood sugar regulation", "Blood pressure"],
    photo: null,
  },
  {
    id: "mother",
    name: "Karin Bergstrom",
    relation: "Mother (Mamma)",
    born: 1967,
    died: null,
    conditions: [
      {
        name: "Type 2 Diabetes (blood sugar disease)",
        ageAtDiagnosis: 58,
        yearDiagnosed: 2025,
        details: "Diagnosed last year after years of borderline readings. Now managed with metformin and diet changes. HbA1c at diagnosis was 52 mmol/mol.",
      },
    ],
    relevance: "Your mum's diabetes appeared 4 years earlier than your grandmother's. The pattern is accelerating. She was diagnosed just 18 years from your current age.",
    riskGenes: ["Blood sugar regulation", "Insulin resistance"],
    photo: null,
  },
  {
    id: "paternal-grandfather",
    name: "Erik Bergstrom",
    relation: "Paternal Grandfather (Farfar)",
    born: 1938,
    died: 2011,
    conditions: [
      {
        name: "Stroke (brain blood clot)",
        ageAtDiagnosis: 71,
        yearDiagnosed: 2009,
        details: "Ischemic stroke at 71. Partial recovery but required care. Passed away 2 years later.",
      },
      {
        name: "High cholesterol",
        ageAtDiagnosis: 60,
        yearDiagnosed: 1998,
        details: "On statins from age 60. Cholesterol was reportedly very high before treatment.",
      },
    ],
    relevance: "Cardiovascular disease from the other side of your family. Combined with your father's heart attack, this doubles the cardiovascular pattern.",
    riskGenes: ["Cholesterol metabolism", "Blood vessel health"],
    photo: null,
  },
  {
    id: "father",
    name: "Lars Bergstrom",
    relation: "Father (Pappa)",
    born: 1960,
    died: null,
    conditions: [
      {
        name: "Heart attack (myocardial infarction)",
        ageAtDiagnosis: 65,
        yearDiagnosed: 2025,
        details: "Stent placed in the left anterior descending artery. Now on aspirin, statins, and beta-blockers. Recovering well but lifestyle changes required.",
      },
      {
        name: "High blood pressure",
        ageAtDiagnosis: 50,
        yearDiagnosed: 2010,
        details: "On medication for 15 years before the heart attack.",
      },
    ],
    relevance: "Your father had high blood pressure from age 50 and a heart attack at 65. You already have mild hypertension at 40 - 10 years earlier than he did.",
    riskGenes: ["Blood pressure regulation", "Heart disease"],
    photo: null,
  },
];

// Timeline of pattern acceleration
const PATTERN_TIMELINE = [
  { generation: "Grandparents", events: ["Mormor: diabetes at 62", "Farfar: stroke at 71"], avgAge: 66 },
  { generation: "Parents", events: ["Mamma: diabetes at 58", "Pappa: heart attack at 65"], avgAge: 61 },
  { generation: "You", events: ["High blood pressure at 40", "Rising blood sugar now"], currentAge: 40 },
];

function FamilyMemberCard({ member, index }: { member: (typeof FAMILY_MEMBERS)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isDeceased = member.died !== null;
  const isDiabetesSide = member.id.includes("maternal") || member.id === "mother";

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${200 + index * 150}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: isDiabetesSide
                ? "linear-gradient(135deg, #f3e5f5, #e1bee7)"
                : "linear-gradient(135deg, #ede7f6, #d1c4e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `2px solid ${isDeceased ? "#e0e0e0" : PURPLE.light}`,
            }}
          >
            <User size={22} style={{ color: isDeceased ? "#9e9e9e" : PURPLE.primary }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
              {member.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
              {member.relation}
              {isDeceased ? ` - ${member.born}-${member.died}` : ` - born ${member.born}`}
            </div>
          </div>

          <ChevronDown
            size={18}
            style={{
              color: "var(--text-muted)",
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          />
        </button>

        {/* Conditions summary (always visible) */}
        <div style={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {member.conditions.map((c, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                background: c.name.includes("Diabetes")
                  ? "#fff3e0"
                  : c.name.includes("Heart") || c.name.includes("Stroke")
                    ? "#fce4ec"
                    : "#e8eaf6",
                color: c.name.includes("Diabetes")
                  ? "#e65100"
                  : c.name.includes("Heart") || c.name.includes("Stroke")
                    ? "#c62828"
                    : "#3f51b5",
              }}
            >
              <span>Age {c.ageAtDiagnosis}</span>
            </div>
          ))}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: 16,
              background: "#fafafa",
            }}
          >
            {/* Conditions detail */}
            {member.conditions.map((c, i) => (
              <div key={i} style={{ marginBottom: i < member.conditions.length - 1 ? 14 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  {c.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      background: PURPLE.pale,
                      color: PURPLE.deep,
                    }}
                  >
                    Diagnosed at {c.ageAtDiagnosis} ({c.yearDiagnosed})
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {c.details}
                </div>
              </div>
            ))}

            {/* Relevance to Anna */}
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${PURPLE.pale}, #fff)`,
                border: `1px solid ${PURPLE.light}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Heart size={14} style={{ color: PURPLE.primary, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: PURPLE.deep, marginBottom: 3 }}>
                    What this means for you
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {member.relevance}
                  </div>
                </div>
              </div>
            </div>

            {/* Inherited risk factors */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                Shared health patterns
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {member.riskGenes.map((g) => (
                  <div
                    key={g}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      background: "#f1f3f5",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PatternAcceleration() {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "800ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          The pattern is accelerating
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
          Each generation is getting diagnosed younger
        </div>

        {PATTERN_TIMELINE.map((gen, i) => (
          <div key={gen.generation} style={{ marginBottom: i < PATTERN_TIMELINE.length - 1 ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Timeline dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                <div
                  style={{
                    width: gen.generation === "You" ? 16 : 12,
                    height: gen.generation === "You" ? 16 : 12,
                    borderRadius: "50%",
                    background:
                      gen.generation === "You"
                        ? `linear-gradient(135deg, ${PURPLE.primary}, ${PURPLE.accent})`
                        : gen.generation === "Parents"
                          ? PURPLE.light
                          : "#d1c4e9",
                    border: gen.generation === "You" ? `2px solid ${PURPLE.mid}` : "none",
                  }}
                />
                {i < PATTERN_TIMELINE.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 40,
                      background: `linear-gradient(to bottom, ${PURPLE.light}, ${PURPLE.pale})`,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: i < PATTERN_TIMELINE.length - 1 ? 4 : 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                    {gen.generation}
                  </div>
                  {gen.avgAge && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      avg diagnosis age: {gen.avgAge}
                    </div>
                  )}
                  {gen.currentAge && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: PURPLE.primary,
                      }}
                    >
                      age {gen.currentAge} now
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 4 }}>
                  {gen.events.map((e) => (
                    <div
                      key={e}
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        paddingLeft: 8,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--text-muted)",
                        }}
                      >
                        -
                      </span>
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Acceleration warning */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            background: "#fff3e0",
            border: "1px solid #ffe0b2",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <AlertTriangle size={16} style={{ color: "#e65100", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: "#4e342e", lineHeight: 1.5 }}>
            Grandparents averaged diagnosis at <strong>66</strong>. Parents at{" "}
            <strong>61</strong>. The gap is narrowing by about{" "}
            <strong>5 years per generation</strong>. If the trend continues, your risk window
            starts around age <strong>56</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

function DualPatternMap() {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: "1000ms",
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          Two patterns, one family
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
          Diabetes from one side, heart disease from the other
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Maternal side - Diabetes */}
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: "linear-gradient(135deg, #fff3e0, #fff8e1)",
              border: "1px solid #ffe0b2",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#e65100",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Mum's side
            </div>
            <Activity size={18} style={{ color: "#ff9800", marginBottom: 8 }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e65100" }}>Diabetes</div>
            <div style={{ fontSize: 11, color: "#bf360c", marginTop: 4, lineHeight: 1.4 }}>
              Mormor at 62
              <br />
              Mamma at 58
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "#4e342e",
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: 8,
                background: "rgba(230, 81, 0, 0.08)",
                display: "inline-block",
              }}
            >
              Getting younger each generation
            </div>
          </div>

          {/* Paternal side - Cardiovascular */}
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: "linear-gradient(135deg, #fce4ec, #fce4ec)",
              border: "1px solid #f8bbd0",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#c62828",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Dad's side
            </div>
            <Heart size={18} style={{ color: "#ef5350", marginBottom: 8 }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: "#c62828" }}>Heart</div>
            <div style={{ fontSize: 11, color: "#b71c1c", marginTop: 4, lineHeight: 1.4 }}>
              Farfar stroke at 71
              <br />
              Pappa heart attack at 65
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "#4e342e",
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: 8,
                background: "rgba(198, 40, 40, 0.06)",
                display: "inline-block",
              }}
            >
              6 years younger each gen
            </div>
          </div>
        </div>

        {/* Intersection */}
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            padding: "12px 16px",
            borderRadius: 12,
            background: PURPLE.pale,
            border: `1px solid ${PURPLE.light}`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: PURPLE.deep, marginBottom: 2 }}>
            You sit at the intersection
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Both patterns meet in you. But that also means addressing one helps the other -
            exercise, diet, and weight management protect against both.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FamilyTreePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ background: PURPLE.wash, minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/smith5"
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            Family Health Tree
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            4 relatives, 2 patterns, 1 story
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Intro */}
        <div
          className="animate-fade-in"
          style={{
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            Your family's health
            <br />
            <span style={{ color: PURPLE.primary }}>tells a story</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            Tap each family member to see their health history and what it means for yours.
          </div>
        </div>

        {/* Family member cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {FAMILY_MEMBERS.map((member, i) => (
            <FamilyMemberCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* Pattern acceleration */}
        <PatternAcceleration />

        {/* Dual pattern map */}
        <div style={{ marginTop: 16 }}>
          <DualPatternMap />
        </div>

        {/* Hope message */}
        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "1200ms",
            opacity: 0,
            animationFillMode: "forwards",
            marginTop: 20,
            textAlign: "center",
            padding: "20px 16px",
            background: `linear-gradient(135deg, #e8f5e9, #f1f8e9)`,
            borderRadius: 16,
            border: "1px solid #c8e6c9",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2e7d32", marginBottom: 6 }}>
            Knowledge is your advantage
          </div>
          <div style={{ fontSize: 12, color: "#33691e", lineHeight: 1.5 }}>
            Your grandparents and parents didn't have this information until it was too late.
            You have it at 40 - with decades to act. That changes everything.
          </div>
        </div>
      </div>
    </div>
  );
}
