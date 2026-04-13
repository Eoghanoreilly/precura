"use client";

/**
 * MEMBER STORIES - "Stories from the first 2,000 members."
 * Borrows the framing directly from home-10 but re-renders it in
 * home-12's disciplined style. NOT a star-rating grid.
 *
 * Design: a large primary member panel on the left, a vertical index
 * rail on the right. Clicking any name in the rail swaps the panel.
 * Photographic, quiet, grown-up. Each story has a plain-English
 * "what changed" stat.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, FONT, MONO, TYPE, GRID, EASE, IMG } from "./tokens";

type Member = {
  name: string;
  role: string;
  age: number;
  city: string;
  since: string;
  image: string;
  highlight: string;
  quote: string;
  metric: { label: string; before: string; after: string; delta: string };
};

const MEMBERS: Member[] = [
  {
    name: "Lotta Svensson",
    role: "Account Director",
    age: 44,
    city: "Stockholm",
    since: "January 2026",
    image: IMG.member1,
    highlight: "Ten years of bloodwork, one chart",
    quote:
      "I had ten years of annual bloodwork from three different vardcentraler. Precura was the first place to stitch them into one chart. The rise in fasting glucose was obvious once I could see it on a single axis. Dr. Marcus called it a pre-diabetic trajectory. I changed two things in my training and one in my diet, and my panel six months later was already trending back.",
    metric: {
      label: "Fasting glucose",
      before: "5.9",
      after: "5.4",
      delta: "-0.5 / 6 months",
    },
  },
  {
    name: "Erik Lindqvist",
    role: "Teacher",
    age: 38,
    city: "Malmo",
    since: "February 2026",
    image: IMG.member2,
    highlight: "Caught a moderate cardiovascular risk",
    quote:
      "My mum was diagnosed with T2D at 60. I went to my GP, she said my numbers were fine. Precura ran SCORE2 on me and I was in the moderate cardiovascular band because my ApoB was high for my age. Dr. Marcus recommended a statin trial plus a metabolic training plan from coach Ellen. Six months in, my ApoB dropped from 1.1 to 0.78.",
    metric: {
      label: "ApoB",
      before: "1.1",
      after: "0.78",
      delta: "-30% / 6 months",
    },
  },
  {
    name: "Anja Bjornsson",
    role: "Product Designer",
    age: 35,
    city: "Goteborg",
    since: "January 2026",
    image: IMG.member3,
    highlight: "A real doctor's note, in writing",
    quote:
      "What I liked was the honesty. No miracle promises, no supplements list. The doctor's note on my results actually said my cholesterol was borderline and to retest in six months. That is exactly what I would expect from a real clinician. It is not performative longevity, it is primary care done properly.",
    metric: {
      label: "LDL-C",
      before: "3.3",
      after: "3.1",
      delta: "Stable, retest in 6m",
    },
  },
  {
    name: "Jonas Hedstrom",
    role: "Engineer",
    age: 52,
    city: "Uppsala",
    since: "March 2026",
    image: IMG.member4,
    highlight: "A coach who actually read the data",
    quote:
      "I had been getting generic training plans for years. Ellen, my Precura coach, built my current block from my real VO2, my resting heart rate trend and my HbA1c. First thing she did was cut my volume and rewrite the zones. Three months later my sleep was sharper, my glucose was lower, and my mood stabilised without me trying.",
    metric: {
      label: "HbA1c",
      before: "41",
      after: "37",
      delta: "-4 / 12 weeks",
    },
  },
];

export function MemberStories() {
  const [active, setActive] = useState(0);
  const m = MEMBERS[active];

  return (
    <section
      id="members"
      style={{
        background: C.graphite,
        color: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
            marginBottom: 56,
            alignItems: "flex-end",
          }}
        >
          <div style={{ gridColumn: "span 8" }} className="home12-ms-head">
            <div
              style={{
                ...TYPE.eyebrow,
                color: C.accent,
                marginBottom: 20,
              }}
            >
              08 / Members
            </div>
            <h2
              style={{
                ...TYPE.h2,
                margin: 0,
                color: C.paper,
              }}
            >
              Stories from the first{" "}
              <span style={{ color: C.accent, fontStyle: "italic" }}>
                2,000 members.
              </span>
            </h2>
          </div>
          <div
            style={{
              gridColumn: "span 4",
              ...TYPE.body,
              color: "rgba(250, 250, 247, 0.68)",
              margin: 0,
            }}
            className="home12-ms-sub"
          >
            Real members, in five Swedish cities, six months into their
            first annual membership. Click any name to read theirs.
          </div>
        </div>

        {/* Main layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: GRID.columnGap,
          }}
        >
          {/* Active story panel */}
          <div
            style={{
              gridColumn: "span 8",
              position: "relative",
            }}
            className="home12-ms-active"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.7, ease: EASE.out }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "5fr 7fr",
                  gap: 32,
                  background: C.graphiteSoft,
                  border: `1px solid ${C.lineDark}`,
                  borderRadius: 22,
                  overflow: "hidden",
                }}
                className="home12-ms-panel"
              >
                {/* Photo */}
                <div
                  style={{
                    position: "relative",
                    minHeight: 520,
                    background: C.slate,
                  }}
                  className="home12-ms-photo"
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "contrast(1.02)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(13,16,20,0) 40%, rgba(13,16,20,0.78) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 24,
                      left: 24,
                      right: 24,
                      color: C.paper,
                    }}
                  >
                    <div
                      style={{
                        ...TYPE.eyebrow,
                        color: C.accent,
                        marginBottom: 6,
                      }}
                    >
                      Precura member / age {m.age}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontSize: 24,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        color: C.paper,
                        lineHeight: 1.12,
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        ...TYPE.caption,
                        color: "rgba(250, 250, 247, 0.7)",
                        marginTop: 2,
                      }}
                    >
                      {m.role} / {m.city}
                    </div>
                  </div>
                </div>

                {/* Quote side */}
                <div
                  style={{
                    padding: "40px 36px 36px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                  }}
                  className="home12-ms-quote"
                >
                  <div
                    style={{
                      ...TYPE.eyebrow,
                      color: C.accent,
                    }}
                  >
                    {m.highlight}
                  </div>
                  <p
                    style={{
                      ...TYPE.lead,
                      color: "rgba(250, 250, 247, 0.88)",
                      margin: 0,
                      fontSize: "clamp(20px, 1.8vw, 24px)",
                      lineHeight: 1.45,
                    }}
                  >
                    "{m.quote}"
                  </p>

                  {/* Metric */}
                  <div
                    style={{
                      marginTop: "auto",
                      padding: "22px 24px",
                      background: "rgba(250, 250, 247, 0.04)",
                      border: `1px solid ${C.lineDark}`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          ...TYPE.eyebrow,
                          color: "rgba(250, 250, 247, 0.5)",
                          marginBottom: 6,
                        }}
                      >
                        {m.metric.label} / six months
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 14,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 34,
                            fontWeight: 500,
                            color: "rgba(250, 250, 247, 0.4)",
                            letterSpacing: "-0.02em",
                            textDecoration: "line-through",
                          }}
                        >
                          {m.metric.before}
                        </span>
                        <span
                          style={{
                            ...TYPE.eyebrow,
                            color: C.inkFaint,
                          }}
                        >
                          was
                        </span>
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 34,
                            fontWeight: 500,
                            color: C.paper,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {m.metric.after}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        ...TYPE.eyebrow,
                        color: C.accent,
                        padding: "6px 12px",
                        background: "rgba(201, 122, 61, 0.14)",
                        border: "1px solid rgba(201, 122, 61, 0.35)",
                        borderRadius: 100,
                      }}
                    >
                      {m.metric.delta}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Index rail */}
          <div
            style={{
              gridColumn: "span 4",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
            className="home12-ms-rail"
          >
            <div
              style={{
                ...TYPE.eyebrow,
                color: "rgba(250, 250, 247, 0.5)",
                marginBottom: 8,
                paddingBottom: 12,
                borderBottom: `1px solid ${C.lineDark}`,
              }}
            >
              All members
            </div>
            {MEMBERS.map((mm, i) => {
              const activeItem = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    textAlign: "left",
                    padding: "18px 20px",
                    background: activeItem ? C.paper : "transparent",
                    color: activeItem ? C.ink : C.paper,
                    border: `1px solid ${
                      activeItem ? C.paper : C.lineDark
                    }`,
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: FONT,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    transition: "all 240ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!activeItem)
                      e.currentTarget.style.background =
                        "rgba(250, 250, 247, 0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!activeItem)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        ...TYPE.eyebrow,
                        color: activeItem ? C.accent : "rgba(250, 250, 247, 0.5)",
                      }}
                    >
                      {mm.city} / age {mm.age}
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 10,
                        color: activeItem ? C.inkMuted : "rgba(250, 250, 247, 0.5)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 16,
                      fontWeight: 500,
                      color: activeItem ? C.ink : C.paper,
                      lineHeight: 1.22,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {mm.name}
                  </div>
                  <div
                    style={{
                      ...TYPE.caption,
                      color: activeItem ? C.inkMuted : "rgba(250, 250, 247, 0.55)",
                    }}
                  >
                    {mm.highlight}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-ms-head),
          :global(.home12-ms-sub),
          :global(.home12-ms-active),
          :global(.home12-ms-rail) {
            grid-column: span 12 !important;
          }
          :global(.home12-ms-rail) {
            margin-top: 24px;
          }
        }
        @media (max-width: 720px) {
          :global(.home12-ms-panel) {
            grid-template-columns: 1fr !important;
          }
          :global(.home12-ms-photo) {
            min-height: 320px !important;
          }
          :global(.home12-ms-quote) {
            padding: 32px 28px !important;
          }
        }
      `}</style>
    </section>
  );
}
