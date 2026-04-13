"use client";

/**
 * Final CTA.
 *
 * A full-bleed aurora / archipelago photo with a giant parallaxing headline
 * and CTA button. Same parallax language as the hero, closing the loop.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const photoY = useParallaxY(scrollYProgress, [-60, 120], reduceMotion);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const copyY = useParallaxY(scrollYProgress, [100, -100], reduceMotion);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [0.35, 0.55, 0.85]
  );

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "150vh",
        width: "100%",
        overflow: "hidden",
        background: C.forestDeep,
        color: C.textLight,
        fontFamily: FONT.ui,
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          y: photoY,
          scale: photoScale,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-10%",
            backgroundImage: `url(${IMG.aurora})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: "contrast(1.05)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: overlayOpacity,
          background: `linear-gradient(180deg, rgba(15,26,22,0.3) 0%, rgba(15,26,22,0.4) 40%, rgba(15,26,22,0.85) 100%)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          mixBlendMode: "overlay",
          background:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')",
        }}
      />

      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 100px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <motion.div style={{ y: copyY }}>
          <div
            style={{
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.textLightSoft,
              marginBottom: "clamp(24px, 3vw, 40px)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: FONT.mono,
            }}
          >
            <span>/ 09</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 120,
                background: C.textLightSoft,
              }}
            />
            <span>Begin</span>
          </div>
          <h2
            style={{
              fontSize: SIZE.displayXL,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              lineHeight: 0.9,
              margin: 0,
              maxWidth: "14ch",
            }}
          >
            <SplitReveal text="The line was" />
            <br />
            <SplitReveal
              text="always there."
              delay={0.15}
            />
            <br />
            <SplitReveal
              text="We just"
              delay={0.3}
            />{" "}
            <SplitReveal
              text="draw it."
              delay={0.4}
              style={{
                color: C.terracottaSoft,
                fontStyle: "italic",
              }}
            />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              fontSize: SIZE.lead,
              maxWidth: "46ch",
              color: C.textLightSoft,
              marginTop: "clamp(24px, 3vw, 40px)",
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            Log in with BankID, connect your 1177 history, book a blood test.
            Takes eleven minutes. The first reading is on us if you change your
            mind within 14 days.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, delay: 0.55 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginTop: "clamp(32px, 4vw, 56px)",
            }}
          >
            <button
              style={{
                background: C.cream,
                color: C.ink,
                border: "none",
                padding: "20px 36px",
                fontSize: SIZE.small,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: FONT.ui,
                borderRadius: 2,
              }}
            >
              Begin with BankID
            </button>
            <button
              style={{
                background: "transparent",
                color: C.textLight,
                border: `1px solid ${C.textLightSoft}`,
                padding: "20px 36px",
                fontSize: SIZE.small,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: FONT.ui,
                borderRadius: 2,
              }}
            >
              Book a free 15 min call
            </button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{
              fontSize: SIZE.eyebrow,
              color: C.textLightSoft,
              marginTop: "clamp(48px, 6vw, 80px)",
              maxWidth: "60ch",
              lineHeight: 1.6,
              fontFamily: FONT.mono,
              letterSpacing: "0.08em",
            }}
          >
            Precura does not replace urgent care. If you are experiencing chest
            pain, shortness of breath or other acute symptoms, call 112 or 1177
            immediately. Precura is regulated as a Swedish caregiver under IVO
            oversight. Organisation number 559-XXXX-XXXX.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
