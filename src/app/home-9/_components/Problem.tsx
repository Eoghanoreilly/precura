"use client";

/**
 * The Problem section.
 *
 * Layered composition:
 *  - Layer 1 (background): Deep forest gradient, very slow parallax
 *  - Layer 2 (mid): Oversized "50%" display number drifting faster
 *  - Layer 3 (foreground): Editorial copy with citation + supporting stats
 *
 * The idea: you enter an almost dark forest scene and a massive number
 * slides past like a ghost in the middle ground while the headline holds.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

export default function Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);

  const bgY = useParallaxY(scrollYProgress, [-80, 80], reduceMotion);
  const bigNumY = useParallaxY(scrollYProgress, [200, -200], reduceMotion);
  const bigNumOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0.2, 0.14, 0]
  );
  const subNumY = useParallaxY(scrollYProgress, [120, -120], reduceMotion);
  const copyY = useParallaxY(scrollYProgress, [60, -60], reduceMotion);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "160vh",
        width: "100%",
        overflow: "hidden",
        background: C.forestDeep,
        color: C.textLight,
        fontFamily: FONT.ui,
      }}
    >
      {/* Layer 1: atmospheric background */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-10%",
          y: bgY,
          backgroundImage: `
            radial-gradient(ellipse at 80% 20%, rgba(74, 124, 89, 0.18) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 80%, rgba(200, 93, 63, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, #0f1a16 0%, #141514 50%, #0f1a16 100%)
          `,
          backgroundSize: "cover",
        }}
      />

      {/* Fine grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          background:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')",
          pointerEvents: "none",
        }}
      />

      {/* Layer 2: oversized 50% ghost number */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          right: "-5%",
          y: bigNumY,
          opacity: bigNumOpacity,
          fontSize: "clamp(200px, 48vw, 900px)",
          fontWeight: 100,
          color: C.cream,
          letterSpacing: "-0.06em",
          lineHeight: 0.8,
          whiteSpace: "nowrap",
          textAlign: "center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        50%
      </motion.div>

      {/* Sticky content container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 100px) clamp(24px, 6vw, 100px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <motion.div
          style={{ y: copyY }}
        >
          {/* Section index */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1 }}
            style={{
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.textLightSoft,
              marginBottom: "clamp(32px, 4vw, 64px)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: FONT.mono,
            }}
          >
            <span>/ 01</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 120,
                background: C.textLightSoft,
              }}
            />
            <span>The Problem</span>
          </motion.div>

          <h2
            style={{
              fontSize: SIZE.display,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
              margin: 0,
              maxWidth: "18ch",
              color: C.textLight,
            }}
          >
            <SplitReveal text="Half of Swedes" />
            <br />
            <SplitReveal text="with type 2 diabetes" delay={0.2} />
            <br />
            <SplitReveal
              text="already had it"
              delay={0.4}
              style={{ color: C.terracottaSoft, fontStyle: "italic" }}
            />
            <br />
            <SplitReveal text="before they knew." delay={0.6} />
          </h2>
        </motion.div>

        {/* Supporting numbers drift at different speed */}
        <motion.div
          style={{
            y: subNumY,
            marginTop: "clamp(64px, 8vw, 128px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(32px, 4vw, 64px)",
            maxWidth: 1200,
          }}
        >
          {[
            {
              big: "5 years",
              small:
                "Average delay between the first abnormal blood test and a T2D diagnosis in Sweden.",
            },
            {
              big: "0",
              small:
                "Number of doctors who see your 2021 and 2026 results in the same place.",
            },
            {
              big: "1 in 3",
              small:
                "Swedish adults already live with pre-diabetes and have no idea.",
            },
            {
              big: "100%",
              small:
                "Of that data was written down somewhere. Nobody connected it.",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.big}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                borderTop: `1px solid ${C.textLightSoft}`,
                paddingTop: "clamp(16px, 2vw, 24px)",
              }}
            >
              <div
                style={{
                  fontSize: SIZE.h1,
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: C.textLight,
                  fontFamily: FONT.ui,
                }}
              >
                {stat.big}
              </div>
              <p
                style={{
                  fontSize: SIZE.small,
                  color: C.textLightSoft,
                  marginTop: "clamp(12px, 1.5vw, 20px)",
                  lineHeight: 1.55,
                  maxWidth: "30ch",
                }}
              >
                {stat.small}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Citation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            marginTop: "clamp(48px, 6vw, 96px)",
            fontSize: SIZE.eyebrow,
            color: C.textLightSoft,
            fontFamily: FONT.mono,
            letterSpacing: "0.08em",
            maxWidth: "60ch",
          }}
        >
          Sources: Swedish National Diabetes Register (NDR) 2022 / Socialstyrelsen
          prevalence estimates / Lancet Diabetes and Endocrinology 2019.
        </motion.div>
      </div>
    </section>
  );
}
