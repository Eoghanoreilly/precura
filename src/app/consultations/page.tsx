"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Stethoscope,
  Video,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";

const DOCTOR = {
  name: "Dr. Marcus Johansson",
  initials: "MJ",
  title: "General Practitioner & Preventive Medicine",
  role: "Precura Medical Co-founder",
  bio: "Specializing in metabolic health and diabetes prevention. 12 years clinical experience.",
};

const TIME_SLOTS = ["09:00", "10:00", "11:30", "14:00", "15:30"];

function getNextDays(count: number) {
  const days: { date: Date; label: string; dayName: string; dayNum: number }[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();
    const label = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    days.push({ date: d, label, dayName, dayNum });
  }
  return days;
}

export default function ConsultationsPage() {
  const router = useRouter();
  const [appointmentType, setAppointmentType] = useState<"video" | "inperson">("video");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const days = useMemo(() => getNextDays(7), []);
  const selectedDay = days[selectedDayIndex];

  function handleBook() {
    if (!selectedTime || !selectedDay) return;
    setBooked(true);
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-elevated)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div className="flex items-center gap-2">
          <Stethoscope size={18} style={{ color: "var(--purple)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Book a Consultation
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">
        {booked ? (
          /* Confirmation state */
          <div className="animate-scale-in flex flex-col items-center text-center py-10">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "var(--green-bg)" }}
            >
              <CheckCircle2 size={36} style={{ color: "var(--green)" }} />
            </div>
            <h2
              className="text-lg font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              Appointment booked!
            </h2>
            <p
              className="text-sm leading-relaxed max-w-xs mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Your Precura health report will be shared with {DOCTOR.name} before
              your session.
            </p>
            <div
              className="rounded-xl p-4 w-full mt-4 text-left"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} style={{ color: "var(--purple)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {selectedDay?.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} style={{ color: "var(--purple)" }} />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "var(--text)",
                  }}
                >
                  {selectedTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {appointmentType === "video" ? (
                  <Video size={14} style={{ color: "var(--purple)" }} />
                ) : (
                  <MapPin size={14} style={{ color: "var(--purple)" }} />
                )}
                <span
                  className="text-sm"
                  style={{ color: "var(--text)" }}
                >
                  {appointmentType === "video" ? "Video call" : "In person"}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-xl text-sm font-semibold mt-6"
              style={{
                background: "var(--purple)",
                color: "white",
              }}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          /* Booking flow */
          <>
            {/* Title */}
            <div className="animate-fade-in">
              <h1
                className="text-xl font-bold tracking-tight mb-1"
                style={{ color: "var(--text)" }}
              >
                Book a Consultation
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Discuss your results with a preventive medicine specialist.
              </p>
            </div>

            {/* Doctor card */}
            <div
              className="animate-fade-in-up stagger-1 rounded-2xl p-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                opacity: 0,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "var(--purple-bg)",
                    color: "var(--purple-text)",
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  {DOCTOR.initials}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {DOCTOR.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--purple-text)" }}
                  >
                    {DOCTOR.role}
                  </p>
                </div>
              </div>
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {DOCTOR.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {DOCTOR.bio}
              </p>
            </div>

            {/* Appointment type */}
            <div
              className="animate-fade-in-up stagger-2"
              style={{ opacity: 0 }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Appointment type
              </p>
              <div
                className="flex rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => setAppointmentType("video")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                  style={{
                    background:
                      appointmentType === "video"
                        ? "var(--purple)"
                        : "transparent",
                    color:
                      appointmentType === "video"
                        ? "white"
                        : "var(--text-secondary)",
                  }}
                >
                  <Video size={16} />
                  Video Call
                </button>
                <button
                  onClick={() => setAppointmentType("inperson")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                  style={{
                    background:
                      appointmentType === "inperson"
                        ? "var(--purple)"
                        : "transparent",
                    color:
                      appointmentType === "inperson"
                        ? "white"
                        : "var(--text-secondary)",
                  }}
                >
                  <MapPin size={16} />
                  In Person
                </button>
              </div>
            </div>

            {/* Date picker */}
            <div
              className="animate-fade-in-up stagger-3"
              style={{ opacity: 0 }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Select date
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
                {days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDayIndex(i);
                      setSelectedTime(null);
                    }}
                    className="flex flex-col items-center px-3 py-2.5 rounded-xl shrink-0 min-w-[60px]"
                    style={{
                      background:
                        selectedDayIndex === i
                          ? "var(--purple)"
                          : "var(--bg-card)",
                      border:
                        selectedDayIndex === i
                          ? "1px solid var(--purple)"
                          : "1px solid var(--border)",
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          selectedDayIndex === i
                            ? "rgba(255,255,255,0.7)"
                            : "var(--text-muted)",
                      }}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className="text-base font-bold"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color:
                          selectedDayIndex === i
                            ? "white"
                            : "var(--text)",
                      }}
                    >
                      {day.dayNum}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div
              className="animate-fade-in-up stagger-4"
              style={{ opacity: 0 }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Available times
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className="py-3 rounded-xl text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      background:
                        selectedTime === time
                          ? "var(--purple)"
                          : "var(--bg-card)",
                      border:
                        selectedTime === time
                          ? "1px solid var(--purple)"
                          : "1px solid var(--border)",
                      color:
                        selectedTime === time
                          ? "white"
                          : "var(--text)",
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + book */}
            <div
              className="animate-fade-in-up stagger-5"
              style={{ opacity: 0 }}
            >
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Consultation fee
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: "var(--text)",
                    }}
                  >
                    495 SEK
                  </p>
                </div>
                <button
                  onClick={handleBook}
                  disabled={!selectedTime}
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: selectedTime
                      ? "var(--purple)"
                      : "var(--bg-elevated)",
                    color: selectedTime ? "white" : "var(--text-muted)",
                    opacity: selectedTime ? 1 : 0.5,
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Spacer */}
            <div className="h-4" />
          </>
        )}
      </main>
    </div>
  );
}
