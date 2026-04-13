"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, TYPE, IMG } from "./tokens";

/**
 * CatalogueGrid - "Everything in your membership"
 *
 * The 8-card editorial catalogue, relocated from the hero to its own
 * dedicated section. This answers "what's in the box" AFTER the hero has
 * answered "why should I care" and Anna's story has earned the stakes.
 */

type Perk = {
  image: string;
  category: "Included" | "Most used" | "New" | "Plus";
  title: string;
  desc: string;
};

const PERKS: Perk[] = [
  {
    image: IMG.doctor,
    category: "Most used",
    title: "Your personal doctor",
    desc: "Dr. Marcus Johansson, Karolinska-trained, reviews every test.",
  },
  {
    image: IMG.labKit,
    category: "Included",
    title: "Quarterly blood panels",
    desc: "40+ markers, drawn at any Swedish lab. Four times a year.",
  },
  {
    image: IMG.coach,
    category: "Most used",
    title: "A real coach, not an app",
    desc: "Assigned human coach. Messages back. Adjusts your plan.",
  },
  {
    image: IMG.training,
    category: "Included",
    title: "Personal training plan",
    desc: "Real exercises, sets, reps. Built around your blood work.",
  },
  {
    image: IMG.aiChat,
    category: "New",
    title: "AI chat that knows you",
    desc: "Ask anything. It has your full five-year history already.",
  },
  {
    image: IMG.profile,
    category: "Included",
    title: "Your living profile",
    desc: "One page. Every marker, every risk, evolving with each test.",
  },
  {
    image: IMG.checkin,
    category: "Most used",
    title: "Monthly check-ins",
    desc: "A quick coach call or chat. Someone who actually knows you.",
  },
  {
    image: IMG.priority,
    category: "Plus",
    title: "Priority booking",
    desc: "Same-day doctor slots and fast-tracked specialist referrals.",
  },
];

export function CatalogueGrid() {
  return (
    <section
      id="catalogue"
      style={{
        position: "relative",
        background: C.creamWarm,
        fontFamily: SYSTEM_FONT,
        color: C.ink,
        padding: "112px 32px 120px",
        borderTop: `1px solid ${C.lineFaint}`,
        borderBottom: `1px solid ${C.lineFaint}`,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 56,
            alignItems: "flex-end",
            marginBottom: 48,
          }}
          className="home20-catalogue-header"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                ...TYPE.tiny,
                color: C.terra,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 16,
              }}
            >
              Everything in your membership
            </div>
            <h2
              style={{
                ...TYPE.displayM,
                margin: 0,
                color: C.ink,
                maxWidth: 620,
              }}
            >
              One subscription. Eight things that actually move the needle.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...TYPE.lead,
              color: C.inkSoft,
              margin: 0,
              maxWidth: 440,
            }}
          >
            No add-ons, no upsells, no pay-per-call. Member tier is 2,995 SEK
            a year and includes everything below.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.1 },
            },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
          className="home20-catalogue-grid"
        >
          {PERKS.map((perk, i) => (
            <PerkCard key={i} perk={perk} />
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.home20-catalogue-grid) {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 820px) {
          :global(.home20-catalogue-header) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            align-items: flex-start !important;
          }
          :global(.home20-catalogue-grid) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 520px) {
          :global(.home20-catalogue-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function PerkCard({ perk }: { perk: Perk }) {
  const [hovered, setHovered] = useState(false);

  const catColor =
    perk.category === "New"
      ? C.terra
      : perk.category === "Plus"
      ? C.sageDeep
      : perk.category === "Most used"
      ? C.inkSoft
      : C.sageDeep;

  const catBg =
    perk.category === "New"
      ? C.terraHaze
      : perk.category === "Plus"
      ? C.sageHaze
      : C.creamSoft;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 20,
        overflow: "hidden",
        background: C.paper,
        border: `1px solid ${C.lineFaint}`,
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? C.shadowLift : C.shadowSoft,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          background: C.creamDeep,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${perk.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            background:
              "linear-gradient(180deg, rgba(22,21,18,0.18) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "5px 11px",
            background: catBg,
            color: catColor,
            borderRadius: 100,
            ...TYPE.tiny,
            fontWeight: 600,
            backdropFilter: "saturate(160%)",
          }}
        >
          {perk.category}
        </div>
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.25,
            fontWeight: 600,
            color: C.ink,
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          {perk.title}
        </div>
        <p
          style={{
            ...TYPE.small,
            color: C.inkMuted,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {perk.desc}
        </p>
      </div>
    </motion.div>
  );
}
