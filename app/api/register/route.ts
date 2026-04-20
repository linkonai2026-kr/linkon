import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createServiceUser,
  recordServiceAccount,
  recordPreferences,
  type ServiceName,
} from "@/lib/auth/sync";

export const dynamic = "force-dynamic";

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  preferredService?: string;
  termsAgreed: boolean;
  marketingAgreed?: boolean;
}

export async function POST(req: Request) {
  let body: RegisterBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const {
    email,
    password,
    name,
    preferredService,
    termsAgreed,
    marketingAgreed = false,
  } = body;

  // 필수 항목 검증
  if (!email || !password || !name || !termsAgreed) {
    return NextResponse.json(
      { error: "이름, 이메일, 비밀번호, 약관 동의는 필수입니다." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const linkonAdmin = createAdminClient("linkon");

  // ── Step 1: linkon Supabase에 계정 생성 ──
  const { data: linkonUser, error: linkonError } =
    await linkonAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

  if (linkonError) {
    const isAlreadyRegistered =
      linkonError.message.includes("already been registered") ||
      linkonError.message.includes("already exists") ||
      linkonError.message.includes("duplicate");

    if (isAlreadyRegistered) {
      return NextResponse.json(
        { error: "이미 가입된 이메일 주소입니다." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: linkonError.message },
      { status: 400 }
    );
  }

  const linkonUid = linkonUser.user!.id;

  // ── Step 2: 세 서비스에 동시 계정 생성 (일부 실패해도 계속) ──
  const services: ServiceName[] = ["vion", "rion", "taxon"];
  const serviceResults = await Promise.allSettled(
    services.map((service) =>
      createServiceUser(service, { email, password, name })
    )
  );

  const results = serviceResults.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return { service: services[i], uid: null, error: result.reason?.message ?? "알 수 없는 오류" };
  });

  // ── Step 3: service_accounts 테이블 기록 ──
  await recordServiceAccount(linkonUid, results);

  // ── Step 4: registration_preferences 기록 ──
  await recordPreferences(linkonUid, {
    preferredService,
    termsAgreed,
    marketingAgreed,
  });

  // ── Step 5: linkon 로그인 세션 생성 ──
  const { data: sessionData, error: sessionError } =
    await linkonAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/select-service`,
      },
    });

  if (sessionError || !sessionData?.properties?.action_link) {
    // 계정은 생성됐지만 자동 로그인 불가 → 로그인 페이지로 안내
    return NextResponse.json({
      ok: true,
      autoLogin: false,
      syncResults: results.map((r) => ({
        service: r.service,
        success: r.error === null,
      })),
    });
  }

  return NextResponse.json({
    ok: true,
    autoLogin: true,
    magicLink: sessionData.properties.action_link,
    syncResults: results.map((r) => ({
      service: r.service,
      success: r.error === null,
    })),
  });
}
