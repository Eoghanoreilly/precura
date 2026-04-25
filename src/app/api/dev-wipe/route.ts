import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Dev-only endpoint: nukes an allowlisted user's auth + cascades all data.
// Use case: testing first-login / onboarding flows without touching real
// Supabase data manually.
//
// Sequence:
//   1. Look up profile by email.
//   2. Clean up polymorphic annotations targeting this user's panels and
//      biomarkers (annotations.target_id has no FK so they don't cascade).
//   3. admin.auth.admin.deleteUser(id) - cascade kills:
//        profiles -> panels -> biomarkers / panel_views / pre_reads
//        profiles -> chat_sessions -> chat_messages
//        profiles -> annotations (by author_id)
//        profiles -> emotional_rail_toggles (by member_id / doctor_id)
//   4. Next dev-login call recreates auth.users + profile via the
//      handle_new_user trigger, simulating a fresh first-time sign-in.

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email as string | undefined)?.toLowerCase();

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

    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (profileErr) {
      console.error("[dev-wipe] profile lookup:", profileErr.message);
      return NextResponse.json(
        { error: "Failed to look up profile." },
        { status: 500 },
      );
    }

    if (!profile) {
      return NextResponse.json({ ok: true, alreadyWiped: true });
    }

    const userId = profile.id;

    const { data: panels, error: panelsErr } = await admin
      .from("panels")
      .select("id")
      .eq("user_id", userId);
    if (panelsErr) {
      console.error("[dev-wipe] panels lookup:", panelsErr.message);
    }
    const panelIds = (panels ?? []).map((p) => p.id);

    let biomarkerIds: string[] = [];
    if (panelIds.length > 0) {
      const { data: bms, error: bmErr } = await admin
        .from("biomarkers")
        .select("id")
        .in("panel_id", panelIds);
      if (bmErr) {
        console.error("[dev-wipe] biomarkers lookup:", bmErr.message);
      }
      biomarkerIds = (bms ?? []).map((b) => b.id);
    }

    if (panelIds.length > 0) {
      const { error } = await admin
        .from("annotations")
        .delete()
        .eq("target_type", "panel")
        .in("target_id", panelIds);
      if (error) {
        console.error("[dev-wipe] panel annotations:", error.message);
      }
    }
    if (biomarkerIds.length > 0) {
      const { error } = await admin
        .from("annotations")
        .delete()
        .eq("target_type", "biomarker")
        .in("target_id", biomarkerIds);
      if (error) {
        console.error("[dev-wipe] biomarker annotations:", error.message);
      }
    }

    const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      console.error("[dev-wipe] deleteUser:", deleteErr.message);
      return NextResponse.json(
        { error: deleteErr.message || "Failed to delete user." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[dev-wipe] uncaught:", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Wipe failed for an unknown reason.",
      },
      { status: 500 },
    );
  }
}
