import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureCanonicalUserProfile, getBlockedReason } from "@/lib/linkon/users";

export const dynamic = "force-dynamic";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function buildLoginRedirect(
  origin: string,
  errorCode: string,
  searchParams: URLSearchParams,
) {
  const params = new URLSearchParams({ error: errorCode });
  const service = searchParams.get("service");
  const returnTo = searchParams.get("returnTo") ?? searchParams.get("next");

  if (service && /^(vion|rion|taxon)$/.test(service)) {
    params.set("service", service);
  }

  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    params.set("returnTo", returnTo);
  }

  return `${origin}/login?${params.toString()}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  try {
    if (!code) {
      // 자동 복구: 이미 유효한 세션이 있으면 에러 없이 next로 이동
      // (페이지 새로고침 / 중복 클릭 / 캐시된 콜백 진입 시 사용자 혼란 방지)
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          return NextResponse.redirect(`${origin}${next}`);
        }
      } catch {
        // 세션 확인 실패 시에도 명확한 에러 안내로 계속 진행
      }

      return NextResponse.redirect(
        buildLoginRedirect(origin, "auth_callback_no_code", searchParams),
      );
    }

    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        buildLoginRedirect(origin, "auth_callback_expired", searchParams),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const profile = await ensureCanonicalUserProfile(user);
      const blockedReason = getBlockedReason(profile);

      if (blockedReason) {
        return NextResponse.redirect(
          buildLoginRedirect(origin, blockedReason, searchParams),
        );
      }
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return NextResponse.redirect(
      buildLoginRedirect(origin, "auth_callback_failed", searchParams),
    );
  }
}
