"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type Persona = "client" | "doctor";

type UiState =
  | { tag: "idle" }
  | { tag: "loading"; persona: Persona }
  | { tag: "error"; message: string };

export default function LoginPage() {
  const [state, setState] = useState<UiState>({ tag: "idle" });

  async function signIn(persona: Persona) {
    setState({ tag: "loading", persona });
    const body =
      persona === "client"
        ? {
            email: "eoghan@vestego.com",
            role: "patient",
            redirect: "/member",
          }
        : {
            email: "tomas@precura.se",
            role: "doctor",
            redirect: "/doctor",
          };
    try {
      const res = await fetch("/api/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setState({ tag: "error", message: data.error || "Sign in failed." });
    } catch {
      setState({ tag: "error", message: "Sign in failed." });
    }
  }

  const busy = state.tag === "loading";
  const loadingPersona = state.tag === "loading" ? state.persona : null;

  return (
    <div className="vlogin-root">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="vlogin-card"
      >
        <div className="vlogin-eyebrow">
          <em>Precura / Dev console</em>
        </div>
        <h1 className="vlogin-title">V3 Login</h1>
        <p className="vlogin-body">
          One click to sign in as one of the two test personas.
        </p>

        {state.tag === "error" && (
          <div className="vlogin-err" role="alert">
            {state.message}
          </div>
        )}

        <div className="vlogin-tiles">
          <button
            type="button"
            disabled={busy}
            onClick={() => signIn("client")}
            className="vlogin-tile"
          >
            <span className="vlogin-tile-kicker">Client</span>
            <span className="vlogin-tile-name">Eoghan</span>
            <span className="vlogin-tile-meta">
              eoghan@vestego.com
              <br />
              role: patient
              <br />
              lands on /member
            </span>
            <span className="vlogin-tile-cta">
              {loadingPersona === "client"
                ? "Signing in..."
                : "Sign in as Client"}
            </span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => signIn("doctor")}
            className="vlogin-tile"
          >
            <span className="vlogin-tile-kicker">Doctor</span>
            <span className="vlogin-tile-name">Tomas</span>
            <span className="vlogin-tile-meta">
              tomas@precura.se
              <br />
              role: doctor
              <br />
              lands on /doctor
            </span>
            <span className="vlogin-tile-cta">
              {loadingPersona === "doctor"
                ? "Signing in..."
                : "Sign in as Doctor"}
            </span>
          </button>
        </div>

        <div className="vlogin-foot">
          Real user? Sign in at <a href="/member/login">/member/login</a> or{" "}
          <a href="/doctor/login">/doctor/login</a>.
        </div>

        <style jsx>{`
          .vlogin-root {
            min-height: 100dvh;
            background: var(--canvas);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            font-family: var(--font-sans);
          }
          .vlogin-card {
            width: 100%;
            max-width: 640px;
            background: var(--paper);
            border: 1px solid var(--line-card);
            border-radius: var(--radius-hero);
            box-shadow: var(--shadow-card);
            padding: var(--sp-9) var(--sp-7) var(--sp-8);
          }
          .vlogin-eyebrow {
            font-family: var(--font-serif);
            font-style: italic;
            color: var(--sage-deep);
            font-size: var(--text-meta);
            margin-bottom: var(--sp-3);
          }
          .vlogin-title {
            font-size: var(--text-title);
            font-weight: 600;
            color: var(--ink);
            letter-spacing: -0.02em;
            margin: 0 0 var(--sp-3);
          }
          .vlogin-body {
            font-size: var(--text-body);
            line-height: var(--line-height-body);
            color: var(--ink-soft);
            margin: 0 0 var(--sp-6);
          }
          .vlogin-err {
            padding: var(--sp-3) var(--sp-4);
            background: var(--terracotta-tint);
            border: 1px solid var(--terracotta-soft);
            border-radius: var(--radius);
            font-size: var(--text-meta);
            color: var(--terracotta-deep);
            margin-bottom: var(--sp-5);
          }
          .vlogin-tiles {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--sp-4);
            margin-bottom: var(--sp-6);
          }
          @media (min-width: 640px) {
            .vlogin-tiles {
              grid-template-columns: 1fr 1fr;
            }
          }
          .vlogin-tile {
            display: flex;
            flex-direction: column;
            gap: var(--sp-3);
            padding: var(--sp-6);
            background: var(--canvas-soft);
            border: 1px solid var(--line-card);
            border-radius: var(--radius-card);
            text-align: left;
            cursor: pointer;
            transition: background 0.2s ease, border-color 0.2s ease,
              transform 0.15s ease;
            font-family: var(--font-sans);
          }
          .vlogin-tile:hover:not(:disabled) {
            background: var(--sage-tint);
            border-color: var(--sage-soft);
            transform: translateY(-1px);
          }
          .vlogin-tile:disabled {
            opacity: 0.6;
            cursor: default;
          }
          .vlogin-tile-kicker {
            font-size: var(--text-micro);
            font-weight: 600;
            color: var(--sage-deep);
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
          .vlogin-tile-name {
            font-size: var(--text-section);
            font-weight: 600;
            color: var(--ink);
            letter-spacing: -0.015em;
          }
          .vlogin-tile-meta {
            font-size: var(--text-meta);
            color: var(--ink-soft);
            line-height: var(--line-height-body);
          }
          .vlogin-tile-cta {
            margin-top: auto;
            padding-top: var(--sp-3);
            font-size: var(--text-meta);
            font-weight: 600;
            color: var(--sage-deep);
          }
          .vlogin-foot {
            font-size: var(--text-micro);
            color: var(--ink-faint);
            font-style: italic;
            font-family: var(--font-serif);
            text-align: center;
            line-height: var(--line-height-body);
            border-top: 1px solid var(--line-soft);
            padding-top: var(--sp-5);
          }
          .vlogin-foot a {
            color: var(--ink-soft);
            text-decoration: underline;
          }
        `}</style>
      </motion.div>
    </div>
  );
}
