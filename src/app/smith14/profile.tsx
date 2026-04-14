"use client";

import React from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Pill,
  Heart,
  Users,
  Shield,
  ChevronRight,
  Syringe,
  AlertTriangle,
  FileText,
  Crown,
} from "lucide-react";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  FAMILY_HISTORY,
  ALLERGIES,
  VACCINATIONS,
  BIOMETRICS_HISTORY,
  DOCTOR_VISITS,
} from "@/lib/v2/mock-patient";

export default function ProfilePage() {
  const latestBio = BIOMETRICS_HISTORY[0];

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
      {/* Profile header */}
      <div
        className="flex flex-col items-center"
        style={{
          padding: "24px 16px",
          background: "#ECF5EF",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 50,
            background: "#006D3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 600, color: "#FFFFFF" }}>
            {PATIENT.firstName[0]}
          </span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "#002110", margin: 0 }}>
          {PATIENT.name}
        </h1>
        <p style={{ fontSize: 14, color: "#4F6354", marginTop: 4 }}>
          {PATIENT.age} years old
        </p>

        {/* Membership pill */}
        <div
          style={{
            marginTop: 12,
            padding: "6px 16px",
            borderRadius: 50,
            background: "#95F7B5",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Crown size={14} style={{ color: "#002110" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#002110" }}>
            Annual member - {PATIENT.membershipPrice} SEK/year
          </span>
        </div>
      </div>

      {/* Contact info */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Personal details
        </h2>
        <div className="flex flex-col gap-3">
          <InfoRow icon={<Mail size={16} />} label="Email" value={PATIENT.email} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={PATIENT.phone} />
          <InfoRow icon={<MapPin size={16} />} label="Address" value={PATIENT.address} />
          <InfoRow icon={<Heart size={16} />} label="Health center" value={PATIENT.vardcentral} />
          <InfoRow
            icon={<Calendar size={16} />}
            label="Member since"
            value={new Date(PATIENT.memberSince).toLocaleDateString("en-SE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </div>
      </div>

      {/* Active conditions */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Active conditions
        </h2>
        <div className="flex flex-col gap-2">
          {CONDITIONS.filter((c) => c.status === "active").map((condition) => (
            <div
              key={condition.name}
              className="flex items-center gap-3"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FAFDFB",
              }}
            >
              <AlertTriangle size={16} style={{ color: "#E65100", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
                  {condition.name}
                </p>
                <p style={{ fontSize: 12, color: "#6F796F", margin: "2px 0 0" }}>
                  Since {new Date(condition.diagnosedDate).getFullYear()} - {condition.treatedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current medications */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Current medications
        </h2>
        <div className="flex flex-col gap-2">
          {MEDICATIONS.filter((m) => m.active).map((med) => (
            <div
              key={med.name}
              className="flex items-center gap-3"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FAFDFB",
              }}
            >
              <Pill size={16} style={{ color: "#006D3E", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
                  {med.name} {med.dose}
                </p>
                <p style={{ fontSize: 12, color: "#6F796F", margin: "2px 0 0" }}>
                  {med.frequency} - {med.purpose}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family history */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Family history
        </h2>
        <div className="flex flex-col gap-2">
          {FAMILY_HISTORY.map((fh) => (
            <div
              key={`${fh.relative}-${fh.condition}`}
              className="flex items-center gap-3"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FAFDFB",
              }}
            >
              <Users size={16} style={{ color: "#3A6471", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
                  {fh.relative} - {fh.condition}
                </p>
                <p style={{ fontSize: 12, color: "#6F796F", margin: "2px 0 0" }}>
                  Diagnosed at {fh.ageAtDiagnosis} - {fh.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Allergies
        </h2>
        <div className="flex flex-col gap-2">
          {ALLERGIES.map((a) => (
            <div
              key={a.substance}
              className="flex items-center gap-3"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background:
                  a.severity === "none" ? "#FAFDFB" : "#FFF3E0",
              }}
            >
              <Shield
                size={16}
                style={{
                  color: a.severity === "none" ? "#006D3E" : "#E65100",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
                  {a.substance}
                </p>
                {a.reaction && (
                  <p style={{ fontSize: 12, color: "#6F796F", margin: "2px 0 0" }}>
                    {a.reaction} ({a.severity})
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent vaccinations */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Recent vaccinations
        </h2>
        <div className="flex flex-col gap-2">
          {VACCINATIONS.slice(0, 3).map((v, i) => (
            <div
              key={`${v.name}-${v.date}`}
              className="flex items-center gap-3"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FAFDFB",
              }}
            >
              <Syringe size={16} style={{ color: "#3A6471", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#002110", margin: 0 }}>
                  {v.name}
                </p>
                <p style={{ fontSize: 12, color: "#6F796F", margin: "2px 0 0" }}>
                  {new Date(v.date).toLocaleDateString("en-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  - {v.provider}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent doctor visits */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#002110", margin: "0 0 12px" }}>
          Recent visits
        </h2>
        <div className="flex flex-col gap-2">
          {DOCTOR_VISITS.slice(0, 4).map((visit) => (
            <div
              key={`${visit.date}-${visit.type}`}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "#FAFDFB",
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#002110" }}>
                  {visit.type}
                </span>
                <span style={{ fontSize: 12, color: "#6F796F" }}>
                  {new Date(visit.date).toLocaleDateString("sv-SE")}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#4F6354", margin: 0, lineHeight: 1.4 }}>
                {visit.summary.slice(0, 120)}...
              </p>
              <p style={{ fontSize: 12, color: "#6F796F", marginTop: 4 }}>
                {visit.provider}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings links */}
      <div
        style={{
          background: "#ECF5EF",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {[
          { label: "Export health data (FHIR)", icon: FileText },
          { label: "Manage membership", icon: Crown },
          { label: "Privacy settings", icon: Shield },
        ].map((item, i) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full"
            style={{
              padding: "14px 16px",
              background: "transparent",
              border: "none",
              borderTop: i > 0 ? "1px solid #DAE8DE" : "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <item.icon size={18} style={{ color: "#006D3E" }} />
            <span style={{ fontSize: 14, color: "#002110", flex: 1 }}>
              {item.label}
            </span>
            <ChevronRight size={16} style={{ color: "#6F796F" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div style={{ color: "#006D3E", marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 12, color: "#6F796F", margin: 0 }}>{label}</p>
        <p style={{ fontSize: 14, color: "#002110", margin: "2px 0 0" }}>{value}</p>
      </div>
    </div>
  );
}
