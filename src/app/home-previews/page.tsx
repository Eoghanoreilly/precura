"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Gift } from "lucide-react";

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
const MONO = '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

export default function HomePreviews() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FAFAF7",
        fontFamily: FONT,
        color: "#0D0D0D",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 120px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 56 }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B6B6B",
              fontFamily: MONO,
              marginBottom: 18,
            }}
          >
            20 designs / 4 rounds / Smith home page
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              marginBottom: 20,
              maxWidth: 820,
            }}
          >
            The chosen home page.
            <br />
            <span style={{ color: "#6B6B6B" }}>Welcome Kit.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "#3A3A3A",
              maxWidth: 640,
              margin: 0,
            }}
          >
            Round 1 explored 5 directions. Round 2 pushed cinematic substance. Round 3 refined the 3D direction.
            Round 4 pivoted to Airbnb warmth, instant value, and subscription framing, and put each v1 in front of
            two TechCrunch Disrupt judges. After 20 designs and a judge loop, the Welcome Kit is the one we shipped.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "#FFFFFF",
                borderRadius: 28,
                padding: 44,
                border: "1px solid #EEEAE1",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 12px 40px rgba(20,20,15,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 28,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "#111",
                  color: "#FFF",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                }}
              >
                Shipped
              </div>

              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "#FBEDE4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Gift size={28} strokeWidth={1.8} color="#C9573A" />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#9A9A9A",
                    fontFamily: MONO,
                    marginBottom: 12,
                  }}
                >
                  The home page / Welcome Kit
                </div>
                <h2
                  style={{
                    fontSize: "clamp(30px, 4vw, 48px)",
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    marginBottom: 16,
                    lineHeight: 1.1,
                  }}
                >
                  See trouble coming.{" "}
                  <em
                    style={{
                      color: "#C9573A",
                      fontStyle: "italic",
                      fontWeight: 500,
                    }}
                  >
                    A year before your doctor does.
                  </em>
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#4A4A4A",
                    margin: 0,
                    maxWidth: 640,
                  }}
                >
                  The Welcome Kit survived two TechCrunch Disrupt judges and one refinement round. Warm cream
                  canvas, single membership card hero, problem-first copy, four blood panels per year, one Swedish
                  GP who watches your trajectory. Tap to open the live home page.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 20,
                  borderTop: "1px solid #EEEAE1",
                }}
              >
                <span style={{ fontSize: 12, fontFamily: MONO, color: "#9A9A9A" }}>
                  Round 4 / Home 17 / Final v2
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#C9573A",
                  }}
                >
                  Open the home page
                  <ArrowUpRight size={17} strokeWidth={2.2} />
                </div>
              </div>
            </motion.article>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            marginTop: 72,
            paddingTop: 32,
            borderTop: "1px solid #E8E4DB",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9A9A9A",
              fontFamily: MONO,
              marginBottom: 18,
            }}
          >
            The process
          </div>
          <div
            style={{
              maxWidth: 760,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 14,
              lineHeight: 1.6,
              color: "#4A4A4A",
            }}
          >
            <p style={{ margin: 0 }}>
              <span style={{ fontFamily: MONO, color: "#9A9A9A", marginRight: 10 }}>R1</span>
              5 divergent explorations - data story, editorial, cinematic, quiz, clinical trust
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontFamily: MONO, color: "#9A9A9A", marginRight: 10 }}>R2</span>
              5 cinematic with substance - WebGL 3D, theater, horizontal, parallax, mixed-media
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontFamily: MONO, color: "#9A9A9A", marginRight: 10 }}>R3</span>
              5 refinements on the 3D direction - minimal, split, reveal, magazine, research
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontFamily: MONO, color: "#9A9A9A", marginRight: 10 }}>R4</span>
              5 Airbnb-warm proposals judged by 2 TC Disrupt judges - Welcome Kit won
            </p>
            <p style={{ margin: "18px 0 0", color: "#8A8A8A", fontSize: 13 }}>
              All 20 designs live in git history on feature/home-page-designs.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
