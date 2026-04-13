"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * TRUST & SCIENCE - Technique: Parallax portrait of the doctor
 * co-founder with floating citation cards drifting at different speeds.
 * The portrait itself has a multi-layer parallax: background, image,
 * foreground caption all move at different rates as the user scrolls.
 */
export function TrustScience() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const captionY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const citation1Y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const citation2Y = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const citation3Y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="science"
      ref={ref}
      style={{
        position: "relative",
        background: C.ink,
        color: C.cream,
        padding: "180px 32px 180px",
        fontFamily: SYSTEM_FONT,
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.inkSoft} 1px, transparent 1px), linear-gradient(90deg, ${C.inkSoft} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...TYPE.mono,
            color: C.amber,
            padding: "6px 12px",
            border: `1px solid ${C.amber}`,
            borderRadius: 100,
            display: "inline-block",
            marginBottom: 20,
          }}
        >
          05 / TRUST AND SCIENCE
        </div>
        <h2
          style={{
            ...TYPE.displayLarge,
            color: C.cream,
            margin: 0,
            marginBottom: 80,
            maxWidth: 1100,
          }}
        >
          Built with a doctor. Grounded in{" "}
          <span style={{ color: C.sage, fontStyle: "italic" }}>
            validated science.
          </span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
          className="home10-sci-grid"
        >
          {/* Parallax portrait */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3 / 4",
              borderRadius: 24,
              overflow: "hidden",
              background: C.inkSoft,
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: "-10% -5%",
                backgroundImage: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                y: imageY,
              }}
            />
            {/* Grain overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(12,14,11,0.92) 100%)",
              }}
            />
            <motion.div
              style={{
                position: "absolute",
                bottom: 32,
                left: 32,
                right: 32,
                y: captionY,
              }}
            >
              <div
                style={{
                  ...TYPE.mono,
                  color: C.amber,
                  marginBottom: 10,
                }}
              >
                CO-FOUNDER / CHIEF MEDICAL
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: C.cream,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: 8,
                }}
              >
                Dr. Marcus Johansson
              </div>
              <div
                style={{
                  ...TYPE.small,
                  color: C.creamDeep,
                }}
              >
                Internal medicine, Karolinska. 14 years in Swedish primary care.
              </div>
            </motion.div>
          </div>

          {/* Science stack */}
          <div
            style={{
              position: "relative",
              minHeight: 700,
            }}
          >
            {/* Floating citation cards */}
            <motion.div
              style={{
                marginBottom: 28,
                y: citation1Y,
              }}
            >
              <CitationCard
                model="FINDRISC"
                full="Finnish Diabetes Risk Score"
                author="Lindstrom J, Tuomilehto J. 2003"
                journal="Diabetes Care, 26(3):725-31"
                quote="A simple scoring tool to predict future risk of type 2 diabetes over 10 years. Validated across European and Nordic populations."
                badge="Used for diabetes risk"
              />
            </motion.div>

            <motion.div
              style={{
                marginBottom: 28,
                y: citation2Y,
              }}
            >
              <CitationCard
                model="SCORE2"
                full="Systematic Coronary Risk Evaluation 2"
                author="SCORE2 Working Group, 2021"
                journal="European Heart Journal, 42(25):2439-2454"
                quote="Updated cardiovascular disease risk prediction algorithms for Europe, calibrated to four risk regions."
                badge="Used for heart risk"
              />
            </motion.div>

            <motion.div
              style={{
                y: citation3Y,
              }}
            >
              <CitationCard
                model="FRAX"
                full="Fracture Risk Assessment Tool"
                author="Kanis JA et al, 2008"
                journal="Osteoporosis International, 19(4):385-97"
                quote="The most widely used algorithm for estimating 10-year fracture probability, developed at the University of Sheffield."
                badge="Used for bone risk"
              />
            </motion.div>
          </div>
        </div>

        {/* Trust row */}
        <div
          style={{
            marginTop: 120,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            paddingTop: 60,
            borderTop: `1px solid ${C.inkMuted}`,
          }}
          className="home10-trust-row"
        >
          {[
            { n: "14 yrs", label: "Clinical practice" },
            { n: "3 models", label: "Validated risk scores" },
            { n: "100%", label: "Doctor reviewed" },
            { n: "GDPR", label: "Swedish data residency" },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  color: C.cream,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {t.n}
              </div>
              <div style={{ ...TYPE.small, color: C.inkFaint }}>{t.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-sci-grid) {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
          :global(.home10-trust-row) {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

function CitationCard({
  model,
  full,
  author,
  journal,
  quote,
  badge,
}: {
  model: string;
  full: string;
  author: string;
  journal: string;
  quote: string;
  badge: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      style={{
        padding: 28,
        background: C.inkSoft,
        border: "1px solid rgba(245,239,228,0.1)",
        borderRadius: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: C.cream,
              marginBottom: 4,
            }}
          >
            {model}
          </div>
          <div style={{ ...TYPE.small, color: C.inkFaint }}>{full}</div>
        </div>
        <span
          style={{
            ...TYPE.mono,
            color: C.sage,
            padding: "4px 10px",
            background: "rgba(107,143,113,0.15)",
            borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      </div>
      <p
        style={{
          ...TYPE.small,
          color: C.creamDeep,
          margin: 0,
          marginBottom: 14,
          lineHeight: 1.6,
        }}
      >
        "{quote}"
      </p>
      <div
        style={{
          ...TYPE.mono,
          color: C.inkFaint,
          borderTop: "1px solid rgba(245,239,228,0.08)",
          paddingTop: 12,
        }}
      >
        {author} / {journal}
      </div>
    </motion.div>
  );
}
