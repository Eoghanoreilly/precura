"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, SYSTEM_FONT, MONO_FONT, TYPE, IMG } from "./tokens";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, background: C.paper }}
    />
  ),
});

/**
 * HERO - Magazine cover.
 *
 * The hero is laid out like a printed magazine cover:
 *   - A faint horizontal baseline grid runs the full width.
 *   - Top masthead: "PRECURA" wordmark + issue number + date.
 *   - A giant two-line cover headline dominates the left column.
 *   - A full portrait photograph occupies the right column, framed with
 *     a clean rule on top and bottom, editorial captioned.
 *   - The 3D terrain is a SMALL preview widget nested over the bottom
 *     of the photograph, labelled "Cover Feature" with a hairline frame.
 *   - A text-link CTA at the bottom, no big buttons.
 *
 * No pill badges. No centered stacked headline + button.
 */
export function Hero() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Live Stockholm time in mono type for the masthead
  const [stockholm, setStockholm] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const f = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setStockholm(f.format(d));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={wrapRef}
      style={{
        position: "relative",
        background: C.paper,
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Very faint horizontal baseline grid, 12 lines across the viewport */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 119px, rgba(20,18,14,0.04) 119px, rgba(20,18,14,0.04) 120px)`,
          pointerEvents: "none",
        }}
      />

      {/* Masthead row */}
      <Masthead stockholm={stockholm} />

      {/* Main cover grid: headline left, portrait right */}
      <div
        className="hero14-grid"
        style={{
          position: "relative",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "160px 48px 64px",
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 64,
          alignItems: "flex-start",
        }}
      >
        {/* Left: headline column */}
        <motion.div style={{ y: titleY, opacity: titleOpacity }}>
          <div
            style={{
              ...TYPE.mono,
              color: C.rust,
              marginBottom: 32,
            }}
          >
            The Cover Feature / April 2026
          </div>

          <h1
            style={{
              ...TYPE.cover,
              margin: 0,
              color: C.ink,
            }}
          >
            The quiet
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 500 }}>
              trajectory
            </span>
          </h1>

          {/* Rule + deck */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: `1px solid ${C.rule}`,
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 40,
              maxWidth: 700,
            }}
          >
            <div>
              <p
                style={{
                  ...TYPE.deck,
                  margin: 0,
                  color: C.inkSoft,
                  maxWidth: 500,
                }}
              >
                A Swedish predictive health platform for people whose bodies are
                telling a five-year story. We read it. Then a doctor writes it
                back to you in plain language.
              </p>
            </div>
            <div>
              <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 8 }}>
                Inside
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  fontSize: "13px",
                  color: C.inkSoft,
                  lineHeight: 1.7,
                }}
              >
                <li>Ch 01 / The missed years</li>
                <li>Ch 02 / Anna Bergstrom</li>
                <li>Ch 03 / The method</li>
                <li>Ch 04 / Five pillars</li>
                <li>Ch 05 / The profile</li>
              </ul>
            </div>
          </div>

          {/* Text link CTA, no big buttons */}
          <div
            style={{
              marginTop: 64,
              display: "flex",
              alignItems: "center",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/v2/dashboard"
              style={{
                ...TYPE.monoLarge,
                color: C.ink,
                textDecoration: "none",
                borderBottom: `2px solid ${C.ink}`,
                paddingBottom: 4,
              }}
            >
              Begin your trajectory
            </Link>
            <Link
              href="#how"
              style={{
                ...TYPE.monoLarge,
                color: C.inkMuted,
                textDecoration: "none",
                borderBottom: `1px solid ${C.inkMuted}`,
                paddingBottom: 4,
              }}
            >
              How the method works
            </Link>
          </div>
        </motion.div>

        {/* Right: portrait + cover feature widget */}
        <motion.div
          style={{
            y: photoY,
            position: "relative",
            aspectRatio: "3 / 4.2",
            minHeight: 560,
          }}
        >
          {/* Top caption row */}
          <div
            style={{
              paddingBottom: 14,
              borderBottom: `1px solid ${C.rule}`,
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <div style={{ ...TYPE.mono, color: C.inkMuted }}>
              Portrait / Anna B, 40
            </div>
            <div style={{ ...TYPE.mono, color: C.inkFaint }}>
              Photographed Stockholm
            </div>
          </div>

          {/* Portrait photo */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3 / 4",
              overflow: "hidden",
              backgroundColor: C.paperDeep,
              backgroundImage: `url(${IMG.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              filter: "grayscale(14%) contrast(1.02)",
            }}
          >
            {/* Subtle paper grain overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 100% 100% at 30% 40%, rgba(244,239,230,0) 0%, rgba(244,239,230,0.18) 85%)",
                pointerEvents: "none",
              }}
            />

            {/* 3D terrain as a contained cover feature widget */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                width: "min(260px, 62%)",
                aspectRatio: "1 / 1",
                background: C.paper,
                border: `1px solid ${C.ink}`,
                boxShadow: "0 12px 30px rgba(20,18,14,0.25)",
                overflow: "hidden",
              }}
            >
              {/* Widget header */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: C.paper,
                  borderBottom: `1px solid ${C.ink}`,
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.ink,
                    fontWeight: 600,
                  }}
                >
                  Cover Feature
                </div>
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.inkMuted,
                  }}
                >
                  5y / f-Glucose
                </div>
              </div>

              {/* The actual 3D canvas */}
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Hero3D />
              </div>

              {/* Widget footer caption */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "8px 12px",
                  background: C.paper,
                  borderTop: `1px solid ${C.ink}`,
                  display: "flex",
                  justifyContent: "space-between",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.ink,
                  }}
                >
                  5.0
                </div>
                <div
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.rust,
                    fontWeight: 600,
                  }}
                >
                  5.8 mmol/L
                </div>
              </div>
            </div>
          </div>

          {/* Bottom caption row */}
          <div
            style={{
              paddingTop: 14,
              borderTop: `1px solid ${C.rule}`,
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.inkSoft,
                fontStyle: "italic",
                fontFamily: SYSTEM_FONT,
                maxWidth: 260,
                lineHeight: 1.35,
              }}
            >
              "For five years my numbers were fine. Now I have a slope."
            </div>
            <div style={{ ...TYPE.mono, color: C.inkFaint }}>p. 24</div>
          </div>
        </motion.div>
      </div>

      {/* Footer information band for the cover */}
      <div
        className="hero14-meta"
        style={{
          position: "relative",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 48px 56px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          borderTop: `1px solid ${C.rule}`,
          paddingTop: 32,
          marginTop: 40,
        }}
      >
        {[
          { label: "Published", value: "April 2026" },
          { label: "Edition", value: "Volume I / Issue 01" },
          { label: "Frequency", value: "Quarterly retests" },
          { label: "From", value: `Stockholm / ${stockholm || "11:00"} CET` },
        ].map((m, i) => (
          <div key={i}>
            <div style={{ ...TYPE.mono, color: C.inkMuted, marginBottom: 6 }}>
              {m.label}
            </div>
            <div
              style={{
                fontSize: 16,
                color: C.ink,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.hero14-grid) {
            grid-template-columns: 1fr !important;
            padding: 140px 24px 48px !important;
            gap: 40px !important;
          }
          :global(.hero14-meta) {
            grid-template-columns: 1fr 1fr !important;
            padding: 0 24px 40px !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// Masthead
// =============================================================================
function Masthead({ stockholm }: { stockholm: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        maxWidth: 1440,
        margin: "0 auto",
        padding: "28px 48px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${C.rule}`,
        background: C.paper,
        fontFamily: SYSTEM_FONT,
      }}
      className="hero14-masthead"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          Precura
        </span>
        <span
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            borderLeft: `1px solid ${C.rule}`,
            paddingLeft: 14,
          }}
        >
          The Quarterly / Vol I
        </span>
      </div>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
        className="hero14-nav"
      >
        {["Method", "Science", "Membership", "Stories"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              ...TYPE.mono,
              color: C.ink,
              textDecoration: "none",
            }}
          >
            {l}
          </a>
        ))}
      </nav>

      <div
        style={{
          ...TYPE.mono,
          color: C.inkMuted,
        }}
      >
        Issue 01 / 2026 / {stockholm || "--:--"}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.hero14-masthead) {
            padding: 20px 24px 14px !important;
          }
          :global(.hero14-nav) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
