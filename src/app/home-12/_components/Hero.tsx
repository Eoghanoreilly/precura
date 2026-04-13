"use client";

/**
 * Hero - "Split Classical".
 *
 * A disciplined 12-column split. Left 7 columns are typography plus
 * a small set of live trust microcopy. Right 5 columns are a contained
 * 3D terrain panel with HTML overlays (not WebGL text) sitting over
 * the canvas. The canvas itself is clipped by the rounded panel.
 *
 * Vibe: linear.app hero with a 3D widget where the product screenshot
 * would usually live.
 */

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { C, FONT, MONO, TYPE, GRID, EASE } from "./tokens";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 90% 70% at 55% 60%, #1F2A26 0%, #14181C 55%, #0D1014 100%)",
      }}
    />
  ),
});

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: 140,
        paddingBottom: 80,
        paddingLeft: GRID.pagePaddingX,
        paddingRight: GRID.pagePaddingX,
        background: C.paper,
        overflow: "hidden",
        fontFamily: FONT,
      }}
      className="home12-hero"
    >
      {/* Vertical hairline grid. Visual reminder of the column discipline. */}
      <GridLines />

      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: GRID.columnGap,
          alignItems: "center",
        }}
      >
        {/* LEFT COLUMN - typography and CTAs */}
        <div
          style={{
            gridColumn: "span 7",
          }}
          className="home12-hero-left"
        >
          <HeroEyebrow />
          <HeroHeadline />
          <HeroSub />
          <HeroCtas />
          <HeroTrustRow />
        </div>

        {/* RIGHT COLUMN - contained 3D panel */}
        <div
          style={{
            gridColumn: "span 5",
          }}
          className="home12-hero-right"
        >
          <HeroPanel />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-hero-left) {
            grid-column: span 12 !important;
          }
          :global(.home12-hero-right) {
            grid-column: span 12 !important;
            margin-top: 48px;
          }
        }
        @media (max-width: 720px) {
          :global(.home12-hero) {
            padding-left: ${GRID.pagePaddingXMobile}px !important;
            padding-right: ${GRID.pagePaddingXMobile}px !important;
            padding-top: 116px !important;
          }
        }
      `}</style>
    </section>
  );
}

// -------------------------------------------------------------------------
// LEFT SIDE PARTS
// -------------------------------------------------------------------------

function HeroEyebrow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE.out }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px 6px 10px",
        border: `1px solid ${C.line}`,
        borderRadius: 100,
        background: C.paperElev,
        marginBottom: 40,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: C.sage,
          boxShadow: `0 0 8px ${C.sage}`,
        }}
      />
      <span
        style={{
          ...TYPE.eyebrow,
          color: C.inkMid,
        }}
      >
        Predictive health / Stockholm / Spring 2026
      </span>
    </motion.div>
  );
}

function HeroHeadline() {
  const lines = [
    { text: "Your blood work", color: C.ink, italic: false },
    { text: "has a story.", color: C.ink, italic: false },
    { text: "Most doctors never read it.", color: C.accent, italic: true },
  ];
  return (
    <h1
      style={{
        ...TYPE.display,
        margin: 0,
        maxWidth: 820,
        color: C.ink,
      }}
    >
      {lines.map((l, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.45 + i * 0.12,
            ease: EASE.out,
          }}
          style={{
            display: "block",
            color: l.color,
            fontStyle: l.italic ? "italic" : "normal",
            fontFamily: FONT,
          }}
        >
          {l.text}
        </motion.span>
      ))}
    </h1>
  );
}

function HeroSub() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 0.85, ease: EASE.out }}
      style={{
        marginTop: 36,
        marginBottom: 0,
        maxWidth: 560,
        ...TYPE.lead,
        color: C.inkSoft,
      }}
    >
      Precura reads five years of your biomarkers through the same clinical
      risk models your GP would run, pairs you with a Swedish doctor and a
      personal coach, and keeps watching. A living profile, not a report.
    </motion.p>
  );
}

function HeroCtas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 1.0, ease: EASE.out }}
      style={{
        marginTop: 44,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 14,
      }}
    >
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 24px",
          background: C.ink,
          color: C.paper,
          border: "none",
          borderRadius: 10,
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: "-0.005em",
          boxShadow: C.shadowMd,
          transition: "transform 200ms ease, box-shadow 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = C.shadowLg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = C.shadowMd;
        }}
      >
        See your trajectory
        <ArrowRight size={16} strokeWidth={2} />
      </button>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "15px 20px",
          background: "transparent",
          color: C.ink,
          border: `1px solid ${C.lineStrong}`,
          borderRadius: 10,
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: "-0.005em",
          transition: "background 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.paperSoft;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        Meet Dr. Marcus
      </button>
    </motion.div>
  );
}

function HeroTrustRow() {
  const items = [
    "BankID sign-in",
    "EU hosted",
    "Peer-reviewed models",
    "Karolinska-trained",
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 1.2, ease: EASE.out }}
      style={{
        marginTop: 52,
        paddingTop: 28,
        borderTop: `1px solid ${C.line}`,
        display: "flex",
        flexWrap: "wrap",
        gap: "14px 28px",
        alignItems: "center",
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            ...TYPE.caption,
            color: C.inkMuted,
          }}
        >
          <Check size={13} color={C.sage} strokeWidth={2.2} />
          {it}
        </div>
      ))}
    </motion.div>
  );
}

// -------------------------------------------------------------------------
// RIGHT PANEL - the contained 3D widget
// -------------------------------------------------------------------------

function HeroPanel() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      const ss = d.getSeconds().toString().padStart(2, "0");
      setNow(`${hh}:${mm}:${ss}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.55, ease: EASE.out }}
      style={{
        position: "relative",
        aspectRatio: "4 / 5",
        borderRadius: 20,
        overflow: "hidden",
        background: C.graphite,
        border: `1px solid ${C.lineStrong}`,
        boxShadow: C.shadowLg,
      }}
    >
      {/* The canvas */}
      <Hero3D />

      {/* Window chrome bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(180deg, rgba(13,16,20,0.72) 0%, rgba(13,16,20,0) 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: C.signalCaution,
              boxShadow: `0 0 8px ${C.signalCaution}`,
            }}
          />
          <span
            style={{
              ...TYPE.eyebrow,
              color: "rgba(250, 250, 247, 0.88)",
            }}
          >
            Your risk landscape
          </span>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: "rgba(250, 250, 247, 0.52)",
            letterSpacing: "0.08em",
          }}
        >
          LIVE / {now}
        </span>
      </div>

      {/* Bottom readout - data callouts */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "18px 18px 18px",
          background:
            "linear-gradient(0deg, rgba(13,16,20,0.92) 0%, rgba(13,16,20,0) 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: "rgba(250, 250, 247, 0.52)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Anna B / fasting glucose / 5yr
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 34,
                fontWeight: 500,
                color: "#FAFAF7",
                letterSpacing: "-0.02em",
              }}
            >
              5.8
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: "rgba(250, 250, 247, 0.5)",
                letterSpacing: "0.06em",
              }}
            >
              mmol/L
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 100,
              background: "rgba(201, 122, 61, 0.22)",
              border: "1px solid rgba(201, 122, 61, 0.35)",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: "#E9A87A",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              +0.8 / 5 yrs
            </span>
          </div>
        </div>
      </div>

      {/* A tiny marker on the right side, referencing today's point */}
      <div
        style={{
          position: "absolute",
          right: "20%",
          top: "52%",
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid rgba(201, 122, 61, 0.55)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(201, 122, 61, 0.55)",
          }}
        />
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------------------
// GRID LINES - decorative hairlines reinforcing the column discipline.
// -------------------------------------------------------------------------

function GridLines() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: GRID.pageMaxWidth,
        pointerEvents: "none",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        paddingLeft: GRID.pagePaddingX,
        paddingRight: GRID.pagePaddingX,
      }}
      className="home12-hero-gridlines"
    >
      {Array.from({ length: 13 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `calc(${(i / 12) * 100}% )`,
            width: 1,
            background: C.lineSoft,
          }}
        />
      ))}
    </div>
  );
}
