import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureCanonicalUserProfile, getBlockedReason } from "@/lib/linkon/users";

export const dynamic = "force-dynamic";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  try {
    if (!code) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const profile = await ensureCanonicalUserProfile(user);
      const blockedReason = getBlockedReason(profile);

      if (blockedReason) {
        return NextResponse.redirect(`${origin}/login?error=${blockedReason}`);
      }
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }
}
