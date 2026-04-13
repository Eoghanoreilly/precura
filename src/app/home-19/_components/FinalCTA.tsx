"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FINAL CTA
 *
 * The closing moment. Confident one-liner headline, a warm paragraph
 * underneath, two buttons (primary + ghost), and a small row of
 * reassurance markers. Below that, the legal disclaimer in muted
 * small type: Precura is preventive care, not a replacement for
 * emergency services.
 *
 * Paper card on cream, large rounded corners, soft shadow. No gradient
 * blob backgrounds, no left borders. Just warm confidence.
 */
export function FinalCTA() {
  return (
    <section
      id="final"
      style={{
        padding: "140px 32px 140px",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: C.paper,
            borderRadius: 36,
            border: `1px solid ${C.line}`,
            boxShadow: C.shadowLift,
            padding: "clamp(48px, 7vw, 96px) clamp(32px, 6vw, 80px)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px 6px 8px",
              borderRadius: 100,
              background: C.creamDeep,
              border: `1px solid ${C.line}`,
              marginBottom: 26,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: C.coral,
                display: "grid",
                placeItems: "center",
                color: C.paper,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              P
            </span>
            <span
              style={{
                ...TYPE.small,
                color: C.inkSoft,
                fontWeight: 500,
              }}
            >
              Open to new members in Sweden
            </span>
          </div>

          <h2
            style={{
              ...TYPE.displayXL,
              margin: 0,
              color: C.ink,
              maxWidth: 900,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Start watching the{" "}
            <span
              style={{
                color: C.coral,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              slope, not the number.
            </span>
          </h2>

          <p
            style={{
              ...TYPE.lead,
              color: C.inkMuted,
              marginTop: 24,
              marginBottom: 40,
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Join the first 2,000 members. Your doctor, your coach, your
            living health profile. One membership, one price, one team that
            actually reads your results.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 36,
            }}
          >
            <a
              href="#pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 26px",
                borderRadius: 100,
                background: C.ink,
                color: C.paper,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 10px 28px rgba(26,26,26,0.2)",
                transition: "background 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = C.coralDeep;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = C.ink;
              }}
            >
              Start your membership
              <ArrowRight size={17} strokeWidth={2.2} />
            </a>
            <a
              href="#how"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 24px",
                borderRadius: 100,
                color: C.inkSoft,
                background: "transparent",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                border: `1px solid ${C.line}`,
              }}
            >
              Book a 15 min intro call
            </a>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px 28px",
              flexWrap: "wrap",
              ...TYPE.small,
              color: C.inkMuted,
            }}
          >
            {[
              "From 995 SEK / year",
              "Cancel anytime",
              "Dr. Marcus reviews every panel",
              "BankID",
            ].map((t) => (
              <span
                key={t}
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
                    borderRadius: "50%",
                    background: C.sage,
                  }}
                />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Legal disclaimer */}
        <p
          style={{
            ...TYPE.small,
            color: C.inkFaint,
            textAlign: "center",
            maxWidth: 760,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 36,
            lineHeight: 1.55,
          }}
        >
          Precura is a preventive health membership and does not replace
          emergency medical services or your vardcentral. In an emergency call
          112. For acute symptoms call 1177. Dr. Marcus Johansson is a
          licensed Swedish physician (legitimerad lakare). Medical guidance
          in Precura is intended to support, not replace, the care of your
          primary physician.
        </p>
      </div>
    </section>
  );
}
