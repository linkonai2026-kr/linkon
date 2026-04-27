import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureCanonicalUserProfile } from "@/lib/linkon/users";
import { syncServiceUserState, toServiceSyncPayload } from "@/lib/linkon/service-sync";
import { ServiceName, SERVICE_NAMES } from "@/lib/linkon/types";

export const dynamic = "force-dynamic";

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  preferredService?: string;
  returnTo?: string;
  termsAgreed: boolean;
  marketingAgreed?: boolean;
}

function isServiceName(value: unknown): value is ServiceName {
  return typeof value === "string" && SERVICE_NAMES.includes(value as ServiceName);
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function isAllowedReturnTo(returnTo: string | undefined, service: ServiceName | null) {
  if (!returnTo || !service) return false;

  const allowedUrl = {
    vion: process.env.NEXT_PUBLIC_VION_URL,
    rion: process.env.NEXT_PUBLIC_RION_URL,
    taxon: process.env.NEXT_PUBLIC_TAXON_URL,
  }[service];

  if (!allowedUrl) return false;

  try {
    return new URL(returnTo).origin === new URL(allowedUrl).origin;
  } catch {
    return false;
  }
}

function getPostRegisterRedirect(service: ServiceName | null, returnTo: string | undefined) {
  const appUrl = getAppUrl();

  if (!service) {
    return `${appUrl}/select-service`;
  }

  const params = new URLSearchParams({ service });

  if (returnTo && isAllowedReturnTo(returnTo, service)) {
    params.set("returnTo", returnTo);
  }

  return `${appUrl}/api/auth/token?${params.toString()}`;
}

export async function POST(req: Request) {
  try {
    let body: RegisterBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "회원가입 요청 형식이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      name,
      preferredService,
      returnTo,
      termsAgreed,
      marketingAgreed = false,
    } = body;

    if (!email || !password || !name || !termsAgreed) {
      return NextResponse.json(
        { error: "이름, 이메일, 비밀번호, 필수 약관 동의가 필요합니다." },
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
    const { data: createdUser, error: createError } =
      await linkonAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

    if (createError) {
      const isAlreadyRegistered =
        createError.message.includes("already been registered") ||
        createError.message.includes("already exists") ||
        createError.message.includes("duplicate");

      return NextResponse.json(
        {
          error: isAlreadyRegistered ? "이미 가입된 이메일입니다." : createError.message,
        },
        { status: isAlreadyRegistered ? 409 : 400 }
      );
    }

    if (!createdUser.user) {
      return NextResponse.json(
        { error: "계정을 생성하지 못했습니다." },
        { status: 500 }
      );
    }

    const profile = await ensureCanonicalUserProfile(createdUser.user);
    const selectedService = isServiceName(preferredService) ? preferredService : null;
    const syncResults = selectedService
      ? [
          await syncServiceUserState(
            selectedService,
            toServiceSyncPayload(profile, createdUser.user, password),
            createdUser.user.id,
            "upsert"
          ),
        ]
      : [];

    const { error: preferenceError } = await linkonAdmin
      .from("registration_preferences")
      .upsert(
        {
          linkon_uid: createdUser.user.id,
          preferred_service: selectedService,
          terms_agreed: termsAgreed,
          terms_agreed_at: new Date().toISOString(),
          marketing_agreed: marketingAgreed,
        },
        { onConflict: "linkon_uid" }
      );

    if (preferenceError) {
      return NextResponse.json(
        {
          error: `계정은 생성되었지만 가입 설정 저장에 실패했습니다: ${preferenceError.message}`,
        },
        { status: 500 }
      );
    }

    const { error: contextError } = await linkonAdmin
      .from("linkon_user_context")
      .upsert(
        {
          linkon_uid: createdUser.user.id,
          preferred_service: selectedService,
          interest_tags: selectedService ? [selectedService] : [],
          user_traits: {},
          memo_summary: selectedService ? `${selectedService} signup interest` : "Linkon signup",
          risk_flags: [],
        },
        { onConflict: "linkon_uid" }
      );

    if (contextError) {
      return NextResponse.json(
        {
          error: `계정은 생성되었지만 사용자 컨텍스트 저장에 실패했습니다: ${contextError.message}`,
        },
        { status: 500 }
      );
    }

    const { data: sessionData, error: sessionError } =
      await linkonAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: getPostRegisterRedirect(selectedService, returnTo),
        },
      });

    const serializedSyncResults = syncResults.map((result) => ({
      service: result.service,
      success: result.success,
    }));

    if (sessionError || !sessionData?.properties?.action_link) {
      return NextResponse.json({
        ok: true,
        autoLogin: false,
        nextPath: selectedService
          ? `/api/auth/token?service=${selectedService}`
          : "/select-service",
        syncResults: serializedSyncResults,
      });
    }

    return NextResponse.json({
      ok: true,
      autoLogin: true,
      magicLink: sessionData.properties.action_link,
      nextPath: selectedService
        ? `/api/auth/token?service=${selectedService}`
        : "/select-service",
      syncResults: serializedSyncResults,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "회원가입 중 예상하지 못한 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
