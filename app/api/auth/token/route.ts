import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateServiceMagicLink, type ServiceName } from "@/lib/auth/sync";

export const dynamic = "force-dynamic";

const SERVICE_URLS: Record<ServiceName, string> = {
  vion: process.env.NEXT_PUBLIC_VION_URL ?? "",
  rion: process.env.NEXT_PUBLIC_RION_URL ?? "",
  taxon: process.env.NEXT_PUBLIC_TAXON_URL ?? "",
};

/**
 * GET /api/auth/token?service=vion
 *
 * linkon 로그인 상태 검증 후 해당 서비스에 자동 로그인 magic link 생성
 * 302 redirect → {service}/api/auth/linkon-callback?token=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") as ServiceName | null;

  if (!service || !["vion", "rion", "taxon"].includes(service)) {
    return NextResponse.json(
      { error: "유효하지 않은 서비스입니다." },
      { status: 400 }
    );
  }

  // linkon 세션 검증
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/api/auth/token?service=${service}`
    );
  }

  const serviceUrl = SERVICE_URLS[service];
  if (!serviceUrl) {
    return NextResponse.json(
      { error: "서비스 URL이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  // 해당 서비스 Supabase에서 magic link 생성
  const callbackUrl = `${serviceUrl}/api/auth/linkon-callback`;
  const magicLink = await generateServiceMagicLink(service, user.email!, callbackUrl);

  if (!magicLink) {
    // magic link 생성 실패 → 해당 서비스 로그인 페이지로 리다이렉트
    return NextResponse.redirect(`${serviceUrl}/login?source=linkon&email=${encodeURIComponent(user.email!)}`);
  }

  // Supabase magic link로 직접 리다이렉트 (서비스가 알아서 세션 처리)
  return NextResponse.redirect(magicLink);
}
