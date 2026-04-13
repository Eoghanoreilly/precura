"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

// 3D scene loaded client-only.
const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 100% 70% at 52% 58%, #EDEBDF 0%, #F4F2EA 55%, #FAFAF7 100%)",
      }}
    />
  ),
});

/**
 * HERO - Minimal Ambient.
 *
 * Structure:
 *  - 3D terrain as low-opacity ambient background. Muted sage palette.
 *  - Top gradient wash so the nav reads cleanly.
 *  - Bottom gradient wash so the content reads cleanly.
 *  - Editorial layout: small meta row top-left, oversized headline bottom-left,
 *    one line of sub-copy, one primary text-link CTA, one secondary link.
 *  - No pill badges, no sparkle icons, no live ticker.
 *  - Single line hairline caption top-right with Stockholm coords.
 */
export function Hero() {
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 480], [1, 0]);
  const lift = useTransform(scrollY, [0, 480], [0, -60]);
  const sceneFade = useTransform(scrollY, [0, 600], [0.55, 0.08]);
  const sceneScale = useTransform(scrollY, [0, 800], [1, 1.06]);

  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineInView = useInView(headlineRef, { once: true, amount: 0.4 });

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background: C.page,
        overflow: "hidden",
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* 3D scene, ambient in the background */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: sceneFade,
          scale: sceneScale,
        }}
      >
        <Hero3D />
      </motion.div>

      {/* Cream vignette washes - keep the 3D from ever dominating.
          Top wash lets nav breathe, bottom wash holds copy. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(250,250,247,0.92) 0%, rgba(250,250,247,0) 22%, rgba(250,250,247,0) 58%, rgba(250,250,247,0.85) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Side vignettes - keep the 3D in a soft central oval */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 60% at 50% 55%, transparent 0%, rgba(250,250,247,0.15) 60%, rgba(250,250,247,0.7) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content layer */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100vh",
          minHeight: 720,
          display: "flex",
          flexDirection: "column",
          padding: "120px 40px 80px",
          maxWidth: 1440,
          margin: "0 auto",
          opacity: fade,
          y: lift,
        }}
      >
        {/* Top meta row - single hairline line of mono */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            color: C.inkMuted,
            ...TYPE.mono,
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
          >
            Precura / Predictive health / Stockholm
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            style={{ textAlign: "right" }}
          >
            59.329 N / 18.068 E
          </motion.span>
        </div>

        {/* Flexible space pushes headline to the bottom edge */}
        <div style={{ flex: 1 }} />

        {/* Headline block - editorial, left-aligned, confident */}
        <div ref={headlineRef} style={{ maxWidth: 1100 }}>
          {/* Small chapter marker above the headline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            style={{
              ...TYPE.mono,
              color: C.inkMuted,
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 14,
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
            The quiet drift
          </motion.div>

          {/* Oversized serif-less display headline. One statement, three lines. */}
          <h1
            style={{
              ...TYPE.display,
              margin: 0,
              color: C.ink,
              maxWidth: 1080,
            }}
          >
            <AnimatedLine delay={0.45}>Your body has been</AnimatedLine>
            <AnimatedLine delay={0.6}>
              telling a story for years.
            </AnimatedLine>
            <AnimatedLine delay={0.78}>
              <span
                style={{
                  color: C.sage,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                We read it out loud.
              </span>
            </AnimatedLine>
          </h1>

          {/* Single line of supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 1.1, ease: EASE }}
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: "40px 0 0",
              maxWidth: 640,
            }}
          >
            Precura reads 40 biomarkers across years, runs validated clinical
            risk models, pairs you with a Swedish doctor and a training coach,
            and turns it into one living profile. Built in Stockholm.
          </motion.p>

          {/* CTA row - two quiet text links with underlines. No buttons. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 1.3, ease: EASE }}
            style={{
              marginTop: 52,
              display: "flex",
              alignItems: "center",
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#pricing"
              style={{
                color: C.ink,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                borderBottom: `1px solid ${C.ink}`,
                paddingBottom: 4,
              }}
            >
              Begin your profile
            </a>
            <a
              href="#how"
              style={{
                color: C.inkMuted,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 400,
                letterSpacing: "-0.005em",
              }}
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Bottom-right caption - terrain context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headlineInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 1.5, ease: EASE }}
          style={{
            position: "absolute",
            right: 40,
            bottom: 48,
            maxWidth: 280,
            textAlign: "right",
            color: C.inkMuted,
          }}
        >
          <div style={{ ...TYPE.mono, marginBottom: 8 }}>
            Fig. 01 / Terrain above
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: C.inkMuted,
              letterSpacing: "-0.005em",
            }}
          >
            Anna Bergstrom, age 40. Five years of fasting glucose, rising 5.0
            to 5.8 mmol/L. Each test technically normal.
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Line-by-line reveal. Slides up beneath a mask. Quiet, no letter stagger.
function AnimatedLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div
      ref={ref}
      style={{
        display: "block",
        overflow: "hidden",
      }}
    >
      <motion.span
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
        style={{ display: "block" }}
      >
        {children}
      </motion.span>
    </div>
  );
}
