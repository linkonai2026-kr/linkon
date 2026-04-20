import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookAuth } from "@/lib/auth/token";
import {
  createServiceUser,
  recordServiceAccount,
  type ServiceName,
} from "@/lib/auth/sync";

export const dynamic = "force-dynamic";

interface SyncBody {
  event: "user.created";
  service: ServiceName;
  email: string;
  name?: string;
  serviceUid: string;
}

/**
 * POST /api/sync
 *
 * 개별 서비스(vion/rion/taxon)에서 직접 가입 시 호출하는 webhook
 * HMAC-SHA256 서명으로 인증 (LINKON_WEBHOOK_SECRET 공유)
 */
export async function POST(req: Request) {
  const rawBody = await req.text();

  // HMAC 서명 검증
  const authHeader = req.headers.get("Authorization");
  if (!verifyWebhookAuth(rawBody, authHeader)) {
    return NextResponse.json(
      { error: "인증 실패" },
      { status: 401 }
    );
  }

  let body: SyncBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const { event, service, email, name, serviceUid } = body;

  if (event !== "user.created") {
    return NextResponse.json({ ok: true, message: "이벤트 무시" });
  }

  if (!email || !service || !serviceUid) {
    return NextResponse.json(
      { error: "필수 필드가 누락되었습니다." },
      { status: 400 }
    );
  }

  const linkonAdmin = createAdminClient("linkon");

  // 1. linkon에 이미 계정이 있는지 확인
  const { data: existingUsers } = await linkonAdmin.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u) => u.email === email);

  let linkonUid: string;

  if (existingUser) {
    // 기존 계정 — service_accounts만 추가
    linkonUid = existingUser.id;
  } else {
    // linkon에 계정 없음 — 새로 생성 (비밀번호 없음: 랜덤 password로 생성)
    // 사용자가 linkon에 처음 접근 시 "비밀번호 설정" 또는 magic link 로그인 안내
    const tempPassword = Math.random().toString(36).slice(-12) + "Aa1!";
    const { data: newUser, error: createError } =
      await linkonAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: name ?? "", needs_password_setup: true },
      });

    if (createError) {
      return NextResponse.json(
        { error: `linkon 계정 생성 실패: ${createError.message}` },
        { status: 500 }
      );
    }

    linkonUid = newUser.user!.id;
  }

  // 2. 해당 서비스 service_account 기록
  await recordServiceAccount(linkonUid, [
    { service, uid: serviceUid, error: null },
  ]);

  // 3. 나머지 두 서비스에는 계정 생성을 하지 않음
  //    (비밀번호를 모르므로 — 사용자가 linkon에서 직접 통합 가입할 때 동기화)

  return NextResponse.json({
    ok: true,
    linkonUid,
    message: `${service} 가입이 linkon에 동기화되었습니다.`,
  });
}
