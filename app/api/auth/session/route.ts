import { NextResponse } from "next/server";
import { linkonEnv } from "@/lib/linkon/env";
import { createClient } from "@/lib/supabase/server";
import { getBlockedReason, getCanonicalUserProfile } from "@/lib/linkon/users";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const profile = user ? await getCanonicalUserProfile(user.id) : null;
    const blockedReason = profile ? getBlockedReason(profile) : null;
    const normalizedEmail = user?.email?.trim().toLowerCase() ?? null;
    const bootstrapSuperAdminEmail = linkonEnv.superAdminEmail();
    const role =
      profile?.role ??
      (normalizedEmail && bootstrapSuperAdminEmail === normalizedEmail ? "super_admin" : null);

    return NextResponse.json(
      {
        authenticated: Boolean(user?.email && !blockedReason),
        email: user?.email ?? null,
        role,
        accountStatus: profile?.account_status ?? null,
        isSuperAdmin: role === "super_admin" && !blockedReason,
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
