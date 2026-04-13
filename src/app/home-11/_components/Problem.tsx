"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * PROBLEM - The 50% number. Editorial treatment: a single oversized
 * statistic set against a column of body copy on the right. A single
 * animated vertical timeline on the far right ticks the 5 years of
 * missed signals. Cream on cream. No illustrations.
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const numGrow = useTransform(scrollYProgress, [0, 0.6], [0.96, 1]);

  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      id="problem"
      style={{
        background: C.page,
        padding: "180px 40px 180px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Chapter label */}
        <div ref={headRef} style={{ marginBottom: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
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
            Ch. 01 / The problem
          </motion.div>
        </div>

        {/* Main layout: giant fraction left / prose right */}
        <div
          className="home11-problem-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 100,
            alignItems: "flex-start",
          }}
        >
          {/* Left: The statistic */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: EASE }}
              style={{
                position: "relative",
                paddingTop: 8,
              }}
            >
              <motion.div
                style={{
                  fontSize: "clamp(180px, 22vw, 360px)",
                  lineHeight: 0.82,
                  letterSpacing: "-0.055em",
                  color: C.ink,
                  fontWeight: 300,
                  scale: numGrow,
                  transformOrigin: "left bottom",
                }}
              >
                50<span style={{ color: C.sage }}>%</span>
              </motion.div>
              <div
                style={{
                  marginTop: 32,
                  paddingTop: 28,
                  borderTop: `1px solid ${C.inkHairlineStrong}`,
                  ...TYPE.title,
                  color: C.ink,
                  maxWidth: 520,
                  fontWeight: 400,
                }}
              >
                of Swedes who develop Type 2 diabetes are caught years late.
                Not because the data wasn&apos;t there. Because nobody read it
                as one story.
              </div>
            </motion.div>
          </div>

          {/* Right: prose + timeline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: 0,
                marginBottom: 32,
              }}
            >
              Swedish primary care sees the average patient every 18 months. At
              each visit a blood panel is drawn, filed, and read in isolation.
              Borderline becomes normal. Normal becomes the baseline. Years
              pass. Then, one afternoon, the word diagnosis arrives, and the
              treatment is no longer prevention.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
              style={{
                ...TYPE.body,
                color: C.inkMuted,
                margin: 0,
                marginBottom: 56,
              }}
            >
              The information existed the whole time. The thread simply had no
              reader.
            </motion.p>

            {/* Vertical ticker - five years, five data points */}
            <Timeline />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-problem-grid) {
            grid-template-columns: 1fr !important;
            gap: 64px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Timeline() {
  const rows = [
    { year: "2021", val: "5.0", note: "Baseline. Read in isolation." },
    { year: "2022", val: "5.1", note: "Hypertension. Started Enalapril." },
    { year: "2023", val: "5.2", note: "Annual check. Unremarkable." },
    { year: "2024", val: "5.4", note: "Weight up 1 kg. No flag raised." },
    { year: "2025", val: "5.5", note: "Blood pressure follow up." },
    { year: "2026", val: "5.8", note: "Borderline. Still technically normal." },
  ];
  return (
    <div>
      <div
        style={{
          ...TYPE.mono,
          color: C.inkMuted,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Anna / fasting glucose</span>
        <span>mmol/L</span>
      </div>
      <div
        style={{
          borderTop: `1px solid ${C.inkHairlineStrong}`,
          borderBottom: `1px solid ${C.inkHairlineStrong}`,
          padding: "6px 0",
        }}
      >
        {rows.map((r, i) => (
          <motion.div
            key={r.year}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.8,
              delay: 0.08 * i,
              ease: EASE,
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "64px 64px 1fr",
              alignItems: "baseline",
              padding: "14px 0",
              borderBottom:
                i === rows.length - 1 ? "none" : `1px solid ${C.inkHairline}`,
              color: C.ink,
              fontSize: 15,
            }}
          >
            <span
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
              }}
            >
              {r.year}
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color:
                  i === rows.length - 1
                    ? C.signalCaution
                    : i === rows.length - 2
                    ? C.signalCaution
                    : C.ink,
              }}
            >
              {r.val}
            </span>
            <span
              style={{
                fontSize: 14,
                color: C.inkMuted,
                lineHeight: 1.4,
              }}
            >
              {r.note}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
