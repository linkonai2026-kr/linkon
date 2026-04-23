import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureCanonicalUserProfile, getBlockedReason } from "@/lib/linkon/users";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/select-service";

  try {
    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
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
      }
    }
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
