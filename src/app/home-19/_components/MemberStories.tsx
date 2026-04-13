"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * MEMBER STORIES - "Stories from the first 2,000 members"
 *
 * NOT a star rating grid. Editorial story cards, each with a portrait,
 * a first-person paragraph, and a small tag that tells the reader what
 * Precura actually found for this person. Feels closer to Airbnb host
 * stories than to a SaaS testimonial wall.
 *
 * Layout: a big hero story on the left (Anna-like, with her photo and
 * a longer paragraph) and four smaller story cards to the right in a
 * 2x2 grid. Five people total, real-looking, Swedish names.
 */
export function MemberStories() {
  const hero = {
    name: "Karin, 46",
    city: "Gothenburg",
    photo: IMG.member1,
    found: "Pre-diabetes, caught 4 years early",
    story:
      "I thought I was healthy. Nothing hurt. But my fasting glucose had been creeping up since 2022 and nobody had said a word about it. Dr. Marcus pulled up my last four panels on our first call, showed me the slope, and told me exactly what a twenty minute walk after dinner would do to it. Two panels later my HbA1c was back in range. This is the first time I have felt like a doctor was actually on my side.",
  };

  const others = [
    {
      name: "Erik, 52",
      city: "Malmo",
      photo: IMG.member2,
      found: "High ApoB, cardiovascular risk flagged",
      story:
        "My lipid panel looked fine on paper. Precura measured ApoB and my 10-year cardiovascular risk jumped out of 'fine' immediately. My coach and Marcus built me a plan I actually stuck to.",
    },
    {
      name: "Sara, 38",
      city: "Uppsala",
      photo: IMG.member3,
      found: "Low iron, fixed in 3 months",
      story:
        "I had been exhausted for two years and every GP told me 'your bloods are normal'. Precura saw ferritin in the 20s and said, gently, this is why you feel like this. I have my energy back.",
    },
    {
      name: "Johan, 41",
      city: "Stockholm",
      photo: IMG.member4,
      found: "Vitamin D 38 nmol/L, supplement plan",
      story:
        "I like that the coach writes real workouts with real sets and reps, not 'get 10k steps'. Training feels like it has a purpose because it is tied to my blood work.",
    },
    {
      name: "Mikaela, 49",
      city: "Linkoping",
      photo: IMG.annaCoffee,
      found: "Thyroid flagged for retest",
      story:
        "I cancelled my Werlabs subscription the day I joined. Getting a PDF once a year was nothing compared to having Marcus read every panel and actually message me back.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 32px 120px",
        background: C.creamDeep,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            ...TYPE.label,
            color: C.coral,
            marginBottom: 16,
          }}
        >
          Member stories
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
            marginBottom: 56,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              ...TYPE.displayL,
              margin: 0,
              maxWidth: 820,
            }}
          >
            Stories from the{" "}
            <span
              style={{
                color: C.coral,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              first 2,000 members.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 380,
            }}
          >
            Five Swedes. Five very different data stories. One thing in common:
            somebody finally looked at the numbers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="home19-stories-grid"
        >
          {/* HERO STORY */}
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: C.paper,
              borderRadius: 28,
              border: `1px solid ${C.line}`,
              boxShadow: C.shadowLift,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 320,
                backgroundImage: `url(${hero.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
              }}
            />
            <div style={{ padding: "30px 34px 32px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 100,
                  background: C.coralSoft,
                  color: C.coralDeep,
                  ...TYPE.micro,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  marginBottom: 18,
                }}
              >
                {hero.found}
              </div>
              <Quote
                size={28}
                strokeWidth={2}
                style={{
                  color: C.coral,
                  marginBottom: 10,
                }}
              />
              <p
                style={{
                  ...TYPE.lead,
                  color: C.inkSoft,
                  margin: 0,
                  marginBottom: 24,
                  fontSize: "clamp(17px, 1.4vw, 20px)",
                  lineHeight: 1.55,
                }}
              >
                {hero.story}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 18,
                  borderTop: `1px solid ${C.lineSoft}`,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    backgroundImage: `url(${hero.photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: `1px solid ${C.line}`,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.ink,
                      letterSpacing: "-0.008em",
                    }}
                  >
                    {hero.name}
                  </div>
                  <div style={{ ...TYPE.small, color: C.inkMuted }}>
                    Member since 2025 / {hero.city}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>

          {/* 2x2 of smaller stories */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
            className="home19-stories-small"
          >
            {others.map((m, i) => (
              <motion.article
                key={m.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -3 }}
                style={{
                  background: C.paper,
                  borderRadius: 22,
                  border: `1px solid ${C.line}`,
                  boxShadow: C.shadow,
                  padding: "22px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    padding: "5px 11px",
                    borderRadius: 100,
                    background: C.sageSoft,
                    color: C.sageDeep,
                    ...TYPE.micro,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {m.found}
                </div>
                <p
                  style={{
                    ...TYPE.body,
                    color: C.inkSoft,
                    margin: 0,
                    lineHeight: 1.55,
                    flex: 1,
                  }}
                >
                  {m.story}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 14,
                    borderTop: `1px solid ${C.lineSoft}`,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundImage: `url(${m.photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: `1px solid ${C.line}`,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.ink,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {m.name}
                    </div>
                    <div style={{ ...TYPE.small, color: C.inkMuted }}>
                      {m.city}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            marginTop: 44,
            padding: "18px 24px",
            borderRadius: 100,
            background: C.paper,
            border: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.sage,
              boxShadow: `0 0 0 4px ${C.sageSoft}`,
            }}
          />
          <span
            style={{
              ...TYPE.small,
              color: C.inkSoft,
              fontWeight: 500,
            }}
          >
            2,000+ members across Sweden. Anonymised stories. Shared with
            permission.
          </span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1040px) {
          :global(.home19-stories-grid) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          :global(.home19-stories-small) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
