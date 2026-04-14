"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, IMG } from "./tokens";

/**
 * TRUST & SCIENCE - Dr. Tomas named and imaged. Citations listed as a
 * neat reference table. Two-column editorial layout.
 */
export function TrustScience() {
  const citations = [
    {
      model: "FINDRISC",
      purpose: "Diabetes risk",
      source: "Lindstrom J & Tuomilehto J, Diabetes Care, 2003",
    },
    {
      model: "SCORE2",
      purpose: "Cardiovascular risk",
      source: "SCORE2 Working Group, Eur Heart J, 2021",
    },
    {
      model: "FRAX",
      purpose: "Fracture / bone risk",
      source: "Kanis JA et al., Osteoporos Int, 2008",
    },
    {
      model: "SDPP",
      purpose: "Swedish Diabetes Prevention Program",
      source: "Carlsson AC et al., BMC Public Health, 2024",
    },
    {
      model: "UKPDS",
      purpose: "Type 2 progression model",
      source: "Turner RC, Lancet, 1998",
    },
    {
      model: "DPP",
      purpose: "Diabetes Prevention Program",
      source: "Knowler WC et al., NEJM, 2002",
    },
  ];

  return (
    <section
      style={{
        background: C.canvasDeep,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.15fr",
            gap: 72,
            alignItems: "flex-start",
          }}
          className="home17-trust-grid"
        >
          {/* Doctor portrait card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: C.shadowCard,
              border: `1px solid ${C.lineCard}`,
              background: C.paper,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                backgroundImage: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              style={{
                padding: 24,
                borderTop: `1px solid ${C.lineSoft}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  marginBottom: 6,
                }}
              >
                Your personal GP
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  color: C.ink,
                  marginBottom: 4,
                }}
              >
                Dr. Tomas Kurakovas
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.inkMuted,
                  lineHeight: 1.55,
                }}
              >
                Karolinska-trained / 15+ years primary care / Licensed
              </div>
            </div>
          </motion.div>

          {/* Copy + citations */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.terracotta,
                marginBottom: 16,
              }}
            >
              Trust & science
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              style={{
                fontSize: "clamp(34px, 4vw, 54px)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                fontWeight: 600,
                color: C.ink,
                margin: 0,
                marginBottom: 20,
              }}
            >
              Run by licensed doctors.{" "}
              <span
                style={{
                  color: C.terracotta,
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                Built on clinical science.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: C.inkMuted,
                margin: 0,
                marginBottom: 36,
                maxWidth: 620,
              }}
            >
              Dr. Tomas personally reviews every new member&apos;s baseline
              panel and writes the first note. The risk models we use are the
              same ones doctors trust today, published in peer-reviewed
              journals, referenced below.
            </motion.p>

            {/* Citations table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                background: C.paper,
                borderRadius: 16,
                border: `1px solid ${C.lineCard}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1.4fr",
                  padding: "14px 24px",
                  borderBottom: `1px solid ${C.lineSoft}`,
                  background: C.canvasSoft,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: C.inkFaint,
                  gap: 16,
                }}
                className="home17-cite-header"
              >
                <div>Model</div>
                <div>Purpose</div>
                <div>Source</div>
              </div>
              {citations.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 1.4fr",
                    padding: "16px 24px",
                    borderBottom:
                      i === citations.length - 1
                        ? "none"
                        : `1px solid ${C.lineSoft}`,
                    fontSize: 13,
                    gap: 16,
                    alignItems: "baseline",
                  }}
                  className="home17-cite-row"
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: C.ink,
                      fontFamily: "ui-monospace, monospace",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {c.model}
                  </div>
                  <div style={{ color: C.inkSoft }}>{c.purpose}</div>
                  <div style={{ color: C.inkMuted, fontSize: 12 }}>
                    {c.source}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home17-trust-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          :global(.home17-cite-header),
          :global(.home17-cite-row) {
            grid-template-columns: 80px 1fr !important;
          }
          :global(.home17-cite-header > :last-child),
          :global(.home17-cite-row > :last-child) {
            grid-column: 1 / -1 !important;
            padding-top: 4px;
          }
        }
      `}</style>
    </section>
  );
}
