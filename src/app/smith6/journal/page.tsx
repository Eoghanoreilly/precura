"use client";

import Link from "next/link";
import {
  ChevronLeft, FileText, Stethoscope, Calendar,
  User, MapPin, ChevronRight,
} from "lucide-react";
import {
  DOCTOR_VISITS,
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatYear(d: string) {
  return new Date(d).getFullYear().toString();
}

// Visit type color/icon mapping
function visitTypeInfo(type: string) {
  if (type.includes("Initial") || type.includes("Precura"))
    return { color: HEALTHCARE_BLUE, bg: HEALTHCARE_BLUE_LIGHT, label: "Precura" };
  if (type.includes("Annual") || type.includes("check"))
    return { color: "#16a34a", bg: "#ecfdf5", label: "Arskontroll" };
  if (type.includes("Blood pressure") || type.includes("Follow"))
    return { color: "#7c3aed", bg: "#faf5ff", label: "Uppfoljning" };
  if (type.includes("Acute"))
    return { color: "#dc2626", bg: "#fef2f2", label: "Akut" };
  if (type.includes("Physio"))
    return { color: "#0891b2", bg: "#ecfeff", label: "Sjukgymnastik" };
  return { color: TEXT_MUTED, bg: "#f1f5f9", label: "Besok" };
}

export default function Smith6Journal() {
  // Group visits by year
  const visitsByYear: Record<string, typeof DOCTOR_VISITS> = {};
  DOCTOR_VISITS.forEach((v) => {
    const year = formatYear(v.date);
    if (!visitsByYear[year]) visitsByYear[year] = [];
    visitsByYear[year].push(v);
  });

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
            <div style={{ fontSize: 20, fontWeight: 700 }}>Journal</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Alla dina vardbesok samlade pa ett stalle
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
        {/* Source info */}
        <div
          style={{
            background: HEALTHCARE_BLUE_LIGHT,
            border: `1px solid ${HEALTHCARE_BLUE}33`,
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 24,
            fontSize: 15,
            color: HEALTHCARE_BLUE_DARK,
            lineHeight: 1.5,
          }}
        >
          Din journal sammanstaller besok fran bade 1177/Journalen och
          Precura. Har ser du hela bilden - fran din vardcentral och din
          Precura-lakare, pa samma stalle.
        </div>

        {/* Visit timeline by year */}
        {Object.entries(visitsByYear)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([year, visits]) => (
            <div key={year} style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: TEXT_PRIMARY,
                  margin: "0 0 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Calendar size={18} color={HEALTHCARE_BLUE} />
                {year}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: TEXT_MUTED,
                  }}
                >
                  ({visits.length} besok)
                </span>
              </h2>

              <div
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {visits.map((visit, i) => {
                  const typeInfo = visitTypeInfo(visit.type);
                  return (
                    <div
                      key={visit.date + visit.type}
                      style={{
                        padding: "18px 20px",
                        borderBottom:
                          i < visits.length - 1
                            ? `1px solid ${BORDER_COLOR}`
                            : "none",
                      }}
                    >
                      {/* Visit header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: typeInfo.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Stethoscope size={22} color={typeInfo.color} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: TEXT_PRIMARY,
                                marginBottom: 4,
                              }}
                            >
                              {visit.type}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 14,
                                color: TEXT_SECONDARY,
                              }}
                            >
                              <User size={14} />
                              {visit.provider}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: TEXT_PRIMARY,
                            }}
                          >
                            {formatDate(visit.date)}
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: typeInfo.color,
                              background: typeInfo.bg,
                              padding: "2px 8px",
                              borderRadius: 8,
                              display: "inline-block",
                              marginTop: 4,
                            }}
                          >
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Visit summary */}
                      <div
                        style={{
                          fontSize: 15,
                          color: TEXT_SECONDARY,
                          lineHeight: 1.6,
                          paddingLeft: 56,
                        }}
                      >
                        {visit.summary}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {/* Data source attribution */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "20px 0",
            fontSize: 13,
            color: TEXT_MUTED,
            lineHeight: 1.6,
          }}
        >
          <div>Data fran: 1177 Journalen, Precura</div>
          <div>
            {DOCTOR_VISITS.length} registrerade besok | 2022-2026
          </div>
        </div>
      </main>
    </div>
  );
}
