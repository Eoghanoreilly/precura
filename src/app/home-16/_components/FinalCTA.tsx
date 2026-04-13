"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS, IMG } from "./tokens";

/**
 * FINAL CTA
 *
 * One confident closing statement on a full-width warm panel. A single
 * primary CTA, a quiet secondary link, and a small disclaimer that the
 * product is decision support and not a medical device.
 */
export function FinalCTA() {
  return (
    <section
      id="start"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 140px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            background: COLORS.bgCreamDeep,
            borderRadius: RADIUS.cardLarge,
            overflow: "hidden",
            padding: "84px 64px",
            boxShadow: COLORS.shadowMedium,
          }}
          className="home16-final-panel"
        >
          {/* Soft image wash on the right */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "46%",
              backgroundImage: `url(${IMG.stockholm})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.22,
              maskImage:
                "linear-gradient(90deg, transparent 0%, #000 40%, #000 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, #000 40%, #000 100%)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(246,237,221,1) 0%, rgba(246,237,221,0.92) 52%, rgba(246,237,221,0.65) 100%)",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", maxWidth: 760 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                background: COLORS.bgPaper,
                border: `1px solid ${COLORS.line}`,
                color: COLORS.inkSoft,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                marginBottom: 28,
                boxShadow: COLORS.shadowSoft,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: COLORS.coral,
                }}
              />
              Built in Stockholm for Swedish health
            </span>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(40px, 6vw, 76px)",
                fontWeight: 600,
                lineHeight: 1.0,
                letterSpacing: "-0.035em",
                color: COLORS.ink,
              }}
            >
              Ten years earlier.{" "}
              <span style={{ color: COLORS.coral }}>Starting today.</span>
            </h2>

            <p
              style={{
                margin: "28px 0 40px",
                fontSize: 20,
                lineHeight: 1.55,
                color: COLORS.inkSoft,
                maxWidth: 640,
                letterSpacing: "-0.005em",
              }}
            >
              Join the first 2,000 Swedes building a health profile that
              actually follows them through life. A doctor, a coach, a living
              record. One annual price.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <a
                href="#pricing"
                style={{
                  background: COLORS.coral,
                  color: "#FFFFFF",
                  padding: "18px 32px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  boxShadow: "0 12px 34px rgba(232,90,79,0.32)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Start your membership
              </a>
              <a
                href="#how-it-works"
                style={{
                  color: COLORS.ink,
                  padding: "16px 24px",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                See how it works
              </a>
            </div>

            {/* Disclaimer */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 12,
                color: COLORS.inkMuted,
                lineHeight: 1.55,
                maxWidth: 560,
                fontWeight: 500,
              }}
            >
              <ShieldCheck
                size={14}
                style={{
                  color: COLORS.sage,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <span>
                Precura provides health decision support. Not a medical
                device. Not a diagnosis. If you have urgent symptoms please
                call 1177 or your vardcentral.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 760px) {
          :global(.home16-final-panel) {
            padding: 56px 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
