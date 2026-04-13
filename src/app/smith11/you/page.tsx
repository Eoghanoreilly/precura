"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Shield,
  Heart,
  Pill,
  AlertCircle,
  Syringe,
  Users,
  Bell,
  HelpCircle,
  FileDown,
  LogOut,
  CreditCard,
  Star,
  type LucideIcon,
} from "lucide-react";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  ALLERGIES,
  VACCINATIONS,
  FAMILY_HISTORY,
  SCREENING_SCORES,
  BIOMETRICS_HISTORY,
} from "@/lib/v2/mock-patient";

/* ------------------------------------------------------------------ */
/* Profile Header                                                       */
/* ------------------------------------------------------------------ */
function ProfileHeader() {
  const initials = PATIENT.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center gap-4" style={{ marginBottom: 24 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: "linear-gradient(135deg, #1DB954, #1ED760)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>{initials}</span>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>{PATIENT.name}</div>
        <div style={{ fontSize: 13, color: "#B3B3B3" }}>{PATIENT.age} years old</div>
        <div style={{ fontSize: 12, color: "#B3B3B360" }}>{PATIENT.address}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Membership Card                                                      */
/* ------------------------------------------------------------------ */
function MembershipCard() {
  const memberDate = new Date(PATIENT.memberSince);
  const memberStr = memberDate.toLocaleDateString("en-SE", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1DB954, #17a34a)",
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div className="flex items-center gap-2">
          <Star size={18} style={{ color: "#FFFFFF" }} fill="#FFFFFF" />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
            Precura Annual
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#FFFFFF",
            background: "#FFFFFF20",
            borderRadius: 24,
            padding: "4px 10px",
          }}
        >
          Active
        </span>
      </div>
      <div className="flex items-baseline gap-1" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
          {PATIENT.membershipPrice.toLocaleString()}
        </span>
        <span style={{ fontSize: 14, color: "#FFFFFF90" }}>SEK/year</span>
      </div>
      <div style={{ fontSize: 12, color: "#FFFFFF70" }}>Member since {memberStr}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Expandable Section                                                   */
/* ------------------------------------------------------------------ */
function ExpandableSection({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 16,
        }}
      >
        <Icon size={18} style={{ color: iconColor, flexShrink: 0, marginRight: 12 }} />
        <span
          className="flex-1"
          style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", textAlign: "left" }}
        >
          {title}
        </span>
        <ChevronRight
          size={16}
          style={{
            color: "#B3B3B340",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>
      {open && <div style={{ padding: "0 16px 16px" }}>{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screening Score Row                                                  */
/* ------------------------------------------------------------------ */
function ScreeningRow({
  name,
  score,
  maxScore,
  level,
  interpretation,
}: {
  name: string;
  score: number;
  maxScore: number;
  level: string;
  interpretation?: string;
}) {
  const pct = (score / maxScore) * 100;
  const levelColor =
    level === "minimal" || level === "low_risk" || level === "low"
      ? "#1DB954"
      : level === "moderate" || level === "low_moderate"
        ? "#FFA42B"
        : "#F15E6C";

  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #28282850" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{name}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: levelColor }}>
          {score}/{maxScore}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "#282828", marginBottom: 4 }}>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            width: `${pct}%`,
            background: levelColor,
          }}
        />
      </div>
      {interpretation && (
        <div style={{ fontSize: 12, color: "#B3B3B3" }}>{interpretation}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Settings Row                                                         */
/* ------------------------------------------------------------------ */
function SettingsRow({
  icon: Icon,
  label,
  value,
  color = "#B3B3B3",
  danger = false,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  color?: string;
  danger?: boolean;
}) {
  return (
    <button
      className="flex items-center w-full"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "14px 0",
        borderBottom: "1px solid #28282830",
      }}
    >
      <Icon
        size={18}
        style={{
          color: danger ? "#F15E6C" : color,
          flexShrink: 0,
          marginRight: 12,
        }}
      />
      <span
        className="flex-1"
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: danger ? "#F15E6C" : "#FFFFFF",
          textAlign: "left",
        }}
      >
        {label}
      </span>
      {value && (
        <span style={{ fontSize: 13, color: "#B3B3B360", marginRight: 8 }}>{value}</span>
      )}
      <ChevronRight size={16} style={{ color: "#B3B3B320" }} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* YOU PAGE                                                             */
/* ------------------------------------------------------------------ */
export default function YouPage() {
  const scores = SCREENING_SCORES;

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: "0 0 20px" }}>
        You
      </h1>

      <ProfileHeader />
      <MembershipCard />

      {/* Health Data Sections */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
          Health record
        </h2>

        <ExpandableSection title="Conditions" icon={Heart} iconColor="#F15E6C" defaultOpen>
          {CONDITIONS.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{
                padding: "10px 0",
                borderBottom: i < CONDITIONS.length - 1 ? "1px solid #28282850" : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#B3B3B360" }}>
                  Diagnosed {c.diagnosedDate}
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: c.status === "active" ? "#FFA42B" : "#1DB954",
                  background:
                    c.status === "active" ? "#FFA42B18" : "#1DB95418",
                  borderRadius: 24,
                  padding: "3px 10px",
                }}
              >
                {c.status === "active" ? "Active" : "Resolved"}
              </span>
            </div>
          ))}
        </ExpandableSection>

        <ExpandableSection title="Medications" icon={Pill} iconColor="#1DB954">
          {MEDICATIONS.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px 0",
                borderBottom:
                  i < MEDICATIONS.length - 1 ? "1px solid #28282850" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                  {m.name} {m.dose}
                </span>
                <span style={{ fontSize: 12, color: "#B3B3B3" }}>{m.frequency}</span>
              </div>
              <div style={{ fontSize: 12, color: "#B3B3B360", marginTop: 2 }}>{m.purpose}</div>
            </div>
          ))}
        </ExpandableSection>

        <ExpandableSection title="Allergies" icon={AlertCircle} iconColor="#FFA42B">
          {ALLERGIES.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{
                padding: "10px 0",
                borderBottom:
                  i < ALLERGIES.length - 1 ? "1px solid #28282850" : "none",
              }}
            >
              <span style={{ fontSize: 14, color: "#FFFFFF" }}>{a.substance}</span>
              {a.severity !== "none" && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#FFA42B",
                    background: "#FFA42B18",
                    borderRadius: 24,
                    padding: "3px 10px",
                  }}
                >
                  {a.severity}
                </span>
              )}
            </div>
          ))}
        </ExpandableSection>

        <ExpandableSection title="Vaccinations" icon={Syringe} iconColor="#1DB954">
          {VACCINATIONS.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{
                padding: "10px 0",
                borderBottom:
                  i < VACCINATIONS.length - 1 ? "1px solid #28282850" : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: "#FFFFFF" }}>{v.name}</div>
                <div style={{ fontSize: 12, color: "#B3B3B360" }}>{v.provider}</div>
              </div>
              <span style={{ fontSize: 12, color: "#B3B3B3" }}>{v.date}</span>
            </div>
          ))}
        </ExpandableSection>

        <ExpandableSection title="Family history" icon={Users} iconColor="#B3B3B3">
          {FAMILY_HISTORY.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px 0",
                borderBottom:
                  i < FAMILY_HISTORY.length - 1 ? "1px solid #28282850" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                  {f.relative}
                </span>
                <span style={{ fontSize: 12, color: "#B3B3B3" }}>
                  Age {f.ageAtDiagnosis}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#FFA42B", marginTop: 2 }}>{f.condition}</div>
              <div style={{ fontSize: 12, color: "#B3B3B360", marginTop: 2 }}>{f.status}</div>
            </div>
          ))}
        </ExpandableSection>
      </div>

      {/* Screening Scores */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
          Screening scores
        </h2>
        <div style={{ background: "#1E1E1E", borderRadius: 8, padding: 16 }}>
          <ScreeningRow
            name="FINDRISC (diabetes risk)"
            score={scores.findrisc.score}
            maxScore={scores.findrisc.maxScore}
            level={scores.findrisc.level}
          />
          <ScreeningRow
            name="PHQ-9 (depression)"
            score={scores.phq9.score}
            maxScore={scores.phq9.maxScore}
            level={scores.phq9.level}
            interpretation={scores.phq9.interpretation}
          />
          <ScreeningRow
            name="GAD-7 (anxiety)"
            score={scores.gad7.score}
            maxScore={scores.gad7.maxScore}
            level={scores.gad7.level}
            interpretation={scores.gad7.interpretation}
          />
          <ScreeningRow
            name="AUDIT-C (alcohol)"
            score={scores.auditC.score}
            maxScore={scores.auditC.maxScore}
            level={scores.auditC.level}
            interpretation={scores.auditC.interpretation}
          />
          <div style={{ padding: "10px 0" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                SCORE2 (heart risk)
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#FFA42B" }}>
                ~{scores.score2.riskPercent}%
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#B3B3B3" }}>
              {scores.score2.interpretation}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 12px" }}>
          Settings
        </h2>
        <div style={{ background: "#1E1E1E", borderRadius: 8, padding: "0 16px" }}>
          <SettingsRow icon={Bell} label="Notifications" value="On" />
          <SettingsRow icon={Shield} label="Privacy" />
          <SettingsRow icon={CreditCard} label="Billing" value="Annual" />
          <SettingsRow icon={FileDown} label="Export health data (FHIR)" />
          <SettingsRow icon={HelpCircle} label="Support" />
          <SettingsRow icon={LogOut} label="Sign out" danger />
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: 12, color: "#B3B3B340" }}>
          Precura / {PATIENT.vardcentral}
        </div>
        <div style={{ fontSize: 11, color: "#B3B3B320", marginTop: 4 }}>
          {PATIENT.personnummer}
        </div>
      </div>
    </div>
  );
}
