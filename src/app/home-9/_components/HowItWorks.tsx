"use client";

/**
 * How It Works.
 *
 * Structure: one outer sticky section followed by three "stage" panels, each
 * with its own parallax layers:
 *   - full bleed photo (slow)
 *   - accent caption card (mid)
 *   - big numeric step + copy (fast)
 *
 * The stages intentionally differ in layout to avoid the "three numbered
 * circles" banned pattern.
 */

import React, { useRef } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

interface Stage {
  step: string;
  title: string;
  desc: string;
  detail: string[];
  photo: string;
  accent: string;
  reverse?: boolean;
}

const STAGES: Stage[] = [
  {
    step: "Step 01",
    title: "A clinical blood test",
    desc:
      "Order a comprehensive panel online. Walk into a partner lab in Stockholm, Goteborg or Malmo. No referral. No waiting room.",
    detail: [
      "35+ markers including HbA1c, fasting glucose, lipids, liver, kidney, thyroid",
      "Karolinska University Laboratory quality",
      "Results in 48 hours",
    ],
    photo: IMG.lab,
    accent: C.terracotta,
  },
  {
    step: "Step 02",
    title: "Validated risk models",
    desc:
      "We run your results through FINDRISC, SCORE2 and FRAX. Not a black box AI. Published, peer-reviewed models a Swedish GP uses every day.",
    detail: [
      "Diabetes: FINDRISC (Lindstrom and Tuomilehto, 2003)",
      "Cardiovascular: SCORE2 (ESC Working Group, 2021)",
      "Bone health: FRAX (Kanis, University of Sheffield, 2008)",
    ],
    photo: IMG.papers,
    accent: C.brass,
    reverse: true,
  },
  {
    step: "Step 03",
    title: "Your living profile",
    desc:
      "A health profile that shows your 10-year risk trajectory in plain Swedish English. Every blood test adds a dot. Every dot changes the line.",
    detail: [
      "Year over year trends for every marker",
      "Personal doctor message thread",
      "Training plan written against your blood work",
    ],
    photo: IMG.phone,
    accent: C.green,
  },
];

function StagePanel({ stage, index }: { stage: Stage; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);

  const photoY = useParallaxY(scrollYProgress, [-50, 120], reduceMotion);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const captionY = useParallaxY(scrollYProgress, [120, -120], reduceMotion);
  const copyY = useParallaxY(scrollYProgress, [60, -60], reduceMotion);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        minHeight: "130vh",
        width: "100%",
        overflow: "hidden",
        background: C.cream,
      }}
    >
      {/* Photo layer */}
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
            inset: "-8%",
            backgroundImage: `url(${stage.photo})`,
            backgroundSize: "cover",
            backgroundPosition: stage.reverse ? "left center" : "right center",
            filter: "grayscale(0.1) contrast(1.02)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: stage.reverse
              ? `linear-gradient(90deg, ${C.cream} 0%, ${C.cream} 35%, rgba(244,239,230,0.5) 55%, transparent 85%)`
              : `linear-gradient(270deg, ${C.cream} 0%, ${C.cream} 35%, rgba(244,239,230,0.5) 55%, transparent 85%)`,
          }}
        />
      </motion.div>

      {/* Content */}
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "clamp(40px, 6vw, 100px) clamp(24px, 6vw, 100px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 4vw, 80px)",
            width: "100%",
            direction: stage.reverse ? "rtl" : "ltr",
          }}
        >
          {/* Caption card, sits in the mid layer */}
          <motion.div
            style={{
              y: captionY,
              direction: "ltr",
              alignSelf: stage.reverse ? "end" : "start",
            }}
          >
            <div
              style={{
                background: C.ink,
                color: C.cream,
                padding: "clamp(24px, 3vw, 48px)",
                maxWidth: 380,
                fontFamily: FONT.mono,
                fontSize: SIZE.small,
                lineHeight: 1.65,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: 24,
                  background: stage.accent,
                  color: C.cream,
                  padding: "4px 12px",
                  fontSize: SIZE.eyebrow,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Detail
              </div>
              <div style={{ marginTop: 10 }}>
                {stage.detail.map((d) => (
                  <div
                    key={d}
                    style={{
                      borderBottom: `1px solid ${C.ruleDark}`,
                      padding: "10px 0",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Foreground copy */}
          <motion.div style={{ y: copyY, direction: "ltr" }}>
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: SIZE.eyebrow,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: stage.accent,
                marginBottom: 20,
              }}
            >
              {stage.step} / 03
            </div>
            <h3
              style={{
                fontSize: SIZE.h2,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
                margin: 0,
                color: C.ink,
                maxWidth: "16ch",
              }}
            >
              <SplitReveal text={stage.title} />
            </h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                fontSize: SIZE.lead,
                maxWidth: "36ch",
                color: C.textSecondary,
                marginTop: "clamp(20px, 2vw, 32px)",
                lineHeight: 1.55,
                fontWeight: 300,
              }}
            >
              {stage.desc}
            </motion.p>
            <div
              style={{
                marginTop: "clamp(24px, 3vw, 40px)",
                display: "flex",
                gap: 40,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: "clamp(60px, 6vw, 96px)",
                  fontWeight: 200,
                  color: stage.accent,
                  lineHeight: 0.8,
                  letterSpacing: "-0.04em",
                }}
              >
                0{index + 1}
              </div>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  maxWidth: 160,
                  background: C.rule,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const introY = useParallaxY(scrollYProgress, [0, -150], reduceMotion);
  const introOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.03, 0.12, 0.22],
    [1, 1, 1, 0]
  );

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: C.cream,
        fontFamily: FONT.ui,
      }}
    >
      {/* Intro panel */}
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 100px) clamp(24px, 6vw, 100px)",
          position: "sticky",
          top: 0,
          overflow: "hidden",
        }}
      >
        <motion.div style={{ y: introY, opacity: introOpacity }}>
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
            <span>/ 03</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 120,
                background: C.rule,
              }}
            />
            <span>How it works</span>
          </div>
          <h2
            style={{
              fontSize: SIZE.display,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              margin: 0,
              maxWidth: "16ch",
            }}
          >
            <SplitReveal text="Three steps." />
            <br />
            <SplitReveal text="Three months." delay={0.15} />
            <br />
            <SplitReveal
              text="One continuous"
              delay={0.3}
            />
            <br />
            <SplitReveal
              text="picture of you."
              delay={0.4}
              style={{ color: C.terracotta, fontStyle: "italic" }}
            />
          </h2>
        </motion.div>
      </div>

      {/* Stages */}
      {STAGES.map((stage, i) => (
        <StagePanel key={stage.step} stage={stage} index={i} />
      ))}
    </section>
  );
}
