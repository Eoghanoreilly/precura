"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  TestTube2,
  Brain,
  Dumbbell,
  MessageSquare,
  Package,
} from "lucide-react";
import { C, SYSTEM_FONT, TYPE } from "./tokens";

/**
 * WHAT YOU GET - A deeper, six-card breakdown of the membership.
 * Bespoke mosaic: big card + tall card + two medium cards. Not a
 * standard three-card features grid. Airbnb-warm: soft paper cards,
 * hairlines, no left borders, subtle hover lifts.
 */
export function WhatYouGet() {
  return (
    <section
      style={{
        padding: "120px 32px 120px",
        background: C.cream,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...TYPE.label,
            color: C.coral,
            marginBottom: 16,
          }}
        >
          Inside the membership
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
            marginBottom: 56,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              ...TYPE.displayL,
              margin: 0,
              maxWidth: 760,
            }}
          >
            Six things,{" "}
            <span
              style={{
                color: C.coral,
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              updated every test.
            </span>
          </h2>
          <p
            style={{
              ...TYPE.lead,
              color: C.inkMuted,
              margin: 0,
              maxWidth: 360,
            }}
          >
            A doctor, a coach, blood panels, an AI that knows your history,
            a living profile and a welcome kit.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "minmax(170px, auto)",
            gap: 20,
          }}
          className="home19-mosaic"
        >
          {/* BIG - Doctor */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 4", gridRow: "span 2" }}
            icon={<Stethoscope size={20} strokeWidth={2.2} />}
            iconBg={C.coralSoft}
            iconColor={C.coralDeep}
            background={C.paper}
            minHeight={380}
            pullQuote
            heading="A personal doctor who remembers your file"
            body="Dr. Marcus Johansson is your doctor. He reads every panel, tracks every trend, and writes a note on every result in plain Swedish. You can message him back. Same doctor, every time."
            badge="Internal medicine / Karolinska"
          />

          {/* TALL - Lab panel */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 2", gridRow: "span 2" }}
            icon={<TestTube2 size={20} strokeWidth={2.2} />}
            iconBg={C.sageSoft}
            iconColor={C.sageDeep}
            background={C.creamDeep}
            minHeight={380}
            heading="40+ markers, 2 to 4 times a year"
            body="ApoB, HbA1c, fasting insulin, LDL, HDL, triglycerides, hs-CRP, Omega-3, Vitamin D, ferritin, TSH, creatinine, eGFR and more."
            badge="Karolinska lab"
          />

          {/* WIDE - AI */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 3" }}
            icon={<Brain size={20} strokeWidth={2.2} />}
            iconBg={C.coralSoft}
            iconColor={C.coralDeep}
            background={C.paper}
            heading="AI that has read your file"
            body="Ask anything about your own data. It already knows your history, your family history and your trend."
          />

          {/* WIDE - Coach */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 3" }}
            icon={<Dumbbell size={20} strokeWidth={2.2} />}
            iconBg={C.amberSoft}
            iconColor="#8A5310"
            background={C.paper}
            heading="A coach, not a chatbot"
            body="Assigned human coach. Training block tuned to your blood work, reviewed by Dr. Marcus, not generic advice."
          />

          {/* SMALL - Messaging */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 2" }}
            icon={<MessageSquare size={18} strokeWidth={2.2} />}
            iconBg={C.creamDeep}
            iconColor={C.ink}
            background={C.paper}
            heading="Message the doctor"
            body="Secure thread in the app. Typical response in hours, not days."
          />

          {/* SMALL - Welcome kit */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 2" }}
            icon={<Package size={18} strokeWidth={2.2} />}
            iconBg={C.sageSoft}
            iconColor={C.sageDeep}
            background={C.paper}
            heading="Welcome kit on day one"
            body="Home test kit, plain-English guide, a little card with Dr. Marcus printed on it."
          />

          {/* SMALL - Trajectory */}
          <MosaicCard
            gridStyle={{ gridColumn: "span 2" }}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 17L10 11L14 15L20 7"
                  stroke={C.ink}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            iconBg={C.coralSoft}
            iconColor={C.coralDeep}
            background={C.paper}
            heading="See the slope, not the number"
            body="Every biomarker tracked as a trajectory across years, not a single snapshot."
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 940px) {
          :global(.home19-mosaic) {
            grid-template-columns: 1fr 1fr !important;
          }
          :global(.home19-mosaic > *) {
            grid-column: span 1 !important;
            grid-row: auto !important;
            min-height: 240px;
          }
        }
        @media (max-width: 620px) {
          :global(.home19-mosaic) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function MosaicCard({
  gridStyle,
  icon,
  iconBg,
  iconColor,
  background,
  heading,
  body,
  badge,
  pullQuote,
  minHeight,
}: {
  gridStyle: React.CSSProperties;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  background: string;
  heading: string;
  body: string;
  badge?: string;
  pullQuote?: boolean;
  minHeight?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      style={{
        ...gridStyle,
        background,
        borderRadius: 24,
        border: `1px solid ${C.line}`,
        padding: 28,
        boxShadow: C.shadow,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight,
      }}
    >
      <div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: iconBg,
            color: iconColor,
            display: "grid",
            placeItems: "center",
            marginBottom: 22,
          }}
        >
          {icon}
        </div>
        <h3
          style={{
            fontSize: pullQuote ? 28 : 20,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 12,
            maxWidth: pullQuote ? 460 : undefined,
          }}
        >
          {heading}
        </h3>
        <p
          style={{
            ...(pullQuote ? TYPE.lead : TYPE.body),
            color: C.inkMuted,
            margin: 0,
            maxWidth: pullQuote ? 520 : 380,
          }}
        >
          {body}
        </p>
      </div>
      {badge && (
        <div
          style={{
            marginTop: 20,
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 100,
            background: C.creamSoft,
            border: `1px solid ${C.lineSoft}`,
            ...TYPE.small,
            color: C.inkMuted,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.sage,
            }}
          />
          {badge}
        </div>
      )}
    </motion.div>
  );
}
