"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { C, SYSTEM_FONT, TYPE, MONO_FONT } from "./tokens";

/**
 * FOOTER
 *
 * Warm editorial footer on deep cream. Four columns: wordmark + address,
 * Product, Company, Legal. Below that a thin rule and a base strip with
 * a live Stockholm clock (mono font), the company registration line, and
 * a small "Made in Sweden" note.
 *
 * Mirrors the Airbnb-warm vocabulary. Hairlines for structure, no heavy
 * grey bars, no left-border accent decorations.
 */
export function Footer() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      try {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Europe/Stockholm",
        });
        setTime(formatter.format(d));
      } catch {
        const d = new Date();
        setTime(
          d.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const columns = [
    {
      title: "Product",
      items: [
        { label: "How it works", href: "#how" },
        { label: "Science", href: "#science" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About Precura", href: "#" },
        { label: "Dr. Marcus", href: "#science" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Data Protection (GDPR)", href: "#" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.creamDeep,
        fontFamily: SYSTEM_FONT,
        borderTop: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 32px 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
          className="home19-footer-grid"
        >
          {/* Wordmark column */}
          <div>
            <Link
              href="/home-19"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: C.coral,
                  display: "grid",
                  placeItems: "center",
                  color: C.paper,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.018em",
                }}
              >
                Precura
              </span>
            </Link>

            <p
              style={{
                ...TYPE.body,
                color: C.inkMuted,
                margin: 0,
                marginBottom: 22,
                maxWidth: 340,
                lineHeight: 1.55,
              }}
            >
              A preventive health membership for Sweden. Your own doctor, your
              own coach, and a living profile that watches the slope of your
              numbers.
            </p>

            <div
              style={{
                ...TYPE.small,
                color: C.inkFaint,
                lineHeight: 1.55,
              }}
            >
              Precura AB
              <br />
              Sveavagen 24
              <br />
              111 34 Stockholm, Sweden
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  ...TYPE.label,
                  color: C.ink,
                  marginBottom: 18,
                }}
              >
                {col.title}
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
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{
                        ...TYPE.small,
                        color: C.inkMuted,
                        textDecoration: "none",
                        fontWeight: 500,
                        transition: "color 0.2s ease",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          C.coralDeep;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          C.inkMuted;
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Base strip */}
        <div
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              ...TYPE.small,
              color: C.inkFaint,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span>(c) 2026 Precura AB</span>
            <span style={{ color: C.inkHairline }}>/</span>
            <span>Org.nr 559XXX-XXXX</span>
            <span style={{ color: C.inkHairline }}>/</span>
            <span>Legitimerad vard / Medical Director Dr. Marcus Johansson</span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 100,
              background: C.paper,
              border: `1px solid ${C.line}`,
              boxShadow: C.shadow,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: C.sage,
                boxShadow: `0 0 0 3px ${C.sageSoft}`,
              }}
            />
            <span
              style={{
                ...TYPE.micro,
                color: C.inkMuted,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Stockholm
            </span>
            <span
              style={{
                fontFamily: MONO_FONT,
                fontSize: 13,
                color: C.ink,
                fontWeight: 600,
                letterSpacing: "0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 920px) {
          :global(.home19-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 560px) {
          :global(.home19-footer-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
