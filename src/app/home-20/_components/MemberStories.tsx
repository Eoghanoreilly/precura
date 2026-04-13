"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * MEMBER STORIES - editorial "stories from the first 2,000 members".
 * Not a 5-star grid. Each story is a short, specific, human quote
 * with a tiny stat the member is proud of, in a warm card layout.
 */

type Story = {
  portrait: string;
  name: string;
  role: string;
  city: string;
  quote: string;
  pull: { label: string; value: string };
};

const STORIES: Story[] = [
  {
    portrait: IMG.member1,
    name: "Johanna L.",
    role: "Product designer",
    city: "Stockholm",
    quote:
      "My dad had a heart attack at 54. I always assumed I'd eventually do the same. Dr. Marcus looked at my lipids over three draws and said my trajectory is actually good, and here's what to change. For the first time I have a plan that is about ME, not about him.",
    pull: { label: "LDL change in 9 months", value: "3.4 to 2.7" },
  },
  {
    portrait: IMG.member2,
    name: "Erik S.",
    role: "Software engineer",
    city: "Gothenburg",
    quote:
      "I had been going to three different clinics for years. Nobody noticed my fasting glucose had moved from 5.1 to 5.9 over four years. Precura pulled it all in from 1177 and it was the first chart I ever saw of my own slope. I am now 5.4 and holding.",
    pull: { label: "Fasting glucose", value: "5.9 to 5.4" },
  },
  {
    portrait: IMG.member3,
    name: "Linda K.",
    role: "Nurse",
    city: "Malmo",
    quote:
      "I am a nurse and I still missed my own vitamin D deficiency for three winters in a row. My coach noticed it in my first panel and built a Nordic-diet plan around it. Sounds small. It changed how I feel on Monday mornings.",
    pull: { label: "Vitamin D", value: "32 to 74 nmol/L" },
  },
  {
    portrait: IMG.member4,
    name: "Peter A.",
    role: "Restaurant owner",
    city: "Uppsala",
    quote:
      "I kept putting off tests because I was afraid of what they'd say. Having someone like Marcus read them first, then explain them in a note I can actually understand, took the fear out of it. I test four times a year now. That is a sentence I never thought I would say.",
    pull: { label: "Tests per year", value: "0 to 4" },
  },
];

export function MemberStories() {
  return (
    <section
      style={{
        background: C.cream,
        padding: "140px 32px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
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
            gridTemplateColumns: "1.2fr 1fr",
            gap: 56,
            alignItems: "flex-end",
            marginBottom: 56,
          }}
          className="home20-stories-header"
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
              Member letters
            </div>
            <h2 style={{ ...TYPE.displayL, margin: 0, maxWidth: 720 }}>
              Stories from the first 2,000 members.
            </h2>
          </div>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 440,
            }}
          >
            We asked Precura members to write a paragraph about what
            actually changed. No stars, no scores. Just their own words.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 22,
          }}
          className="home20-stories-grid"
        >
          {STORIES.map((s, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                background: C.paper,
                borderRadius: 22,
                border: `1px solid ${C.lineFaint}`,
                padding: "32px 34px 30px",
                boxShadow: C.shadowSoft,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 50,
                    backgroundImage: `url(${s.portrait})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: `2px solid ${C.creamDeep}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      ...TYPE.body,
                      fontWeight: 600,
                      color: C.ink,
                      marginBottom: 2,
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      ...TYPE.small,
                      color: C.inkMuted,
                    }}
                  >
                    {s.role} / {s.city}
                  </div>
                </div>
              </div>

              <p
                style={{
                  ...TYPE.body,
                  color: C.inkSoft,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {s.quote}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 20,
                  borderTop: `1px solid ${C.lineFaint}`,
                  marginTop: "auto",
                }}
              >
                <div
                  style={{
                    ...TYPE.tiny,
                    color: C.inkFaint,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.pull.label}
                </div>
                <div
                  style={{
                    ...TYPE.h3,
                    fontSize: 18,
                    color: C.terra,
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {s.pull.value}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Small footer row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
          className="home20-stories-footer"
        >
          <div
            style={{
              ...TYPE.small,
              color: C.inkMuted,
              maxWidth: 560,
            }}
          >
            Members are quoted with permission. Lab numbers are self-reported
            and corroborated by their own Precura profile data.
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
            }}
          >
            <FooterStat v="2,041" l="active members" />
            <FooterStat v="8,164" l="blood panels run" />
            <FooterStat v="97%" l="renew annually" />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home20-stories-header) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          :global(.home20-stories-grid) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          :global(.home20-stories-footer) {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}

function FooterStat({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div
        style={{
          ...TYPE.h3,
          fontSize: 20,
          color: C.ink,
          margin: 0,
          fontWeight: 600,
        }}
      >
        {v}
      </div>
      <div
        style={{
          ...TYPE.tiny,
          color: C.inkFaint,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {l}
      </div>
    </div>
  );
}
