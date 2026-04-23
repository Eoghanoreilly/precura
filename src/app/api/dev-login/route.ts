import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Dev-only endpoint: creates a signed-in session for an allowlisted email
// without sending an email or depending on Supabase's Redirect URL allowlist.
//
// Flow:
//   1. Ensure auth.users + profiles rows exist (create via admin.createUser
//      if missing; the auto-profile trigger fires synchronously).
//   2. Optionally upgrade the target profile's role.
//   3. Ask the admin API to generateLink to obtain a hashed_token.
//   4. Use the SSR Supabase client (which writes auth cookies via our
//      setAll handler) to verifyOtp against that token. The session gets
//      baked into cookies attached to the outgoing NextResponse.
//   5. Return a same-origin redirect URL.

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email as string | undefined)?.toLowerCase();
  const redirect = (body.redirect as string | undefined) || "/member";
  const role = body.role as "doctor" | "both" | "patient" | undefined;

  const allowed = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !allowed.includes(email)) {
    return NextResponse.json(
      { error: "Not on the access list." },
      { status: 403 },
    );
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 1. Ensure user + profile exist. admin.generateLink requires an existing
  // auth.users row; first-time Tomas needs createUser first.
  let profileRow: { id: string } | null = null;
  {
    const { data, error: profileErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profileErr) {
      console.error("[dev-login] profile lookup:", profileErr.message);
    }
    profileRow = data;
  }

  if (!profileRow) {
    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createErr) {
      console.error("[dev-login] createUser:", createErr.message);
      return NextResponse.json(
        { error: createErr.message || "Failed to create user." },
        { status: 500 },
      );
    }
    const { data, error: relookupErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (relookupErr) {
      console.error("[dev-login] profile re-lookup:", relookupErr.message);
    }
    profileRow = data;
  }

  // 2. Optional role upgrade (existing and freshly created users alike).
  if (role && profileRow) {
    const { error: updErr } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", profileRow.id);
    if (updErr) {
      console.error("[dev-login] role update:", updErr.message);
    }
  }

  // 3. Generate magic link to obtain a hashed_token we can verify server-side.
  const { data: linkData, error: linkErr } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
  if (linkErr || !linkData?.properties?.hashed_token) {
    console.error(
      "[dev-login] generateLink failed:",
      linkErr?.message,
      JSON.stringify(linkData),
    );
    return NextResponse.json(
      { error: linkErr?.message || "Failed to generate link." },
      { status: 500 },
    );
  }

  // 4. Verify the token through the SSR client, buffering the cookies.
  const cookieBuffer: {
    name: string;
    value: string;
    options?: Record<string, unknown>;
  }[] = [];
  const ssr = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {
          for (const c of cookiesToSet) {
            cookieBuffer.push({
              name: c.name,
              value: c.value,
              options: c.options as Record<string, unknown>,
            });
          }
        },
      },
    },
  );

  const { data: otpData, error: otpErr } = await ssr.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "magiclink",
  });
  if (otpErr || !otpData?.session) {
    console.error("[dev-login] verifyOtp:", otpErr?.message);
    return NextResponse.json(
      { error: otpErr?.message || "Failed to verify." },
      { status: 500 },
    );
  }

  // 5. Return a same-origin redirect, cookies attached.
  const response = NextResponse.json({ url: redirect });
  for (const c of cookieBuffer) {
    response.cookies.set({
      name: c.name,
      value: c.value,
      ...(c.options ?? {}),
    });
  }
  return response;
}
