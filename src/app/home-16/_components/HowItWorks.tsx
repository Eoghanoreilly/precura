"use client";

import React from "react";
import { motion } from "framer-motion";
import { Droplets, BrainCircuit, MessageSquareHeart } from "lucide-react";
import { COLORS, SYSTEM_FONT, RADIUS } from "./tokens";

/**
 * HOW IT WORKS
 *
 * Vertical 3-step flow. Each step is a large rounded card that alternates
 * sides (image LEFT step 1, RIGHT step 2, LEFT step 3). Warm cream card,
 * friendly icons, plain English copy. Fades in on scroll, no pinning.
 */
export function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Droplets,
      title: "Order a blood test, get it done locally",
      body:
        "Book your panel online, visit a partner lab in your city (Karolinska, Cityakuten and others), or order a home kit. We test 40+ biomarkers: glucose, HbA1c, cholesterol, ApoB, HDL, Vitamin D, thyroid, liver, kidney and more.",
      detail: "Usually 1-2 days from draw to results.",
    },
    {
      n: "02",
      icon: BrainCircuit,
      title: "We merge your results, history and family risk",
      body:
        "Precura layers your new panel on top of every past test from 1177, your family history, your lifestyle and validated risk models (FINDRISC, SCORE2, FRAX). You get trends, not isolated numbers.",
      detail: "You keep full ownership of your data. Export or delete anytime.",
    },
    {
      n: "03",
      icon: MessageSquareHeart,
      title: "Your doctor reviews, your coach acts",
      body:
        "Dr. Marcus reads your panel and leaves a plain-English note. Your coach updates your training and nutrition plan based on the actual markers that moved. You can message both of them inside the app.",
      detail: "Average response time from Dr. Marcus: under 24 hours.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 120px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 60, maxWidth: 760 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: COLORS.sageSoft,
              color: COLORS.sage,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            How it works
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4.8vw, 56px)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.028em",
            }}
          >
            Three steps,
            <br />
            <span style={{ color: COLORS.coral }}>
              from blood draw to a plan you can actually follow.
            </span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: COLORS.bgPaper,
                  borderRadius: RADIUS.cardLarge,
                  border: `1px solid ${COLORS.line}`,
                  boxShadow: COLORS.shadowSoft,
                  padding: "36px 40px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 32,
                  alignItems: "flex-start",
                }}
                className="home16-step-card"
              >
                {/* Number + Icon */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 16,
                    minWidth: 130,
                  }}
                >
                  <div
                    style={{
                      fontSize: 58,
                      fontWeight: 700,
                      color: COLORS.bgCreamDeep,
                      letterSpacing: "-0.04em",
                      lineHeight: 0.85,
                    }}
                  >
                    {step.n}
                  </div>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: COLORS.coralTint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} strokeWidth={2} style={{ color: COLORS.coral }} />
                  </div>
                </div>

                {/* Copy */}
                <div>
                  <h3
                    style={{
                      margin: "0 0 12px",
                      fontSize: 24,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.25,
                      color: COLORS.ink,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: COLORS.inkSoft,
                      maxWidth: 720,
                    }}
                  >
                    {step.body}
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: COLORS.sageSoft,
                      color: COLORS.sage,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {step.detail}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 700px) {
          :global(.home16-step-card) {
            grid-template-columns: 1fr !important;
            padding: 28px 26px !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
