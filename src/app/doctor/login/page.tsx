"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/layout";

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const urlError = params.get("error");

  useEffect(() => {
    // Only auto-redirect if the logged-in user already has a doctor role.
    // Otherwise the middleware bounces them back to /member and they never
    // see this page, which is the problem we are trying to solve.
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role === "doctor" || profile?.role === "both") {
        router.replace("/doctor");
      }
      // patients stay on this page so they can click the dev button to
      // promote themselves to 'both'
    })();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/member/auth/callback?next=/doctor`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="dlogin-root">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dlogin-card"
      >
        <div className="dlogin-eyebrow">
          <em>Precura for clinicians</em>
        </div>
        <h1 className="dlogin-title">Sign in</h1>
        <p className="dlogin-body">
          Magic link authentication. Send yourself a link, click it, you are in.
        </p>

        {urlError === "not_allowed" && (
          <div className="dlogin-alert">
            This email is not on the access list. Precura is invite-only.
          </div>
        )}
        {urlError === "auth_failed" && (
          <div className="dlogin-alert">
            Authentication failed. Please try again.
          </div>
        )}

        {status === "sent" ? (
          <div className="dlogin-ok">
            <div className="dlogin-ok-title">Check your email</div>
            <div className="dlogin-ok-body">
              We sent a magic link to <strong>{email}</strong>.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="dlogin-form">
            <label className="dlogin-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.example"
              required
              autoFocus
              className="dlogin-input"
            />
            {status === "error" && errorMsg && (
              <div className="dlogin-err">{errorMsg}</div>
            )}
            <div className="dlogin-actions">
              <Button tone="sage" type="submit">
                {status === "sending" ? "Sending..." : "Send magic link"}
              </Button>
            </div>

            <div className="dlogin-dev">
              <div className="dlogin-dev-label">Dev quick login</div>
              <button
                type="button"
                disabled={status === "sending"}
                onClick={async () => {
                  setStatus("sending");
                  setErrorMsg("");
                  try {
                    const res = await fetch("/api/dev-login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: "eoghan@vestego.com",
                        role: "both",
                        redirect: "/doctor",
                      }),
                    });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      setStatus("error");
                      setErrorMsg(data.error || "Dev login failed.");
                    }
                  } catch {
                    setStatus("error");
                    setErrorMsg("Dev login failed.");
                  }
                }}
                className="dlogin-dev-btn"
              >
                Sign in as doctor
              </button>
              <div className="dlogin-dev-foot">
                Promotes eoghan@vestego.com to role &#39;both&#39; and lands you in /doctor.
              </div>
            </div>
          </form>
        )}

        <style jsx>{`
          .dlogin-root {
            min-height: 100dvh;
            background: var(--canvas);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            font-family: var(--font-sans);
          }
          .dlogin-card {
            width: 100%;
            max-width: 440px;
            background: var(--paper);
            border: 1px solid var(--line-card);
            border-radius: var(--radius-hero);
            box-shadow: var(--shadow-card);
            padding: var(--sp-9) var(--sp-7) var(--sp-8);
          }
          .dlogin-eyebrow {
            font-family: var(--font-serif);
            font-style: italic;
            color: var(--sage-deep);
            font-size: var(--text-meta);
            margin-bottom: var(--sp-3);
          }
          .dlogin-title {
            font-size: var(--text-title);
            font-weight: 600;
            color: var(--ink);
            letter-spacing: -0.02em;
            margin: 0 0 var(--sp-3);
          }
          .dlogin-body {
            font-size: var(--text-body);
            line-height: var(--line-height-body);
            color: var(--ink-soft);
            margin: 0 0 var(--sp-7);
          }
          .dlogin-alert {
            padding: var(--sp-3) var(--sp-4);
            background: var(--terracotta-tint);
            border: 1px solid var(--terracotta-soft);
            border-radius: var(--radius);
            font-size: var(--text-meta);
            color: var(--terracotta-deep);
            margin-bottom: var(--sp-5);
          }
          .dlogin-ok {
            padding: var(--sp-5) var(--sp-5);
            background: var(--sage-tint);
            border: 1px solid var(--sage-soft);
            border-radius: var(--radius-card);
            text-align: center;
          }
          .dlogin-ok-title {
            font-size: var(--text-section);
            font-weight: 600;
            color: var(--sage-deep);
            margin-bottom: var(--sp-2);
          }
          .dlogin-ok-body {
            font-size: var(--text-meta);
            color: var(--ink-soft);
            line-height: var(--line-height-body);
          }
          .dlogin-form {
            display: flex;
            flex-direction: column;
          }
          .dlogin-label {
            font-size: var(--text-micro);
            font-weight: 600;
            color: var(--ink-faint);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: var(--sp-2);
          }
          .dlogin-input {
            padding: var(--sp-3) var(--sp-4);
            font-size: var(--text-body);
            font-family: var(--font-sans);
            color: var(--ink);
            background: var(--canvas-soft);
            border: 1px solid var(--line-card);
            border-radius: var(--radius);
            outline: none;
            margin-bottom: var(--sp-4);
          }
          .dlogin-input:focus {
            border-color: var(--sage);
            box-shadow: 0 0 0 3px var(--sage-tint);
          }
          .dlogin-err {
            font-size: var(--text-meta);
            color: var(--health-risk);
            margin-bottom: var(--sp-3);
          }
          .dlogin-actions {
            display: flex;
            justify-content: flex-start;
          }
          .dlogin-dev {
            margin-top: var(--sp-6);
            padding-top: var(--sp-5);
            border-top: 1px solid var(--line-soft);
          }
          .dlogin-dev-label {
            font-size: var(--text-micro);
            font-weight: 600;
            color: var(--ink-faint);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: var(--sp-3);
            text-align: center;
          }
          .dlogin-dev-btn {
            display: block;
            width: 100%;
            padding: var(--sp-3) var(--sp-4);
            font-size: var(--text-meta);
            font-weight: 500;
            font-family: var(--font-sans);
            color: var(--ink);
            background: var(--canvas-soft);
            border: 1px solid var(--line-card);
            border-radius: var(--radius);
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .dlogin-dev-btn:hover {
            background: var(--canvas);
          }
          .dlogin-dev-btn:disabled {
            opacity: 0.5;
            cursor: default;
          }
          .dlogin-dev-foot {
            margin-top: var(--sp-3);
            font-size: var(--text-micro);
            color: var(--ink-faint);
            font-style: italic;
            font-family: var(--font-serif);
            text-align: center;
            line-height: var(--line-height-body);
          }
        `}</style>
      </motion.div>
    </div>
  );
}

export default function DoctorLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
