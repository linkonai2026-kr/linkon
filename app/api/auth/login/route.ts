import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isInvalidApiKeyError, isSupabaseConfigError } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "로그인 요청 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 모두 입력해 주세요." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (isInvalidApiKeyError(error.message)) {
        console.error("[linkon] Supabase public API key is invalid for login.");
        return NextResponse.json(
          {
            error:
              "로그인 서버 설정을 확인하는 중입니다. 잠시 후 다시 시도하거나 운영팀에 문의해 주세요.",
            code: "auth_config_invalid",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "이메일 또는 비밀번호가 올바르지 않습니다.",
          code: "invalid_credentials",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    if (isSupabaseConfigError(error)) {
      console.error("[linkon] Supabase auth environment is incomplete or malformed.");
      return NextResponse.json(
        {
          error:
            "로그인 서버 설정이 아직 완료되지 않았습니다. 잠시 후 다시 시도하거나 운영팀에 문의해 주세요.",
          code: "auth_config_missing",
        },
        { status: 503 }
      );
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}
