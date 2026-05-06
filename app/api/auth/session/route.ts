import { NextResponse } from "next/server";
import { linkonEnv } from "@/lib/linkon/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase
          .from("users")
          .select("role, account_status, deleted_at")
          .eq("id", user.id)
          .maybeSingle()
      : { data: null };

    const accountStatus =
      typeof profile?.account_status === "string" ? profile.account_status : null;
    const deletedAt = typeof profile?.deleted_at === "string" ? profile.deleted_at : null;
    const blockedReason =
      accountStatus === "deleted" || deletedAt
        ? "account_deleted"
        : accountStatus === "suspended"
          ? "account_suspended"
          : null;
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
        accountStatus,
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
