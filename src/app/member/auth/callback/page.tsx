"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Handles both flows:
// 1. Hash fragment (#access_token=...) from magic link / dev login
// 2. Query param (?code=...) from PKCE email confirmation

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      const supabase = createClient();

      // Check for hash fragment tokens (magic link / OTP verify redirect)
      const hash = window.location.hash.substring(1);
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            router.replace("/member");
            return;
          }
        }
      }

      // Check for PKCE code exchange (?code=...)
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace("/member");
          return;
        }
      }

      // If neither worked, redirect to login with error
      router.replace("/member/login?error=auth_failed");
    }

    handleAuth();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        color: "#615C52",
        fontSize: 14,
      }}
    >
      Signing you in...
    </div>
  );
}
