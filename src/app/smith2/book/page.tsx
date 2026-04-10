"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Phone,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { PATIENT } from "@/lib/v2/mock-patient";

const DOC_COLOR = "#0d9488";
const DOC_BG = "#f0fdfa";
const DOC_BORDER = "#ccfbf1";
const DOC_AVATAR = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80&fit=crop&crop=face";

type ConsultType = "video" | "phone" | "clinic";

const consultTypes: { key: ConsultType; label: string; desc: string; icon: typeof Video; price: string; duration: string }[] = [
  {
    key: "video",
    label: "Video consultation",
    desc: "Face-to-face with Dr. Johansson from home",
    icon: Video,
    price: "Included",
    duration: "30 min",
  },
  {
    key: "phone",
    label: "Phone consultation",
    desc: "Quick check-in or follow-up call",
    icon: Phone,
    price: "Included",
    duration: "15 min",
  },
  {
    key: "clinic",
    label: "Clinic visit",
    desc: "In-person at Precura Stockholm",
    icon: MapPin,
    price: "Included",
    duration: "45 min",
  },
];

// Mock available slots
const availableSlots = [
  { date: "Mon, 14 Apr", slots: ["09:00", "10:30", "14:00", "15:30"] },
  { date: "Tue, 15 Apr", slots: ["09:30", "11:00", "13:00", "16:00"] },
  { date: "Wed, 16 Apr", slots: ["08:30", "10:00", "14:30"] },
  { date: "Thu, 17 Apr", slots: ["09:00", "11:30", "15:00", "16:30"] },
  { date: "Fri, 18 Apr", slots: ["09:00", "10:30"] },
];

export default function BookPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ConsultType>("video");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
        <div style={{ maxWidth: 448, margin: "0 auto", padding: "0 20px" }}>
          {/* Success state */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "80dvh",
              textAlign: "center" as const,
            }}
          >
            <div
              className="animate-scale-in"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: DOC_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <CheckCircle size={36} style={{ color: DOC_COLOR }} />
            </div>
            <h2
              className="animate-fade-in stagger-1"
              style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}
            >
              Consultation booked
            </h2>
            <p
              className="animate-fade-in stagger-2"
              style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 6 }}
            >
              {consultTypes.find((t) => t.key === selectedType)?.label} with Dr. Johansson
            </p>
            <p
              className="animate-fade-in stagger-2"
              style={{ fontSize: 14, fontWeight: 600, color: DOC_COLOR, marginBottom: 24 }}
            >
              {selectedDate !== null ? availableSlots[selectedDate].date : ""} at {selectedSlot}
            </p>
            <p
              className="animate-fade-in stagger-3"
              style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}
            >
              Dr. Johansson will have your complete medical record and latest blood results ready for the appointment.
            </p>
            <div className="animate-fade-in stagger-4" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <Link
                href="/smith2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px",
                  borderRadius: 12,
                  background: DOC_COLOR,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Back to home
              </Link>
              <Link
                href="/smith2/messages"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px",
                  borderRadius: 12,
                  background: DOC_BG,
                  color: DOC_COLOR,
                  fontSize: 14,
                  fontWeight: 600,
                  border: `1px solid ${DOC_BORDER}`,
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={15} />
                Message Dr. Johansson
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--divider)",
          boxShadow: "var(--shadow-sm)",
          padding: "12px 20px",
        }}
      >
        <div style={{ maxWidth: 448, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/smith2")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Book consultation</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>With Dr. Marcus Johansson</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 448, margin: "0 auto", padding: "20px 20px 80px" }}>

        {/* Doctor card */}
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: DOC_BG,
            borderRadius: 16,
            padding: "16px",
            marginBottom: 20,
            border: `1px solid ${DOC_BORDER}`,
          }}
        >
          <img
            src={DOC_AVATAR}
            alt=""
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${DOC_COLOR}`,
            }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Dr. Marcus Johansson</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              General Practitioner / Preventive Medicine
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Your doctor since {new Date(PATIENT.memberSince).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* CONSULTATION TYPE                                                 */}
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
          Type of consultation
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {consultTypes.map((ct) => {
            const Icon = ct.icon;
            const isSelected = selectedType === ct.key;
            return (
              <button
                key={ct.key}
                onClick={() => setSelectedType(ct.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: isSelected ? DOC_BG : "var(--bg-card)",
                  border: `2px solid ${isSelected ? DOC_COLOR : "var(--border)"}`,
                  cursor: "pointer",
                  textAlign: "left" as const,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: isSelected ? "rgba(13,148,136,0.15)" : "var(--bg-elevated)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: isSelected ? DOC_COLOR : "var(--text-secondary)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{ct.label}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{ct.desc}</p>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: DOC_COLOR }}>{ct.price}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{ct.duration}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* TIME SLOTS                                                        */}
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
          Available times
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {availableSlots.map((day, dayIdx) => (
            <div key={dayIdx}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                {day.date}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {day.slots.map((slot) => {
                  const isSelected = selectedDate === dayIdx && selectedSlot === slot;
                  return (
                    <button
                      key={`${dayIdx}-${slot}`}
                      onClick={() => {
                        setSelectedDate(dayIdx);
                        setSelectedSlot(slot);
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: `1px solid ${isSelected ? DOC_COLOR : "var(--border)"}`,
                        background: isSelected ? DOC_COLOR : "var(--bg-card)",
                        color: isSelected ? "#ffffff" : "var(--text-secondary)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* BOOK BUTTON                                                       */}
        {/* ----------------------------------------------------------------- */}
        <button
          onClick={() => {
            if (selectedSlot) setBooked(true);
          }}
          disabled={!selectedSlot}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: selectedSlot ? "pointer" : "default",
            background: selectedSlot ? DOC_COLOR : "var(--bg-elevated)",
            color: selectedSlot ? "#ffffff" : "var(--text-faint)",
            transition: "all 0.2s ease",
          }}
        >
          {selectedSlot
            ? `Book ${consultTypes.find((t) => t.key === selectedType)?.label.toLowerCase()}`
            : "Select a time to continue"}
        </button>

        {/* Included in membership note */}
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center" as const,
            marginTop: 10,
          }}
        >
          All consultations included in your annual membership
        </p>
      </div>
    </div>
  );
}
