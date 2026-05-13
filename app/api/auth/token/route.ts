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

    // Phase 2 최적화: 서로 독립적인 두 호출을 병렬 처리하여 응답 지연 단축.
    // ensureCanonicalUserProfile은 사용자 프로필 확인/보정, findServiceAccount는
    // 서비스 계정 조회로 둘 다 user.id만 필요하며 상호 의존성이 없음.
    const [profile, existingServiceAccount] = await Promise.all([
      ensureCanonicalUserProfile(user),
      findServiceAccount(user.id, service),
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

    // Phase 2: 선호 서비스 기록은 응답 지연에서 분리 (fire-and-forget).
    // 실패해도 로그인 흐름은 정상 진행.
    void rememberPreferredService(user.id, service).catch(() => {});

    const serviceUrl = getServiceUrl(service);
    if (!serviceUrl) {
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
      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_setup_required`
      );
    }

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

    // Phase 2: 접근 로그 기록은 응답 지연에서 분리 (fire-and-forget).
    void recordServiceAccess(user.id, service).catch(() => {});

    const redirectTo = safeReturnTo ?? getDefaultServiceReturnTo(service);

    if (!redirectTo) {
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
      return NextResponse.redirect(
        `${getAppUrl()}/select-service?error=service_signin_failed`
      );
    }

    return NextResponse.redirect(data.properties.action_link);
  } catch (error) {
    console.error("[linkon] service token handoff failed:", error);
    return NextResponse.redirect(
      `${getAppUrl()}/select-service?error=service_signin_failed`
    );
  }
}
