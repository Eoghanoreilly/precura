"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * FINAL CTA - confident parting shot. Huge display type scales with scroll.
 */
export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const headingScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 1.06]);

  return (
    <section
      ref={ref}
      style={{
        background: colors.ink,
        color: colors.ivory,
        fontFamily: fontStack.display,
        padding: "180px 40px",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${colors.inkMid} 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.5,
        }}
      />

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
          zIndex: 2,
        }}
      >
        <span>Ch 09</span>
        <span>The ask</span>
      </div>

      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        <motion.h2
          style={{
            fontSize: "clamp(56px, 11vw, 180px)",
            lineHeight: 0.86,
            letterSpacing: "-0.04em",
            margin: 0,
            fontWeight: 500,
            y: headingY,
            scale: headingScale,
            maxWidth: "1280px",
          }}
        >
          Stop waiting for{" "}
          <span style={{ color: colors.amber, fontStyle: "italic", fontWeight: 400 }}>
            something to go wrong.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: easing.out, delay: 0.2 }}
          style={{
            marginTop: "56px",
            fontSize: "clamp(17px, 1.4vw, 20px)",
            lineHeight: 1.55,
            color: colors.inkFaint,
            maxWidth: "620px",
          }}
        >
          {"A single blood test tomorrow, a signed doctor review in 48 hours, and a real plan for the next 10 years. The earliest you'll ever have looked at your health."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: easing.out, delay: 0.4 }}
          style={{ marginTop: "48px", display: "flex", gap: "16px", flexWrap: "wrap" }}
        >
          <a
            href="#signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "22px 36px",
              background: colors.amber,
              color: colors.ink,
              borderRadius: "100px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Start with a blood test / 995 SEK
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: colors.ink,
              }}
            />
          </a>
          <a
            href="#faq"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "22px 36px",
              background: "transparent",
              border: `1px solid ${colors.inkMid}`,
              color: colors.ivory,
              borderRadius: "100px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Talk to us first
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            marginTop: "96px",
            paddingTop: "32px",
            borderTop: `1px solid ${colors.inkMid}`,
            fontSize: "11px",
            lineHeight: 1.6,
            color: colors.inkMuted,
            maxWidth: "680px",
            fontFamily: fontStack.mono,
            letterSpacing: "0.04em",
          }}
        >
          Precura AB. Not a substitute for medical care. In an emergency call
          112. For urgent but non-emergency care contact 1177 Vardguiden.
          Precura cooperates with, and refers into, the Swedish public
          healthcare system.
        </motion.div>
      </div>
    </section>
  );
}
