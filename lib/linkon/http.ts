import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureCanonicalUserProfile, getBlockedReason } from "@/lib/linkon/users";

export async function requireSuperAdminRequest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      error: NextResponse.json({ error: "Sign-in is required." }, { status: 401 }),
    };
  }

  const profile = await ensureCanonicalUserProfile(user);
  const blockedReason = getBlockedReason(profile);

  if (blockedReason) {
    return {
      error: NextResponse.json(
        { error: "This account is blocked.", code: blockedReason },
        { status: 403 }
      ),
    };
  }

  if (profile.role !== "super_admin") {
    return {
      error: NextResponse.json(
        { error: "Super admin access is required." },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    profile,
  };
}
