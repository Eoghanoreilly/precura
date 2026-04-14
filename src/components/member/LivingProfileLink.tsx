"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

export function LivingProfileLink({ years }: { years: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      style={{
        margin: "0 20px 36px",
        padding: "20px 22px",
        background: C.sageTint,
        border: `1px solid ${C.sageSoft}`,
        borderRadius: 22,
        boxShadow: C.shadowSoft,
        fontFamily: SYSTEM_FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: C.sageDeep,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 5,
          }}
        >
          The long view
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}
        >
          Your {years}-year story
        </div>
      </div>
      <button
        style={{
          background: C.paper,
          border: `1px solid ${C.sageSoft}`,
          borderRadius: 100,
          padding: "10px 18px",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 600,
          color: C.sageDeep,
          cursor: "pointer",
          letterSpacing: "-0.005em",
          flexShrink: 0,
        }}
      >
        See timeline
      </button>
    </motion.section>
  );
}
