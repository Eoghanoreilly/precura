"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

// Helper component to avoid calling hooks inside map loops.
function Dot({
  i,
  d,
  x,
  y,
  total,
  progress,
}: {
  i: number;
  d: { year: number; value: number };
  x: (i: number) => number;
  y: (v: number) => number;
  total: number;
  progress: MotionValue<number>;
}) {
  const dotThreshold = i / (total - 1);
  const opacity = useTransform(progress, (v) =>
    v > dotThreshold - 0.05 ? 1 : 0
  );
  const scale = useTransform(progress, (v) =>
    v > dotThreshold - 0.05 ? 1 : 0
  );
  const isLast = i === total - 1;
  return (
    <motion.g style={{ opacity }}>
      <motion.circle
        cx={x(i)}
        cy={y(d.value)}
        r={6}
        fill={C.paper}
        stroke={isLast ? C.amber : C.ink}
        strokeWidth={2}
        style={{ scale }}
      />
      {isLast && (
        <>
          <motion.circle
            cx={x(i)}
            cy={y(d.value)}
            r={16}
            fill="none"
            stroke={C.amber}
            strokeWidth={1.5}
            opacity={0.35}
            style={{ scale }}
          />
          <text
            x={x(i)}
            y={y(d.value) - 28}
            fontSize={13}
            fill={C.amber}
            fontWeight={600}
            textAnchor="middle"
            fontFamily={SYSTEM_FONT}
          >
            5.8 - borderline
          </text>
        </>
      )}
    </motion.g>
  );
}

/**
 * THE PROBLEM - Technique: Animated SVG line chart that draws itself as
 * the user scrolls, with number counters that count up in sync.
 *
 * The curve traces Anna's 5 years of "technically normal" glucose
 * readings. Each dot lights up as the path passes through it. A giant
 * statistic "50%" crossfades through competing versions as we scroll.
 */
