"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Check, Star } from "lucide-react";
import { COLORS, SYSTEM_FONT, IMG, RADIUS } from "./tokens";

/**
 * HERO - "The Shopfront" / ROUND 4 REFINED
 *
 * Refined after Alex Sung (design) and Maya Patel (growth) critique.
 *
 * The single decisive move: a full hero rewrite that addresses both judges
 * at once.
 *
 * Type system (Alex):
 *   - H1 at weight 500, letter-spacing -0.045em
 *   - "10 years early." in italic serif hook (editorial, not color swap)
 *   - Eyebrow pills at 11px weight 500, NOT tracked caps
 *   - Floating tiles and "Based in Stockholm" dot killed (AI tells)
 *
 * Conversion (Maya):
 *   - Correct entry price: "From 995 SEK/year" (was falsely 2,995)
 *   - Primary CTA is the 2-minute free risk check, not "Start your membership"
 *   - Werlabs contrast baked into the sub-headline
 *   - Price + free-check commitment visible in the first eye path
 */
export function Hero() {
  return (
    <section
      id="top"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "48px 32px 96px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.12fr 1fr",
          gap: 72,
          alignItems: "center",
        }}
        className="home16-hero-grid"
      >
        {/* ----------------------------------------------------- LEFT */}
        <div>
          {/* Editorial eyebrow - NOT a tracked cap pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
              color: COLORS.inkMuted,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                background: COLORS.ink,
                opacity: 0.4,
              }}
            />
            Swedish predictive health, reviewed by a real doctor
          </motion.div>

          {/* Headline - weight 500, tight tracking, italic hook */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              margin: "0 0 24px",
              fontSize: "clamp(54px, 7vw, 104px)",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              color: COLORS.ink,
            }}
          >
            Catch it
            <br />
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: COLORS.coral,
                letterSpacing: "-0.04em",
              }}
            >
              10 years early.
            </span>
          </motion.h1>

          {/* Sub-headline - Werlabs contrast + free check + price together */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              margin: "0 0 14px",
              fontSize: 20,
              lineHeight: 1.5,
              color: COLORS.inkSoft,
              maxWidth: 580,
              letterSpacing: "-0.008em",
              fontWeight: 400,
            }}
          >
            Werlabs gives you numbers in a PDF. Precura gives you a
            Swedish GP who watches them, year after year, and tells you
            what to do before it becomes a diagnosis.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.26,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              margin: "0 0 36px",
              fontSize: 16,
              lineHeight: 1.55,
              color: COLORS.inkMuted,
              maxWidth: 560,
              letterSpacing: "-0.005em",
              fontWeight: 400,
            }}
          >
            Start with a free 2-minute Swedish diabetes and heart risk
            check. See your score before you pay a krona. Membership
            from 995 SEK/year, cancel anytime.
          </motion.p>

          {/* CTAs - low-friction primary, pricing jump as secondary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <a
              href="#risk-check"
              style={{
                background: COLORS.coral,
                color: "#FFFFFF",
                padding: "17px 28px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.008em",
                boxShadow: "0 10px 28px rgba(232,90,79,0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Start my free risk check
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  opacity: 0.85,
                  letterSpacing: "0",
                }}
              >
                2 min
              </span>
            </a>
            <a
              href="#pricing"
              style={{
                background: "transparent",
                color: COLORS.ink,
                padding: "17px 24px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.008em",
                border: `1px solid ${COLORS.ink}`,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              See membership from 995 SEK/year
            </a>
          </motion.div>

          {/* Trust row - no cap tracking, no pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "flex",
              gap: 22,
              flexWrap: "wrap",
              alignItems: "center",
              color: COLORS.inkMuted,
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "-0.003em",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <ShieldCheck size={15} style={{ color: COLORS.sage }} />
              Reviewed by Dr. Marcus Johansson, Karolinska-trained GP
            </span>
            <span style={{ color: COLORS.inkFaint }}>/</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Check size={15} style={{ color: COLORS.sage }} />
              No credit card for the risk check
            </span>
            <span style={{ color: COLORS.inkFaint }}>/</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Star size={15} style={{ color: COLORS.amber }} />
              2,000+ Swedish members
            </span>
          </motion.div>
        </div>

        {/* ----------------------------------------------------- RIGHT */}
        {/* Clean portrait. No floating tiles. No pulsing dot. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            width: "100%",
            maxWidth: 540,
            justifySelf: "end",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: RADIUS.cardLarge,
              overflow: "hidden",
              backgroundImage: `url(${IMG.heroProduct})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: COLORS.shadowHero,
            }}
          />
          {/* Single editorial caption below the image, in the grid flow,
              not floating AI-tile nonsense. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 24,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: "rgba(253, 248, 240, 0.94)",
                backdropFilter: "saturate(180%) blur(14px)",
                borderRadius: 14,
                padding: "12px 18px",
                maxWidth: "86%",
                textAlign: "center",
                color: COLORS.inkSoft,
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "-0.005em",
                lineHeight: 1.45,
                boxShadow: "0 6px 20px rgba(28,26,22,0.10)",
              }}
            >
              <span
                style={{
                  fontStyle: "italic",
                  color: COLORS.ink,
                  fontWeight: 400,
                }}
              >
                &ldquo;I had five years of blood tests. Nobody ever
                told me my glucose was climbing.&rdquo;
              </span>
              <br />
              <span style={{ color: COLORS.inkMuted }}>
                Anna, 40, Stockholm / Precura member
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-hero-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
