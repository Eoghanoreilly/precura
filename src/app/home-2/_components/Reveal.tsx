"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import React from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "section" | "figure" | "blockquote";
  style?: React.CSSProperties;
};

/**
 * Minimal scroll-triggered reveal for prose and typography.
 * One effect only: fade + small upward translate.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  duration = 0.9,
  once = true,
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
      viewport={{ once, amount: 0.25 }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

type WordsRevealProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "p" | "span";
};

/**
 * Word-by-word fade reveal. Each word is wrapped in an inline-block span
 * so we can animate each independently without breaking line wrapping.
 */
export function WordsReveal({
  text,
  className,
  style,
  stagger = 0.04,
  duration = 0.8,
  delay = 0,
  once = true,
  as = "h1",
}: WordsRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduce ? 0 : duration,
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
      viewport={{ once, amount: 0.4 }}
      variants={containerVariants}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          <motion.span
            variants={wordVariants}
            style={{ display: "inline-block", willChange: "transform, opacity" }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionTag>
  );
}