export function ProblemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Glucose data: year -> value (mmol/L). Real Anna data from mock-patient.
  const data = [
    { year: 2021, value: 5.0 },
    { year: 2022, value: 5.1 },
    { year: 2023, value: 5.2 },
    { year: 2024, value: 5.4 },
    { year: 2025, value: 5.5 },
    { year: 2026, value: 5.8 },
  ];

  // Chart geometry
  const W = 900;
  const H = 400;
  const padX = 80;
  const padY = 60;
  const yMin = 4.5;
  const yMax = 6.2;

  const x = (i: number) =>
    padX + (i / (data.length - 1)) * (W - padX * 2);
  const y = (v: number) =>
    padY + ((yMax - v) / (yMax - yMin)) * (H - padY * 2);

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`)
    .join(" ");

  // Scroll-driven draw progress
  const drawProgress = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);
  const drawSpring = useSpring(drawProgress, {
    stiffness: 110,
    damping: 30,
  });

  // Scroll-driven counter (rises from 5.0 to 5.8)
  const [glucoseDisplay, setGlucoseDisplay] = useState("5.0");
  useMotionValueEvent(drawSpring, "change", (v) => {
    const val = 5.0 + v * 0.8;
    setGlucoseDisplay(val.toFixed(1));
  });

  // Scroll-driven big stat crossfade
  const stat1Opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.4], [0, 1, 0]);
  const stat2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.6], [0, 1, 0]);
  const stat3Opacity = useTransform(scrollYProgress, [0.55, 0.7, 0.85], [0, 1, 1]);

  return (
    <section
      id="problem"
      ref={sectionRef}
      style={{
        position: "relative",
        background: C.cream,
        padding: "140px 32px 160px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Section label + kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              ...TYPE.mono,
              color: C.amber,
              padding: "6px 12px",
              border: `1px solid ${C.amber}`,
              borderRadius: 100,
            }}
          >
            01 / THE PROBLEM
          </span>
        </div>

        <h2
          style={{
            ...TYPE.displayLarge,
            maxWidth: 1200,
            margin: "0 0 80px 0",
          }}
        >
          Half of Swedes with type 2 diabetes are caught{" "}
          <span style={{ color: C.amber, fontStyle: "italic" }}>years</span>{" "}
          too late.
        </h2>

        {/* Grid: chart left, narrative right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
          className="home10-prob-grid"
        >
          {/* Chart */}
          <div
            style={{
              position: "relative",
              background: C.paper,
              borderRadius: 28,
              padding: 32,
              border: `1px solid ${C.line}`,
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.inkMuted,
                    marginBottom: 6,
                  }}
                >
                  FASTING GLUCOSE / ANNA B.
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 500,
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                    color: C.ink,
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  {glucoseDisplay}
                  <span
                    style={{
                      fontSize: 18,
                      color: C.inkMuted,
                      marginLeft: 8,
                      fontWeight: 400,
                    }}
                  >
                    mmol/L
                  </span>
                </div>
              </div>
              <div
                style={{
                  padding: "6px 12px",
                  background: C.creamDeep,
                  borderRadius: 100,
                  ...TYPE.mono,
                  color: C.inkSoft,
                }}
              >
                5 YEAR DRIFT
              </div>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            >
              {/* Zone band (normal range) */}
              <defs>
                <linearGradient id="zoneGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C84A2D" stopOpacity="0.0" />
                  <stop offset="40%" stopColor="#C79025" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#4E8E5C" stopOpacity="0.06" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.sage} />
                  <stop offset="100%" stopColor={C.amber} />
                </linearGradient>
              </defs>

              <rect
                x={padX}
                y={padY}
                width={W - padX * 2}
                height={H - padY * 2}
                fill="url(#zoneGradient)"
              />

              {/* Threshold line at 6.0 (pre-diabetic) */}
              <line
                x1={padX}
                y1={y(6.0)}
                x2={W - padX}
                y2={y(6.0)}
                stroke={C.amber}
                strokeWidth={1}
                strokeDasharray="4 6"
                opacity={0.7}
              />
              <text
                x={W - padX + 10}
                y={y(6.0) + 4}
                fontSize={11}
                fill={C.amber}
                fontFamily={SYSTEM_FONT}
                fontWeight={500}
              >
                Pre-diabetic threshold
              </text>

              {/* Normal upper limit at 5.6 */}
              <line
                x1={padX}
                y1={y(5.6)}
                x2={W - padX}
                y2={y(5.6)}
                stroke={C.inkFaint}
                strokeWidth={1}
                strokeDasharray="2 4"
                opacity={0.4}
              />

              {/* Y axis labels */}
              {[5.0, 5.4, 5.8, 6.2].map((v) => (
                <text
                  key={v}
                  x={padX - 14}
                  y={y(v) + 4}
                  fontSize={11}
                  fill={C.inkMuted}
                  fontFamily={SYSTEM_FONT}
                  textAnchor="end"
                >
                  {v.toFixed(1)}
                </text>
              ))}

              {/* X axis labels */}
              {data.map((d, i) => (
                <text
                  key={d.year}
                  x={x(i)}
                  y={H - padY + 24}
                  fontSize={11}
                  fill={C.inkMuted}
                  fontFamily={SYSTEM_FONT}
                  textAnchor="middle"
                >
                  {d.year}
                </text>
              ))}

              {/* Animated path */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{
                  pathLength: drawSpring,
                }}
              />

              {/* Dots (appear sequentially as draw progresses) */}
              {data.map((d, i) => (
                <Dot
                  key={i}
                  i={i}
                  d={d}
                  x={x}
                  y={y}
                  total={data.length}
                  progress={drawSpring}
                />
              ))}
            </svg>

            <div
              style={{
                marginTop: 16,
                ...TYPE.small,
                color: C.inkMuted,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Each test: marked as "normal"</span>
              <span>Source: 1177 + Cityakuten records</span>
            </div>
          </div>

          {/* Narrative */}
          <div>
            <p
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: "0 0 28px 0",
              }}
            >
              The data exists. Blood test on blood test. The 0.1 mmol/L rise
              every year is real. But no single doctor, at any single visit,
              sees the five-year slope. Every individual reading is{" "}
              <em>technically normal</em>.
            </p>
            <p
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: "0 0 32px 0",
              }}
            >
              Diabetes, heart disease and osteoporosis don't arrive in a single
              result. They arrive in a trajectory. Precura watches the
              trajectory.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 16,
              }}
            >
              {[
                { stat: "1 in 2", text: "Swedes with T2D go undiagnosed for years" },
                { stat: "8.8 years", text: "Average lag between onset and diagnosis" },
                { stat: "61%", text: "Of early damage is preventable if caught" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 20,
                    padding: "16px 20px",
                    background: C.paper,
                    borderRadius: 14,
                    border: `1px solid ${C.line}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 500,
                      color: C.amber,
                      letterSpacing: "-0.02em",
                      minWidth: 92,
                    }}
                  >
                    {item.stat}
                  </span>
                  <span style={{ ...TYPE.small, color: C.inkSoft }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Giant crossfading stat */}
        <div
          style={{
            marginTop: 140,
            position: "relative",
            textAlign: "center",
            height: 240,
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: stat1Opacity,
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: C.inkMuted,
                  marginBottom: 16,
                }}
              >
                One in two
              </div>
              <div
                style={{
                  ...TYPE.displayHuge,
                  color: C.ink,
                }}
              >
                50%
              </div>
            </div>
          </motion.div>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: stat2Opacity,
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: C.inkMuted,
                  marginBottom: 16,
                }}
              >
                Undiagnosed years
              </div>
              <div
                style={{
                  ...TYPE.displayHuge,
                  color: C.amber,
                }}
              >
                8.8
              </div>
            </div>
          </motion.div>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: stat3Opacity,
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.eyebrow,
                  color: C.inkMuted,
                  marginBottom: 16,
                }}
              >
                Preventable damage
              </div>
              <div
                style={{
                  ...TYPE.displayHuge,
                  color: C.sageDeep,
                }}
              >
                61%
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-prob-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
