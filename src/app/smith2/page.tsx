"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  ChevronRight,
  Activity,
  TestTube,
  Dumbbell,
  FileText,
  Calendar,
  Clock,
  Heart,
  CheckCheck,
  User,
  TrendingUp,
  AlertTriangle,
  Shield,
  Stethoscope,
} from "lucide-react";
import {
  PATIENT,
  MESSAGES,
  DOCTOR_NOTES,
  BLOOD_TEST_HISTORY,
  RISK_ASSESSMENTS,
  TRAINING_PLAN,
  CONDITIONS,
  MEDICATIONS,
  getMarkerHistory,
} from "@/lib/v2/mock-patient";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Warm teal/green doctor accent
const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Smith2Home() {
  const [msgText, setMsgText] = useState("");
  const latestNote = DOCTOR_NOTES[0];
  const latestBlood = BLOOD_TEST_HISTORY[0];
  const glucoseHistory = getMarkerHistory("f-Glucose");
  const latestGlucose = glucoseHistory[glucoseHistory.length - 1];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ----------------------------------------------------------------- */}
        {/* TOP BAR                                                           */}
        {/* ----------------------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            paddingBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: DOC_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={14} style={{ color: DOC_COLOR }} />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Precura
            </span>
          </div>
          <Link href="/smith2/record">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: DOC_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: DOC_COLOR,
              }}
            >
              AB
            </div>
          </Link>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* DOCTOR HERO CARD                                                  */}
        {/* The first thing Anna sees: her doctor, his latest note to her     */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in"
          style={{
            background: `linear-gradient(135deg, ${DOC_BG} 0%, #ecfdf5 100%)`,
            borderRadius: 20,
            padding: "24px 20px",
            marginBottom: 16,
            border: `1px solid ${DOC_BORDER}`,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Doctor identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <img
              src={DOC_AVATAR}
              alt="Dr. Marcus Johansson"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${DOC_COLOR}`,
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                Dr. Marcus Johansson
              </p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 1 }}>
                Your Precura physician
              </p>
            </div>
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#166534" }}>Available</span>
            </div>
          </div>

          {/* Latest doctor note preview */}
          <div
            style={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 14,
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <FileText size={13} style={{ color: DOC_COLOR }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: DOC_COLOR, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Latest review - {formatDate(latestNote.date)}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55 }}>
              {latestNote.note.split("\n")[0].slice(0, 180)}...
            </p>
            <Link
              href="/smith2/health"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 10,
                fontSize: 13,
                fontWeight: 600,
                color: DOC_COLOR,
              }}
            >
              Read full review <ChevronRight size={14} />
            </Link>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href="/smith2/messages"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 0",
                borderRadius: 12,
                background: DOC_COLOR,
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <MessageCircle size={15} />
              Message
            </Link>
            <Link
              href="/smith2/book"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 0",
                borderRadius: 12,
                background: "rgba(255,255,255,0.8)",
                color: DOC_COLOR,
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid ${DOC_BORDER}`,
                textDecoration: "none",
              }}
            >
              <Calendar size={15} />
              Book visit
            </Link>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* DOCTOR'S ATTENTION ITEMS                                          */}
        {/* What Dr. Johansson wants Anna to know about right now             */}
        {/* ----------------------------------------------------------------- */}
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
              paddingLeft: 2,
            }}
          >
            Dr. Johansson's priorities for you
          </p>

          {/* Glucose attention item */}
          <div
            className="animate-fade-in stagger-1"
            style={{
              background: "var(--bg-card)",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 10,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--amber-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUp size={16} style={{ color: "var(--amber-text)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Blood sugar (fasting glucose) trending up
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                5.0 to 5.8 over 5 years. Still in normal range, but Dr. Johansson is tracking this closely given your family history.
              </p>
              <Link
                href="/smith2/blood-results"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: DOC_COLOR,
                }}
              >
                View blood results <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Vitamin D item */}
          <div
            className="animate-fade-in stagger-2"
            style={{
              background: "var(--bg-card)",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 10,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--blue-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Shield size={16} style={{ color: "var(--blue-text)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Start Vitamin D supplement
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Dr. Johansson recommends D3 2000 IU daily. Your level is 48 nmol/L (target is above 50).
              </p>
            </div>
          </div>

          {/* Next test reminder */}
          <div
            className="animate-fade-in stagger-3"
            style={{
              background: "var(--bg-card)",
              borderRadius: 16,
              padding: "14px 16px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: DOC_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TestTube size={16} style={{ color: DOC_COLOR }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Next blood test: September 2026
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Dr. Johansson ordered a retest in 6 months to check if lifestyle changes are improving your glucose trend.
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* LATEST MESSAGE PREVIEW                                            */}
        {/* ----------------------------------------------------------------- */}
        <Link href="/smith2/messages" style={{ textDecoration: "none" }}>
          <div
            className="animate-fade-in stagger-4"
            style={{
              background: "var(--bg-card)",
              borderRadius: 16,
              padding: "16px",
              marginBottom: 20,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img
                src={DOC_AVATAR}
                alt=""
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                  Dr. Johansson
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {formatDate(MESSAGES[MESSAGES.length - 1].date)}
                </p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}
            >
              {MESSAGES[MESSAGES.length - 1].text}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
              }}
            >
              <MessageCircle size={13} style={{ color: DOC_COLOR }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: DOC_COLOR }}>
                Continue conversation
              </span>
            </div>
          </div>
        </Link>

        {/* ----------------------------------------------------------------- */}
        {/* YOUR CARE                                                         */}
        {/* Navigation cards to sub-pages                                     */}
        {/* ----------------------------------------------------------------- */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 10,
            paddingLeft: 2,
          }}
        >
          Your care with Dr. Johansson
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {/* Health overview */}
          <Link href="/smith2/health" style={{ textDecoration: "none" }}>
            <div
              className="card-hover animate-fade-in stagger-4"
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                padding: "16px 14px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--teal-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Heart size={16} style={{ color: "var(--teal-text)" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Health overview
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                Doctor's assessment of your risks and progress
              </p>
            </div>
          </Link>

          {/* Blood results */}
          <Link href="/smith2/blood-results" style={{ textDecoration: "none" }}>
            <div
              className="card-hover animate-fade-in stagger-5"
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                padding: "16px 14px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--purple-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <TestTube size={16} style={{ color: "var(--purple-text)" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Blood results
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                {latestBlood.results.length} markers tested on {formatDate(latestBlood.date)}
              </p>
            </div>
          </Link>

          {/* Training plan */}
          <Link href="/smith2/training" style={{ textDecoration: "none" }}>
            <div
              className="card-hover animate-fade-in stagger-5"
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                padding: "16px 14px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--green-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Dumbbell size={16} style={{ color: "var(--green-text)" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Training plan
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                Week {TRAINING_PLAN.currentWeek}/{TRAINING_PLAN.totalWeeks} - reviewed by Dr. Johansson
              </p>
            </div>
          </Link>

          {/* Medical record */}
          <Link href="/smith2/record" style={{ textDecoration: "none" }}>
            <div
              className="card-hover animate-fade-in stagger-6"
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                padding: "16px 14px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--amber-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <FileText size={16} style={{ color: "var(--amber-text)" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                Medical record
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                Conditions, medications, visits, family history
              </p>
            </div>
          </Link>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* MEMBERSHIP FOOTER                                                 */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="animate-fade-in stagger-6"
          style={{
            background: "var(--bg-card)",
            borderRadius: 16,
            padding: "14px 16px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
              Annual membership
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Member since {new Date(PATIENT.memberSince).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
          </div>
          <div
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              background: DOC_BG,
              fontSize: 12,
              fontWeight: 600,
              color: DOC_COLOR,
            }}
          >
            Active
          </div>
        </div>
      </div>
    </div>
  );
}
