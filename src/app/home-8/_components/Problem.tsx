"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * PROBLEM - visualize the thesis: 50% of Swedes with T2D are diagnosed late.
 * 100-person dot grid where half are diagnosed on time (filled) and half
 * only after symptoms appear (hollow, pulsing red). Scroll-linked fill.
 */
export default function Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { amount: 0.3, once: true });

  // 10x10 grid = 100 people
  const people = Array.from({ length: 100 });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "140vh",
        background: colors.ink,
        color: colors.ivory,
        fontFamily: fontStack.display,
        overflow: "hidden",
        padding: "140px 40px",
      }}
    >
      {/* Mono strip */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          fontFamily: fontStack.mono,
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.inkFaint,
          display: "flex",
          gap: "24px",
        }}
      >
        <span>Ch 01</span>
        <span>The problem</span>
      </div>

      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        <motion.div style={{ y: headingY }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: easing.out }}
            style={{
              fontSize: "clamp(44px, 6vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Roughly half of Swedes with type 2 diabetes are{" "}
            <span style={{ color: colors.amber, fontStyle: "italic", fontWeight: 400 }}>
              found too late.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: easing.out, delay: 0.3 }}
            style={{
              marginTop: "40px",
              maxWidth: "560px",
              fontSize: "clamp(15px, 1.3vw, 18px)",
              lineHeight: 1.7,
              color: colors.inkFaint,
            }}
          >
            <p style={{ margin: 0 }}>
              The data almost always existed. A borderline glucose reading at 35.
              A mother with T2D at 58. A waistline creeping up for five years.
              Each data point looks technically normal. Nobody reads them
              together.
            </p>
            <p style={{ marginTop: "20px" }}>
              Meanwhile the Swedish healthcare system is built for illness, not
              prediction. By the time a diagnosis arrives, the damage to kidneys,
              eyes, nerves and heart is already years in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: easing.out, delay: 0.6 }}
            style={{
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: `1px solid ${colors.inkMid}`,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: fontStack.mono,
                  fontSize: "11px",
                  color: colors.inkFaint,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Avg delay
              </div>
              <div style={{ fontSize: "42px", fontWeight: 500, letterSpacing: "-0.02em" }}>
                4-7<span style={{ fontSize: "18px", color: colors.inkFaint }}> years</span>
              </div>
              <div style={{ fontSize: "13px", color: colors.inkFaint, marginTop: "4px" }}>
                between first warning signs and diagnosis
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: fontStack.mono,
                  fontSize: "11px",
                  color: colors.inkFaint,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Swedish adults
              </div>
              <div style={{ fontSize: "42px", fontWeight: 500, letterSpacing: "-0.02em" }}>
                ~500k<span style={{ fontSize: "18px", color: colors.inkFaint }}> undiagnosed</span>
              </div>
              <div style={{ fontSize: "13px", color: colors.inkFaint, marginTop: "4px" }}>
                living with pre-diabetic trajectories
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Dot grid */}
        <div ref={inViewRef}>
          <div
            style={{
              fontFamily: fontStack.mono,
              fontSize: "11px",
              color: colors.inkFaint,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "20px",
              display: "flex",
              gap: "24px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  background: colors.forestSoft,
                  borderRadius: "50%",
                }}
              />
              Caught early
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  border: `2px solid ${colors.rust}`,
                  borderRadius: "50%",
                }}
              />
              Found too late
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: "14px",
              maxWidth: "420px",
            }}
          >
            {people.map((_, i) => {
              const isLate = i >= 50;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    inView
                      ? {
                          opacity: 1,
                          scale: 1,
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.015,
                    ease: easing.out,
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    background: isLate ? "transparent" : colors.forestSoft,
                    border: isLate ? `2px solid ${colors.rust}` : "none",
                  }}
                />
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 2.2, ease: easing.out }}
            style={{
              marginTop: "32px",
              padding: "20px 24px",
              background: colors.inkSoft,
              border: `1px solid ${colors.inkMid}`,
              borderRadius: "16px",
              fontSize: "13px",
              lineHeight: 1.6,
              color: colors.inkFaint,
              maxWidth: "420px",
            }}
          >
            <span style={{ color: colors.amber, fontFamily: fontStack.mono, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Source
            </span>
            Socialstyrelsen / Diabetesforbundet, 2023. Estimated prevalence of
            undiagnosed T2D in Swedish adults aged 45-74.
          </motion.div>
        </div>
      </div>
    </section>
  );
}
