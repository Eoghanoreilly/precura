"use client";

import React from "react";
import { motion } from "framer-motion";
import { COLORS, SYSTEM_FONT, IMG, RADIUS, CITATIONS } from "./tokens";
import { ShieldCheck, Stethoscope, FlaskConical } from "lucide-react";

/**
 * TRUST & SCIENCE
 *
 * Two panels:
 *  - Left: Dr. Marcus portrait + bio
 *  - Right: Citation list with real peer-reviewed models
 *
 * Airbnb-warm. Real photo. No "As featured in" logo walls.
 */
export function TrustScience() {
  const credentials = [
    {
      icon: Stethoscope,
      label: "Swedish GP, Karolinska-trained",
    },
    {
      icon: ShieldCheck,
      label: "Lakarlegitimation from Socialstyrelsen",
    },
    {
      icon: FlaskConical,
      label: "15+ years in primary care",
    },
  ];

  return (
    <section
      id="science"
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        padding: "120px 32px 140px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 780, marginBottom: 60 }}
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
              marginBottom: 20,
            }}
          >
            Trust and science
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(32px, 4.6vw, 56px)",
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.028em",
            }}
          >
            Built on the same science{" "}
            <span style={{ color: COLORS.coral }}>
              your hospital cardiologist uses.
            </span>
          </h2>
          <p
            style={{
              margin: "22px 0 0",
              fontSize: 18,
              lineHeight: 1.6,
              color: COLORS.inkSoft,
              maxWidth: 700,
            }}
          >
            Our risk models are peer-reviewed. Our doctor is real. Our labs are
            Karolinska-accredited. We&apos;re a health product, not a marketing
            product.
          </p>
        </motion.div>

        <div
          className="home16-trust-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 28,
            alignItems: "stretch",
          }}
        >
          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            style={{
              background: COLORS.bgPaper,
              borderRadius: RADIUS.cardLarge,
              border: `1px solid ${COLORS.line}`,
              boxShadow: COLORS.shadowSoft,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "5 / 4",
                backgroundImage: `url(${IMG.doctor})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(28,26,22,0) 40%, rgba(28,26,22,0.55) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  padding: "6px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.94)",
                  color: COLORS.ink,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: COLORS.sage,
                  }}
                />
                Your personal doctor
              </div>
            </div>

            <div style={{ padding: "28px 32px 32px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.022em",
                  color: COLORS.ink,
                }}
              >
                Dr. Marcus Johansson
              </h3>
              <p
                style={{
                  margin: "6px 0 20px",
                  fontSize: 15,
                  color: COLORS.inkMuted,
                  fontWeight: 500,
                }}
              >
                Swedish General Practitioner
              </p>

              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {credentials.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li
                      key={c.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 14,
                        color: COLORS.inkSoft,
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: COLORS.sageSoft,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={14} style={{ color: COLORS.sage }} />
                      </span>
                      {c.label}
                    </li>
                  );
                })}
              </ul>

              <p
                style={{
                  margin: "22px 0 0",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: COLORS.inkSoft,
                  fontStyle: "italic",
                  padding: "14px 16px",
                  background: COLORS.bgCream,
                  borderRadius: RADIUS.chip,
                }}
              >
                &quot;Most of my patients just wanted someone to read all their
                old tests in one go. That&apos;s what Precura does.&quot;
              </p>
            </div>
          </motion.div>

          {/* Citation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              background: COLORS.bgPaper,
              borderRadius: RADIUS.cardLarge,
              border: `1px solid ${COLORS.line}`,
              boxShadow: COLORS.shadowSoft,
              padding: "34px 34px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: COLORS.inkMuted,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Peer-reviewed risk models we use
            </div>
            <h3
              style={{
                margin: "0 0 24px",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                color: COLORS.ink,
              }}
            >
              Six validated models, all published in journals doctors read.
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                borderTop: `1px solid ${COLORS.line}`,
              }}
            >
              {CITATIONS.map((c) => (
                <div
                  key={c.model}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom: `1px solid ${COLORS.lineSoft}`,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: COLORS.coralTint,
                      color: COLORS.coralDeep,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      minWidth: 86,
                      textAlign: "center",
                    }}
                  >
                    {c.model}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: COLORS.ink,
                      fontWeight: 500,
                    }}
                  >
                    {c.use}
                    <span
                      style={{
                        color: COLORS.inkMuted,
                        fontWeight: 400,
                        marginLeft: 8,
                        fontSize: 13,
                      }}
                    >
                      / {c.authors}, {c.year}
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: COLORS.inkMuted,
                      fontStyle: "italic",
                      fontWeight: 500,
                    }}
                  >
                    {c.journal}
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                margin: "22px 0 0",
                fontSize: 13,
                color: COLORS.inkMuted,
                lineHeight: 1.55,
              }}
            >
              We layer your personal data on top of these models. No secret
              sauce, no proprietary black box, no &quot;AI score&quot; with no
              citation behind it.
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home16-trust-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
