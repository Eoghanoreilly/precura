"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "@/components/member/tokens";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const urlError = params.get("error");

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
        emailRedirectTo: `${window.location.origin}/member/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  // Check if already logged in and redirect
  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/member");
    });
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.stone,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 400,
          background: C.paper,
          border: `1px solid ${C.lineCard}`,
          borderRadius: 24,
          boxShadow: C.shadowCard,
          padding: "40px 32px 36px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.03em",
            marginBottom: 6,
          }}
        >
          Precura
        </div>
        <div
          style={{
            fontSize: 14,
            color: C.inkMuted,
            marginBottom: 32,
            lineHeight: 1.5,
          }}
        >
          Sign in with your email. We'll send you a magic link.
        </div>

        {urlError === "not_allowed" && (
          <div
            style={{
              padding: "12px 16px",
              background: C.terracottaTint,
              border: `1px solid ${C.terracottaSoft}`,
              borderRadius: 12,
              fontSize: 13,
              color: C.terracottaDeep,
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            This email is not on the access list. Precura is currently
            invite-only.
          </div>
        )}

        {urlError === "auth_failed" && (
          <div
            style={{
              padding: "12px 16px",
              background: C.terracottaTint,
              border: `1px solid ${C.terracottaSoft}`,
              borderRadius: 12,
              fontSize: 13,
              color: C.terracottaDeep,
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            Authentication failed. Please try again.
          </div>
        )}

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "20px 18px",
              background: C.sageTint,
              border: `1px solid ${C.sageSoft}`,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: C.sageDeep,
                marginBottom: 8,
              }}
            >
              Check your email
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.inkMuted,
                lineHeight: 1.5,
              }}
            >
              We sent a magic link to{" "}
              <strong style={{ color: C.ink }}>{email}</strong>. Click it to
              sign in.
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: C.inkMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 15,
                fontFamily: SYSTEM_FONT,
                color: C.ink,
                background: C.canvasSoft,
                border: `1px solid ${C.lineCard}`,
                borderRadius: 12,
                outline: "none",
                marginBottom: 16,
                boxSizing: "border-box",
                letterSpacing: "-0.005em",
              }}
            />

            {status === "error" && errorMsg && (
              <div
                style={{
                  fontSize: 13,
                  color: C.risk,
                  marginBottom: 14,
                  lineHeight: 1.5,
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%",
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: SYSTEM_FONT,
                color: C.canvasSoft,
                background:
                  status === "sending" ? C.stone : C.terracotta,
                border: "none",
                borderRadius: 100,
                cursor:
                  status === "sending" ? "default" : "pointer",
                boxShadow:
                  status === "sending"
                    ? "none"
                    : "0 8px 18px -8px rgba(201,87,58,0.42), 0 2px 6px rgba(201,87,58,0.2)",
                letterSpacing: "-0.005em",
                transition: "background 0.2s ease",
              }}
            >
              {status === "sending"
                ? "Sending..."
                : "Send magic link"}
            </button>

            {/* Dev quick login - skip the email round-trip */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: `1px solid ${C.lineSoft}`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: C.inkFaint,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Dev quick login
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["eoghan@vestego.com"].map((devEmail) => (
                  <button
                    key={devEmail}
                    type="button"
                    disabled={status === "sending"}
                    onClick={async () => {
                      setStatus("sending");
                      setErrorMsg("");
                      try {
                        const res = await fetch("/api/dev-login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: devEmail }),
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
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: SYSTEM_FONT,
                      color: C.inkSoft,
                      background: C.canvasSoft,
                      border: `1px solid ${C.lineCard}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {devEmail.split("@")[0]}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        <div
          style={{
            marginTop: 28,
            fontSize: 11,
            color: C.inkFaint,
            textAlign: "center",
            lineHeight: 1.5,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Precura is currently in private testing. Only invited
          members can sign in.
        </div>
      </motion.div>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh" }} />}>
      <LoginContent />
    </Suspense>
  );
}
