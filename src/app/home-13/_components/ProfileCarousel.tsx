"use client";

/**
 * ProfileCarousel - "Explore the profile"
 *
 * The user asked for a clickable carousel on the page. This is it: a wide
 * panel with six tabs along the top (Overview, Glucose, Heart, Bone,
 * Coaching, Doctor) and each tab reveals a different slide inside the
 * Precura profile mock-up.
 *
 * Each slide is a distinct composition so the carousel feels like pages
 * in a document, not the same card with different text.
 *
 * Uses AnimatePresence + framer-motion for the slide crossfade. Left and
 * right arrow keys also move between tabs.
 */

import {
  AnimatePresence,
  motion,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

type Slide = {
  key: string;
  tab: string;
  eyebrow: string;
  title: string;
  body: string;
  render: () => React.ReactNode;
};

const slides: Slide[] = [
  {
    key: "overview",
    tab: "Overview",
    eyebrow: "Page 01  /  Landing view",
    title: "Your five-year picture, on one page.",
    body: "A quiet summary of everything Precura knows about you today. Trajectory, risk models, the latest note from your doctor, and what your coach has queued for next week.",
    render: () => <OverviewSlide />,
  },
  {
    key: "glucose",
    tab: "Glucose",
    eyebrow: "Page 02  /  Metabolic health",
    title: "The slope under the normal.",
    body: "Fasting glucose, HbA1c, fasting insulin and HOMA-IR plotted across every draw we have on you. Safe corridor shaded behind. Your trend line colour-coded by direction.",
    render: () => <GlucoseSlide />,
  },
  {
    key: "heart",
    tab: "Heart",
    eyebrow: "Page 03  /  Cardiovascular",
    title: "SCORE2 risk, in plain English.",
    body: "Combines LDL-C, ApoB, HDL, triglycerides, blood pressure and smoking status with your age and sex. 10-year CVD risk read against European Society of Cardiology bands.",
    render: () => <HeartSlide />,
  },
  {
    key: "bone",
    tab: "Bone",
    eyebrow: "Page 04  /  Skeletal health",
    title: "FRAX + vitamin D, watched.",
    body: "Your 10-year fracture risk from FRAX, alongside your vitamin D level tracked season by season. The Swedish winter is not polite to bones.",
    render: () => <BoneSlide />,
  },
  {
    key: "coach",
    tab: "Coach",
    eyebrow: "Page 05  /  Training plan",
    title: "Built from your markers.",
    body: "A 12-week strength + zone-2 programme designed by a human exercise physiologist, reviewed by your doctor, and updated every time your blood is re-read.",
    render: () => <CoachSlide />,
  },
  {
    key: "doctor",
    tab: "Doctor",
    eyebrow: "Page 06  /  Messages",
    title: "A real doctor, on your phone.",
    body: "iMessage-style thread with Dr. Marcus Johansson. Ask follow-ups on any marker, ask about medications, ask about anything. 12 months of unlimited written questions included.",
    render: () => <DoctorSlide />,
  },
];

export default function ProfileCarousel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [index, setIndex] = useState(0);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const slide = slides[index];

  return (
    <section
      ref={ref}
      style={{
        background: C.creamSoft,
        color: C.ink,
        padding: "160px 36px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Heading */}
        <div
          style={{
            marginBottom: 60,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                ...TYPE.mono,
                color: C.amber,
                marginBottom: 24,
              }}
            >
              06  /  Explore the profile
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              style={{ ...TYPE.displayLarge, color: C.ink, margin: 0 }}
            >
              Six tabs.{" "}
              <span
                style={{
                  color: C.amberDeep,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Click anywhere.
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + slides.length) % slides.length)
              }
              aria-label="Previous slide"
              style={arrowBtn}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              aria-label="Next slide"
              style={{
                ...arrowBtn,
                background: C.ink,
                color: C.cream,
                borderColor: C.ink,
              }}
            >
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          {slides.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIndex(i)}
              style={{
                padding: "12px 20px",
                borderRadius: 100,
                border: `1px solid ${i === index ? C.ink : C.line}`,
                background: i === index ? C.ink : C.paper,
                color: i === index ? C.cream : C.inkSoft,
                fontFamily: SYSTEM_FONT,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 500ms cubic-bezier(0.22,1,0.36,1)",
                letterSpacing: "-0.01em",
              }}
            >
              {String(i + 1).padStart(2, "0")}  .  {s.tab}
            </button>
          ))}
        </motion.div>

        {/* Stage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
          style={{
            background: C.paper,
            border: `1px solid ${C.line}`,
            borderRadius: 28,
            boxShadow: C.shadowMd,
            overflow: "hidden",
            minHeight: 600,
            position: "relative",
          }}
        >
          {/* Fake window chrome */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${C.lineSoft}`,
              background: C.creamSoft,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#E06B2D",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#D4AB3D",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#6B8F71",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                ...TYPE.mono,
                color: C.inkMuted,
              }}
            >
              precura.se  /  anna bergstrom
            </div>
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
              }}
            >
              {String(index + 1).padStart(2, "0")} / {slides.length}
            </div>
          </div>

          {/* Slide body */}
          <div
            style={{
              position: "relative",
              minHeight: 540,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                  padding: 44,
                  display: "grid",
                  gridTemplateColumns: "5fr 7fr",
                  gap: 48,
                  minHeight: 540,
                }}
                className="home13-slide-body"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.amber,
                      marginBottom: 16,
                    }}
                  >
                    {slide.eyebrow}
                  </div>
                  <h3
                    style={{
                      fontSize: "clamp(26px, 2.8vw, 40px)",
                      fontWeight: 500,
                      margin: 0,
                      color: C.ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {slide.title}
                  </h3>
                  <p
                    style={{
                      ...TYPE.body,
                      color: C.inkMid,
                      marginTop: 18,
                      maxWidth: 420,
                    }}
                  >
                    {slide.body}
                  </p>

                  {/* Progress dots */}
                  <div
                    style={{
                      marginTop: 32,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => setIndex(i)}
                        style={{
                          width: i === index ? 32 : 10,
                          height: 10,
                          borderRadius: 100,
                          background: i === index ? C.amber : C.line,
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          transition: "all 500ms cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex" }}>{slide.render()}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-slide-body) {
            grid-template-columns: 1fr !important;
            padding: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}

const arrowBtn: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: `1px solid ${C.line}`,
  background: C.paper,
  color: C.ink,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
};

// ---------------------------------------------------------------------------
// Slide contents - each a distinct composition
// ---------------------------------------------------------------------------

function OverviewSlide() {
  const risks = [
    { name: "Diabetes", model: "FINDRISC", pct: 17, band: "Moderate", col: C.signalCaution },
    { name: "Cardio", model: "SCORE2", pct: 3, band: "Low-mod", col: C.signalGood },
    { name: "Bone", model: "FRAX", pct: 2, band: "Low", col: C.signalGood },
  ];
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {risks.map((r) => (
          <div
            key={r.name}
            style={{
              padding: 18,
              background: C.creamSoft,
              border: `1px solid ${C.lineSoft}`,
              borderRadius: 14,
            }}
          >
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>{r.model}</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.ink,
                marginTop: 4,
              }}
            >
              {r.name}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: r.col,
                letterSpacing: "-0.02em",
                marginTop: 10,
                lineHeight: 1,
              }}
            >
              {r.pct}%
            </div>
            <div
              style={{
                ...TYPE.mono,
                color: r.col,
                marginTop: 6,
              }}
            >
              {r.band}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: 18,
          background: C.creamSoft,
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: C.sage,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          MJ
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.ink }}>
            Dr. Marcus Johansson
          </div>
          <div style={{ fontSize: 11, color: C.inkMuted }}>
            Your glucose trend warrants attention...
          </div>
        </div>
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>28 MAR</div>
      </div>
      <div
        style={{
          padding: 18,
          background: C.amberWash,
          border: `1px solid ${C.amberSoft}`,
          borderRadius: 14,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.amberDeep }}>Next action</div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: C.ink,
            marginTop: 4,
          }}
        >
          Book retest  /  Sep 15, 2026
        </div>
      </div>
    </div>
  );
}

function GlucoseSlide() {
  // Mini trendline chart
  const readings = [
    { year: 2021, v: 5.0 },
    { year: 2022, v: 5.1 },
    { year: 2023, v: 5.2 },
    { year: 2024, v: 5.4 },
    { year: 2025, v: 5.5 },
    { year: 2026, v: 5.8 },
  ];
  const min = 4.6;
  const max = 6.2;
  const w = 100;
  const h = 40;
  const xStep = w / (readings.length - 1);
  const pts = readings.map((r, i) => ({
    x: i * xStep,
    y: h - ((r.v - min) / (max - min)) * h,
    year: r.year,
    v: r.v,
  }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        background: C.creamSoft,
        border: `1px solid ${C.lineSoft}`,
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ ...TYPE.mono, color: C.inkMuted }}>
        Fasting glucose  /  mmol/L
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 500,
          color: C.ink,
          letterSpacing: "-0.02em",
          marginTop: 8,
        }}
      >
        5.8{" "}
        <span style={{ fontSize: 18, color: C.amberDeep }}>
          +0.8 in 5 yrs
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 220, marginTop: 20 }}>
        <svg
          viewBox={`-4 -6 ${w + 8} ${h + 16}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="gls-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.sage} />
              <stop offset="100%" stopColor={C.amber} />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y={h - ((5.6 - min) / (max - min)) * h}
            width={w}
            height={((5.6 - 4.6) / (max - min)) * h}
            fill={C.sageWash}
            opacity={0.6}
          />
          <path
            d={path}
            fill="none"
            stroke="url(#gls-grad)"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pts.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="0.9"
                fill={i === pts.length - 1 ? C.amberDeep : C.paper}
                stroke={C.amber}
                strokeWidth="0.3"
              />
              <text
                x={p.x}
                y={h + 5}
                fontSize="2.8"
                textAnchor="middle"
                fill={C.inkMuted}
                fontFamily={SYSTEM_FONT}
              >
                {p.year}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ ...TYPE.mono, color: C.inkMuted, marginTop: 10 }}>
        Safe corridor shaded
      </div>
    </div>
  );
}

