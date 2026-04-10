"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PATIENT,
  BLOOD_TEST_HISTORY,
} from "@/lib/v2/mock-patient";
import {
  Droplets,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  ChevronRight,
  ArrowLeft,
  Package,
} from "lucide-react";

const ORDER_STEPS = [
  { label: "Order placed", desc: "Comprehensive blood panel ordered by Dr. Johansson", date: "March 25, 2026", done: true },
  { label: "Kit shipped", desc: "Lab requisition sent to Karolinska University Laboratory", date: "March 25, 2026", done: true },
  { label: "Sample collected", desc: "Blood drawn at Karolinska lab, Solna", date: "March 27, 2026", done: true },
  { label: "Lab processing", desc: "10 markers analyzed", date: "March 27, 2026", done: true },
  { label: "Doctor review", desc: "Dr. Johansson reviewed results and wrote clinical note", date: "March 28, 2026", done: true },
  { label: "Results available", desc: "Full results with doctor's interpretation in your account", date: "March 28, 2026", done: true },
];

const TEST_PACKAGES = [
  {
    name: "Comprehensive Panel",
    desc: "Full metabolic, lipid, thyroid, vitamin screening. 10+ markers with doctor review.",
    price: "Included in membership",
    markers: 10,
    recommended: true,
  },
  {
    name: "Diabetes Focus",
    desc: "Glucose, HbA1c, insulin, HOMA-IR. Targeted for blood sugar monitoring.",
    price: "Included in membership",
    markers: 4,
    recommended: false,
  },
  {
    name: "Heart Health",
    desc: "Full lipid panel, hsCRP, ApoB. Cardiovascular risk markers.",
    price: "495 SEK add-on",
    markers: 6,
    recommended: false,
  },
];

export default function BloodTestsPage() {
  const [activeTab, setActiveTab] = useState<"current" | "history" | "order">("current");

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
          Blood Tests
        </h1>
        <p
          style={{
            color: "#B8C5D6",
            fontSize: 14,
            marginTop: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          Track orders, view history, and schedule your next test
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1" style={{ background: "#141F2E", borderRadius: 10 }}>
        {[
          { key: "current" as const, label: "Current Order" },
          { key: "history" as const, label: "History" },
          { key: "order" as const, label: "Order New" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 px-3"
            style={{
              background: activeTab === tab.key ? "#7C3AED" : "transparent",
              color: activeTab === tab.key ? "#FFFFFF" : "#B8C5D6",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: "pointer",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Current Order */}
      {activeTab === "current" && (
        <div className="flex flex-col gap-6">
          {/* Order tracker */}
          <div
            className="p-5"
            style={{
              background: "#141F2E",
              borderRadius: 12,
              border: "1px solid #1F2D42",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Package size={18} style={{ color: "#10B981" }} />
                <h2
                  style={{
                    color: "#F5F7FA",
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  }}
                >
                  March 2026 - Comprehensive Panel
                </h2>
              </div>
              <span
                className="px-2 py-1"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                }}
              >
                Complete
              </span>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-0">
              {ORDER_STEPS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        background: step.done ? "#10B981" : "#1F2D42",
                        flexShrink: 0,
                      }}
                    >
                      {step.done ? (
                        <CheckCircle size={14} style={{ color: "#FFFFFF" }} />
                      ) : (
                        <Clock size={12} style={{ color: "#B8C5D6" }} />
                      )}
                    </div>
                    {i < ORDER_STEPS.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          height: 32,
                          background: step.done ? "#10B981" : "#1F2D42",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4">
                    <div
                      style={{
                        color: "#F5F7FA",
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        marginTop: 2,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {step.desc}
                    </div>
                    <div
                      style={{
                        color: "#7C3AED",
                        fontSize: 11,
                        marginTop: 2,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {step.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View results CTA */}
            <Link
              href="/smith1/results"
              className="flex items-center justify-center gap-2 mt-4 py-3"
              style={{
                background: "#7C3AED",
                color: "#FFFFFF",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              <FileText size={16} />
              View Results with Doctor Notes
            </Link>
          </div>

          {/* Next test info */}
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
              <Clock size={16} style={{ color: "#7C3AED" }} />
              <h3
                style={{
                  color: "#F5F7FA",
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Next Recommended Test
              </h3>
            </div>
            <p
              style={{
                color: "#B8C5D6",
                fontSize: 13,
                lineHeight: 1.5,
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              Dr. Johansson recommends retesting in September 2026 to monitor your glucose trend.
              Given the steady rise from 5.0 to 5.8 over 5 years, the 6-month interval will help
              determine if lifestyle changes are slowing the progression.
            </p>
            <div
              className="flex items-center gap-2 mt-3"
              style={{
                color: "#F5F7FA",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              }}
            >
              <MapPin size={14} style={{ color: "#7C3AED" }} />
              September 15, 2026 - Karolinska University Laboratory, Solna
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === "history" && (
        <div className="flex flex-col gap-3">
          {BLOOD_TEST_HISTORY.map((session, i) => (
            <Link
              key={session.date}
              href={i === 0 ? "/smith1/results" : "#"}
              style={{ textDecoration: "none" }}
            >
              <div
                className="p-4 flex items-center justify-between"
                style={{
                  background: "#141F2E",
                  borderRadius: 12,
                  border: "1px solid #1F2D42",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  cursor: i === 0 ? "pointer" : "default",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: i === 0 ? "rgba(124, 58, 237, 0.15)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Droplets size={16} style={{ color: i === 0 ? "#7C3AED" : "#B8C5D6" }} />
                  </div>
                  <div>
                    <div
                      style={{
                        color: "#F5F7FA",
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {new Date(session.date).toLocaleDateString("en-SE", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div
                      style={{
                        color: "#B8C5D6",
                        fontSize: 12,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      {session.orderedBy} - {session.results.length} markers
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.results.some((r) => r.status === "borderline") && (
                    <span
                      className="px-2 py-0.5"
                      style={{
                        background: "rgba(245, 158, 11, 0.15)",
                        color: "#F59E0B",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      }}
                    >
                      borderline
                    </span>
                  )}
                  {i === 0 && <ChevronRight size={16} style={{ color: "#B8C5D6" }} />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Order New */}
      {activeTab === "order" && (
        <div className="flex flex-col gap-4">
          {TEST_PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className="p-5"
              style={{
                background: "#141F2E",
                borderRadius: 12,
                border: pkg.recommended
                  ? "1px solid rgba(124, 58, 237, 0.4)"
                  : "1px solid #1F2D42",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                position: "relative",
              }}
            >
              {pkg.recommended && (
                <div
                  className="absolute -top-2.5 left-4 px-2 py-0.5"
                  style={{
                    background: "#7C3AED",
                    color: "#FFFFFF",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  RECOMMENDED
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    style={{
                      color: "#F5F7FA",
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    }}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    style={{
                      color: "#B8C5D6",
                      fontSize: 13,
                      margin: 0,
                      marginTop: 4,
                      lineHeight: 1.5,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    {pkg.desc}
                  </p>
                  <div
                    className="flex items-center gap-4 mt-3"
                    style={{
                      fontSize: 12,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                    }}
                  >
                    <span style={{ color: "#B8C5D6" }}>{pkg.markers} markers</span>
                    <span style={{ color: pkg.price.includes("Included") ? "#10B981" : "#F5F7FA", fontWeight: 600 }}>
                      {pkg.price}
                    </span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 ml-4"
                  style={{
                    background: pkg.recommended ? "#7C3AED" : "rgba(124, 58, 237, 0.15)",
                    color: pkg.recommended ? "#FFFFFF" : "#A78BFA",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
