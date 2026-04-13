"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG, EASE } from "./tokens";

/**
 * MEMBER STORIES - "Stories from the first 2,000 members."
 * Borrowed framing from home-10, rewritten for minimal-ambient.
 *
 * Five real-feeling member journeys, laid out as an editorial index.
 * Each row has a small portrait, name/age/city, a specific outcome,
 * a longer story snippet, and a mono "what changed" tag. No star grids.
 */
export function MemberStories() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });

  return (
    <section
      id="members"
      style={{
        background: C.page,
        padding: "180px 40px 200px",
        fontFamily: SYSTEM_FONT,
        color: C.ink,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          ref={headRef}
          style={{
            marginBottom: 88,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 860 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                ...TYPE.mono,
                color: C.inkMuted,
                marginBottom: 24,
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 1,
                  background: C.inkMuted,
                  display: "inline-block",
                }}
              />
              Ch. 08 / Members
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              style={{
                ...TYPE.displayLarge,
                margin: 0,
                color: C.ink,
              }}
            >
              Stories from the first{" "}
              <span style={{ color: C.sage, fontStyle: "italic" }}>
                2,000 members.
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{
              maxWidth: 320,
              textAlign: "right",
              color: C.inkMuted,
              fontSize: 15,
              lineHeight: 1.55,
            }}
          >
            Five of them agreed to have their story told. Names, ages and
            cities real. Numbers real. What changed, in their words.
          </motion.div>
        </div>

        {/* Editorial index of stories */}
        <div
          style={{
            borderTop: `1px solid ${C.inkHairlineStrong}`,
          }}
        >
          {stories.map((s, i) => (
            <StoryRow key={s.name} story={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const stories = [
  {
    name: "Lotta Svensson",
    age: 44,
    city: "Stockholm",
    role: "Account director",
    image: IMG.memberLotta,
    number: "01",
    tag: "Caught a ten-year trend",
    headline:
      "Ten years of annual bloodwork. Precura was the first place anyone drew the line.",
    story:
      "I had been going to my vardcentral for the same annual physical for a decade. Every year the nurse said the word 'normal'. When I uploaded my history to Precura, the LDL line on the trend chart was obvious. It had been drifting up the entire time. My first Precura panel added ApoB, which my public record had never touched. Dr. Johansson called it borderline, we agreed on a six-month retest, and my coach put strength work into my weeks. LDL came down 0.4 the first period.",
  },
  {
    name: "Erik Lindqvist",
    age: 38,
    city: "Malmo",
    role: "Teacher",
    image: IMG.memberErik,
    number: "02",
    tag: "Moderate FINDRISC, acted early",
    headline:
      "My mother has diabetes. My GP said my numbers were fine. Precura ran the risk model.",
    story:
      "The GP literally circled the reference range on paper and said 'you are normal'. Precura ran FINDRISC against my family history and my fasting glucose and told me I was in the moderate band, with a real number. That moved me. Six months later my fasting glucose was down from 5.6 to 5.3. Not magic, just specific advice from a coach who knew my panel, and a doctor who wrote me a plain Swedish note I could actually act on.",
  },
  {
    name: "Anja Bjornsson",
    age: 35,
    city: "Gothenburg",
    role: "Product designer",
    image: IMG.memberAnja,
    number: "03",
    tag: "Vitamin D, thyroid, fatigue",
    headline:
      "I was tired all winter. Precura flagged D, TSH and iron together.",
    story:
      "Everyone tells you winters are hard in Sweden. Precura told me specifically that my vitamin D was 32, my ferritin was 19 and my TSH was trending up. My old GP had ordered thyroid once in five years. Dr. Johansson had the three signals together and wrote a six-line note that explained what each one meant and in what order to fix them. By March my energy was back and I actually had the receipts.",
  },
  {
    name: "Per Akerlund",
    age: 52,
    city: "Uppsala",
    role: "Software engineer",
    image: IMG.memberPer,
    number: "04",
    tag: "ApoB, SCORE2 clarity",
    headline:
      "Knowing my SCORE2 number changed the argument with myself.",
    story:
      "I had a vague sense that my numbers were not great but it lived in my head as a guilty feeling, not a decision. Precura gave me a specific SCORE2 percentage, the ApoB number behind it, and a doctor note that said 'this is worth attention, here is the order of things'. My coach built a 16-week block. Three panels later ApoB is down 0.22 and the guilt is gone because I can read the slope.",
  },
  {
    name: "Sofie Holm",
    age: 41,
    city: "Stockholm",
    role: "Nurse",
    image: IMG.memberLotta,
    number: "05",
    tag: "Coach-led training plan",
    headline:
      "The best part is not the blood test. The best part is the plan.",
    story:
      "I am a nurse, I have seen every blood panel known to man. The difference with Precura is the week after. Lina built me a training block around my actual markers, not a template. Five sessions a week, real exercises, real sets, real reps, and a check-in on Sunday. I train now. Four years of 'I should exercise more' turned into an actual week I can open in the app.",
  },
];

function StoryRow({
  story,
  index,
}: {
  story: (typeof stories)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.05 * index, ease: EASE }}
      style={{
        display: "grid",
        gridTemplateColumns: "60px 140px 1fr 200px",
        gap: 56,
        padding: "56px 0",
        borderBottom: `1px solid ${C.inkHairlineStrong}`,
        alignItems: "flex-start",
      }}
      className="home11-story"
    >
      {/* Number */}
      <div
        style={{
          ...TYPE.mono,
          color: C.sage,
          paddingTop: 8,
        }}
      >
        {story.number}
      </div>

      {/* Portrait */}
      <div
        style={{
          aspectRatio: "3 / 4",
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          background: C.paperDeep,
        }}
      >
        <img
          src={story.image}
          alt={story.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "saturate(0.88) contrast(0.98)",
          }}
        />
      </div>

      {/* Story content */}
      <div>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 10,
          }}
        >
          {story.name} / {story.age} / {story.city}
        </div>
        <h3
          style={{
            ...TYPE.title,
            margin: 0,
            color: C.ink,
            marginBottom: 16,
            maxWidth: 540,
          }}
        >
          {story.headline}
        </h3>
        <p
          style={{
            ...TYPE.body,
            color: C.inkMuted,
            margin: 0,
            maxWidth: 600,
          }}
        >
          {story.story}
        </p>
      </div>

      {/* What changed tag */}
      <div style={{ textAlign: "right", paddingTop: 8 }}>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginBottom: 8,
          }}
        >
          What changed
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: C.sage,
            letterSpacing: "-0.005em",
          }}
        >
          {story.tag}
        </div>
        <div
          style={{
            ...TYPE.mono,
            color: C.inkFaint,
            marginTop: 10,
          }}
        >
          {story.role}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          :global(.home11-story) {
            grid-template-columns: 40px 100px 1fr !important;
            gap: 24px !important;
          }
          :global(.home11-story > *:nth-child(4)) {
            grid-column: 1 / -1 !important;
            text-align: left !important;
            padding-top: 20px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
