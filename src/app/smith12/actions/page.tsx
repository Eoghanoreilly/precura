"use client";

import React from "react";
import Link from "next/link";
import {
  PATIENT,
  TRAINING_PLAN,
  RISK_ASSESSMENTS,
  BIOMETRICS_HISTORY,
} from "@/lib/v2/mock-patient";
import {
  Droplets,
  Heart,
  Activity,
  Dumbbell,
  Pill,
  CheckCircle,
  Clock,
  ChevronRight,
  Sun,
  Footprints,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Action Item Card
// ---------------------------------------------------------------------------

function ActionCard({
  icon: Icon,
  title,
  description,
  due,
  priority,
  done,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  due?: string;
  priority: "high" | "medium" | "low";
  done?: boolean;
  href?: string;
}) {
  const priorityColor =
    priority === "high" ? "#FF385C" :
    priority === "medium" ? "#E07912" :
    "#717171";

  const priorityBg =
    priority === "high" ? "#FFF5F7" :
    priority === "medium" ? "#FFF7ED" :
    "#F7F7F7";

  const content = (
    <div
      className="flex items-start gap-3 p-4"
      style={{
        borderRadius: 16,
        background: done ? "#F7F7F7" : "#FFFFFF",
        boxShadow: done ? "none" : "0 2px 8px rgba(0,0,0,0.12)",
        opacity: done ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: done ? "#F0FFF4" : priorityBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {done ? (
          <CheckCircle size={20} style={{ color: "#008A05" }} />
        ) : (
          <Icon size={20} style={{ color: priorityColor }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p
            style={{
              color: "#222222",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: done ? "line-through" : "none",
            }}
          >
            {title}
          </p>
          {!done && (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 50,
                background: priorityBg,
                color: priorityColor,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {priority}
            </span>
          )}
        </div>
        <p style={{ color: "#717171", fontSize: 13, lineHeight: 1.5 }}>{description}</p>
        {due && !done && (
          <div className="flex items-center gap-1 mt-2">
            <Clock size={11} style={{ color: "#717171" }} />
            <span style={{ color: "#717171", fontSize: 11 }}>{due}</span>
          </div>
        )}
      </div>
      {href && !done && <ChevronRight size={16} style={{ color: "#717171", marginTop: 4 }} />}
    </div>
  );

  if (href && !done) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return content;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ActionsPage() {
  return (
    <div>
      {/* Page header */}
      <div className="px-5 pt-2 pb-4">
        <h1 style={{ color: "#222222", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Your actions
        </h1>
        <p style={{ color: "#717171", fontSize: 14, marginTop: 4 }}>
          Personalized next steps based on your health data
        </p>
      </div>

      {/* Active / priority items */}
      <div className="px-5 mb-6">
        <p style={{ color: "#222222", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Priority
        </p>
        <div className="flex flex-col gap-3">
          <ActionCard
            icon={Droplets}
            title="Blood test in September"
            description="Retest comprehensive panel. Monitor glucose trend and Vitamin D levels after supplementation."
            due={new Date(PATIENT.nextBloodTest).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            priority="high"
            href="/smith12/blood-tests"
          />
          <ActionCard
            icon={Sun}
            title="Start Vitamin D supplement"
            description="Your Vitamin D is 48 nmol/L (target is over 50). Dr. Johansson recommends 2000 IU daily, especially important during Swedish winters."
            priority="high"
          />
          <ActionCard
            icon={Footprints}
            title="Post-dinner walks"
            description="Even a 20-minute walk after your evening meal helps regulate blood sugar. Research shows this is one of the most effective habits for glucose control."
            priority="medium"
          />
        </div>
      </div>

      {/* Weekly goals */}
      <div className="px-5 mb-6">
        <p style={{ color: "#222222", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          This week
        </p>
        <div className="flex flex-col gap-3">
          <ActionCard
            icon={Dumbbell}
            title="Monday - Upper Body"
            description="Push-ups, dumbbell rows, shoulder press, planks. Focus on core engagement."
            priority="low"
            done
            href="/smith12/training"
          />
          <ActionCard
            icon={Dumbbell}
            title="Wednesday - Lower Body + Core"
            description="Squats, walking lunges, glute bridges, dead bugs. Remember: slow and controlled."
            priority="low"
            done
            href="/smith12/training"
          />
          <ActionCard
            icon={Dumbbell}
            title="Friday - Full Body + Cardio"
            description="Walk intervals, resistance band work, step-ups, core circuit. Your next session."
            priority="medium"
            href="/smith12/training"
          />
        </div>
      </div>

      {/* Ongoing habits */}
      <div className="px-5 mb-6">
        <p style={{ color: "#222222", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Daily habits
        </p>
        <div className="flex flex-col gap-3">
          <ActionCard
            icon={Pill}
            title="Enalapril 5mg"
            description="Continue taking once daily for blood pressure management. Working well - BP stable at 132/82."
            priority="low"
          />
          <ActionCard
            icon={Activity}
            title="Monitor blood pressure"
            description="Check periodically. Current reading: {BIOMETRICS_HISTORY[0].bloodPressure}. Target: under 130/80."
            priority="low"
          />
        </div>
      </div>

      {/* Motivational footer */}
      <div
        className="mx-5 mb-6 p-5 text-center"
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #FFF5F7, #FFF0E6)",
        }}
      >
        <Heart size={24} style={{ color: "#FF385C", margin: "0 auto 8px" }} />
        <p style={{ color: "#222222", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
          You are ahead of the curve
        </p>
        <p style={{ color: "#717171", fontSize: 13, lineHeight: 1.5 }}>
          Most people with your glucose trend would not catch it for another 10+ years.
          You are taking action now, and that changes everything.
        </p>
      </div>
    </div>
  );
}
