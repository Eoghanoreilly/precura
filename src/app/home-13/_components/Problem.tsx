"use client";

/**
 * Problem - "The quiet drift" section.
 *
 * Not a stat wall. Not a 3-card grid. Instead, one editorial composition:
 * a giant typographic quote, a small running caption on the left, and a
 * sparse line of data callouts along the bottom. Dark background so this
 * section visually transitions out of the hero 3D zone cleanly.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

export default function Problem() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { big: "1 in 2", label: "Swedes with type-2 diabetes / undiagnosed" },
    { big: "7.2 yrs", label: "Average delay before diagnosis" },
    { big: "8 markers", label: "Typically out of range / nobody connects" },
  ];

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: C.ink,
        color: C.cream,
        padding: "180px 36px 160px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 240px) 1fr",
            gap: 60,
            alignItems: "flex-start",
          }}
          className="home13-problem-grid"
        >
          {/* Running caption on the left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                ...TYPE.mono,
                color: C.amberSoft,
                marginBottom: 16,
              }}
            >
              01  /  The problem
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              style={{
                ...TYPE.small,
                color: "rgba(245, 239, 226, 0.6)",
                maxWidth: 220,
                margin: 0,
              }}
            >
              Your body speaks in trajectories. Swedish primary care reads
              blood tests one snapshot at a time.
            </motion.p>
          </div>

          {/* Giant editorial quote */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
              style={{
                ...TYPE.displayHuge,
                color: C.cream,
                margin: 0,
                maxWidth: 1100,
              }}
            >
              The data existed.
              <br />
              <span
                style={{
                  color: C.amberSoft,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Nobody saw the picture.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
              style={{
                ...TYPE.lead,
                color: "rgba(245, 239, 226, 0.78)",
                maxWidth: 680,
                marginTop: 40,
              }}
            >
              Five normal tests in a row can still describe a person sliding
              toward type-2 diabetes. Normal is a point. Health is a slope.
              Precura watches the slope.
            </motion.p>
          </div>
        </div>

        {/* Sparse bottom stat line */}
        <div
          style={{
            marginTop: 120,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            paddingTop: 48,
            borderTop: "1px solid rgba(245, 239, 226, 0.12)",
          }}
          className="home13-problem-stats"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.5 + i * 0.12,
                ease: EASE,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(40px, 5vw, 72px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  color: C.cream,
                  lineHeight: 0.95,
                  marginBottom: 14,
                }}
              >
                {s.big}
              </div>
              <div
                style={{
                  ...TYPE.small,
                  color: "rgba(245, 239, 226, 0.55)",
                  maxWidth: 260,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-problem-grid) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          :global(.home13-problem-stats) {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
