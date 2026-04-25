"use client";

import React, { useEffect, useRef, useState } from "react";

type Persona = "member" | "doctor";

type UiState =
  | { tag: "idle" }
  | { tag: "loading"; persona: Persona }
  | { tag: "error"; persona: Persona; message: string };

type WipeState =
  | { tag: "idle" }
  | { tag: "confirm"; persona: Persona }
  | { tag: "loading"; persona: Persona }
  | { tag: "error"; persona: Persona; message: string };

type Panel = {
  persona: Persona;
  tone: "warm" | "sage";
  eyebrow: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
  redirect: string;
  wipeable?: boolean;
};

const PANELS: Panel[] = [
  {
    persona: "member",
    tone: "warm",
    eyebrow: "Member",
    name: "Eoghan",
    email: "eoghan@vestego.com",
    role: "patient",
    redirect: "/member",
    wipeable: true,
  },
  {
    persona: "doctor",
    tone: "sage",
    eyebrow: "Doctor",
    name: "Tomas",
    email: "tomas@precura.se",
    role: "doctor",
    redirect: "/doctor",
  },
];

const CONFIRM_WINDOW_MS = 3000;

export default function LoginPage() {
  const [state, setState] = useState<UiState>({ tag: "idle" });
  const [wipeState, setWipeState] = useState<WipeState>({ tag: "idle" });
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const busy = state.tag === "loading" || wipeState.tag === "loading";

  useEffect(
    () => () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    },
    [],
  );

  function clearConfirmTimer() {
    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
  }

  async function signIn(p: Panel) {
    setState({ tag: "loading", persona: p.persona });
    try {
      const res = await fetch("/api/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: p.email,
          role: p.role,
          redirect: p.redirect,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setState({
        tag: "error",
        persona: p.persona,
        message: data.error || "Sign in failed.",
      });
    } catch {
      setState({
        tag: "error",
        persona: p.persona,
        message: "Sign in failed.",
      });
    }
  }

  async function performWipe(p: Panel) {
    clearConfirmTimer();
    setWipeState({ tag: "loading", persona: p.persona });
    try {
      const res = await fetch("/api/dev-wipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: p.email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setWipeState({
          tag: "error",
          persona: p.persona,
          message: data.error || "Wipe failed.",
        });
        return;
      }
      setWipeState({ tag: "idle" });
      await signIn(p);
    } catch {
      setWipeState({
        tag: "error",
        persona: p.persona,
        message: "Wipe failed.",
      });
    }
  }

  function handleWipeClick(p: Panel) {
    if (
      wipeState.tag === "confirm" &&
      wipeState.persona === p.persona
    ) {
      void performWipe(p);
      return;
    }
    setWipeState({ tag: "confirm", persona: p.persona });
    clearConfirmTimer();
    confirmTimerRef.current = setTimeout(() => {
      setWipeState((s) =>
        s.tag === "confirm" && s.persona === p.persona ? { tag: "idle" } : s,
      );
    }, CONFIRM_WINDOW_MS);
  }

  return (
    <main className="login">
      <div className="login__grid">
        {PANELS.map((p) => {
          const isLoading =
            state.tag === "loading" && state.persona === p.persona;
          const isDimmed =
            state.tag === "loading" && state.persona !== p.persona;
          const errorMsg =
            state.tag === "error" && state.persona === p.persona
              ? state.message
              : null;
          const isWiping =
            wipeState.tag === "loading" && wipeState.persona === p.persona;
          const isConfirming =
            wipeState.tag === "confirm" && wipeState.persona === p.persona;
          const wipeError =
            wipeState.tag === "error" && wipeState.persona === p.persona
              ? wipeState.message
              : null;

          return (
            <div key={p.persona} className="login__cell">
              <button
                type="button"
                disabled={busy}
                onClick={() => signIn(p)}
                className={`login__panel login__panel--${p.tone}`}
                data-dimmed={isDimmed ? "true" : "false"}
                aria-label={`Sign in as ${p.eyebrow.toLowerCase()} ${p.name}`}
              >
                <span className="login__eyebrow">{p.eyebrow}</span>
                <span className="login__name">{p.name}</span>
                <span className="login__email">{p.email}</span>
                <span className="login__hint" data-loading={isLoading}>
                  {isLoading
                    ? "Signing in"
                    : isWiping
                      ? "Wiping data"
                      : "Click to sign in"}
                </span>
                {errorMsg && (
                  <span className="login__err" role="alert">
                    {errorMsg}
                  </span>
                )}
                {wipeError && (
                  <span className="login__err" role="alert">
                    {wipeError}
                  </span>
                )}
              </button>

              {p.wipeable && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleWipeClick(p)}
                  className="login__wipe"
                  data-confirming={isConfirming ? "true" : "false"}
                  aria-label={
                    isConfirming
                      ? "Click again to confirm wipe"
                      : "Wipe all data and start fresh"
                  }
                >
                  {isWiping
                    ? "Wiping"
                    : isConfirming
                      ? "Click again to confirm"
                      : "Wipe and start fresh"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <footer className="login__foot">
        <span className="login__foot-mark">Precura</span>
        <span className="login__foot-sep" aria-hidden="true">
          /
        </span>
        <span>Dev console</span>
        <span className="login__foot-sep" aria-hidden="true">
          /
        </span>
        <span>
          Real users sign in at{" "}
          <a href="/member/login">/member/login</a>
          {" "}or{" "}
          <a href="/doctor/login">/doctor/login</a>
        </span>
      </footer>

      <style jsx>{`
        .login {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          background: var(--canvas);
          font-family: var(--font-sans);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
        }

        .login__grid {
          flex: 1 1 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 0;
        }

        .login__cell {
          position: relative;
          display: flex;
          min-height: 0;
          border-right: 1px solid var(--line-soft);
        }
        .login__cell:last-child {
          border-right: 0;
        }

        .login__panel {
          appearance: none;
          margin: 0;
          border: 0;
          padding: var(--sp-11) var(--sp-9);
          background: var(--canvas-soft);
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: var(--sp-3);
          flex: 1 1 auto;
          min-height: 0;
          width: 100%;
          transition: background 0.25s ease, opacity 0.25s ease;
        }

        .login__panel--warm {
          background: radial-gradient(
              70% 55% at 20% 28%,
              rgba(239, 181, 155, 0.22) 0%,
              transparent 72%
            ),
            var(--canvas);
        }
        .login__panel--sage {
          background: radial-gradient(
              70% 55% at 20% 28%,
              rgba(114, 140, 118, 0.2) 0%,
              transparent 72%
            ),
            var(--sage-tint);
        }
        .login__panel--warm:hover:not(:disabled) {
          background: radial-gradient(
              70% 55% at 20% 28%,
              rgba(239, 181, 155, 0.32) 0%,
              transparent 68%
            ),
            var(--canvas-soft);
        }
        .login__panel--sage:hover:not(:disabled) {
          background: radial-gradient(
              70% 55% at 20% 28%,
              rgba(114, 140, 118, 0.28) 0%,
              transparent 68%
            ),
            #E3ECE4;
        }

        .login__panel[data-dimmed="true"] {
          opacity: 0.35;
        }
        .login__panel:disabled {
          cursor: default;
        }
        .login__panel:focus-visible {
          outline: 2px solid var(--sage-deep);
          outline-offset: -8px;
        }

        .login__eyebrow {
          font-size: var(--text-eyebrow);
          font-weight: 600;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .login__name {
          font-size: var(--text-title);
          font-weight: 600;
          line-height: var(--line-height-title);
          letter-spacing: -0.025em;
          color: var(--ink);
        }

        .login__email {
          font-family: var(--font-mono);
          font-size: var(--text-meta);
          color: var(--ink-faint);
          letter-spacing: 0.01em;
          margin-top: var(--sp-1);
        }

        .login__hint {
          margin-top: var(--sp-5);
          font-size: var(--text-dense);
          color: var(--ink-muted);
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
        }
        .login__panel:hover:not(:disabled) .login__hint {
          color: var(--sage-deep);
        }
        .login__panel--warm:hover:not(:disabled) .login__hint {
          color: var(--terracotta-deep);
        }
        .login__hint[data-loading="true"]::after {
          content: "...";
          display: inline-block;
          animation: dots 1.2s steps(4, end) infinite;
          width: 1.2em;
          text-align: left;
          overflow: hidden;
        }
        @keyframes dots {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        .login__err {
          margin-top: var(--sp-3);
          padding: var(--sp-2) var(--sp-4);
          background: var(--terracotta-tint);
          border: 1px solid var(--terracotta-soft);
          border-radius: var(--radius);
          font-size: var(--text-meta);
          color: var(--terracotta-deep);
          max-width: 36ch;
        }

        .login__wipe {
          position: absolute;
          right: var(--sp-6);
          bottom: var(--sp-6);
          appearance: none;
          margin: 0;
          padding: var(--sp-2) var(--sp-4);
          background: transparent;
          color: var(--ink-faint);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          font: inherit;
          font-size: var(--text-micro);
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .login__wipe:hover:not(:disabled) {
          color: var(--ink);
          border-color: var(--line-card);
          background: var(--canvas);
        }
        .login__wipe:focus-visible {
          outline: 2px solid var(--sage-deep);
          outline-offset: 2px;
        }
        .login__wipe:disabled {
          cursor: default;
          opacity: 0.5;
        }
        .login__wipe[data-confirming="true"] {
          color: var(--terracotta-deep);
          border-color: var(--terracotta-soft);
          background: var(--terracotta-tint);
        }

        .login__foot {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-5) var(--sp-6);
          border-top: 1px solid var(--line-soft);
          background: var(--canvas);
          font-size: var(--text-micro);
          color: var(--ink-faint);
          flex-wrap: wrap;
        }
        .login__foot-mark {
          font-weight: 600;
          color: var(--ink-muted);
          letter-spacing: -0.01em;
        }
        .login__foot-sep {
          color: var(--line-card);
        }
        .login__foot a {
          color: var(--ink-muted);
          text-decoration: underline;
          text-decoration-color: var(--line-card);
          text-underline-offset: 3px;
        }
        .login__foot a:hover {
          color: var(--sage-deep);
          text-decoration-color: var(--sage-deep);
        }

        @media (max-width: 768px) {
          .login__grid {
            grid-template-columns: 1fr;
          }
          .login__cell {
            border-right: 0;
            border-bottom: 1px solid var(--line-soft);
          }
          .login__cell:last-child {
            border-bottom: 0;
          }
          .login__panel {
            padding: var(--sp-9) var(--sp-7);
            min-height: 320px;
          }
          .login__wipe {
            right: var(--sp-5);
            bottom: var(--sp-5);
          }
          .login__foot {
            padding: var(--sp-4);
            gap: var(--sp-2);
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login__panel,
          .login__wipe,
          .login__hint[data-loading="true"]::after {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
