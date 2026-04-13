"use client";

import React from "react";
import Link from "next/link";
import { AtSign, Share2, Mail, MapPin, Globe, Send } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * FOOTER
 * ------
 * Paper surface (keeps the warm tone), four columns of nav, a company
 * info block with address and email, social icons, and a thin legal
 * bottom bar. Matches the NavBar logo treatment for continuity.
 */

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "What you get", href: "#" },
      { label: "Pricing", href: "#pricing" },
      { label: "Take a tour", href: "#" },
      { label: "Member stories", href: "#stories" },
    ],
  },
  {
    title: "Science",
    links: [
      { label: "Risk models", href: "#" },
      { label: "Dr. Marcus Johansson", href: "#" },
      { label: "Clinic partners", href: "#" },
      { label: "Published research", href: "#" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Precura", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press kit", href: "#" },
      { label: "Contact", href: "#" },
      { label: "For clinicians", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Book a call", href: "#" },
      { label: "Members login", href: "#" },
      { label: "Cancel membership", href: "#" },
      { label: "Data export (FHIR)", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: C.paper,
        borderTop: `1px solid ${C.inkLine}`,
        padding: "80px 32px 40px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
            gap: 48,
            marginBottom: 64,
          }}
          className="home18-footer-grid"
        >
          {/* Brand + address */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `linear-gradient(145deg, ${C.lingon} 0%, ${C.lingonDeep} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.paper,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: C.lingon,
                }}
              >
                precura
              </span>
            </Link>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: C.inkSoft,
                margin: "0 0 24px",
                maxWidth: 320,
              }}
            >
              Preventive health, reimagined for Sweden. Book a panel, meet
              your doctor, build your profile. Cancel anytime.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 24,
              }}
            >
              <FooterMeta
                icon={<MapPin size={13} />}
                text="Sveavagen 42 / 111 34 Stockholm / Sweden"
              />
              <FooterMeta
                icon={<Mail size={13} />}
                text="hej@precura.se"
              />
              <FooterMeta
                icon={<Globe size={13} />}
                text="Available across Sweden"
              />
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 10 }}>
              <SocialIcon label="Social">
                <AtSign size={16} />
              </SocialIcon>
              <SocialIcon label="Share">
                <Share2 size={16} />
              </SocialIcon>
              <SocialIcon label="Newsletter">
                <Send size={16} />
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
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
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: 14,
                        color: C.inkMuted,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = C.ink;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = C.inkMuted;
                      }}
                    >
                      {link.label}
                    </a>
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
            paddingTop: 28,
            borderTop: `1px solid ${C.inkLine}`,
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: C.inkMuted,
              lineHeight: 1.55,
            }}
          >
            Copyright 2026 Precura AB / Org.nr 559482-0000. All rights
            reserved.
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <FooterLegal>Privacy policy</FooterLegal>
            <FooterLegal>Terms of service</FooterLegal>
            <FooterLegal>Cookie preferences</FooterLegal>
            <FooterLegal>Data processing agreement</FooterLegal>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home18-footer-grid) {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 560px) {
          :global(.home18-footer-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterMeta({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        color: C.inkMuted,
      }}
    >
      <span style={{ color: C.inkFaint, display: "flex", alignItems: "center" }}>
        {icon}
      </span>
      {text}
    </div>
  );
}

function SocialIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: C.canvas,
        border: `1px solid ${C.inkLine}`,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.ink;
        e.currentTarget.style.color = C.paper;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = C.canvas;
        e.currentTarget.style.color = C.ink;
      }}
    >
      {children}
    </button>
  );
}

function FooterLegal({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      style={{
        fontSize: 12,
        color: C.inkMuted,
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = C.ink;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = C.inkMuted;
      }}
    >
      {children}
    </a>
  );
}
