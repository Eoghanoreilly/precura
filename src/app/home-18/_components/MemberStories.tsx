"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, MapPin } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * MEMBER STORIES
 * --------------
 * "Stories from the first 2,000 members." Four realistic stories
 * (with names, ages, cities, and specific outcomes). No star-rating grid.
 * Layout: one feature card (Lotta - the hero story, large) + three more
 * cards arranged in a 3-column strip underneath on desktop.
 *
 * The feature card uses a 2-column layout (portrait + content). The
 * secondary cards are softer and column-shaped with a small portrait on top.
 */

const FEATURE = {
  name: "Lotta",
  age: 52,
  city: "Goteborg",
  img: IMG.memberLotta,
  tag: "Feature story",
  headline:
    '"My mother had diabetes. I never asked my GP to dig in. Precura did."',
  body:
    "Lotta's fasting glucose had been creeping up for four years. Each test came back with a smiley face from her GP. Her first Precura panel ran FINDRISC automatically. Dr. Marcus flagged her at moderate risk and built a six-month plan: post-dinner walks, one strength session a week, vitamin D. At her second panel her glucose had dropped 0.4 mmol/L.",
  stat: "0.4",
  statUnit: "mmol/L drop",
  statLabel: "Fasting glucose / 6 months",
};

const SECONDARY = [
  {
    name: "Erik",
    age: 38,
    city: "Malmo",
    img: IMG.memberErik,
    tag: "New father",
    quote:
      '"After my first kid, I stopped caring about myself. Precura gave me a plan I could actually stick to."',
    body:
      "Erik joined after his first child was born. His panel showed elevated ApoB and low vitamin D. His coach built a 20-minute lunchtime routine. He didn't want a gym, and he didn't have to. Three months in, his energy is back.",
    chipLabel: "ApoB trending down",
    chipColor: C.euc,
    chipBg: C.eucBg,
  },
  {
    name: "Anja",
    age: 46,
    city: "Uppsala",
    img: IMG.memberAnja,
    tag: "Family history",
    quote:
      '"I wanted to catch it before my mother\'s story became mine."',
    body:
      "Two women in Anja's family have had early heart events. She wanted to know where she stood. SCORE2 put her at low-moderate. Dr. Marcus prescribed a lipid-focused plan and quarterly retests. Her LDL is already down 0.3.",
    chipLabel: "SCORE2 / low-moderate",
    chipColor: C.amberDeep,
    chipBg: C.amberBg,
  },
  {
    name: "Johan",
    age: 61,
    city: "Stockholm",
    img: IMG.memberJohan,
    tag: "Lifelong athlete",
    quote:
      '"I train every day. I still wanted someone looking at the numbers."',
    body:
      "Johan runs marathons and eats well. He joined Precura because nobody was watching his bloodwork over time. His first panel caught a low ferritin. Coach adjusted his training, Dr. Marcus prescribed iron. Two months later he had his fastest 10k.",
    chipLabel: "Ferritin restored",
    chipColor: C.euc,
    chipBg: C.eucBg,
  },
];

export function MemberStories() {
  return (
    <section
      id="stories"
      style={{
        background: C.paper,
        padding: "120px 32px 120px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64, maxWidth: 780 }}
        >
          <div
            style={{
              ...TYPE.label,
              color: C.lingon,
              marginBottom: 20,
            }}
          >
            Stories from the first 2,000 members
          </div>
          <h2
            style={{
              ...TYPE.displayLarge,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Real people.{" "}
            <span style={{ color: C.inkMuted }}>Specific outcomes.</span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 620,
            }}
          >
            We track how our members actually change year over year. Here are
            four we're proud of. No averages, no marketing gloss.
          </p>
        </motion.div>

        {/* Feature story */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: C.cream,
            borderRadius: 28,
            overflow: "hidden",
            border: `1px solid ${C.inkLine}`,
            boxShadow: C.shadowCard,
            marginBottom: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: 0,
          }}
          className="home18-feature-story"
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "4/5",
              background: C.canvas,
              minHeight: 420,
            }}
            className="home18-feature-portrait"
          >
            <img
              src={FEATURE.img}
              alt={`${FEATURE.name}, Precura member`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7) 100%)",
              }}
            />
            {/* Stat chip */}
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                padding: "8px 14px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 100,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 600,
                color: C.lingon,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.lingon,
                }}
              />
              {FEATURE.tag}
            </div>
            {/* Caption */}
            <div
              style={{
                position: "absolute",
                left: 28,
                right: 28,
                bottom: 24,
                color: C.paper,
              }}
            >
              <div
                style={{
                  ...TYPE.label,
                  color: "rgba(255,255,255,0.78)",
                  marginBottom: 6,
                }}
              >
                Member / {FEATURE.city} / age {FEATURE.age}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {FEATURE.name}
              </div>
            </div>
          </div>

          {/* Story body */}
          <div
            style={{
              padding: 48,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 24,
            }}
            className="home18-feature-body"
          >
            <Quote size={32} color={C.lingon} />
            <h3
              style={{
                ...TYPE.displayMedium,
                margin: 0,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                color: C.ink,
              }}
            >
              {FEATURE.headline}
            </h3>
            <p
              style={{
                ...TYPE.lead,
                color: C.inkSoft,
                margin: 0,
              }}
            >
              {FEATURE.body}
            </p>

            {/* Headline stat */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 24px",
                background: C.paper,
                borderRadius: 18,
                border: `1px solid ${C.inkLine}`,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: C.euc,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {FEATURE.stat}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.ink,
                    lineHeight: 1.2,
                  }}
                >
                  {FEATURE.statUnit}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.inkMuted,
                    lineHeight: 1.4,
                    marginTop: 4,
                  }}
                >
                  {FEATURE.statLabel}
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Secondary stories */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="home18-stories-grid"
        >
          {SECONDARY.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.8,
                delay: 0.08 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              style={{
                background: C.paper,
                borderRadius: 24,
                overflow: "hidden",
                border: `1px solid ${C.inkLine}`,
                boxShadow: C.shadowCard,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s",
              }}
            >
              {/* Portrait */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "5/3",
                  background: C.canvas,
                }}
              >
                <img
                  src={s.img}
                  alt={`${s.name}, Precura member`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    padding: "6px 12px",
                    background: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                >
                  {s.tag}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.name}, {s.age}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: C.inkMuted,
                    }}
                  >
                    <MapPin size={11} />
                    {s.city}
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.45,
                    color: C.ink,
                    margin: "0 0 14px",
                    fontWeight: 500,
                    fontStyle: "italic",
                  }}
                >
                  {s.quote}
                </p>
                <p
                  style={{
                    ...TYPE.body,
                    color: C.inkSoft,
                    margin: "0 0 20px",
                    flex: 1,
                  }}
                >
                  {s.body}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    background: s.chipBg,
                    color: s.chipColor,
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: s.chipColor,
                    }}
                  />
                  {s.chipLabel}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.home18-feature-story) {
            grid-template-columns: 1fr !important;
          }
          :global(.home18-feature-body) {
            padding: 32px !important;
          }
          :global(.home18-feature-portrait) {
            aspect-ratio: 16/10 !important;
            min-height: 320px !important;
          }
          :global(.home18-stories-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
