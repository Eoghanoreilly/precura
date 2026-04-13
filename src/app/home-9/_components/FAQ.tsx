"use client";

/**
 * FAQ. A stack of 6 questions with interactive open/close, laid over a slow
 * background. Each question block has a subtle y transform so the stack
 * breathes as the user scrolls past it.
 */

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { C, FONT, SIZE, IMG } from "./tokens";
import { useSectionScroll, useParallaxY, SplitReveal } from "./parallax";

const FAQS = [
  {
    q: "Is Precura a replacement for my GP?",
    a: "No. Precura is an additive layer. Your GP at your vardcentral handles acute care and anything Precura flags. We share your profile with them if you want, and Dr. Johansson writes referrals when clinically indicated. Think of Precura as the continuous record nobody else keeps.",
  },
  {
    q: "Where is my blood actually drawn?",
    a: "We partner with 18 labs across Sweden, including sites in Stockholm, Goteborg, Malmo, Uppsala and Lund. You walk in, the sample is drawn, and analysis runs at Karolinska University Laboratory with the same equipment Swedish hospitals use.",
  },
  {
    q: "What exactly is a \"validated clinical risk model\"?",
    a: "A published equation, trained on a population cohort and peer-reviewed, that turns inputs like age, blood pressure and cholesterol into a number (usually a 10 year event risk). FINDRISC, SCORE2 and FRAX are the three we use. A Swedish GP uses them every day in primary care. They are not AI; they are old-school biostatistics.",
  },
  {
    q: "How is this different from Werlabs?",
    a: "Werlabs sells you a blood panel and a PDF. Precura sells you the same panel plus a living profile, a named GP you can message, a risk model that recomputes every test, and a training plan. The single-panel price is actually lower than Werlabs' most popular panel.",
  },
  {
    q: "Who owns my data?",
    a: "You do. Precura is the data controller under GDPR but you can export a full FHIR bundle at any time, share it with any 1177-connected service, and delete your account and all derived data with one click.",
  },
  {
    q: "Can Precura diagnose me with anything?",
    a: "No. Precura surfaces patterns and estimates risk. A diagnosis can only come from a licensed clinician. Dr. Johansson and the Precura care team can write referrals for formal workups (OGTT, echocardiogram, DXA scan) when the profile indicates it.",
  },
];

function FAQItem({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        borderTop: `1px solid ${C.rule}`,
        paddingTop: 0,
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          background: "transparent",
          border: "none",
          padding: "clamp(24px, 3vw, 40px) 0",
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 40,
          cursor: "pointer",
          textAlign: "left",
          color: C.ink,
          fontFamily: FONT.ui,
        }}
      >
        <div style={{ display: "flex", gap: "clamp(16px, 2vw, 32px)", flex: 1 }}>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: SIZE.small,
              color: C.terracotta,
              letterSpacing: "0.1em",
              minWidth: "4ch",
              paddingTop: 6,
            }}
          >
            0{index + 1}.
          </span>
          <span
            style={{
              fontSize: SIZE.h3,
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              flex: 1,
            }}
          >
            {faq.q}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 28,
            height: 28,
            flexShrink: 0,
            position: "relative",
            marginTop: 8,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: C.ink,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              background: C.ink,
            }}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingBottom: "clamp(24px, 3vw, 40px)",
                paddingLeft: "clamp(20px, 3vw, 52px)",
                fontSize: SIZE.lead,
                color: C.textSecondary,
                lineHeight: 1.6,
                maxWidth: "68ch",
                fontWeight: 300,
              }}
            >
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress, reduceMotion } = useSectionScroll(ref);
  const bgY = useParallaxY(scrollYProgress, [-40, 100], reduceMotion);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const listY = useParallaxY(scrollYProgress, [40, -40], reduceMotion);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "160vh",
        width: "100%",
        overflow: "hidden",
        background: C.cream,
        fontFamily: FONT.ui,
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          y: bgY,
          scale: bgScale,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-10%",
            backgroundImage: `url(${IMG.stockholm})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.9) contrast(1.05)",
            opacity: 0.1,
          }}
        />
      </motion.div>

      <div
        style={{
          position: "relative",
          padding: "clamp(80px, 10vw, 160px) clamp(24px, 6vw, 100px)",
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "clamp(24px, 3vw, 48px)",
        }}
      >
        {/* Header column */}
        <div
          style={{
            gridColumn: "1 / span 4",
            position: "sticky",
            top: 120,
            alignSelf: "start",
          }}
        >
          <div
            style={{
              fontSize: SIZE.eyebrow,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: "clamp(24px, 3vw, 40px)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: FONT.mono,
            }}
          >
            <span>/ 08</span>
            <span
              style={{
                height: 1,
                flex: 1,
                maxWidth: 100,
                background: C.rule,
              }}
            />
            <span>FAQ</span>
          </div>
          <h2
            style={{
              fontSize: SIZE.h1,
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: 0,
              maxWidth: "14ch",
            }}
          >
            <SplitReveal text="What people" />
            <br />
            <SplitReveal text="ask us" delay={0.15} />
            <br />
            <SplitReveal
              text="most often."
              delay={0.3}
              style={{ color: C.terracotta, fontStyle: "italic" }}
            />
          </h2>
          <p
            style={{
              fontSize: SIZE.small,
              color: C.textMuted,
              marginTop: 32,
              maxWidth: "28ch",
              lineHeight: 1.55,
              fontFamily: FONT.mono,
              letterSpacing: "0.02em",
            }}
          >
            Still curious? Message Dr. Johansson on the contact page. He
            answers before he starts his clinic in the morning.
          </p>
        </div>

        {/* FAQ list */}
        <motion.div
          style={{
            gridColumn: "5 / span 8",
            y: listY,
          }}
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.q}
              faq={faq}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
          <div style={{ borderTop: `1px solid ${C.rule}` }} />
        </motion.div>
      </div>
    </section>
  );
}
