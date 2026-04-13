"use client";

/**
 * Trust and Science.
 *
 * A dark editorial panel with a doctor portrait sliding slowly from the
 * left while a floating "citations" card drifts down the right.
 *
 * We name the actual risk models and cite them properly to build credibility.
 */

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

const CITATIONS = [
  {
    name: "FINDRISC",
    scope: "Type 2 diabetes, 10 year risk",
    ref:
      "Lindstrom J, Tuomilehto J. The Diabetes Risk Score. Diabetes Care, 2003.",
  },
  {
    name: "SCORE2",
    scope: "Fatal + non-fatal cardiovascular event, 10 year",
    ref:
      "SCORE2 Working Group / ESC. European Heart Journal, 2021.",
  },
  {
    name: "FRAX",
    scope: "Osteoporotic fracture, 10 year",
    ref:
      "Kanis JA et al. University of Sheffield. Osteoporosis International, 2008.",
  },
  {
    name: "PHQ-9 / GAD-7 / AUDIT-C",
    scope: "Depression / anxiety / alcohol use screening",
    ref:
      "Kroenke K, Spitzer R, Williams J. Primary Care Evaluation, 2001-2002.",
  },
];

export default function Trust() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);

  const portraitY = useParallaxY(scrollYProgress, [-40, 160], reduceMotion);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const portraitX = useTransform(scrollYProgress, [0, 1], ["-4%", "2%"]);

  const papersY = useParallaxY(scrollYProgress, [120, -160], reduceMotion);
  const papersOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 0.25, 0.25, 0]
  );

  const copyY = useParallaxY(scrollYProgress, [40, -40], reduceMotion);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "180vh",
        width: "100%",
        overflow: "hidden",
        background: C.forestDeep,
        color: C.textLight,
        fontFamily: FONT.ui,
      }}
    >
      {/* Layer 1: portrait */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "55%",
          height: "100%",
          y: portraitY,
          x: portraitX,
          scale: portraitScale,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-5%",
            backgroundImage: `url(${IMG.doctor})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: "grayscale(0.3) contrast(1.05) brightness(0.85)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(15,26,22,0.55) 0%, rgba(15,26,22,0.2) 40%, rgba(15,26,22,0.9) 100%)",
          }}
        />
      </motion.div>

      {/* Layer 2: scientific papers background block */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "60%",
          height: "80%",
          y: papersY,
          opacity: papersOpacity,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMG.papers})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(1) contrast(1.2) brightness(0.4)",
            mixBlendMode: "screen",
          }}
        />
      </motion.div>

      {/* Sticky container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          padding: "clamp(40px, 6vw, 100px) clamp(24px, 6vw, 100px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "clamp(24px, 3vw, 48px)",
          alignContent: "center",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <motion.div
          style={{
            y: copyY,
            gridColumn: "1 / span 6",
            alignSelf: "center",
          }}
        >
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
            <span>/ 05</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 120,
                background: C.textLightSoft,
              }}
            />
            <span>Trust and science</span>
          </div>
          <h2
            style={{
              fontSize: SIZE.h1,
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: 0,
              maxWidth: "18ch",
            }}
          >
            <SplitReveal text="Built with a doctor." />
            <br />
            <SplitReveal
              text="Not a brand team."
              delay={0.2}
              style={{
                color: C.terracottaSoft,
                fontStyle: "italic",
              }}
            />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              fontSize: SIZE.lead,
              maxWidth: "42ch",
              color: C.textLightSoft,
              marginTop: "clamp(24px, 3vw, 40px)",
              lineHeight: 1.55,
              fontWeight: 300,
            }}
          >
            Precura was co-founded by Dr. Marcus Johansson, a Swedish GP who
            watched his own father wait six years for a diagnosis that could
            have been made in the first blood test. Every model we use is
            published, peer-reviewed and the same evidence base used by
            Swedish primary care.
          </motion.p>

          {/* Doctor byline card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              marginTop: "clamp(32px, 4vw, 48px)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              paddingTop: 24,
              borderTop: `1px solid ${C.textLightSoft}`,
              maxWidth: 480,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: SIZE.body,
                  fontWeight: 500,
                  color: C.textLight,
                  marginBottom: 4,
                }}
              >
                Dr. Marcus Johansson
              </div>
              <div
                style={{
                  fontSize: SIZE.small,
                  color: C.textLightSoft,
                  fontFamily: FONT.mono,
                  letterSpacing: "0.04em",
                }}
              >
                Co-founder / Clinical lead / Swedish GP, Karolinska trained
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Citations card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            gridColumn: "8 / span 5",
            alignSelf: "center",
            background: "rgba(244, 239, 230, 0.05)",
            backdropFilter: "blur(14px)",
            border: `1px solid ${C.textLightSoft}`,
            padding: "clamp(24px, 3vw, 48px)",
          }}
        >
          <div
            style={{
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: FONT.mono,
              color: C.terracottaSoft,
              marginBottom: 24,
            }}
          >
            The models we use
          </div>
          <div>
            {CITATIONS.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.12 }}
                style={{
                  padding: "20px 0",
                  borderTop: `1px solid ${C.textLightSoft}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 8,
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: SIZE.h3,
                      fontWeight: 400,
                      color: C.textLight,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: SIZE.eyebrow,
                      color: C.textLightSoft,
                      fontFamily: FONT.mono,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {c.scope}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: SIZE.small,
                    color: C.textLightSoft,
                    lineHeight: 1.5,
                    fontFamily: FONT.mono,
                  }}
                >
                  {c.ref}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
