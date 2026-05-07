import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBlockedReason, ensureCanonicalUserProfile } from "@/lib/linkon/users";
import {
  findServiceAccount,
  recordServiceAccess,
  toServiceSyncPayload,
  syncServiceUserState,
} from "@/lib/linkon/service-sync";
import { ServiceName } from "@/lib/linkon/types";
import { getAppUrl } from "@/lib/supabase/config";
import {
  getDefaultServiceReturnTo,
  getServiceUrl,
  isAllowedServiceReturnTo,
  isServiceDownstreamAuthReady,
} from "@/lib/linkon/service-config";
import { rememberPreferredService } from "@/lib/linkon/service-preferences";

export const dynamic = "force-dynamic";

function getSafeReturnTo(service: ServiceName, returnTo: string | null) {
  return isAllowedServiceReturnTo(service, returnTo) ? returnTo : null;
}

function isDirectVionHandoff(service: ServiceName) {
  return service === "vion";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service") as ServiceName | null;
    const returnTo = searchParams.get("returnTo");

    if (!service || !["vion", "rion", "taxon"].includes(service)) {
      return NextResponse.json(
        { error: "Invalid service." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      const redirectPath = `/api/auth/token?${searchParams.toString()}`;
      return NextResponse.redirect(
        `${getAppUrl()}/login?redirect=${encodeURIComponent(redirectPath)}`
      );
    }

    const profile = await ensureCanonicalUserProfile(user);
    const blockedReason = getBlockedReason(profile);

    if (blockedReason) {
      return NextResponse.redirect(
        `${getAppUrl()}/login?error=${blockedReason}`
      );
    }

    const existingServiceAccount = await findServiceAccount(user.id, service);

    if (existingServiceAccount && existingServiceAccount.is_enabled === false) {
      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_disabled`
      );
    }

    await rememberPreferredService(user.id, service);

    const serviceUrl = getServiceUrl(service);
    if (!serviceUrl) {
      if (isDirectVionHandoff(service)) {
        return NextResponse.redirect(
          `${getAppUrl()}/login?error=service_unavailable`
        );
      }

      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_unavailable`
      );
    }

    const safeReturnTo = getSafeReturnTo(service, returnTo);

    if (returnTo && !safeReturnTo) {
      return NextResponse.redirect(
        `${getAppUrl()}/login?error=service_return_to_invalid`
      );
    }

    if (!isServiceDownstreamAuthReady(service)) {
      if (isDirectVionHandoff(service)) {
        return NextResponse.redirect(
          `${getAppUrl()}/login?error=service_setup_required`
        );
      }

      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_setup_required`
      );
    }

    if (!isDirectVionHandoff(service)) {
      const syncResult = await syncServiceUserState(
        service,
        toServiceSyncPayload(profile, user),
        user.id,
        "upsert"
      );

      if (!syncResult.success) {
        return NextResponse.redirect(
          `${getAppUrl()}/select-service?error=service_sync_failed`
        );
      }
    }

    await recordServiceAccess(user.id, service);

    const redirectTo = safeReturnTo ?? getDefaultServiceReturnTo(service);

    if (!redirectTo) {
      if (isDirectVionHandoff(service)) {
        return NextResponse.redirect(
          `${getAppUrl()}/login?error=service_unavailable`
        );
      }

      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_unavailable`
      );
    }

    const serviceAdmin = await import("@/lib/supabase/admin");
    const { data, error } = await serviceAdmin
      .createAdminClient(service)
      .auth.admin.generateLink({
        type: "magiclink",
        email: user.email,
        options: { redirectTo },
      });

    if (error || !data?.properties?.action_link) {
      if (isDirectVionHandoff(service)) {
        return NextResponse.redirect(
          `${getAppUrl()}/login?error=service_signin_failed`
        );
      }

      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_signin_failed`
      );
    }

    return NextResponse.redirect(data.properties.action_link);
  } catch (error) {
    console.error("[linkon] service token handoff failed:", error);

    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    if (service === "vion") {
      return NextResponse.redirect(
        `${getAppUrl()}/login?error=service_signin_failed`
      );
    }

    return NextResponse.redirect(
      `${getAppUrl()}/select-service?error=service_signin_failed`
    );
  }
}
