"use client";

/**
 * FinalCTA - a quiet closer that echoes the hero. One giant headline,
 * two buttons, a tiny signature line. Cream background like the hero so
 * the page starts and ends with silence.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { C, SYSTEM_FONT, TYPE, EASE } from "./tokens";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      style={{
        background: C.cream,
        color: C.ink,
        padding: "200px 36px 200px",
        fontFamily: SYSTEM_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            ...TYPE.mono,
            color: C.amber,
            marginBottom: 32,
          }}
        >
          11  /  One last thing
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          style={{
            ...TYPE.displayHuge,
            color: C.ink,
            margin: 0,
          }}
        >
          Your slope{" "}
          <span
            style={{
              color: C.amberDeep,
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            is writable.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          style={{
            ...TYPE.lead,
            color: C.inkMid,
            maxWidth: 620,
            margin: "40px auto 0",
          }}
        >
          Ten minutes at a clinic. Forty-eight hours later, a real doctor with
          your five-year picture. Then a plan that updates every time your
          blood is re-read.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.38, ease: EASE }}
          style={{
            display: "flex",
            gap: 14,
            marginTop: 48,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: "18px 28px",
              borderRadius: 100,
              background: C.ink,
              color: C.cream,
              border: "none",
              fontFamily: SYSTEM_FONT,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Start with a blood draw
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
          <button
            style={{
              padding: "18px 28px",
              borderRadius: 100,
              background: "transparent",
              color: C.ink,
              border: `1px solid ${C.line}`,
              fontFamily: SYSTEM_FONT,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "all 400ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Book a call with a GP
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          style={{
            ...TYPE.mono,
            color: C.inkMuted,
            marginTop: 72,
          }}
        >
          Signed  /  Dr. Marcus Johansson and the Precura team
        </motion.div>
      </div>
    </section>
  );
}
