"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

/**
 * FINAL CTA - Quiet, confident close. One giant headline, two text-link
 * CTAs, a small disclaimer beneath. No gradient band, no "ready to get
 * started" cliche.
 */
export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      style={{
        background: C.paper,
        padding: "220px 40px 220px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Small mono marker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 40,
            display: "flex",
            gap: 14,
            alignItems: "center",
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
          Ch. 11 / Begin
        </motion.div>

        {/* Oversized closing statement */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          style={{
            fontSize: "clamp(60px, 8vw, 128px)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: 0,
            color: C.ink,
            fontWeight: 400,
            maxWidth: 1200,
          }}
        >
          Your numbers are already{" "}
          <span style={{ color: C.sage, fontStyle: "italic" }}>
            telling a story.
          </span>
          <br />
          We are the first place{" "}
          <span style={{ color: C.sage, fontStyle: "italic" }}>
            to read it properly.
          </span>
        </motion.h2>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          style={{
            marginTop: 80,
            display: "flex",
            alignItems: "center",
            gap: 56,
            flexWrap: "wrap",
          }}
        >
          <a
            href="#pricing"
            style={{
              color: C.ink,
              textDecoration: "none",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.005em",
              borderBottom: `1px solid ${C.ink}`,
              paddingBottom: 6,
            }}
          >
            Begin your profile / 995 SEK
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
            Read how it works
          </a>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
          style={{
            marginTop: 100,
            maxWidth: 640,
            ...TYPE.mono,
            color: C.inkFaint,
            lineHeight: 1.6,
          }}
        >
          Precura provides predictive and preventive health services. We are
          not a replacement for emergency care or formal diagnosis. If you
          have an urgent concern call 112 or 1177 Vardguiden.
        </motion.p>
      </div>
    </section>
  );
}
