"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import React from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "section" | "figure" | "blockquote" | "span";
  style?: React.CSSProperties;
};

/**
 * Tasteful scroll fade + small rise. Designed for trust/editorial content,
 * not flashy animation. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.9,
  className,
  as = "div",
  style,
}: RevealProps) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
