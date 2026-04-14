"use client";

import React from "react";
import Link from "next/link";
import { C, SYSTEM_FONT } from "./tokens";

/**
 * FOOTER - Warm cream base, editorial four-column layout.
 * Logo + tagline left, three nav columns right, fine print bar below.
 * Matches the NavBar logo exactly for bookend effect.
 */
export function Footer() {
  const nav = [
    {
      label: "Product",
      items: [
        { text: "How it works", href: "#how" },
        { text: "What you get", href: "#whatyouget" },
        { text: "Living profile", href: "#living" },
        { text: "Pricing", href: "#pricing" },
      ],
    },
    {
      label: "Science",
      items: [
        { text: "Risk models", href: "#whatyouget" },
        { text: "Dr. Tomas", href: "#whatyouget" },
        { text: "Biomarkers", href: "#whatyouget" },
        { text: "FAQ", href: "#faq" },
      ],
    },
    {
      label: "Company",
      items: [
        { text: "About", href: "#cta" },
        { text: "Contact", href: "mailto:hello@precura.se" },
        { text: "Press", href: "mailto:press@precura.se" },
        { text: "Careers", href: "mailto:jobs@precura.se" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.canvasSoft,
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
        padding: "88px 32px 40px 32px",
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Top: logo + columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 72,
          }}
          className="home17-footer-grid"
        >
          {/* Brand block */}
          <div>
            <Link
              href="#top"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: C.ink,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: C.terracotta,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.canvasSoft,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: C.ink,
                }}
              >
                Precura
              </span>
            </Link>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: C.inkMuted,
                margin: 0,
                marginBottom: 24,
                maxWidth: 320,
              }}
            >
              Predictive health for Sweden. One annual membership, one Swedish
              doctor, one living profile that updates every test.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: C.paper,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 12,
                maxWidth: 300,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.good,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: C.inkSoft,
                  lineHeight: 1.4,
                }}
              >
                Registered with IVO / GDPR compliant / EU data residency
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {nav.map((col) => (
            <div key={col.label}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.terracotta,
                  marginBottom: 18,
                }}
              >
                {col.label}
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
                  <li key={item.text}>
                    <Link
                      href={item.href}
                      style={{
                        fontSize: 14,
                        color: C.inkSoft,
                        textDecoration: "none",
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mid: Company info row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 48,
            padding: "32px 0",
            borderTop: `1px solid ${C.lineSoft}`,
            borderBottom: `1px solid ${C.lineSoft}`,
            marginBottom: 32,
          }}
          className="home17-footer-company"
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.inkFaint,
                marginBottom: 8,
              }}
            >
              Clinic
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.inkSoft,
                lineHeight: 1.5,
              }}
            >
              Precura Health AB
              <br />
              Birger Jarlsgatan 58, 114 29 Stockholm
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.inkFaint,
                marginBottom: 8,
              }}
            >
              Contact
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.inkSoft,
                lineHeight: 1.5,
              }}
            >
              hello@precura.se
              <br />
              Org.nr 559482-1173
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.inkFaint,
                marginBottom: 8,
              }}
            >
              Medical lead
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.inkSoft,
                lineHeight: 1.5,
              }}
            >
              Dr. Tomas Kurakovas, GP
              <br />
              Licensed by Socialstyrelsen
            </div>
          </div>
        </div>

        {/* Bottom: legal row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
          className="home17-footer-legal"
        >
          <div
            style={{
              fontSize: 12,
              color: C.inkFaint,
              letterSpacing: "0.01em",
            }}
          >
            / 2026 Precura Health AB. Made in Sweden.
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Terms", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "Data handling", href: "#" },
              { label: "Accessibility", href: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 12,
                  color: C.inkFaint,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home17-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          :global(.home17-footer-grid > div:first-child) {
            grid-column: 1 / -1 !important;
          }
          :global(.home17-footer-company) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          :global(.home17-footer-legal) {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
