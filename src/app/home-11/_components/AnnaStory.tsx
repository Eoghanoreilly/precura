"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG, EASE } from "./tokens";

/**
 * ANNA'S STORY - Editorial two-column layout. A single portrait on the left,
 * a spare chart and narrative on the right. One pullquote. No noise.
 *
 * The chart is a hand-drawn SVG line, not ECharts. Restraint.
 */
export function AnnaStory() {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      id="story"
      style={{
        background: C.paper,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Chapter head */}
        <div
          ref={headRef}
          style={{
            marginBottom: 88,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE }}
          >
            <div
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 24,
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 1,
                  background: C.inkMuted,
                  display: "inline-block",
                }}
              />
              Ch. 02 / The lead case
            </div>
            <h2
              style={{
                ...TYPE.displayLarge,
                color: C.ink,
                margin: 0,
                maxWidth: 820,
              }}
            >
              Anna is forty. Her mother has diabetes.{" "}
              <span style={{ color: C.sage, fontStyle: "italic" }}>
                Her glucose has been walking for five years.
              </span>
            </h2>
          </motion.div>
        </div>

        <div
          className="home11-anna-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 80,
            alignItems: "flex-start",
          }}
        >
          {/* Left: considered portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.2, ease: EASE }}
            style={{
              position: "relative",
              aspectRatio: "3 / 4",
              borderRadius: 4,
              overflow: "hidden",
              background: C.paperDeep,
            }}
          >
            <img
              src={IMG.annaPortrait}
              alt="Anna, 40, in Stockholm"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "saturate(0.88) contrast(0.98)",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(20,22,20,0.6) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 22,
                bottom: 22,
                right: 22,
                color: C.page,
              }}
            >
              <div style={{ ...TYPE.mono, color: "rgba(250,250,247,0.68)" }}>
                Anna Bergstrom / b. 1985 / Stockholm
              </div>
            </div>
          </motion.div>

          {/* Right: narrative + chart */}
          <div>
            <GlucoseLine />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
              style={{
                ...TYPE.body,
                color: C.inkSoft,
                marginTop: 56,
                marginBottom: 20,
                maxWidth: 560,
              }}
            >
              Six fasting glucose readings since 2021. Each one filed under a
              different visit, signed off by a different clinician, read
              against a static reference band. None of them were abnormal on
              their own. All of them together tell a clear story.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.25, ease: EASE }}
              style={{
                ...TYPE.body,
                color: C.inkMuted,
                margin: 0,
                maxWidth: 560,
              }}
            >
              Anna&apos;s mother was diagnosed with Type 2 diabetes at 58. Her
              father had a heart attack at 65. On FINDRISC (the Finnish
              Diabetes Risk Score used by Swedish primary care), she scores 12
              out of 26. That places her 10-year risk around 17 percent,
              against a population baseline of 5. The system she already
              belongs to never ran the math.
            </motion.p>

            {/* Pullquote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
              style={{
                marginTop: 72,
                paddingLeft: 32,
                borderLeft: `1px solid ${C.sage}`,
              }}
            >
              <div
                style={{
                  ...TYPE.displayMedium,
                  color: C.ink,
                  fontStyle: "italic",
                  margin: 0,
                  maxWidth: 560,
                  fontWeight: 300,
                }}
              >
                &ldquo;Anna is exactly the patient we were built for. The
                numbers all look fine until the day they don&apos;t.&rdquo;
              </div>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkMuted,
                  marginTop: 24,
                }}
              >
                Dr. Marcus Johansson / Medical lead
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-anna-grid) {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Understated line chart - SVG, text-driven. No decorative flourishes.
function GlucoseLine() {
  const points = [
    { year: "2021", val: 5.0 },
    { year: "2022", val: 5.1 },
    { year: "2023", val: 5.2 },
    { year: "2024", val: 5.4 },
    { year: "2025", val: 5.5 },
    { year: "2026", val: 5.8 },
  ];
  const minV = 4.8;
  const maxV = 6.0;
  const W = 560;
  const H = 260;
  const padL = 46;
  const padR = 12;
  const padT = 16;
  const padB = 34;

  const xFor = (i: number) =>
    padL + ((W - padL - padR) / (points.length - 1)) * i;
  const yFor = (v: number) =>
    padT + (H - padT - padB) * (1 - (v - minV) / (maxV - minV));

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(p.val)}`)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        width: "100%",
        maxWidth: 600,
        border: `1px solid ${C.inkHairlineStrong}`,
        borderRadius: 4,
        padding: "24px 24px 16px",
        background: C.page,
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
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>
          Fasting glucose / five year drift
        </div>
        <div style={{ ...TYPE.mono, color: C.inkMuted }}>mmol/L</div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* Reference band 4.0-5.6 (normal) */}
        <rect
          x={padL}
          y={yFor(5.6)}
          width={W - padL - padR}
          height={yFor(minV) - yFor(5.6)}
          fill={C.sageWash}
          opacity={0.55}
        />
        {/* Horizontal guides */}
        {[5.0, 5.5, 6.0].map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke={C.inkHairline}
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={yFor(v) + 4}
              fontSize={10}
              fill={C.inkMuted}
              textAnchor="end"
              fontFamily="ui-monospace, Menlo, monospace"
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        {/* Line path draw-on */}
        <motion.path
          d={path}
          fill="none"
          stroke={C.ink}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
        />
        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={p.year}
            cx={xFor(i)}
            cy={yFor(p.val)}
            r={3}
            fill={i === points.length - 1 ? C.sage : C.ink}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.6,
              delay: 0.5 + i * 0.16,
              ease: EASE,
            }}
          />
        ))}
        {/* Year ticks */}
        {points.map((p, i) => (
          <text
            key={p.year + "lbl"}
            x={xFor(i)}
            y={H - 10}
            fontSize={10}
            fill={C.inkMuted}
            textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace"
          >
            {p.year}
          </text>
        ))}
        {/* Final reading callout */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 2.1, ease: EASE }}
        >
          <line
            x1={xFor(points.length - 1)}
            x2={xFor(points.length - 1)}
            y1={yFor(5.8)}
            y2={padT + 8}
            stroke={C.sage}
            strokeDasharray="2 3"
            strokeWidth={1}
          />
          <text
            x={xFor(points.length - 1) - 8}
            y={padT + 18}
            fontSize={11}
            fill={C.sage}
            textAnchor="end"
            fontFamily={SYSTEM_FONT}
            fontWeight={500}
          >
            5.8 mmol/L
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
