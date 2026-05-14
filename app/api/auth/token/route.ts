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

    // user.id 만 의존하는 작업들과 profile 조회를 병렬화하여 round trip을 단축.
    // rememberPreferredService 의 반환값은 사용하지 않으나, 같은 Promise.all 묶음에서
    // 에러가 발생하면 전체가 reject 되어 기존 동작과 동일하게 catch 블록으로 떨어진다.
    const [profile, existingServiceAccount] = await Promise.all([
      ensureCanonicalUserProfile(user),
      findServiceAccount(user.id, service),
      rememberPreferredService(user.id, service),
    ]);

    const blockedReason = getBlockedReason(profile);

    if (blockedReason) {
      return NextResponse.redirect(
        `${getAppUrl()}/login?error=${blockedReason}`
      );
    }

    if (existingServiceAccount && existingServiceAccount.is_enabled === false) {
      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_disabled`
      );
    }

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

    // 위에서 이미 조회한 existingServiceAccount 를 hint 로 전달하여
    // recordServiceAccess 내부의 findServiceAccount 호출을 생략.
    await recordServiceAccess(user.id, service, existingServiceAccount);

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

    if (error || !data?.properties?.hashed_token) {
      if (isDirectVionHandoff(service)) {
        return NextResponse.redirect(
          `${getAppUrl()}/login?error=service_signin_failed`
        );
      }

      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_signin_failed`
      );
    }

    // Build the service callback URL with token_hash + type so the downstream
    // (SSR) app can call supabase.auth.verifyOtp({ token_hash, type }) directly.
    // Going through Supabase's /auth/v1/verify endpoint returns the session in
    // the URL fragment (#access_token=...), which a server route cannot read —
    // that path breaks SSR callbacks like Vion's /auth/callback.
    const callbackUrl = new URL(redirectTo);
    callbackUrl.searchParams.set("token_hash", data.properties.hashed_token);
    callbackUrl.searchParams.set("type", "magiclink");

    return NextResponse.redirect(callbackUrl.toString());
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
