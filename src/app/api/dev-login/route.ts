import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Dev-only endpoint: generates a magic link without sending an email
// and returns the direct URL for the client to follow. Only works when
// ALLOWED_EMAILS is set (private founder build, not a public product).
//
// Optional body params:
//   - redirect: path to redirect to after auth (default "/member/auth/callback")
//   - role:     "doctor" | "both" | "patient" - if set, updates the target
//               profile's role BEFORE generating the link so the user lands
//               in the intended surface without a separate SQL step.

export async function POST(req: Request) {
  const body = await req.json();
  const email = body.email as string | undefined;
  const redirect = (body.redirect as string | undefined) || "/member/auth/callback";
  const role = body.role as "doctor" | "both" | "patient" | undefined;

  const allowed = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !allowed.includes(email.toLowerCase())) {
    return Response.json({ error: "Not on the access list." }, { status: 403 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Optionally upgrade the target profile's role. This is a dev convenience so
  // developers can hit "Test doctor login" and skip a manual SQL step.
  if (role) {
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profileErr) {
      console.error("[dev-login] profile lookup failed:", profileErr.message);
    } else if (profile) {
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", profile.id);
      if (updErr) {
        console.error("[dev-login] role update failed:", updErr.message);
      }
    }
  }

  const origin = new URL(redirect, req.url).origin;
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: origin + redirect,
    },
  });

  if (error || !data?.properties?.action_link) {
    console.error(
      "[dev-login] generateLink failed:",
      error?.message,
      JSON.stringify(data),
    );
    return Response.json(
      { error: error?.message || "Failed to generate link." },
      { status: 500 },
    );
  }

  return Response.json({ url: data.properties.action_link });
}
