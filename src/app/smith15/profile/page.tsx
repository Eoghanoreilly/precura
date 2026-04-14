"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Shield,
  Download,
  Bell,
} from "lucide-react";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  MEDICATION_HISTORY,
  VACCINATIONS,
  ALLERGIES,
} from "@/lib/v2/mock-patient";

const FONT = '-apple-system, "Inter", system-ui, sans-serif';

function Divider() {
  return <div style={{ borderTop: "1px solid #E9E9E7", margin: "16px 0" }} />;
}

function PropertyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span style={{ fontSize: 14, color: "#9B9A97", fontFamily: FONT }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: "#37352F", fontFamily: FONT }}>
        {value}
      </span>
    </div>
  );
}

function ToggleSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full py-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: FONT,
          padding: 0,
        }}
      >
        {open ? (
          <ChevronDown size={12} style={{ color: "#9B9A97" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "#9B9A97" }} />
        )}
        <span
          style={{
            fontSize: 12,
            color: "#9B9A97",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </span>
        {count !== undefined && (
          <span style={{ fontSize: 11, color: "#9B9A97" }}>({count})</span>
        )}
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: "#D5F5E3", text: "#4DAB9A" },
    resolved: { bg: "#F1F1EF", text: "#9B9A97" },
    mild: { bg: "#F1F1EF", text: "#37352F" },
    none: { bg: "#F1F1EF", text: "#9B9A97" },
  };
  const c = colors[status] || { bg: "#F1F1EF", text: "#37352F" };
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        color: c.text,
        background: c.bg,
        padding: "1px 7px",
        borderRadius: 3,
        fontFamily: FONT,
      }}
    >
      {status}
    </span>
  );
}

export default function ProfilePage() {
  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <Link
          href="/smith15"
          style={{ fontSize: 12, color: "#9B9A97", textDecoration: "none" }}
        >
          Health Overview
        </Link>
        <ChevronRight size={11} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 12, color: "#37352F" }}>Profile</span>
      </div>

      {/* Avatar and name */}
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#E9E9E7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 500,
            color: "#37352F",
          }}
        >
          A
        </div>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#37352F",
              margin: 0,
            }}
          >
            {PATIENT.name}
          </h1>
          <p style={{ fontSize: 14, color: "#9B9A97", margin: 0 }}>
            {PATIENT.age} years / Stockholm
          </p>
        </div>
      </div>

      <Divider />

      {/* Personal Information */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        Personal Information
      </h2>
      <PropertyRow label="Date of Birth" value={new Date(PATIENT.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
      <PropertyRow label="Personnummer" value={PATIENT.personnummer} />
      <PropertyRow label="Email" value={PATIENT.email} />
      <PropertyRow label="Phone" value={PATIENT.phone} />
      <PropertyRow label="Address" value={PATIENT.address} />
      <PropertyRow label="Vardcentral" value={PATIENT.vardcentral} />

      <Divider />

      {/* Membership */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        Membership
      </h2>
      <PropertyRow label="Plan" value="Annual" />
      <PropertyRow label="Price" value={`${PATIENT.membershipPrice.toLocaleString()} SEK/year`} />
      <PropertyRow
        label="Member since"
        value={new Date(PATIENT.memberSince).toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })}
      />

      <Divider />

      {/* Conditions */}
      <ToggleSection title="Conditions" count={CONDITIONS.length}>
        {CONDITIONS.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between py-1.5"
          >
            <div>
              <span style={{ fontSize: 13, color: "#37352F" }}>{c.name}</span>
              <span style={{ fontSize: 11, color: "#9B9A97", marginLeft: 6 }}>
                {c.icd10}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12, color: "#9B9A97" }}>
                {new Date(c.diagnosedDate).getFullYear()}
              </span>
              <StatusPill status={c.status} />
            </div>
          </div>
        ))}
      </ToggleSection>

      {/* Active Medications */}
      <ToggleSection
        title="Active Medications"
        count={MEDICATIONS.filter((m) => m.active).length}
      >
        {MEDICATIONS.filter((m) => m.active).map((med) => (
          <div
            key={med.name}
            className="flex items-center justify-between py-1.5"
          >
            <div>
              <span style={{ fontSize: 13, color: "#37352F" }}>
                {med.name} {med.dose}
              </span>
              <span style={{ fontSize: 11, color: "#9B9A97", marginLeft: 6 }}>
                {med.purpose}
              </span>
            </div>
            <span style={{ fontSize: 13, color: "#9B9A97" }}>
              {med.frequency}
            </span>
          </div>
        ))}
      </ToggleSection>

      {/* Past Medications */}
      <ToggleSection
        title="Past Medications"
        count={MEDICATION_HISTORY.length}
      >
        {MEDICATION_HISTORY.map((med) => (
          <div
            key={med.name}
            className="flex items-center justify-between py-1.5"
          >
            <div>
              <span style={{ fontSize: 13, color: "#37352F" }}>
                {med.name} {med.dose}
              </span>
              <span style={{ fontSize: 11, color: "#9B9A97", marginLeft: 6 }}>
                {med.purpose}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#9B9A97" }}>
              {new Date(med.startDate).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        ))}
      </ToggleSection>

      {/* Vaccinations */}
      <ToggleSection title="Vaccinations" count={VACCINATIONS.length}>
        {VACCINATIONS.map((vax, i) => (
          <div
            key={`${vax.name}-${i}`}
            className="flex items-center justify-between py-1"
          >
            <span style={{ fontSize: 13, color: "#37352F" }}>{vax.name}</span>
            <span style={{ fontSize: 12, color: "#9B9A97" }}>
              {new Date(vax.date).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        ))}
      </ToggleSection>

      {/* Allergies */}
      <ToggleSection title="Allergies" count={ALLERGIES.length}>
        {ALLERGIES.map((a) => (
          <div
            key={a.substance}
            className="flex items-center justify-between py-1"
          >
            <div>
              <span style={{ fontSize: 13, color: "#37352F" }}>
                {a.substance}
              </span>
              {a.reaction && (
                <span
                  style={{ fontSize: 11, color: "#9B9A97", marginLeft: 6 }}
                >
                  {a.reaction}
                </span>
              )}
            </div>
            <StatusPill status={a.severity} />
          </div>
        ))}
      </ToggleSection>

      <Divider />

      {/* Actions */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#37352F",
          marginBottom: 8,
        }}
      >
        Data & Privacy
      </h2>

      <div
        className="flex items-center gap-2 py-2 px-1 -mx-1 cursor-pointer"
        style={{ borderRadius: 3, transition: "background 0.1s" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <Download size={14} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 14, color: "#37352F" }}>
          Export health data (FHIR R4)
        </span>
      </div>

      <div
        className="flex items-center gap-2 py-2 px-1 -mx-1 cursor-pointer"
        style={{ borderRadius: 3, transition: "background 0.1s" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <Shield size={14} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 14, color: "#37352F" }}>
          Privacy settings
        </span>
      </div>

      <div
        className="flex items-center gap-2 py-2 px-1 -mx-1 cursor-pointer"
        style={{ borderRadius: 3, transition: "background 0.1s" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F1F1EF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <Bell size={14} style={{ color: "#9B9A97" }} />
        <span style={{ fontSize: 14, color: "#37352F" }}>
          Notification preferences
        </span>
      </div>

      <Divider />

      <div style={{ fontSize: 12, color: "#9B9A97", lineHeight: 1.6 }}>
        Your data is stored securely and complies with Swedish healthcare data
        regulations (Patientdatalagen). You can request a full data export or
        deletion at any time.
      </div>
    </div>
  );
}
