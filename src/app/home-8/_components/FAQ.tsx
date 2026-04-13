"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, fontStack, easing } from "./tokens";

/**
 * FAQ - 6 animated accordion questions. Real concerns, real answers.
 */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const questions = [
    {
      q: "Does Precura diagnose me with anything?",
      a: "No. Precura is not a clinic and does not replace your vardcentral. We surface risk, trajectory and context that your GP can use. If we see anything that crosses a clinical threshold, Dr. Johansson refers you into the Swedish healthcare system with a full report so you don't have to start from zero.",
    },
    {
      q: "How is this different from Werlabs?",
      a: "Werlabs is a blood test company. They give you a PDF with values and reference ranges and that's where it ends. Precura is a predictive health platform. Same blood draw, but with five years of your history in view, three risk models run on top, a named doctor's written review, and a 12 month plan you can actually follow.",
    },
    {
      q: "Where are the clinics?",
      a: "Partner blood draw clinics in Stockholm (3 sites), Goteborg, Malmo, Uppsala and Lund at launch. All draws are performed by licensed Swedish phlebotomists. Samples go to Karolinska University Laboratory or equivalent accredited labs.",
    },
    {
      q: "What happens to my data?",
      a: "Your data is stored in EU data centers, encrypted at rest and in transit, and is GDPR compliant. You own it. You can export a full FHIR dump at any time, and you can delete your account and all associated data with one tap. We never sell data to insurers or advertisers. That is a core product decision, not a promise we can change later.",
    },
    {
      q: "How often do I need to retest?",
      a: "Annual membership includes a 6-month retest and a 12-month retest. Most people are well served by this cadence. If your trajectory is concerning, Dr. Johansson may recommend a 3-month retest, in which case it's included at no extra cost for Platinum members and 495 SEK for Annual members.",
    },
    {
      q: "Can I cancel the membership?",
      a: "Yes. Annual and Platinum renew yearly and you can cancel any time from your settings. If you cancel mid-year we don't pro-rate refunds, but you keep access until the end of your paid period and you keep your full data forever.",
    },
  ];

  return (
    <section
      style={{
        background: colors.cream,
        padding: "160px 40px",
        fontFamily: fontStack.display,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          fontFamily: fontStack.mono,
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.inkMuted,
          display: "flex",
          gap: "24px",
        }}
      >
        <span>Ch 08</span>
        <span>Questions</span>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.6fr 1.4fr",
          gap: "80px",
          alignItems: "start",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: easing.out }}
          style={{ position: "sticky", top: "80px" }}
        >
          <h2
            style={{
              fontSize: "clamp(40px, 4.5vw, 72px)",
              lineHeight: 0.95,
              margin: 0,
              color: colors.ink,
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            What people actually{" "}
            <span style={{ color: colors.amberDeep, fontStyle: "italic", fontWeight: 400 }}>
              ask us.
            </span>
          </h2>
          <p
            style={{
              marginTop: "24px",
              fontSize: "16px",
              lineHeight: 1.6,
              color: colors.inkSoft,
            }}
          >
            {"If your question isn't here, write to "}
            <span style={{ color: colors.ink, borderBottom: `1px solid ${colors.ink}` }}>
              hello@precura.se
            </span>{" "}
            and a human replies within 24 hours.
          </p>
        </motion.div>

        <div>
          {questions.map((item, i) => (
            <FAQItem
              key={i}
              index={i}
              total={questions.length}
              question={item.q}
              answer={item.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  index,
  total,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  total: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: easing.out }}
      style={{
        borderBottom: index < total - 1 ? `1px solid ${colors.inkLine}` : "none",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: "28px 0",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "24px",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: fontStack.display,
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: "11px",
            color: colors.inkMuted,
            letterSpacing: "0.12em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: colors.ink,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {question}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: easing.out }}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: isOpen ? colors.ink : "transparent",
            color: isOpen ? colors.ivory : colors.ink,
            border: `1px solid ${colors.ink}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 300,
          }}
        >
          +
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easing.inOut }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingLeft: "52px",
                paddingRight: "56px",
                paddingBottom: "32px",
                fontSize: "16px",
                lineHeight: 1.65,
                color: colors.inkSoft,
                maxWidth: "720px",
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
