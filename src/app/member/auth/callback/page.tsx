"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Handles both flows:
// 1. Hash fragment (#access_token=...) from magic link / dev login
// 2. Query param (?code=...) from PKCE email confirmation
//
// Also reads optional `?next=<path>` to route the user past authentication
// into a specific surface (used by /doctor/login to land in /doctor after
// a shared callback). The role is checked before honoring `next` so a
// patient account cannot land inside /doctor by passing the param.

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/member";

  useEffect(() => {
    async function handleAuth() {
      const supabase = createClient();

      const hash = window.location.hash.substring(1);
      if (hash && hash.includes("access_token")) {
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            await routeAfterAuth();
            return;
          }
        }
      }

      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          await routeAfterAuth();
          return;
        }
      }

      router.replace("/member/login?error=auth_failed");
    }

    async function routeAfterAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/member/login?error=auth_failed");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role: "patient" | "doctor" | "both" | undefined = profile?.role;
      const wantsDoctor = next.startsWith("/doctor");

      if (wantsDoctor) {
        if (role === "doctor" || role === "both") {
          // Use full navigation so middleware picks up the new auth cookies
          window.location.href = next;
        } else {
          window.location.href = "/member";
        }
        return;
      }

      // Default member destination, but strict doctors always go to /doctor
      if (role === "doctor") {
        window.location.href = "/doctor";
      } else {
        window.location.href = next;
      }
    }

    handleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
