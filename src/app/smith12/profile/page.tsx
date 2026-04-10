"use client";

import React from "react";
import Link from "next/link";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  ALLERGIES,
  BIOMETRICS_HISTORY,
  SCREENING_SCORES,
  VACCINATIONS,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Pill,
  AlertCircle,
  Activity,
  Syringe,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  Download,
  Heart,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Section Card
// ---------------------------------------------------------------------------

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mx-5 mb-4"
      style={{
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={16} style={{ color: "#FF385C" }} />
          <p style={{ color: "#222222", fontSize: 15, fontWeight: 600 }}>{title}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu Item
// ---------------------------------------------------------------------------

function MenuItem({
  icon: Icon,
  label,
  sublabel,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  danger?: boolean;
}) {
  return (
    <button
      className="w-full flex items-center gap-3 py-3"
      style={{
        borderBottom: "1px solid #EBEBEB",
        background: "transparent",
        border: "none",
        borderBlockEnd: "1px solid #EBEBEB",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        padding: "12px 0",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: danger ? "#FFF5F5" : "#F7F7F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} style={{ color: danger ? "#C13515" : "#222222" }} />
      </div>
      <div className="flex-1">
        <p style={{ color: danger ? "#C13515" : "#222222", fontSize: 14, fontWeight: 500 }}>{label}</p>
        {sublabel && <p style={{ color: "#717171", fontSize: 12 }}>{sublabel}</p>}
      </div>
      <ChevronRight size={16} style={{ color: "#717171" }} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const latestBio = BIOMETRICS_HISTORY[0];

  return (
    <div>
      {/* Back nav */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Link
          href="/smith12"
          style={{
            width: 32,
            height: 32,
            borderRadius: 50,
            border: "1px solid #EBEBEB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} style={{ color: "#222222" }} />
        </Link>
        <p style={{ color: "#222222", fontSize: 18, fontWeight: 600 }}>Profile</p>
      </div>

      {/* Profile header */}
      <div className="mx-5 mb-4">
        <div
          className="p-5"
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #FF385C 0%, #E31C5F 50%, #BD1550 100%)",
            boxShadow: "0 8px 28px rgba(255, 56, 92, 0.25)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 50,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: 700,
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              AB
            </div>
            <div>
              <p style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>{PATIENT.name}</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                {PATIENT.age} years old - {PATIENT.address.split(",")[1]?.trim()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Heart size={12} style={{ color: "rgba(255,255,255,0.8)" }} />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                  Annual member since {new Date(PATIENT.memberSince).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biometrics */}
      <div className="mx-5 mb-4">
        <div
          className="p-4"
          style={{
            borderRadius: 12,
            background: "#F7F7F7",
          }}
        >
          <div className="flex justify-between">
            <div className="text-center">
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>Weight</p>
              <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{latestBio.weight} kg</p>
            </div>
            <div className="text-center">
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>BMI</p>
              <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{latestBio.bmi}</p>
            </div>
            <div className="text-center">
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>Waist</p>
              <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{latestBio.waist} cm</p>
            </div>
            <div className="text-center">
              <p style={{ color: "#717171", fontSize: 11, fontWeight: 500 }}>BP</p>
              <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{latestBio.bloodPressure}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active conditions */}
      <SectionCard title="Active conditions" icon={Shield}>
        <div className="flex flex-col gap-3">
          {CONDITIONS.filter((c) => c.status === "active").map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 50,
                  background: "#E07912",
                  marginTop: 6,
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>{c.name}</p>
                <p style={{ color: "#717171", fontSize: 12 }}>
                  Since {new Date(c.diagnosedDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} - {c.treatedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Medications */}
      <SectionCard title="Current medications" icon={Pill}>
        <div className="flex flex-col gap-3">
          {MEDICATIONS.filter((m) => m.active).map((m, i) => (
            <div
              key={i}
              className="p-3"
              style={{
                borderRadius: 10,
                background: "#F7F7F7",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <p style={{ color: "#222222", fontSize: 14, fontWeight: 500 }}>
                  {m.name} {m.dose}
                </p>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 50,
                    background: "#E6FFED",
                    color: "#008A05",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  active
                </span>
              </div>
              <p style={{ color: "#717171", fontSize: 12 }}>
                {m.frequency} - {m.purpose}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Allergies */}
      <SectionCard title="Allergies" icon={AlertCircle}>
        <div className="flex flex-wrap gap-2">
          {ALLERGIES.filter((a) => a.severity !== "none").map((a, i) => (
            <span
              key={i}
              style={{
                padding: "6px 12px",
                borderRadius: 50,
                background: "#FFF7ED",
                color: "#E07912",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {a.substance}
            </span>
          ))}
          <span
            style={{
              padding: "6px 12px",
              borderRadius: 50,
              background: "#F0FFF4",
              color: "#008A05",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            No drug allergies
          </span>
        </div>
      </SectionCard>

      {/* Vaccinations */}
      <SectionCard title="Recent vaccinations" icon={Syringe}>
        <div className="flex flex-col gap-2">
          {VACCINATIONS.slice(0, 3).map((v, i) => (
            <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #EBEBEB" }}>
              <p style={{ color: "#222222", fontSize: 13 }}>{v.name}</p>
              <span style={{ color: "#717171", fontSize: 11 }}>
                {new Date(v.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Screening scores */}
      <SectionCard title="Screening scores" icon={Activity}>
        <div className="flex flex-wrap gap-2">
          <div
            className="flex-1 p-3 text-center"
            style={{
              borderRadius: 10,
              background: "#F7F7F7",
              minWidth: 80,
            }}
          >
            <p style={{ color: "#717171", fontSize: 10, fontWeight: 500 }}>PHQ-9</p>
            <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{SCREENING_SCORES.phq9.score}</p>
            <p style={{ color: "#008A05", fontSize: 10 }}>{SCREENING_SCORES.phq9.level}</p>
          </div>
          <div
            className="flex-1 p-3 text-center"
            style={{
              borderRadius: 10,
              background: "#F7F7F7",
              minWidth: 80,
            }}
          >
            <p style={{ color: "#717171", fontSize: 10, fontWeight: 500 }}>GAD-7</p>
            <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{SCREENING_SCORES.gad7.score}</p>
            <p style={{ color: "#008A05", fontSize: 10 }}>{SCREENING_SCORES.gad7.level}</p>
          </div>
          <div
            className="flex-1 p-3 text-center"
            style={{
              borderRadius: 10,
              background: "#F7F7F7",
              minWidth: 80,
            }}
          >
            <p style={{ color: "#717171", fontSize: 10, fontWeight: 500 }}>AUDIT-C</p>
            <p style={{ color: "#222222", fontSize: 18, fontWeight: 700 }}>{SCREENING_SCORES.auditC.score}</p>
            <p style={{ color: "#008A05", fontSize: 10 }}>{SCREENING_SCORES.auditC.level.replace("_", " ")}</p>
          </div>
        </div>

        {/* EQ-5D */}
        <div
          className="mt-3 p-3"
          style={{
            borderRadius: 10,
            background: "#F7F7F7",
          }}
        >
          <p style={{ color: "#717171", fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
            EQ-5D (quality of life)
          </p>
          <p style={{ color: "#222222", fontSize: 13 }}>
            {SCREENING_SCORES.eq5d.interpretation}
          </p>
        </div>
      </SectionCard>

      {/* Settings menu */}
      <div
        className="mx-5 mb-6"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div className="px-5 py-2">
          <MenuItem icon={CreditCard} label="Membership" sublabel="Annual - 2,995 SEK/year" />
          <MenuItem icon={Bell} label="Notifications" sublabel="Email and push" />
          <MenuItem icon={Download} label="Export health data" sublabel="FHIR format" />
          <MenuItem icon={Settings} label="Settings" />
          <MenuItem icon={LogOut} label="Sign out" danger />
        </div>
      </div>

      {/* Footer */}
      <div className="mx-5 mb-8 text-center py-4">
        <p style={{ color: "#717171", fontSize: 11 }}>
          {PATIENT.vardcentral}
        </p>
        <p style={{ color: "#717171", fontSize: 11, marginTop: 2 }}>
          Precura v2.0 - Predictive health platform
        </p>
      </div>
    </div>
  );
}
