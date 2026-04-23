import { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ACCOUNT_STATUSES,
  BILLING_STATES,
  CanonicalUserProfile,
  PLAN_TIERS,
  USER_ROLES,
} from "@/lib/linkon/types";
import { linkonEnv } from "@/lib/linkon/env";

const PROFILE_DEFAULTS = {
  role: "customer",
  account_status: "active",
  plan: "free",
  billing_state: "manual",
  suspension_reason: null,
  deleted_at: null,
  last_synced_at: null,
} as const;

function isOneOf<T extends readonly string[]>(value: string | null | undefined, allowed: T): value is T[number] {
  return Boolean(value && allowed.includes(value));
}

export function normalizeCanonicalUserProfile(row: Record<string, unknown>): CanonicalUserProfile {
  const role = typeof row.role === "string" ? row.role : undefined;
  const accountStatus = typeof row.account_status === "string" ? row.account_status : undefined;
  const plan = typeof row.plan === "string" ? row.plan : undefined;
  const billingState = typeof row.billing_state === "string" ? row.billing_state : undefined;

  return {
    id: String(row.id),
    email: String(row.email ?? ""),
    name: typeof row.name === "string" ? row.name : null,
    role: isOneOf(role, USER_ROLES)
      ? role
      : PROFILE_DEFAULTS.role,
    account_status: isOneOf(accountStatus, ACCOUNT_STATUSES)
      ? accountStatus
      : PROFILE_DEFAULTS.account_status,
    plan: isOneOf(plan, PLAN_TIERS)
      ? plan
      : PROFILE_DEFAULTS.plan,
    billing_state: isOneOf(billingState, BILLING_STATES)
      ? billingState
      : PROFILE_DEFAULTS.billing_state,
    deleted_at: typeof row.deleted_at === "string" ? row.deleted_at : null,
    suspension_reason: typeof row.suspension_reason === "string" ? row.suspension_reason : null,
    last_synced_at: typeof row.last_synced_at === "string" ? row.last_synced_at : null,
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

export async function ensureCanonicalUserProfile(user: User) {
  const linkonAdmin = createAdminClient("linkon");
  const superAdminEmail = linkonEnv.superAdminEmail();
  const normalizedEmail = user.email?.trim().toLowerCase() ?? "";
  const shouldBeSuperAdmin = Boolean(superAdminEmail && normalizedEmail === superAdminEmail);
  const existingProfile = await getCanonicalUserProfile(user.id);

  const payload = {
    id: user.id,
    email: normalizedEmail,
    name:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : existingProfile?.name ?? null,
    role: existingProfile?.role ?? PROFILE_DEFAULTS.role,
    account_status: existingProfile?.account_status ?? PROFILE_DEFAULTS.account_status,
    plan: existingProfile?.plan ?? PROFILE_DEFAULTS.plan,
    billing_state: existingProfile?.billing_state ?? PROFILE_DEFAULTS.billing_state,
    suspension_reason: existingProfile?.suspension_reason ?? PROFILE_DEFAULTS.suspension_reason,
    deleted_at: existingProfile?.deleted_at ?? PROFILE_DEFAULTS.deleted_at,
    last_synced_at: existingProfile?.last_synced_at ?? PROFILE_DEFAULTS.last_synced_at,
  };

  const { data, error } = await linkonAdmin
    .from("users")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to ensure canonical user profile: ${error.message}`);
  }

  let profile = normalizeCanonicalUserProfile(data);

  if (shouldBeSuperAdmin && profile.role !== "super_admin") {
    const promoted = await updateCanonicalUserProfile(user.id, {
      role: "super_admin",
    });
    profile = promoted;
  }

  if (profile.role !== user.app_metadata?.linkon_role) {
    await linkonAdmin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...user.app_metadata,
        linkon_role: profile.role,
      },
    });
  }

  return profile;
}

export async function getCanonicalUserProfile(userId: string) {
  const linkonAdmin = createAdminClient("linkon");
  const { data, error } = await linkonAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }

  return normalizeCanonicalUserProfile(data);
}

export async function updateCanonicalUserProfile(
  userId: string,
  patch: Partial<
    Pick<
      CanonicalUserProfile,
      "role" | "account_status" | "plan" | "billing_state" | "suspension_reason" | "deleted_at" | "last_synced_at"
    >
  >
) {
  const linkonAdmin = createAdminClient("linkon");
  const { data, error } = await linkonAdmin
    .from("users")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }

  return normalizeCanonicalUserProfile(data);
}

export function isUserBlocked(profile: CanonicalUserProfile) {
  return profile.account_status === "suspended" || profile.account_status === "deleted" || Boolean(profile.deleted_at);
}

export function getBlockedReason(profile: CanonicalUserProfile) {
  if (profile.account_status === "deleted" || profile.deleted_at) {
    return "account_deleted";
  }

  if (profile.account_status === "suspended") {
    return "account_suspended";
  }

  return null;
}
