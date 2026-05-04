import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureCanonicalUserProfile, getBlockedReason } from "@/lib/linkon/users";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const profile = user ? await ensureCanonicalUserProfile(user) : null;
    const blockedReason = profile ? getBlockedReason(profile) : null;

    return NextResponse.json(
      {
        authenticated: Boolean(user?.email && !blockedReason),
        email: user?.email ?? null,
        role: profile?.role ?? null,
        accountStatus: profile?.account_status ?? null,
        isSuperAdmin: profile?.role === "super_admin" && !blockedReason,
        blockedReason,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        email: null,
        role: null,
        accountStatus: null,
        isSuperAdmin: false,
        blockedReason: null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
