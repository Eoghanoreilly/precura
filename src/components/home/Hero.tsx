"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * HERO - "The Welcome Kit"
 *
 * Left: instant value headline + inline pricing + CTA + trust microcopy.
 * Right: visual flat-lay of the kit contents (blood test box, membership
 * card, doctor note, training card, pillar ring). Items fan out on load.
 *
 * Passes 5-second test: visitor sees WHAT (kit contents), FROM WHOM
 * (Precura member), HOW MUCH (2,995 SEK/year) without scroll.
 */
export function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        background: C.canvas,
        fontFamily: SYSTEM_FONT,
        paddingTop: 120,
        paddingBottom: 80,
        overflow: "hidden",
      }}
    >
      {/* Warm radial highlight, very subtle */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-15%",
          width: "70%",
          height: "90%",
          background:
            "radial-gradient(closest-side, rgba(233,181,71,0.14), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(closest-side, rgba(201,87,58,0.07), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="home17-hero-grid"
      >
        {/* LEFT - Copy */}
        <div style={{ maxWidth: 560 }}>
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "clamp(40px, 5.4vw, 72px)",
              lineHeight: 1.02,
              letterSpacing: "-0.032em",
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              marginBottom: 24,
            }}
          >
            See trouble coming.{" "}
            <span
              style={{
                color: C.terracotta,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              A year before your doctor does.
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: C.inkMuted,
              margin: 0,
              marginBottom: 36,
              maxWidth: 500,
            }}
          >
            Precura is a year of predictive health for Swedish adults. Four
            blood panels, one Swedish GP who knows your trajectory, and a
            living profile that catches drift years before a yearly check-up
            would.
          </motion.p>

          {/* Single primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link
              href="#pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "17px 34px",
                background: C.terracotta,
                color: "#FFFFFF",
                borderRadius: 14,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                boxShadow:
                  "0 14px 28px -12px rgba(201,87,58,0.45), 0 2px 6px rgba(201,87,58,0.18)",
              }}
            >
              Start your membership
            </Link>
          </motion.div>

        </div>

        {/* RIGHT - Welcome Kit flat lay */}
        <WelcomeKitVisual />
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home17-hero-grid) {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Hero Visual - single hero object (membership card) with doctor note peeking
// Warm overhead light, one real shadow, Airbnb host-page restraint.
// =============================================================================
function WelcomeKitVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 560,
        marginLeft: "auto",
      }}
    >
      {/* Warm overhead light pool - single directional source */}
      <div
        style={{
          position: "absolute",
          top: "-6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "92%",
          height: "92%",
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(233,181,71,0.22), transparent 65%)",
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />

      {/* Soft contact shadow pool under the hero card */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          left: "12%",
          right: "12%",
          height: "8%",
          background:
            "radial-gradient(ellipse at center, rgba(43,41,37,0.18), transparent 70%)",
          filter: "blur(22px)",
          pointerEvents: "none",
        }}
      />

      {/* Doctor's handwritten note - peeking out from underneath, bottom-left */}
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "4%",
          width: "46%",
          background: C.canvasSoft,
          borderRadius: 14,
          padding: "14px 16px 16px 16px",
          boxShadow:
            "0 18px 32px -18px rgba(43,41,37,0.22), 0 2px 6px rgba(43,41,37,0.06)",
          border: `1px solid ${C.lineCard}`,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDeep} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.canvasSoft,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            TK
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: "-0.005em",
              }}
            >
              Dr. Tomas Kurakovas
            </div>
            <div style={{ fontSize: 9, color: C.inkFaint }}>
              Your Precura GP
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            lineHeight: 1.45,
            color: C.inkSoft,
            fontStyle: "italic",
          }}
        >
          &ldquo;Welcome Anna. Your glucose has been
          <br />
          drifting since 2022. Let&apos;s turn it around.&rdquo;
        </div>
      </motion.div>

      {/* HERO: The Membership Card - single dominant object, ~62% width */}
      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: "18%",
          left: "22%",
          width: "62%",
          aspectRatio: "1.58 / 1",
          background: `linear-gradient(148deg, #35322D 0%, ${C.ink} 48%, #221F1B 100%)`,
          borderRadius: 22,
          padding: "26px 28px",
          color: C.canvasSoft,
          boxShadow:
            "0 42px 64px -28px rgba(43,41,37,0.48), 0 16px 28px -14px rgba(43,41,37,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        {/* Specular highlight - warm light from top-left */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            background:
              "linear-gradient(142deg, rgba(233,181,71,0.12) 0%, rgba(233,181,71,0.02) 32%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        {/* Top row: brand + logo mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.butter,
                marginBottom: 4,
              }}
            >
              Precura / Member
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(251,247,240,0.55)",
                fontFamily: '"SF Mono", ui-monospace, monospace',
                letterSpacing: "0.04em",
              }}
            >
              ANNUAL / 2026
            </div>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: `linear-gradient(140deg, ${C.terracotta} 0%, #A8462C 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              color: C.canvasSoft,
              boxShadow: "0 4px 10px rgba(201,87,58,0.35)",
            }}
          >
            P
          </div>
        </div>

        {/* Bottom row: name + trajectory marker */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.015em",
              marginBottom: 6,
              lineHeight: 1.1,
            }}
          >
            Anna Bergstrom
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(251,247,240,0.55)",
                fontFamily: '"SF Mono", ui-monospace, monospace',
                letterSpacing: "0.04em",
              }}
            >
              MEMBER SINCE 01.2026
            </div>
            {/* Tiny trajectory sparkline - reinforces "year of value" */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
                height: 14,
              }}
            >
              {[5, 7, 6, 9, 8, 11, 10, 13].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    borderRadius: 1,
                    background:
                      i === 7
                        ? C.butter
                        : `rgba(251,247,240,${0.25 + i * 0.04})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
