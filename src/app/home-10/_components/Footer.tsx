"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FOOTER - Minimal but considered. Giant "Precura" wordmark anchored
 * to the bottom edge + tidy grid of nav columns. Time in Stockholm
 * updates live.
 */
export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const parts = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d);
      setTime(parts);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const columns = [
    {
      title: "Product",
      items: [
        { label: "The method", href: "#how" },
        { label: "Pricing", href: "#pricing" },
        { label: "Risk models", href: "#science" },
        { label: "Sample profile", href: "/v2/health" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "#" },
        { label: "Clinical team", href: "#science" },
        { label: "Press", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "FAQ", href: "#" },
        { label: "Contact a doctor", href: "#" },
        { label: "Lab locations", href: "#" },
        { label: "Help center", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "GDPR", href: "#" },
        { label: "Patientdatalagen", href: "#" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: C.ink,
        color: C.cream,
        padding: "100px 32px 40px",
        fontFamily: SYSTEM_FONT,
        borderTop: "1px solid rgba(245,239,228,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(4, 1fr)",
            gap: 40,
            paddingBottom: 80,
            borderBottom: "1px solid rgba(245,239,228,0.08)",
          }}
          className="home10-footer-grid"
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: C.cream,
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              Precura
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 50,
                  background: C.amber,
                }}
              />
            </div>
            <p
              style={{
                ...TYPE.small,
                color: C.inkFaint,
                margin: 0,
                marginBottom: 24,
                maxWidth: 320,
              }}
            >
              A predictive health platform built in Sweden. See your trajectory
              decades before it becomes a diagnosis.
            </p>
            <div
              style={{
                ...TYPE.mono,
                color: C.inkFaint,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: 50,
                  background: C.sage,
                }}
              />
              STOCKHOLM {time || "00:00:00"}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  ...TYPE.mono,
                  color: C.inkFaint,
                  marginBottom: 16,
                }}
              >
                {col.title.toUpperCase()}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      style={{
                        ...TYPE.small,
                        color: C.creamDeep,
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Massive wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            paddingTop: 80,
            paddingBottom: 40,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(80px, 18vw, 260px)",
              fontWeight: 500,
              letterSpacing: "-0.06em",
              color: C.cream,
              lineHeight: 0.85,
            }}
          >
            Precura
          </div>
          <div
            style={{
              ...TYPE.mono,
              color: C.amber,
              marginTop: 24,
            }}
          >
            Pre. Not post.
          </div>
        </motion.div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 32,
            borderTop: "1px solid rgba(245,239,228,0.08)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            (c) 2026 Precura AB / Org. 559XXX-XXXX
          </div>
          <div style={{ ...TYPE.mono, color: C.inkFaint }}>
            MADE WITH CARE IN SWEDEN
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.home10-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          :global(.home10-footer-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
