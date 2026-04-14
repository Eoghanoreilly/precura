"use client";

import React from "react";
import Link from "next/link";
import {
  PATIENT,
  CONDITIONS,
  MEDICATIONS,
  ALLERGIES,
  VACCINATIONS,
  BIOMETRICS_HISTORY,
  DOCTOR_VISITS,
} from "@/lib/v2/mock-patient";
import {
  ArrowLeft,
  User,
  Shield,
  Pill,
  AlertCircle,
  Syringe,
  Activity,
  Calendar,
  CreditCard,
  FileDown,
  MapPin,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

export default function ProfilePage() {
  const latestBio = BIOMETRICS_HISTORY[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/smith1"
          className="flex items-center gap-1 mb-4"
          style={{
            color: "#B8C5D6",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <h1
          style={{
            color: "#F5F7FA",
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Patient card */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: "rgba(124, 58, 237, 0.15)",
                }}
              >
                <User size={22} style={{ color: "#7C3AED" }} />
              </div>
              <div>
                <div
                  style={{
                    color: "#F5F7FA",
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  }}
                >
                  {PATIENT.name}
                </div>
                <div
                  style={{
                    color: "#B8C5D6",
                    fontSize: 13,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {PATIENT.age} years old
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Mail, label: PATIENT.email },
                { icon: Phone, label: PATIENT.phone },
                { icon: MapPin, label: PATIENT.address },
                { icon: Building2, label: PATIENT.vardcentral },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <Icon size={14} style={{ color: "#B8C5D6" }} />
                    <span
                      style={{
                        color: "#B8C5D6",
                        fontSize: 13,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Membership */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid rgba(124, 58, 237, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} style={{ color: "#7C3AED" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Membership
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span
                  style={{
                    color: "#B8C5D6",
                    fontSize: 13,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  Plan
                </span>
                <span
                  style={{
                    color: "#F5F7FA",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  Annual
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  style={{
                    color: "#B8C5D6",
                    fontSize: 13,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  Price
                </span>
                <span
                  style={{
                    color: "#F5F7FA",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {PATIENT.membershipPrice.toLocaleString()} SEK/year
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  style={{
                    color: "#B8C5D6",
                    fontSize: 13,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  Member since
                </span>
                <span
                  style={{
                    color: "#F5F7FA",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {new Date(PATIENT.memberSince).toLocaleDateString("en-SE", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div
              className="mt-4 p-3"
              style={{
                background: "rgba(124, 58, 237, 0.06)",
                borderRadius: 8,
                fontSize: 12,
                color: "#B8C5D6",
                lineHeight: 1.5,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Includes: 2 comprehensive blood tests/year, doctor review of every result, unlimited messaging, AI health assistant, personalized training plan
            </div>
          </div>

          {/* Data export */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileDown size={16} style={{ color: "#7C3AED" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Your Data
              </h3>
            </div>
            <p
              style={{
                color: "#B8C5D6",
                fontSize: 12,
                lineHeight: 1.5,
                margin: 0,
                marginBottom: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Export all your health data in FHIR R4 format. Compatible with 1177 and other health systems.
            </p>
            <button
              className="w-full py-2.5 flex items-center justify-center gap-2"
              style={{
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                borderRadius: 8,
                color: "#A78BFA",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              <FileDown size={14} />
              Export FHIR Data
            </button>
          </div>
        </div>

        {/* Right columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Biometrics */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} style={{ color: "#7C3AED" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Biometrics
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Weight", value: `${latestBio.weight} kg` },
                { label: "BMI (body mass index)", value: latestBio.bmi.toString() },
                { label: "Waist", value: `${latestBio.waist} cm` },
                { label: "Blood pressure", value: latestBio.bloodPressure },
              ].map((b) => (
                <div
                  key={b.label}
                  className="p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      color: "#B8C5D6",
                      fontSize: 11,
                      marginBottom: 4,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {b.label}
                  </div>
                  <div
                    style={{
                      color: "#F5F7FA",
                      fontSize: 18,
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    {b.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active conditions */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} style={{ color: "#F59E0B" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Conditions
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {CONDITIONS.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#F5F7FA",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {c.name}
                    </span>
                    <span
                      style={{
                        color: "#B8C5D6",
                        fontSize: 11,
                        marginLeft: 6,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      ICD-10: {c.icd10}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5"
                    style={{
                      background:
                        c.status === "active"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(16, 185, 129, 0.15)",
                      color: c.status === "active" ? "#F59E0B" : "#10B981",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Pill size={16} style={{ color: "#7C3AED" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Current Medications
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {MEDICATIONS.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#F5F7FA",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {m.name} {m.dose}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {m.frequency} - {m.purpose}
                    </div>
                  </div>
                  <span
                    style={{
                      color: "#B8C5D6",
                      fontSize: 11,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    Dr. {m.prescribedBy.split(" ").pop()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} style={{ color: "#EF4444" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Allergies
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {ALLERGIES.map((a) => (
                <div
                  key={a.substance}
                  className="flex items-center justify-between p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#F5F7FA",
                      fontSize: 13,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {a.substance}
                  </span>
                  {a.reaction && (
                    <span
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {a.reaction}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vaccinations */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Syringe size={16} style={{ color: "#10B981" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Vaccinations
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {VACCINATIONS.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#F5F7FA",
                      fontSize: 13,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {v.name}
                  </span>
                  <span
                    style={{
                      color: "#B8C5D6",
                      fontSize: 12,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {new Date(v.date).toLocaleDateString("en-SE", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent visits */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} style={{ color: "#7C3AED" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Visit History
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {DOCTOR_VISITS.slice(0, 6).map((v, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: v.provider.includes("Precura")
                          ? "#7C3AED"
                          : "#1F2D42",
                        border: v.provider.includes("Precura")
                          ? "none"
                          : "1px solid #B8C5D6",
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    {i < 5 && (
                      <div
                        style={{
                          width: 1,
                          flex: 1,
                          background: "#1F2D42",
                          marginTop: 4,
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          color: "#F5F7FA",
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        {v.type}
                      </span>
                      <span
                        style={{
                          color: "#B8C5D6",
                          fontSize: 11,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                        }}
                      >
                        {new Date(v.date).toLocaleDateString("en-SE", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        marginTop: 2,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {v.provider}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        marginTop: 2,
                        lineHeight: 1.5,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {v.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