function HeartSlide() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          padding: 24,
          background: C.creamSoft,
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 14,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          SCORE2  /  10-year CVD risk
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: C.signalGood,
            letterSpacing: "-0.02em",
            marginTop: 6,
          }}
        >
          3.1%
        </div>
        <div style={{ fontSize: 13, color: C.inkMid }}>
          European Society of Cardiology  /  Low-moderate band
        </div>
        <div
          style={{
            marginTop: 18,
            height: 8,
            borderRadius: 100,
            background: `linear-gradient(90deg, ${C.signalGood} 0%, ${C.signalCaution} 50%, ${C.signalRisk} 100%)`,
            opacity: 0.55,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: -5,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: C.paper,
              border: `2px solid ${C.ink}`,
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>
      {[
        { n: "LDL-C", v: "2.9 mmol/L", s: "normal" },
        { n: "ApoB", v: "0.74 g/L", s: "normal" },
        { n: "HDL", v: "1.6 mmol/L", s: "good" },
        { n: "Triglycerides", v: "1.3 mmol/L", s: "normal" },
        { n: "Systolic BP", v: "128 mmHg", s: "caution" },
      ].map((m) => (
        <div
          key={m.n}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            background: C.creamSoft,
            border: `1px solid ${C.lineSoft}`,
            borderRadius: 10,
          }}
        >
          <span style={{ fontSize: 13, color: C.inkSoft }}>{m.n}</span>
          <span style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>
            {m.v}
          </span>
        </div>
      ))}
    </div>
  );
}

