"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * TRUST & SCIENCE - doctor co-founder, clinical models with citations.
 * Big portrait left, citations right.
 */
export default function TrustScience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 0.95]);

  return (
    <section
      ref={ref}
      style={{
        background: colors.cream,
        padding: "160px 40px",
        fontFamily: fontStack.display,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          fontFamily: fontStack.mono,
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.inkMuted,
          display: "flex",
          gap: "24px",
        }}
      >
        <span>Ch 05</span>
        <span>Trust & science</span>
      </div>

      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: "80px",
          alignItems: "start",
        }}
      >
        <div style={{ position: "sticky", top: "80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: easing.out }}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              aspectRatio: "3/4",
              position: "relative",
              background: colors.bone,
            }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=900&q=85&fit=crop"
              alt="Dr. Marcus Johansson"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                scale: imageScale,
                filter: "grayscale(0.15) contrast(1.05)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, transparent 40%, ${colors.ink}aa 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "28px",
                right: "28px",
                bottom: "28px",
                color: colors.ivory,
              }}
            >
              <div
                style={{
                  fontFamily: fontStack.mono,
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  marginBottom: "6px",
                }}
              >
                Medical lead / Co-founder
              </div>
              <div style={{ fontSize: "24px", fontWeight: 500, letterSpacing: "-0.01em" }}>
                Dr. Marcus Johansson
              </div>
              <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>
                Leg. lakare / Specialist in internal medicine / 14 years primary care
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: easing.out }}
            style={{
              fontSize: "clamp(44px, 5.5vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              margin: 0,
              color: colors.ink,
              fontWeight: 500,
            }}
          >
            A Swedish doctor, and the same{" "}
            <span style={{ color: colors.amberDeep, fontStyle: "italic", fontWeight: 400 }}>
              clinical math your GP uses.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: easing.out, delay: 0.1 }}
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: colors.inkSoft,
              marginTop: "32px",
              maxWidth: "640px",
            }}
          >
            We do not invent new algorithms. We run the three peer-reviewed risk
            models that Swedish and European guidelines already trust, in one
            place, on top of your real labs. Every result Dr. Johansson signs
            off before it reaches you.
          </motion.p>

          <div style={{ marginTop: "56px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <CitationCard
              number="01"
              name="FINDRISC"
              full="Finnish Type 2 Diabetes Risk Score"
              use="Used by Precura for 10-year type 2 diabetes risk"
              citation="Lindstrom J, Tuomilehto J. The diabetes risk score: a practical tool to predict type 2 diabetes risk. Diabetes Care. 2003;26(3):725-731."
              color={colors.amber}
            />
            <CitationCard
              number="02"
              name="SCORE2"
              full="ESC cardiovascular disease risk"
              use="Used by Precura for 10-year cardiovascular event risk"
              citation="SCORE2 working group and ESC Cardiovascular risk collaboration. SCORE2 risk prediction algorithms. Eur Heart J. 2021;42(25):2439-2454."
              color={colors.amberDeep}
            />
            <CitationCard
              number="03"
              name="FRAX"
              full="Fracture Risk Assessment Tool"
              use="Used by Precura for 10-year fracture / bone risk"
              citation="Kanis JA, et al. FRAX and the assessment of fracture probability in men and women from the UK. Osteoporos Int. 2008;19(4):385-397."
              color={colors.plum}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              marginTop: "56px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "24px",
              padding: "32px 0 0",
              borderTop: `1px solid ${colors.inkLine}`,
            }}
          >
            <ComplianceChip label="GDPR" sub="Data stored in EU" />
            <ComplianceChip label="Leg. lakare" sub="Every report signed" />
            <ComplianceChip label="1177 compatible" sub="Your health history imports" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CitationCard({
  number,
  name,
  full,
  use,
  citation,
  color,
}: {
  number: string;
  name: string;
  full: string;
  use: string;
  citation: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: easing.out }}
      style={{
        padding: "28px",
        background: colors.white,
        borderRadius: "18px",
        border: `1px solid ${colors.inkLine}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "24px",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          background: color,
          color: colors.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontStack.mono,
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.05em",
        }}
      >
        {number}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: colors.ink, letterSpacing: "-0.01em" }}>
            {name}
          </div>
          <div style={{ fontSize: "13px", color: colors.inkMuted }}>{full}</div>
        </div>
        <div style={{ fontSize: "13px", color: colors.inkSoft, marginTop: "6px" }}>{use}</div>
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: colors.cream,
            fontFamily: fontStack.mono,
            fontSize: "11px",
            lineHeight: 1.55,
            color: colors.inkMid,
          }}
        >
          {citation}
        </div>
      </div>
    </motion.div>
  );
}

function ComplianceChip({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      style={{
        padding: "18px 0",
        borderLeft: "none",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: colors.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "12px", color: colors.inkMuted, marginTop: "4px" }}>{sub}</div>
    </div>
  );
}
