"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE } from "./tokens";

/**
 * FINAL CTA - Editorial "back cover" treatment.
 *
 * A giant wordmark, a small deck, and a single text-link CTA rendered
 * like a magazine back cover. No big button, no gradient.
 */
export function FinalCTA() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: C.ink,
        color: C.paper,
        fontFamily: SYSTEM_FONT,
        padding: "200px 48px 160px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Back cover header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: `1px solid rgba(244,239,230,0.2)`,
            paddingBottom: 20,
            marginBottom: 80,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                color: C.rustSoft,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Ch. 11
            </div>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                color: "rgba(244,239,230,0.6)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Back cover
            </div>
          </div>
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 11,
              color: "rgba(244,239,230,0.4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Issue 01 / The Quarterly
          </div>
        </div>

        {/* Giant wordmark */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(80px, 16vw, 260px)",
            fontWeight: 700,
            letterSpacing: "-0.055em",
            lineHeight: 0.82,
            margin: 0,
            color: C.paper,
            marginBottom: 48,
          }}
        >
          Read your
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 500, color: C.rustSoft }}>
            own slope.
          </span>
        </motion.h2>

        {/* Deck */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 1.1,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            ...TYPE.deck,
            color: "rgba(244,239,230,0.72)",
            margin: 0,
            maxWidth: 640,
            marginBottom: 80,
          }}
        >
          A Swedish blood draw, forty-plus biomarkers, five validated risk
          models, a named doctor, a personal coach, and a living profile that
          updates every 90 days. Begin with a single panel, 995 SEK.
        </motion.p>

        {/* CTAs and meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
            paddingTop: 40,
            borderTop: `1px solid rgba(244,239,230,0.2)`,
          }}
        >
          <Link
            href="/v2/dashboard"
            style={{
              fontFamily: MONO_FONT,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: C.paper,
              textDecoration: "none",
              borderBottom: `2px solid ${C.paper}`,
              paddingBottom: 6,
            }}
          >
            Begin your trajectory
          </Link>
          <Link
            href="#how"
            style={{
              fontFamily: MONO_FONT,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(244,239,230,0.7)",
              textDecoration: "none",
              borderBottom: `1px solid rgba(244,239,230,0.4)`,
              paddingBottom: 6,
            }}
          >
            Read the method
          </Link>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: MONO_FONT,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(244,239,230,0.4)",
            }}
          >
            Printed in Stockholm / April 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
}