function BoneSlide() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const vitD = [42, 38, 36, 40, 48, 56, 62, 64, 58, 52, 46, 44];
  const max = 80;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          padding: 24,
          background: C.creamSoft,
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 14,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          FRAX  /  10-year fracture risk
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 500,
            color: C.signalGood,
            letterSpacing: "-0.02em",
            marginTop: 6,
          }}
        >
          2.1%
        </div>
        <div style={{ fontSize: 13, color: C.inkMid }}>Low risk  /  No action</div>
      </div>
      <div
        style={{
          padding: 20,
          background: C.creamSoft,
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 14,
          flex: 1,
        }}
      >
        <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 14 }}>
          Vit D across the Swedish year
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            alignItems: "end",
            gap: 4,
            height: 140,
          }}
        >
          {vitD.map((v, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${(v / max) * 100}%`,
                  background:
                    v < 50 ? C.signalCaution : C.sage,
                  borderRadius: 4,
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  fontSize: 9,
                  color: C.inkMuted,
                }}
              >
                {months[i][0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoachSlide() {
  const week = [
    { d: "Mon", w: "Lower + Zone 2", time: "45m" },
    { d: "Tue", w: "Zone 2 walk", time: "35m" },
    { d: "Wed", w: "Upper + intervals", time: "45m" },
    { d: "Thu", w: "Mobility", time: "20m" },
    { d: "Fri", w: "Full body strength", time: "50m" },
    { d: "Sat", w: "Long Zone 2", time: "60m" },
    { d: "Sun", w: "Rest", time: "-" },
  ];
  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        background: C.creamSoft,
        border: `1px solid ${C.lineSoft}`,
        borderRadius: 14,
      }}
    >
      <div style={{ ...TYPE.mono, color: C.inkMuted }}>
        Week 12  /  Metabolic focus
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: C.ink,
          marginTop: 6,
          letterSpacing: "-0.015em",
        }}
      >
        Strength + Zone 2  /  Coach Emma
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 18,
        }}
      >
        {week.map((d, i) => (
          <div
            key={d.d}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr auto",
              gap: 12,
              padding: "12px 14px",
              background: C.paper,
              border: `1px solid ${C.lineSoft}`,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <span
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
              }}
            >
              {d.d}
            </span>
            <span style={{ fontSize: 13, color: C.ink }}>{d.w}</span>
            <span
              style={{
                fontSize: 11,
                color: C.inkMuted,
                fontFamily: SYSTEM_FONT,
              }}
            >
              {d.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorSlide() {
  const msgs = [
    {
      from: "doc",
      t: "Hi Anna. I&apos;ve gone through your March panel. Good news on lipids. Glucose is where I want to focus.",
    },
    {
      from: "me",
      t: "Thanks Marcus. Should I change anything before the retest?",
    },
    {
      from: "doc",
      t: "Stick to the plan Emma built. Add 30g fibre/day target and we&apos;ll retest in September.",
    },
    { from: "me", t: "Got it. And the vitamin D?" },
    {
      from: "doc",
      t: "Start 2000 IU/day through winter. I&apos;ll send a prescription.",
    },
  ];
  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        background: C.creamSoft,
        border: `1px solid ${C.lineSoft}`,
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingBottom: 16,
          borderBottom: `1px solid ${C.lineSoft}`,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: C.sage,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          MJ
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>
            Dr. Marcus Johansson
          </div>
          <div style={{ fontSize: 11, color: C.sage }}>Active now</div>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 10,
          overflow: "auto",
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.from === "me" ? "flex-end" : "flex-start",
              maxWidth: "78%",
              padding: "10px 14px",
              background: m.from === "me" ? C.amber : C.paper,
              color: m.from === "me" ? C.cream : C.ink,
              borderRadius: 14,
              borderBottomRightRadius: m.from === "me" ? 4 : 14,
              borderBottomLeftRadius: m.from === "me" ? 14 : 4,
              fontSize: 13,
              lineHeight: 1.45,
              border: m.from === "me" ? "none" : `1px solid ${C.lineSoft}`,
            }}
            dangerouslySetInnerHTML={{ __html: m.t }}
          />
        ))}
      </div>
    </div>
  );
}
