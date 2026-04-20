import { createAdminClient } from "@/lib/supabase/admin";

export type ServiceName = "vion" | "rion" | "taxon";

export interface CreateServiceUserResult {
  service: ServiceName;
  uid: string | null;
  error: string | null;
}

/**
 * 특정 서비스의 Supabase에 동일한 이메일/비밀번호로 계정 생성
 * admin API (service_role 키) 사용 — 이메일 확인 없이 즉시 생성
 */
export async function createServiceUser(
  service: ServiceName,
  params: { email: string; password: string; name: string }
): Promise<CreateServiceUserResult> {
  const admin = createAdminClient(service);

  const { data, error } = await admin.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true, // 이메일 확인 없이 즉시 활성화
    user_metadata: { full_name: params.name },
  });

  if (error) {
    // 이미 존재하는 사용자는 오류가 아닌 성공으로 처리
    if (
      error.message.includes("already been registered") ||
      error.message.includes("already exists") ||
      error.message.includes("duplicate")
    ) {
      // 기존 사용자의 uid 조회
      const { data: existingUsers } = await admin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(
        (u) => u.email === params.email
      );
      return { service, uid: existing?.id ?? null, error: null };
    }

    return { service, uid: null, error: error.message };
  }

  return { service, uid: data.user?.id ?? null, error: null };
}

/**
 * linkon DB의 service_accounts 테이블에 서비스 uid 기록
 */
export async function recordServiceAccount(
  linkonUid: string,
  results: CreateServiceUserResult[]
): Promise<void> {
  const admin = createAdminClient("linkon");

  const records = results
    .filter((r) => r.uid !== null)
    .map((r) => ({
      linkon_uid: linkonUid,
      service: r.service,
      service_uid: r.uid as string,
    }));

  if (records.length === 0) return;

  await admin.from("service_accounts").upsert(records, {
    onConflict: "linkon_uid,service",
    ignoreDuplicates: true,
  });
}

/**
 * linkon DB의 registration_preferences 기록
 */
export async function recordPreferences(
  linkonUid: string,
  params: {
    preferredService?: string;
    termsAgreed: boolean;
    marketingAgreed: boolean;
  }
): Promise<void> {
  const admin = createAdminClient("linkon");

  await admin.from("registration_preferences").upsert(
    {
      linkon_uid: linkonUid,
      preferred_service: params.preferredService ?? null,
      terms_agreed: params.termsAgreed,
      terms_agreed_at: params.termsAgreed ? new Date().toISOString() : null,
      marketing_agreed: params.marketingAgreed,
    },
    { onConflict: "linkon_uid" }
  );
}

/**
 * 서비스 자동 로그인용 magic link 생성
 * Supabase admin.generateLink 사용
 */
export async function generateServiceMagicLink(
  service: ServiceName,
  email: string,
  redirectTo: string
): Promise<string | null> {
  const admin = createAdminClient(service);

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !data?.properties?.action_link) {
    console.error(`[linkon] magic link 생성 실패 (${service}):`, error?.message);
    return null;
  }

  return data.properties.action_link;
}
