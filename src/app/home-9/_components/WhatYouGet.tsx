"use client";

/**
 * What You Get.
 *
 * Six features, each in an alternating-row editorial layout. Every row has:
 *   - a full-bleed photo that parallaxes slowly within its own tile
 *   - a translucent tag drifting faster
 *   - a foreground heading + description list
 *
 * This section is deliberately long (1.5x the other sections) so the
 * features get room. It is also the one place we show a micro mock UI.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

interface Feature {
  n: string;
  title: string;
  lead: string;
  bullets: string[];
  tag: string;
  photo: string;
  side: "left" | "right";
}

const FEATURES: Feature[] = [
  {
    n: "Feature 01",
    title: "A risk profile that stays current",
    lead:
      "FINDRISC, SCORE2 and FRAX recomputed every time new data arrives. No questionnaires that go stale.",
    bullets: [
      "10 year type 2 diabetes risk",
      "10 year cardiovascular event risk",
      "10 year fracture risk",
    ],
    tag: "Risk profile",
    photo: IMG.window,
    side: "left",
  },
  {
    n: "Feature 02",
    title: "Biomarker history in one place",
    lead:
      "Every lab result Sweden has on record plus the ones we order, drawn as a single timeline per marker.",
    bullets: [
      "35 markers tracked per panel",
      "Merged with 1177 historical records",
      "Trend plus reference range, never just a number",
    ],
    tag: "Biomarkers",
    photo: IMG.birch,
    side: "right",
  },
  {
    n: "Feature 03",
    title: "An AI that actually read your chart",
    lead:
      "A conversational layer with full access to your history. Ask what the glucose means. It answers using your own numbers.",
    bullets: [
      "Grounded in your test results",
      "Cites the model it is using",
      "Escalates to a doctor when it should",
    ],
    tag: "AI health chat",
    photo: IMG.phone,
    side: "left",
  },
  {
    n: "Feature 04",
    title: "A doctor thread, not a form",
    lead:
      "Message a Precura GP directly. They have your full history and the Precura models open in front of them when they reply.",
    bullets: [
      "Typically answered within 4 hours",
      "No 20 min slot cap",
      "Same doctor, visit after visit",
    ],
    tag: "Doctor messaging",
    photo: IMG.doctor,
    side: "right",
  },
  {
    n: "Feature 05",
    title: "A training plan built on your numbers",
    lead:
      "Programmed against your blood work and screening scores by a certified coach. Adapts as the markers move.",
    bullets: [
      "Real exercises, sets, reps, weights",
      "Weekly check-ins tied to your data",
      "Reviewed by your Precura doctor",
    ],
    tag: "Training",
    photo: IMG.training,
    side: "left",
  },
  {
    n: "Feature 06",
    title: "Retests on a schedule",
    lead:
      "Precura decides when you should test again based on your trajectory. You get a reminder. You walk in. The dot moves.",
    bullets: [
      "Default: every 6 months",
      "Accelerated if a marker starts drifting",
      "Included in the annual membership",
    ],
    tag: "Retests",
    photo: IMG.clinic,
    side: "right",
  },
];

function FeatureRow({ feature }: { feature: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const photoY = useParallaxY(scrollYProgress, [-40, 100], reduceMotion);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.22]);
  const tagY = useParallaxY(scrollYProgress, [120, -120], reduceMotion);
  const copyY = useParallaxY(scrollYProgress, [60, -60], reduceMotion);
  const isLeft = feature.side === "left";

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "clamp(16px, 2vw, 32px)",
        padding: "clamp(60px, 8vw, 120px) clamp(24px, 4vw, 80px)",
        alignItems: "center",
      }}
    >
      {/* Photo panel */}
      <div
        style={{
          gridColumn: isLeft ? "1 / span 7" : "6 / span 7",
          gridRow: 1,
          position: "relative",
          aspectRatio: "16 / 11",
          overflow: "hidden",
          background: C.ink,
        }}
      >
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-10%",
            y: photoY,
            scale: photoScale,
            backgroundImage: `url(${feature.photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
            filter: "contrast(1.05) saturate(0.85)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20,21,20,0.2) 0%, rgba(20,21,20,0.55) 100%)",
          }}
        />
        {/* Tag drifts over photo */}
        <motion.div
          style={{
            y: tagY,
            position: "absolute",
            top: "clamp(16px, 2vw, 32px)",
            left: "clamp(16px, 2vw, 32px)",
            color: C.cream,
            fontFamily: FONT.mono,
            fontSize: SIZE.eyebrow,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: "rgba(20,21,20,0.6)",
            backdropFilter: "blur(8px)",
            padding: "8px 14px",
          }}
        >
          {feature.n} / {feature.tag}
        </motion.div>
        {/* Big number bottom right */}
        <motion.div
          style={{
            position: "absolute",
            right: "clamp(16px, 2vw, 32px)",
            bottom: "clamp(12px, 2vw, 24px)",
            color: C.cream,
            fontFamily: FONT.ui,
            fontSize: "clamp(80px, 10vw, 180px)",
            fontWeight: 100,
            letterSpacing: "-0.04em",
            lineHeight: 0.8,
            opacity: 0.95,
          }}
        >
          {feature.n.replace("Feature ", "")}
        </motion.div>
      </div>

      {/* Copy panel */}
      <motion.div
        style={{
          gridColumn: isLeft ? "8 / span 5" : "1 / span 5",
          gridRow: 1,
          y: copyY,
          padding: isLeft ? "0 0 0 clamp(8px, 1vw, 32px)" : "0 clamp(8px, 1vw, 32px) 0 0",
          zIndex: 2,
        }}
      >
        <h3
          style={{
            fontSize: SIZE.h2,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.02,
            margin: 0,
            color: C.ink,
            maxWidth: "14ch",
          }}
        >
          <SplitReveal text={feature.title} />
        </h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontSize: SIZE.lead,
            color: C.textSecondary,
            marginTop: "clamp(20px, 2vw, 32px)",
            lineHeight: 1.55,
            fontWeight: 300,
            maxWidth: "38ch",
          }}
        >
          {feature.lead}
        </motion.p>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            marginTop: "clamp(20px, 2vw, 32px)",
            listStyle: "none",
            padding: 0,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          {feature.bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              style={{
                padding: "14px 0",
                borderBottom: `1px solid ${C.rule}`,
                fontSize: SIZE.body,
                color: C.textSecondary,
                display: "flex",
                gap: 14,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: SIZE.eyebrow,
                  color: C.terracotta,
                  letterSpacing: "0.1em",
                  minWidth: 24,
                }}
              >
                0{i + 1}
              </span>
              <span>{b}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

export default function WhatYouGet() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const headerY = useParallaxY(scrollYProgress, [60, -200], reduceMotion);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: C.cream,
        fontFamily: FONT.ui,
        paddingTop: "clamp(60px, 8vw, 120px)",
      }}
    >
      {/* Section header */}
      <motion.div
        style={{
          y: headerY,
          padding: "clamp(40px, 6vw, 100px) clamp(24px, 6vw, 100px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: SIZE.eyebrow,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.textMuted,
            marginBottom: "clamp(24px, 3vw, 40px)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: FONT.mono,
          }}
        >
          <span>/ 04</span>
          <span
            style={{
              height: 1,
              flex: 1,
              maxWidth: 120,
              background: C.rule,
            }}
          />
          <span>What you get</span>
        </div>
        <h2
          style={{
            fontSize: SIZE.display,
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          <SplitReveal text="Six things" />
          <br />
          <SplitReveal text="that usually live" delay={0.15} />
          <br />
          <SplitReveal
            text="in six"
            delay={0.3}
          />{" "}
          <SplitReveal
            text="different"
            delay={0.35}
            style={{ color: C.terracotta, fontStyle: "italic" }}
          />
          <br />
          <SplitReveal text="waiting rooms." delay={0.5} />
        </h2>
      </motion.div>

      {FEATURES.map((f) => (
        <FeatureRow key={f.n} feature={f} />
      ))}
    </section>
  );
}
