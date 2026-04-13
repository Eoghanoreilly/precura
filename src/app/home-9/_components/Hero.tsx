"use client";

/**
 * Hero: full-bleed Nordic landscape with 3 parallax layers.
 *
 * Layer 1 (slowest): massive photo, scales slightly and translates slowly.
 * Layer 2: darkening gradient + vignette that deepens as content reveals.
 * Layer 3 (foreground): the "Precura" wordmark + value prop that appear as
 *           soon as the page mounts, plus scroll cues at the bottom.
 *
 * The section is 150vh tall so there's enough scroll runway to feel cinematic
 * while still leaving content visible the whole way down.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import {
  useSectionScroll,
  useParallaxY,
  SplitReveal,
} from "./parallax";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref, [
    "start start",
    "end start",
  ]);

  // Photo translates slowly over the whole range
  const photoY = useParallaxY(scrollYProgress, [-40, 140], reduceMotion);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  // Gradient deepens as we scroll
  const gradientOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [0.55, 0.7, 0.92]
  );
  // Foreground copy rises faster, fades slightly
  const copyY = useParallaxY(scrollYProgress, [0, -160], reduceMotion);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.3]);
  // Year chip drifts further than headline for depth
  const chipY = useParallaxY(scrollYProgress, [0, -220], reduceMotion);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "150vh",
        width: "100%",
        overflow: "hidden",
        background: C.forestDeep,
        fontFamily: FONT.ui,
      }}
    >
      {/* Layer 1: background photo */}
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
            inset: "-10% -5%",
            backgroundImage: `url(${IMG.heroForest})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
      </motion.div>

      {/* Layer 2: vignette + top/bottom darkening */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: gradientOpacity,
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(15,26,22,0.35) 50%, rgba(15,26,22,0.9) 100%),
            linear-gradient(180deg, rgba(15,26,22,0.7) 0%, rgba(15,26,22,0.2) 30%, rgba(15,26,22,0.25) 65%, rgba(15,26,22,0.95) 100%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Fine grain overlay for texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          mixBlendMode: "overlay",
          background:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')",
          pointerEvents: "none",
        }}
      />

      {/* Top navigation bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "clamp(20px, 2.5vw, 36px) clamp(20px, 4vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: C.textLight,
          zIndex: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: SIZE.small,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Precura
        </motion.div>
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          style={{
            display: "flex",
            gap: "clamp(16px, 2vw, 36px)",
            fontSize: SIZE.small,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ opacity: 0.7 }}>Science</span>
          <span style={{ opacity: 0.7 }}>Pricing</span>
          <span style={{ opacity: 0.7 }}>Stockholm</span>
          <span style={{ opacity: 1, borderBottom: `1px solid ${C.textLight}` }}>
            Begin
          </span>
        </motion.nav>
      </div>

      {/* Layer 3: foreground copy */}
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(24px, 4vw, 64px)",
          color: C.textLight,
          y: copyY,
          opacity: copyOpacity,
          zIndex: 10,
        }}
      >
        {/* Eyebrow chip drifts further */}
        <motion.div
          style={{ y: chipY, marginBottom: "clamp(24px, 3vw, 48px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.textLightSoft,
            }}
          >
            <span
              style={{
                width: 24,
                height: 1,
                background: C.textLightSoft,
                display: "inline-block",
              }}
            />
            Sweden / 2026 / Preventive medicine
          </motion.div>
        </motion.div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: SIZE.displayXL,
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            margin: 0,
            maxWidth: "14ch",
            fontFamily: FONT.ui,
          }}
        >
          <SplitReveal text="The disease" delay={0.6} />
          <br />
          <SplitReveal
            text="was there"
            delay={0.9}
            style={{
              fontStyle: "italic",
              fontWeight: 200,
              color: C.terracottaSoft,
            }}
          />
          <br />
          <SplitReveal text="for years." delay={1.2} />
        </h1>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.0 }}
          style={{
            fontSize: SIZE.lead,
            maxWidth: "46ch",
            marginTop: "clamp(24px, 3vw, 48px)",
            lineHeight: 1.5,
            color: C.textLightSoft,
            fontWeight: 300,
          }}
        >
          Precura reads the five years of blood tests your doctor glanced at
          one visit at a time. We run validated clinical risk models and show
          you the trajectory nobody connected before.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.3 }}
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
              padding: "18px 32px",
              fontSize: SIZE.small,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: FONT.ui,
              borderRadius: 2,
            }}
          >
            See your trajectory
          </button>
          <button
            style={{
              background: "transparent",
              color: C.textLight,
              border: `1px solid ${C.textLightSoft}`,
              padding: "18px 32px",
              fontSize: SIZE.small,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: FONT.ui,
              borderRadius: 2,
            }}
          >
            Read Anna&rsquo;s story
          </button>
        </motion.div>

        {/* Bottom meta bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.8 }}
          style={{
            position: "absolute",
            left: "clamp(24px, 4vw, 64px)",
            right: "clamp(24px, 4vw, 64px)",
            bottom: "clamp(24px, 3vw, 48px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            fontSize: SIZE.small,
            color: C.textLightSoft,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.12em",
              maxWidth: "28ch",
              lineHeight: 1.6,
            }}
          >
            FINDRISC / SCORE2 / FRAX
            <br />
            Validated clinical models,
            <br />
            plain language for you.
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Scroll
            <span
              style={{
                width: 1,
                height: 40,
                background: `linear-gradient(to bottom, ${C.textLightSoft}, transparent)`,
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
