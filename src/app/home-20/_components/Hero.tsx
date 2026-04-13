"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * HERO - single-focus, problem-first.
 *
 * The visitor arrives worried at 11pm. The hero does ONE job: convert.
 * Problem-first headline. Werlabs price anchor. One primary CTA.
 * Trust microcopy. ONE supporting visual (Dr. Marcus portrait with a
 * small floating profile card so the product is visible, not eight
 * equal-weight tiles competing for attention).
 *
 * The "everything in your membership" catalogue lives in its own
 * section further down the page (CatalogueGrid).
 */

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        padding: "40px 32px 96px",
        overflow: "hidden",
      }}
    >
      {/* Soft warm vignette in the background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -120,
          right: -160,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(244,162,122,0.22) 0%, rgba(244,162,122,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -180,
          left: -180,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(107,143,113,0.14) 0%, rgba(107,143,113,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 64,
          alignItems: "center",
        }}
        className="home20-hero-root"
      >
        {/* LEFT: copy */}
        <div style={{ maxWidth: 620 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 14px 7px 10px",
              background: C.paper,
              border: `1px solid ${C.lineFaint}`,
              borderRadius: 100,
              boxShadow: C.shadowSoft,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 50,
                background: C.sage,
                boxShadow: "0 0 0 3px rgba(107,143,113,0.18)",
              }}
            />
            <span
              style={{
                ...TYPE.small,
                color: C.inkSoft,
                fontWeight: 500,
              }}
            >
              A predictive health membership for Sweden
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.displayXL,
              margin: 0,
              marginBottom: 22,
              color: C.ink,
            }}
          >
            See trouble coming.
            <br />
            Years before your doctor can.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              marginBottom: 14,
              maxWidth: 560,
            }}
          >
            Four blood tests a year. One personal doctor. One real coach.
            A living profile that actually remembers you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.body,
              color: C.inkMuted,
              margin: 0,
              marginBottom: 34,
              maxWidth: 560,
            }}
          >
            <span style={{ color: C.ink, fontWeight: 600 }}>2,995 SEK</span>
            {" "}a year. Less than four Werlabs panels, and the doctor is included.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 22,
            }}
          >
            <Link
              href="#pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 28px",
                background: C.terra,
                color: C.creamSoft,
                borderRadius: 100,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                boxShadow: "0 14px 36px rgba(211,88,56,0.32)",
              }}
            >
              Start my membership
              <Arrow />
            </Link>
            <Link
              href="#how"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "18px 22px",
                background: "transparent",
                color: C.ink,
                borderRadius: 100,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 600,
                border: `1px solid ${C.line}`,
              }}
            >
              How it works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
              ...TYPE.small,
              color: C.inkMuted,
            }}
          >
            <TrustDot label="First lab slot this week" />
            <TrustSep />
            <TrustDot label="Dr. Marcus reviews every result" />
            <TrustSep />
            <TrustDot label="Cancel anytime" />
          </motion.div>
        </div>

        {/* RIGHT: single supporting visual - Dr. Marcus portrait with floating profile card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            maxWidth: 520,
            width: "100%",
            justifySelf: "end",
          }}
          className="home20-hero-visual"
        >
          {/* Main portrait */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 28,
              overflow: "hidden",
              backgroundImage: `url(${IMG.drMarcus})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 40px 100px rgba(22,21,18,0.22), 0 16px 40px rgba(22,21,18,0.10)",
            }}
          />
          {/* Warm top gradient to soften edge */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 28,
              background:
                "linear-gradient(180deg, rgba(22,21,18,0) 45%, rgba(22,21,18,0.55) 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Doctor credit chip (bottom-left of portrait) */}
          <div
            style={{
              position: "absolute",
              bottom: 22,
              left: 22,
              padding: "10px 14px 10px 12px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: 100,
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: C.shadowSoft,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 50,
                background: C.sage,
              }}
            />
            <span
              style={{
                ...TYPE.small,
                color: C.ink,
                fontWeight: 600,
              }}
            >
              Dr. Marcus Johansson
            </span>
            <span
              style={{
                ...TYPE.tiny,
                color: C.inkMuted,
                fontWeight: 400,
              }}
            >
              Karolinska-trained
            </span>
          </div>

          {/* Floating living-profile card (top-right, overlapping) */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: 36,
              right: -28,
              width: 248,
              background: C.paper,
              border: `1px solid ${C.lineFaint}`,
              borderRadius: 18,
              padding: "16px 18px 18px",
              boxShadow: "0 24px 60px rgba(22,21,18,0.16)",
            }}
            className="home20-hero-profile-card"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  ...TYPE.tiny,
                  color: C.inkMuted,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Your living profile
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 50,
                  background: C.sage,
                  boxShadow: "0 0 0 3px rgba(107,143,113,0.2)",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.ink,
                marginBottom: 2,
                letterSpacing: "-0.01em",
              }}
            >
              Fasting glucose
            </div>
            <div
              style={{
                ...TYPE.tiny,
                color: C.inkMuted,
                marginBottom: 14,
              }}
            >
              5 year trend
            </div>
            {/* Mini inline trend chart */}
            <TrendSparkline />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <span
                style={{
                  ...TYPE.tiny,
                  color: C.inkMuted,
                }}
              >
                2021
              </span>
              <span
                style={{
                  ...TYPE.tiny,
                  color: C.terra,
                  fontWeight: 600,
                }}
              >
                Trending up
              </span>
              <span
                style={{
                  ...TYPE.tiny,
                  color: C.inkMuted,
                }}
              >
                2026
              </span>
            </div>
          </motion.div>

          {/* Werlabs-contrast price card (bottom-right, overlapping) */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: 18 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: -30,
              right: -34,
              width: 248,
              background: C.paper,
              border: `1px solid ${C.lineFaint}`,
              borderRadius: 18,
              padding: "16px 18px",
              boxShadow: "0 24px 60px rgba(22,21,18,0.16)",
            }}
            className="home20-hero-price-card"
          >
            <div
              style={{
                ...TYPE.tiny,
                color: C.inkMuted,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              What you pay
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                2,995
              </span>
              <span
                style={{
                  ...TYPE.small,
                  color: C.inkMuted,
                  fontWeight: 500,
                  paddingBottom: 3,
                }}
              >
                SEK / year
              </span>
            </div>
            <div
              style={{
                height: 1,
                background: C.lineFaint,
                marginBottom: 10,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                ...TYPE.tiny,
                color: C.inkMuted,
                marginBottom: 4,
              }}
            >
              <span>4 Werlabs panels</span>
              <span style={{ color: C.inkSoft, textDecoration: "line-through" }}>
                ~3,600 SEK
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                ...TYPE.tiny,
                color: C.inkSoft,
                fontWeight: 600,
              }}
            >
              <span>Precura all-in</span>
              <span style={{ color: C.sageDeep }}>2,995 SEK</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          :global(.home20-hero-root) {
            gap: 40px !important;
          }
          :global(.home20-hero-profile-card) {
            right: -12px !important;
            width: 220px !important;
          }
          :global(.home20-hero-price-card) {
            right: -16px !important;
            width: 220px !important;
          }
        }
        @media (max-width: 880px) {
          :global(.home20-hero-root) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          :global(.home20-hero-visual) {
            justify-self: center !important;
            max-width: 440px !important;
          }
        }
        @media (max-width: 520px) {
          :global(.home20-hero-profile-card) {
            right: 8px !important;
            top: 18px !important;
            width: 200px !important;
          }
          :global(.home20-hero-price-card) {
            right: 8px !important;
            bottom: -18px !important;
            width: 200px !important;
          }
        }
      `}</style>
    </section>
  );
}

