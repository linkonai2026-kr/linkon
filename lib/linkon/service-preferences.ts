import { createAdminClient } from "@/lib/supabase/admin";
import { ServiceName, SERVICE_NAMES } from "@/lib/linkon/types";

function isServiceName(value: unknown): value is ServiceName {
  return typeof value === "string" && SERVICE_NAMES.includes(value as ServiceName);
}

function firstService(values: unknown[]) {
  return values.find(isServiceName) ?? null;
}

export async function getPreferredServiceForUser(userId: string) {
  const admin = createAdminClient("linkon");

  const { data: profile } = await admin
    .from("users")
    .select("primary_service,last_used_service,most_used_service")
    .eq("id", userId)
    .maybeSingle();

  const profileService = firstService([
    profile?.primary_service,
    profile?.last_used_service,
    profile?.most_used_service,
  ]);

  if (profileService) {
    return profileService;
  }

  const [{ data: preference }, { data: context }, { data: serviceAccounts }] =
    await Promise.all([
      admin
        .from("registration_preferences")
        .select("preferred_service")
        .eq("linkon_uid", userId)
        .maybeSingle(),
      admin
        .from("linkon_user_context")
        .select("preferred_service")
        .eq("linkon_uid", userId)
        .maybeSingle(),
      admin
        .from("service_accounts")
        .select("service")
        .eq("linkon_uid", userId)
        .eq("is_enabled", true)
        .order("usage_count", { ascending: false })
        .order("last_accessed_at", { ascending: false, nullsFirst: false })
        .limit(1),
    ]);

  return firstService([
    preference?.preferred_service,
    context?.preferred_service,
    serviceAccounts?.[0]?.service,
  ]);
}

export async function rememberPreferredService(userId: string, service: ServiceName) {
  const admin = createAdminClient("linkon");
  const { data: profile } = await admin
    .from("users")
    .select("primary_service")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.primary_service) {
    await admin
      .from("users")
      .update({
        primary_service: service,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  }

  const { data: context } = await admin
    .from("linkon_user_context")
    .select("interest_tags")
    .eq("linkon_uid", userId)
    .maybeSingle();

  if (context) {
    const interestTags = Array.isArray(context.interest_tags)
      ? Array.from(new Set([...context.interest_tags, service]))
      : [service];

    await admin
      .from("linkon_user_context")
      .update({
        preferred_service: service,
        interest_tags: interestTags,
        updated_at: new Date().toISOString(),
      })
      .eq("linkon_uid", userId);
    return;
  }

  await admin.from("linkon_user_context").insert({
    linkon_uid: userId,
    preferred_service: service,
    interest_tags: [service],
    user_traits: {},
    memo_summary: `${service} preferred service`,
    risk_flags: [],
  });
}
