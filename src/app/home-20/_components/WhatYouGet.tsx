"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, UserRound, MessageCircle, Activity, Sparkles, CalendarClock } from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * WHAT YOU GET - deeper explanation of each hero perk. An accordion-like
 * list of warm, wide cards. Clicking expands a detail panel showing what's
 * actually inside. Not the hero grid - this is the "now let me explain
 * each one" section.
 */

type Detail = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  bullets: string[];
  badge: string;
};

const DETAILS: Detail[] = [
  {
    icon: UserRound,
    title: "A personal Swedish doctor",
    subtitle: "Dr. Marcus Johansson personally reviews every result",
    bullets: [
      "Karolinska-trained GP, 15+ years in Swedish primary care",
      "A written plain-English note with every blood panel",
      "Messaging through the app, typically answered within 24h",
      "Referrals to Swedish specialists when needed",
    ],
    badge: "Internal medicine",
  },
  {
    icon: Droplets,
    title: "Four blood tests a year",
    subtitle: "22 biomarkers drawn at any Swedish lab, every quarter",
    bullets: [
      "HbA1c, fasting glucose, fasting insulin",
      "Full lipid panel (TC, HDL, LDL, triglycerides)",
      "Liver, kidney, thyroid, inflammation",
      "Vitamin D, Vitamin B12, ferritin",
    ],
    badge: "22 markers",
  },
  {
    icon: Activity,
    title: "Your training plan",
    subtitle: "Built around your blood work, by a certified trainer",
    bullets: [
      "Real exercises, sets, reps and progression",
      "Adjusted to your risk profile and lab numbers",
      "Reviewed by your doctor",
      "Not generic 'exercise more' advice",
    ],
    badge: "Progressive",
  },
  {
    icon: MessageCircle,
    title: "An active coach",
    subtitle: "A real human who checks in monthly",
    bullets: [
      "Assigned coach, not a chatbot",
      "Monthly check-in call or message",
      "Nudges based on your trajectory",
      "Holds you accountable without nagging",
    ],
    badge: "Human",
  },
  {
    icon: Sparkles,
    title: "AI chat with your data",
    subtitle: "Ask anything, answered from your own history",
    bullets: [
      "Knows your 5-year trajectory on every marker",
      "Explains results in plain Swedish or English",
      "Suggests questions to ask your doctor",
      "Never sold, never trained on your data",
    ],
    badge: "Always on",
  },
  {
    icon: CalendarClock,
    title: "A living profile",
    subtitle: "One page that evolves with you, forever",
    bullets: [
      "Every marker, every risk model, one canvas",
      "Family history, medications, vaccinations",
      "Export as FHIR any time",
      "Delete with one click, any time",
    ],
    badge: "Yours",
  },
];

export function WhatYouGet() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="included"
      style={{
        background: C.creamWarm,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 48,
            alignItems: "flex-end",
            marginBottom: 56,
          }}
          className="home20-wyg-header"
        >
          <div>
            <div
              style={{
                ...TYPE.mono,
                color: C.terra,
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Every perk, explained
            </div>
            <h2 style={{ ...TYPE.displayL, margin: 0 }}>
              What is actually inside your membership.
            </h2>
          </div>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 420,
            }}
          >
            Click any item to see what's in the box. Everything listed here
            is included in the Member tier.
          </p>
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {DETAILS.map((d, i) => {
            const isOpen = open === i;
            const Icon = d.icon;
            return (
              <motion.button
                key={i}
                onClick={() => setOpen(isOpen ? -1 : i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  textAlign: "left",
                  padding: "26px 30px",
                  background: isOpen ? C.paper : "rgba(255,255,255,0.6)",
                  border: `1px solid ${isOpen ? C.line : C.lineFaint}`,
                  borderRadius: 22,
                  cursor: "pointer",
                  fontFamily: SYSTEM_FONT,
                  color: C.ink,
                  transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
                  boxShadow: isOpen ? C.shadowSoft : "none",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr auto",
                    gap: 20,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: isOpen ? C.terraHaze : C.creamSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.4s",
                    }}
                  >
                    <Icon size={22} color={isOpen ? C.terra : C.inkSoft} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div
                      style={{
                        ...TYPE.h3,
                        margin: 0,
                        color: C.ink,
                      }}
                    >
                      {d.title}
                    </div>
                    <div
                      style={{
                        ...TYPE.small,
                        color: C.inkMuted,
                        marginTop: 2,
                      }}
                    >
                      {d.subtitle}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span
                      style={{
                        ...TYPE.tiny,
                        padding: "5px 11px",
                        borderRadius: 100,
                        background: C.sageHaze,
                        color: C.sageDeep,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                      className="home20-wyg-badge"
                    >
                      {d.badge}
                    </span>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 50,
                        border: `1px solid ${isOpen ? C.terra : C.line}`,
                        background: isOpen ? C.terra : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.4s",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{
                          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                        }}
                      >
                        <path
                          d="M7 1.5v11M1.5 7h11"
                          stroke={isOpen ? C.cream : C.inkSoft}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? 22 : 0,
                  }}
                  transition={{
                    height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.3 },
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      paddingLeft: 72,
                      paddingTop: 4,
                      borderTop: isOpen ? `1px solid ${C.lineFaint}` : "none",
                      paddingBottom: 4,
                    }}
                  >
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginTop: 18,
                      }}
                      className="home20-wyg-bullets"
                    >
                      {d.bullets.map((b, j) => (
                        <li
                          key={j}
                          style={{
                            ...TYPE.small,
                            color: C.inkSoft,
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 50,
                              background: C.terra,
                              marginTop: 8,
                              flexShrink: 0,
                            }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.home20-wyg-header) {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            align-items: flex-start !important;
          }
          :global(.home20-wyg-badge) {
            display: none !important;
          }
          :global(.home20-wyg-bullets) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
