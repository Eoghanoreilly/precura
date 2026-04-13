"use client";

/**
 * FINAL CTA - confident close on a dark band. Big display quote on
 * the left, ctas and disclaimer on the right. Nothing flashy.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { C, FONT, TYPE, GRID, EASE } from "./tokens";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      style={{
        background: C.graphite,
        color: C.paper,
        padding: `${GRID.sectionSpacing}px ${GRID.pagePaddingX}px`,
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Quiet grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.lineDarkSoft} 1px, transparent 1px),
            linear-gradient(90deg, ${C.lineDarkSoft} 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 50%, black 0%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 50%, black 0%, transparent 85%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: GRID.pageMaxWidth,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: GRID.columnGap,
          alignItems: "end",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.1, ease: EASE.out }}
          style={{ gridColumn: "span 8" }}
          className="home12-cta-text"
        >
          <div
            style={{
              ...TYPE.eyebrow,
              color: C.accent,
              marginBottom: 24,
            }}
          >
            11 / Your move
          </div>
          <h2
            style={{
              ...TYPE.display,
              margin: 0,
              color: C.paper,
              maxWidth: 820,
            }}
          >
            One blood draw.{" "}
            <span style={{ color: C.accent, fontStyle: "italic" }}>
              Five years of clarity.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: "rgba(250, 250, 247, 0.68)",
              marginTop: 32,
              marginBottom: 0,
              maxWidth: 580,
            }}
          >
            Book a panel today. Meet Dr. Marcus next week. Start your
            living profile. You can cancel at any time, and your data is
            always yours to export or delete.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE.out }}
          style={{
            gridColumn: "span 4",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
          className="home12-cta-actions"
        >
          <button
            style={{
              padding: "18px 24px",
              background: C.accent,
              color: C.paper,
              border: "none",
              borderRadius: 10,
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              transition: "transform 200ms ease, background 200ms ease",
              boxShadow: "0 14px 40px rgba(201, 122, 61, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = C.accentDeep;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = C.accent;
            }}
          >
            Order a panel / 995 SEK
            <ArrowRight size={18} strokeWidth={2} />
          </button>
          <button
            style={{
              padding: "17px 24px",
              background: "transparent",
              color: C.paper,
              border: `1px solid ${C.lineDark}`,
              borderRadius: 10,
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              transition: "background 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(250, 250, 247, 0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Join Annual / 2,995 SEK
            <ArrowRight size={18} strokeWidth={2} />
          </button>
          <div
            style={{
              ...TYPE.caption,
              color: "rgba(250, 250, 247, 0.42)",
              marginTop: 10,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            Precura complements your vardcentral. It does not replace
            primary care. If anything is urgent, we route you to it with
            your data ready to share.
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home12-cta-text),
          :global(.home12-cta-actions) {
            grid-column: span 12 !important;
          }
          :global(.home12-cta-actions) {
            margin-top: 40px;
          }
        }
      `}</style>
    </section>
  );
}
