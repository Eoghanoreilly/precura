"use client";

/**
 * TrustScience - named doctor + cited peer-reviewed studies.
 *
 * Layout: a dark editorial band with a doctor portrait on the left and a
 * stack of 6 cited studies on the right, each with authors, journal, year.
 * Signed credential line at the bottom.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { C, SYSTEM_FONT, TYPE, EASE, IMG } from "./tokens";

const studies = [
  {
    name: "FINDRISC",
    full: "Finnish Diabetes Risk Score",
    authors: "Lindstrom & Tuomilehto",
    journal: "Diabetes Care",
    year: "2003",
  },
  {
    name: "SCORE2",
    full: "10-year cardiovascular risk",
    authors: "SCORE2 Working Group",
    journal: "European Heart Journal",
    year: "2021",
  },
  {
    name: "FRAX",
    full: "Fracture risk assessment",
    authors: "Kanis et al.",
    journal: "Osteoporosis International",
    year: "2008",
  },
  {
    name: "SDPP",
    full: "Stockholm Diabetes Prevention",
    authors: "Carlsson et al.",
    journal: "BMC Medicine",
    year: "2024",
  },
  {
    name: "UKPDS",
    full: "UK Prospective Diabetes Study",
    authors: "Turner et al.",
    journal: "The Lancet",
    year: "1998",
  },
  {
    name: "DPP",
    full: "Diabetes Prevention Program",
    authors: "Knowler et al.",
    journal: "New England Journal of Medicine",
    year: "2002",
  },
];

export default function TrustScience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      id="science"
      style={{
        background: C.ink,
        color: C.cream,
        padding: "180px 36px",
        fontFamily: SYSTEM_FONT,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            ...TYPE.mono,
            color: C.amberSoft,
            marginBottom: 24,
          }}
        >
          07  /  Science
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
          style={{
            ...TYPE.displayLarge,
            color: C.cream,
            margin: 0,
            marginBottom: 80,
            maxWidth: 900,
          }}
        >
          Every number{" "}
          <span
            style={{
              color: C.amberSoft,
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            has a citation.
          </span>
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 80,
            alignItems: "stretch",
          }}
          className="home13-science-grid"
        >
          {/* Left: doctor portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: C.inkSoft,
              minHeight: 520,
            }}
          >
            <img
              src={IMG.doctor2}
              alt="Dr. Marcus Johansson"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.8,
                filter: "saturate(0.85)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(14,18,14,0.92) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 32,
                right: 32,
                bottom: 32,
                color: C.cream,
              }}
            >
              <div
                style={{
                  ...TYPE.mono,
                  color: C.amberSoft,
                  marginBottom: 12,
                }}
              >
                Medical lead
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: C.cream,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Dr. Marcus Johansson
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(245, 239, 226, 0.7)",
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                Leg. lakare  /  Karolinska Institutet  /  15+ years in
                primary care in Stockholm. Reviews every Precura panel
                personally.
              </div>
            </div>
          </motion.div>

          {/* Right: citations */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {studies.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.08,
                  ease: EASE,
                }}
                style={{
                  padding: "24px 28px",
                  background: "rgba(245, 239, 226, 0.04)",
                  border: "1px solid rgba(245, 239, 226, 0.1)",
                  borderRadius: 16,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      ...TYPE.mono,
                      color: C.amberSoft,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: C.cream,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(245, 239, 226, 0.7)",
                      marginTop: 4,
                    }}
                  >
                    {s.full}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    color: "rgba(245, 239, 226, 0.55)",
                    fontFamily: SYSTEM_FONT,
                  }}
                >
                  <div>{s.authors}</div>
                  <div style={{ fontStyle: "italic", marginTop: 2 }}>
                    {s.journal}, {s.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home13-science-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
