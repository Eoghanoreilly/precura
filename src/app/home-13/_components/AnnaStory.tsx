"use client";

/**
 * AnnaStory - editorial portrait + narrative + inline glucose chart.
 *
 * Layout: two column grid. Left = portrait of Anna with caption overlay.
 * Right = a short narrative paragraph and a custom glucose drift chart
 * showing the 5 readings from 2021 to 2026, annotated.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE, IMG } from "./tokens";

const readings = [
  { year: "2021", value: 5.0, label: "normal" },
  { year: "2022", value: 5.1, label: "normal" },
  { year: "2023", value: 5.2, label: "normal" },
  { year: "2024", value: 5.4, label: "normal" },
  { year: "2025", value: 5.5, label: "normal" },
  { year: "2026", value: 5.8, label: "high normal" },
];

export default function AnnaStory() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const min = 4.6;
  const max = 6.2;
  const w = 100;
  const h = 44;
  const xStep = w / (readings.length - 1);
  const pts = readings.map((r, i) => {
    const x = i * xStep;
    const y = h - ((r.value - min) / (max - min)) * h;
    return { x, y, ...r };
  });
  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: C.creamSoft,
        color: C.ink,
        padding: "160px 36px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            ...TYPE.mono,
            color: C.amber,
            marginBottom: 24,
          }}
        >
          02  /  Anna&apos;s story
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 80,
            alignItems: "start",
          }}
          className="home13-anna-grid"
        >
          {/* Left: portrait */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "4 / 5",
              background: C.creamDeep,
            }}
          >
            <img
              src={IMG.anna}
              alt="Anna Bergstrom"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "saturate(0.92) brightness(0.98)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 50%, rgba(14,18,14,0.72) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 28,
                right: 28,
                bottom: 28,
                color: C.cream,
              }}
            >
              <div
                style={{
                  ...TYPE.mono,
                  color: C.amberSoft,
                  marginBottom: 10,
                }}
              >
                Member  /  Since January 2026
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  color: C.cream,
                  lineHeight: 1.2,
                }}
              >
                Anna Bergstrom, 40
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(245, 239, 226, 0.75)",
                  marginTop: 4,
                }}
              >
                Account Director  /  Stockholm
              </div>
            </div>
          </motion.div>

          {/* Right: narrative + chart */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              style={{
                ...TYPE.displayLarge,
                color: C.ink,
                margin: 0,
                maxWidth: 720,
              }}
            >
              Five tests. Five{" "}
              <span
                style={{
                  color: C.amberDeep,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                normals.
              </span>{" "}
              One trajectory.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.32, ease: EASE }}
              style={{
                ...TYPE.body,
                color: C.inkMid,
                maxWidth: 620,
                marginTop: 24,
                marginBottom: 8,
              }}
            >
              Anna started getting blood tests at 35, like a lot of health-aware
              Swedes. Her mother was diagnosed with type-2 diabetes at 58; her
              father had a heart attack at 65. Every test was read in
              isolation. Every test came back &ldquo;normal&rdquo;.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.42, ease: EASE }}
              style={{
                ...TYPE.body,
                color: C.inkMid,
                maxWidth: 620,
                marginTop: 0,
              }}
            >
              On Precura we plotted the five readings on one timeline. Her
              fasting glucose had climbed from 5.0 to 5.8 mmol/L over five
              years. Still &ldquo;normal&rdquo;, but the slope told a
              different story.
            </motion.p>

            {/* Custom inline chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.55, ease: EASE }}
              style={{
                marginTop: 48,
                padding: "32px 36px 28px",
                background: C.paper,
                border: `1px solid ${C.line}`,
                borderRadius: 20,
                boxShadow: C.shadowSm,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ ...TYPE.mono, color: C.inkMuted }}>
                    Fasting glucose  /  mmol/L
                  </div>
                  <div
                    style={{
                      fontSize: 19,
                      fontWeight: 500,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                      marginTop: 6,
                    }}
                  >
                    5.0  /  5.8  .  +0.8 over five years
                  </div>
                </div>
                <div
                  style={{
                    ...TYPE.mono,
                    color: C.amberDeep,
                    padding: "6px 10px",
                    borderRadius: 100,
                    background: C.amberWash,
                  }}
                >
                  HIGH NORMAL
                </div>
              </div>

              {/* SVG chart */}
              <div style={{ position: "relative", height: 200 }}>
                <svg
                  viewBox={`-6 -8 ${w + 14} ${h + 20}`}
                  preserveAspectRatio="none"
                  style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.amber} stopOpacity="0.22" />
                      <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={C.sage} />
                      <stop offset="100%" stopColor={C.amber} />
                    </linearGradient>
                  </defs>

                  {/* Horizontal reference lines */}
                  {[0, 0.33, 0.66, 1].map((pct, i) => (
                    <line
                      key={i}
                      x1="0"
                      x2={w}
                      y1={h * pct}
                      y2={h * pct}
                      stroke={C.lineSoft}
                      strokeWidth="0.25"
                    />
                  ))}

                  {/* Safe corridor */}
                  <rect
                    x="0"
                    y={h - ((5.6 - min) / (max - min)) * h}
                    width={w}
                    height={((5.6 - 4.6) / (max - min)) * h}
                    fill={C.sageWash}
                    opacity={0.6}
                  />

                  {/* Area */}
                  <motion.path
                    d={areaD}
                    fill="url(#areaG)"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.9, ease: EASE }}
                  />

                  {/* Line */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="url(#lineG)"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
                  />

                  {/* Points + year labels */}
                  {pts.map((p, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: 0.9 + i * 0.08,
                        ease: EASE,
                      }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="0.9"
                        fill={i === pts.length - 1 ? C.amberDeep : C.paper}
                        stroke={i === pts.length - 1 ? C.amberDeep : C.amber}
                        strokeWidth="0.35"
                      />
                      <text
                        x={p.x}
                        y={h + 6}
                        fontSize="3.2"
                        textAnchor="middle"
                        fill={C.inkMuted}
                        fontFamily={SYSTEM_FONT}
                      >
                        {p.year}
                      </text>
                      <text
                        x={p.x}
                        y={p.y - 2.8}
                        fontSize="3"
                        textAnchor="middle"
                        fill={i === pts.length - 1 ? C.amberDeep : C.inkMuted}
                        fontWeight="500"
                        fontFamily={SYSTEM_FONT}
                      >
                        {p.value.toFixed(1)}
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