function TrendSparkline() {
  // Fasting glucose 5.0 -> 5.8 (rising). Terracotta gradient line.
  const points = [5.0, 5.1, 5.2, 5.3, 5.5, 5.6, 5.8];
  const w = 208;
  const h = 54;
  const pad = 4;
  const minV = 4.8;
  const maxV = 6.0;
  const x = (i: number) => pad + (i * (w - pad * 2)) / (points.length - 1);
  const y = (v: number) =>
    pad + ((maxV - v) / (maxV - minV)) * (h - pad * 2);
  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const area =
    `M${x(0).toFixed(1)},${h - pad} ` +
    points.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    ` L${x(points.length - 1).toFixed(1)},${h - pad} Z`;

  return (
    <svg width={w} height={h} style={{ display: "block" }} aria-hidden>
      <defs>
        <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D35838" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#D35838" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="heroSparkLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B8F71" />
          <stop offset="70%" stopColor="#D35838" />
          <stop offset="100%" stopColor="#A83E23" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#heroSparkFill)" />
      <path
        d={path}
        fill="none"
        stroke="url(#heroSparkLine)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={x(points.length - 1)}
        cy={y(points[points.length - 1])}
        r="4"
        fill="#D35838"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrustDot({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 50,
          background: C.sage,
        }}
      />
      {label}
    </span>
  );
}

function TrustSep() {
  return (
    <span
      style={{
        width: 1,
        height: 12,
        background: C.line,
      }}
    />
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
