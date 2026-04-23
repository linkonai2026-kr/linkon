import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureCanonicalUserProfile, getBlockedReason } from "@/lib/linkon/users";
import { CanonicalUserProfile } from "@/lib/linkon/types";

export interface SessionContext {
  authUserId: string;
  email: string;
  profile: CanonicalUserProfile;
}

export async function requireSessionContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const profile = await ensureCanonicalUserProfile(user);
  const blockedReason = getBlockedReason(profile);

  if (blockedReason) {
    redirect(`/login?error=${blockedReason}`);
  }

  return {
    authUserId: user.id,
    email: user.email,
    profile,
  } satisfies SessionContext;
}

export async function requireSuperAdminSession() {
  const session = await requireSessionContext();

  if (session.profile.role !== "super_admin") {
    redirect("/login?error=admin_required");
  }

  return session;
}
