"use client";

/**
 * Footer. Dark, editorial. No parallax (reader is at rest now) but still uses
 * in-view reveal animation for each column.
 */

import React from "react";
import { motion } from "framer-motion";
import { C, FONT, SIZE } from "./tokens";

const COLS: { heading: string; items: string[] }[] = [
  {
    heading: "Precura",
    items: ["Science", "How it works", "Pricing", "Blog", "Press"],
  },
  {
    heading: "Members",
    items: ["Log in with BankID", "Book a blood test", "Message a doctor", "Training plan"],
  },
  {
    heading: "Stockholm",
    items: ["Sveavagen 42, 113 34", "hello@precura.se", "+46 8 123 45 67", "IVO oversight"],
  },
  {
    heading: "Legal",
    items: ["GDPR", "Data policy", "Terms", "FHIR export"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: C.ink,
        color: C.cream,
        fontFamily: FONT.ui,
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 6vw, 100px) clamp(48px, 6vw, 96px)",
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {/* Big wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(80px, 16vw, 280px)",
            fontWeight: 200,
            letterSpacing: "-0.05em",
            lineHeight: 0.85,
            margin: 0,
            marginBottom: "clamp(60px, 8vw, 120px)",
            color: C.cream,
            position: "relative",
          }}
        >
          Precura
          <span
            style={{
              fontSize: "0.25em",
              verticalAlign: "super",
              color: C.terracottaSoft,
              marginLeft: 14,
              fontStyle: "italic",
              fontWeight: 300,
              letterSpacing: "0.01em",
            }}
          >
            ae
          </span>
          <span
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: SIZE.eyebrow,
              fontFamily: FONT.mono,
              letterSpacing: "0.15em",
              color: C.textLightSoft,
              textTransform: "uppercase",
              textAlign: "right",
              lineHeight: 1.8,
            }}
          >
            Pre / prediction
            <br />
            Cura / cure
            <br />
            Stockholm / 2026
          </span>
        </motion.div>

        {/* Column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "clamp(32px, 4vw, 64px)",
            borderTop: `1px solid ${C.ruleDark}`,
            paddingTop: "clamp(40px, 5vw, 72px)",
          }}
        >
          {COLS.map((col, i) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
            >
              <div
                style={{
                  fontSize: SIZE.eyebrow,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.textLightSoft,
                  marginBottom: 20,
                  fontFamily: FONT.mono,
                }}
              >
                {col.heading}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {col.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: SIZE.body,
                      color: C.cream,
                      fontWeight: 300,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            marginTop: "clamp(60px, 8vw, 120px)",
            paddingTop: "clamp(24px, 3vw, 40px)",
            borderTop: `1px solid ${C.ruleDark}`,
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            fontSize: SIZE.eyebrow,
            color: C.textLightSoft,
            letterSpacing: "0.08em",
            fontFamily: FONT.mono,
          }}
        >
          <div>
            Precura AB / Org nr 559-XXXX-XXXX / Regulated by IVO
          </div>
          <div>
            (c) 2026 Precura. The line was always there.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
