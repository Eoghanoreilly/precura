import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Dev-only endpoint: generates a magic link without sending an email
// and redirects straight to it. Only works when ALLOWED_EMAILS is set
// (i.e., this is the private founder build, not a public product).

export async function POST(req: Request) {
  const { email } = await req.json();

  const allowed = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(email?.toLowerCase())) {
    return Response.json({ error: "Not on the access list." }, { status: 403 });
  }

  // Use the service_role key to generate a link without sending email
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: new URL("/member/auth/callback", req.url).origin + "/member/auth/callback",
    },
  });

  if (error || !data?.properties?.hashed_token) {
    return Response.json(
      { error: error?.message || "Failed to generate link." },
      { status: 500 }
    );
  }

  // Build the verification URL that Supabase Auth expects
  const verifyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?token=${data.properties.hashed_token}&type=magiclink&redirect_to=${encodeURIComponent(new URL("/member/auth/callback", req.url).origin + "/member/auth/callback")}`;

  return Response.json({ url: verifyUrl });
}
