import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceUrl, isServiceDownstreamAuthReady } from "@/lib/linkon/service-config";
import { findServiceAccount } from "@/lib/linkon/service-sync";
import { getPreferredServiceForUser } from "@/lib/linkon/service-preferences";
import {
  ensureCanonicalUserProfile,
  getBlockedReason,
  getCanonicalUserProfile,
} from "@/lib/linkon/users";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return NextResponse.json(
        { nextPath: "/login", reason: "not_authenticated" },
        { status: 401 }
      );
    }

    const profile =
      (await getCanonicalUserProfile(user.id)) ?? (await ensureCanonicalUserProfile(user));
    const blockedReason = getBlockedReason(profile);

    if (blockedReason) {
      return NextResponse.json({
        nextPath: `/login?error=${blockedReason}`,
        reason: blockedReason,
      });
    }

    const service = await getPreferredServiceForUser(user.id);

    if (!service) {
      return NextResponse.json({
        nextPath: "/select-service",
        reason: "service_selection_required",
      });
    }

    const serviceAccount = await findServiceAccount(user.id, service);

    if (serviceAccount?.is_enabled === false) {
      return NextResponse.json({
        nextPath: "/select-service?error=service_disabled",
        reason: "service_disabled",
      });
    }

    if (!getServiceUrl(service) || !isServiceDownstreamAuthReady(service)) {
      return NextResponse.json({
        nextPath: `/${service}`,
        reason: "service_not_ready",
      });
    }

    return NextResponse.json({
      nextPath: `/api/auth/token?service=${service}`,
      reason: "preferred_service",
      service,
    });
  } catch (error) {
    console.error("[linkon] post-login routing failed:", error);
    return NextResponse.json({
      nextPath: "/",
      reason: "fallback",
    });
  }
}
