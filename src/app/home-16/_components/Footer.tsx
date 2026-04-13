"use client";

import React from "react";
import { COLORS, SYSTEM_FONT } from "./tokens";

/**
 * FOOTER
 *
 * Warm cream footer with logo, four column nav, company details, and
 * legal microcopy. Kept quiet and editorial. No emojis, no social
 * icons, no newsletter field, no tall visuals.
 */
export function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how-it-works" },
        { label: "What you get", href: "#what-you-get" },
        { label: "Pricing", href: "#pricing" },
        { label: "Member stories", href: "#members" },
      ],
    },
    {
      title: "Science",
      links: [
        { label: "Risk models", href: "#science" },
        { label: "Our doctor", href: "#science" },
        { label: "Clinical advisors", href: "#science" },
        { label: "Research library", href: "#science" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Contact", href: "mailto:hej@precura.se" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
        { label: "Data processing", href: "#dpa" },
        { label: "Cookie settings", href: "#cookies" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: COLORS.bgCream,
        fontFamily: SYSTEM_FONT,
        color: COLORS.ink,
        borderTop: `1px solid ${COLORS.line}`,
        padding: "80px 32px 40px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top row */}
        <div
          className="home16-footer-top"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
            gap: 40,
            paddingBottom: 56,
          }}
        >
          {/* Brand */}
          <div>
            <a
              href="#top"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: COLORS.ink,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: COLORS.coral,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                P
              </span>
              Precura
            </a>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 14,
                lineHeight: 1.6,
                color: COLORS.inkMuted,
                maxWidth: 320,
                fontWeight: 500,
              }}
            >
              A Swedish predictive health membership. Catch it ten years early,
              with a real doctor, a real coach, and a living health profile
              built on peer-reviewed science.
            </p>
            <div
              style={{
                fontSize: 13,
                color: COLORS.inkSoft,
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              <div style={{ color: COLORS.ink, fontWeight: 600 }}>
                Precura AB
              </div>
              <div>Sveavagen 44, 111 34 Stockholm</div>
              <div>Org.nr 559412-xxxx</div>
              <div>
                <a
                  href="mailto:hej@precura.se"
                  style={{ color: COLORS.coral, textDecoration: "none" }}
                >
                  hej@precura.se
                </a>
              </div>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: COLORS.inkMuted,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {col.title}
              </div>
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
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      style={{
                        color: COLORS.inkSoft,
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            width: "100%",
            background: COLORS.line,
          }}
        />

        {/* Bottom row */}
        <div
          className="home16-footer-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            paddingTop: 28,
            fontSize: 12,
            color: COLORS.inkMuted,
            fontWeight: 500,
          }}
        >
          <div>
            (c) 2026 Precura AB. All data stored in the EU. GDPR compliant.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span>Stockholm</span>
            <span style={{ color: COLORS.lineFaint }}>/</span>
            <span>Malmo</span>
            <span style={{ color: COLORS.lineFaint }}>/</span>
            <span>Gothenburg</span>
            <span style={{ color: COLORS.lineFaint }}>/</span>
            <span>Uppsala</span>
          </div>
          <div>
            Built in Stockholm. Reviewed by Dr. Marcus Johansson, Swedish GP.
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home16-footer-top) {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px 32px !important;
          }
        }
        @media (max-width: 600px) {
          :global(.home16-footer-top) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
