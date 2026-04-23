"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DoctorAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      const supabase = createClient();

      // Hash fragment (magic link / OTP)
      const hash = window.location.hash.substring(1);
      if (hash && hash.includes("access_token")) {
        const p = new URLSearchParams(hash);
        const accessToken = p.get("access_token");
        const refreshToken = p.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            await routeByRole();
            return;
          }
        }
      }

      // PKCE code exchange
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          await routeByRole();
          return;
        }
      }

      router.replace("/doctor/login?error=auth_failed");
    }

    async function routeByRole() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/doctor/login?error=auth_failed");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "doctor" || profile?.role === "both") {
        router.replace("/doctor");
      } else {
        router.replace("/member");
      }
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
        fontFamily: "var(--font-sans)",
        color: "var(--ink-muted)",
        fontSize: "var(--text-meta)",
        background: "var(--canvas)",
      }}
    >
      Signing you in...
    </div>
  );
}
