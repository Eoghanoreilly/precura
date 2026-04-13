"use client";

import React from "react";
import Link from "next/link";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FOOTER - warm ink background. Logo, product nav, company info,
 * legal links, a small language switch. Quiet and honest.
 */

const COLUMNS = [
  {
    heading: "Membership",
    links: [
      { label: "What you get", href: "#included" },
      { label: "How it works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
      { label: "For families", href: "#pricing" },
    ],
  },
  {
    heading: "Science",
    links: [
      { label: "Clinical models", href: "#science" },
      { label: "Dr. Marcus", href: "#science" },
      { label: "Blood panels", href: "#included" },
      { label: "Living profile", href: "#included" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
      { label: "Data processing", href: "#" },
      { label: "Medical disclaimer", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: C.ink,
        color: C.creamSoft,
        padding: "88px 32px 40px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
            gap: 48,
            marginBottom: 72,
          }}
          className="home20-footer-grid"
        >
          {/* Brand */}
          <div>
            <Link
              href="/home-20"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: C.creamSoft,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: C.terra,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.creamSoft,
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: C.creamSoft,
                }}
              >
                Precura
              </span>
            </Link>
            <p
              style={{
                ...TYPE.small,
                color: "rgba(246,241,232,0.6)",
                margin: 0,
                marginBottom: 22,
                maxWidth: 280,
                lineHeight: 1.55,
              }}
            >
              A Swedish predictive health subscription. One doctor, one
              coach, four blood tests a year, one profile that remembers
              you.
            </p>
            <div
              style={{
                ...TYPE.tiny,
                color: "rgba(246,241,232,0.5)",
                textTransform: "none",
                letterSpacing: 0,
                lineHeight: 1.7,
              }}
            >
              Precura Health AB
              <br />
              Storgatan 12, 114 51 Stockholm
              <br />
              Org.nr 559412-8821
              <br />
              hello@precura.se
            </div>
          </div>

          {/* Nav columns */}
          {COLUMNS.map((col, i) => (
            <div key={i}>
              <div
                style={{
                  ...TYPE.tiny,
                  color: C.peach,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 18,
                  fontWeight: 600,
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
                  gap: 11,
                }}
              >
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link
                      href={l.href}
                      style={{
                        ...TYPE.small,
                        color: "rgba(246,241,232,0.72)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      className="home20-footer-link"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 18,
            paddingTop: 32,
            borderTop: `1px solid rgba(246,241,232,0.1)`,
          }}
          className="home20-footer-bottom"
        >
          <div
            style={{
              ...TYPE.tiny,
              color: "rgba(246,241,232,0.5)",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            Copyright 2026 Precura Health AB. All data hosted in Stockholm
            on GDPR-compliant EU infrastructure.
          </div>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
            }}
          >
            <LangChip label="Svenska" active={false} />
            <LangChip label="English" active />
            <div
              style={{
                width: 1,
                height: 14,
                background: "rgba(246,241,232,0.18)",
              }}
            />
            <Link
              href="#"
              style={{
                ...TYPE.tiny,
                color: "rgba(246,241,232,0.5)",
                textTransform: "none",
                letterSpacing: 0,
                textDecoration: "none",
              }}
            >
              Status
            </Link>
            <Link
              href="#"
              style={{
                ...TYPE.tiny,
                color: "rgba(246,241,232,0.5)",
                textTransform: "none",
                letterSpacing: 0,
                textDecoration: "none",
              }}
            >
              Press kit
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 600px) {
          :global(.home20-footer-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.home20-footer-bottom) {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }
        :global(.home20-footer-link):hover {
          color: ${C.peach} !important;
        }
      `}</style>
    </footer>
  );
}

function LangChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      style={{
        ...TYPE.tiny,
        color: active ? C.creamSoft : "rgba(246,241,232,0.5)",
        fontWeight: active ? 600 : 500,
        textTransform: "none",
        letterSpacing: 0,
      }}
    >
      {label}
    </span>
  );
}
