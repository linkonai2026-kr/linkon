import { createAdminClient } from "@/lib/supabase/admin";
import {
  AdminAuditLogRecord,
  AccountStatus,
  AdminListFilters,
  CanonicalUserProfile,
  PlanTier,
  ServiceAccountRecord,
  SERVICE_NAMES,
  SERVICE_ROLES,
  SYNC_JOB_STATUSES,
} from "@/lib/linkon/types";
import { normalizeCanonicalUserProfile } from "@/lib/linkon/users";

type UserRow = Record<string, unknown> & {
  service_accounts?: ServiceAccountRecord[] | null;
};

type AuditRow = Record<string, unknown>;

export interface AdminUserListItem extends CanonicalUserProfile {
  service_accounts: ServiceAccountRecord[];
}

export interface AdminUserDetail extends AdminUserListItem {
  audit_logs: AdminAuditLogRecord[];
}

export interface AdminOverview {
  totalUsers: number;
  statusCounts: Record<AccountStatus, number>;
  planCounts: Record<PlanTier, number>;
  serviceAccountCounts: Record<(typeof SERVICE_NAMES)[number], number>;
  recentUsers: Pick<
    CanonicalUserProfile,
    "id" | "email" | "name" | "role" | "account_status" | "plan" | "created_at"
  >[];
  recentAuditLogs: AdminAuditLogRecord[];
}

function normalizeAdminUser(row: UserRow): AdminUserListItem {
  return {
    ...normalizeCanonicalUserProfile(row),
    service_accounts: Array.isArray(row.service_accounts)
      ? row.service_accounts.map((account) => ({
          ...account,
          is_enabled: account.is_enabled !== false,
          service_role: SERVICE_ROLES.includes(account.service_role ?? "user")
            ? account.service_role
            : "user",
          sync_status:
            account.sync_status && SYNC_JOB_STATUSES.includes(account.sync_status)
              ? account.sync_status
              : "pending",
          usage_count: Number(account.usage_count ?? 0),
          last_accessed_at: account.last_accessed_at ?? null,
        }))
      : [],
  };
}

function normalizeAuditLog(row: AuditRow): AdminAuditLogRecord {
  return {
    id: typeof row.id === "string" ? row.id : undefined,
    actor_uid: typeof row.actor_uid === "string" ? row.actor_uid : null,
    target_uid: String(row.target_uid ?? ""),
    action: String(row.action ?? ""),
    before_state: typeof row.before_state === "object" && row.before_state ? (row.before_state as Record<string, unknown>) : null,
    after_state: typeof row.after_state === "object" && row.after_state ? (row.after_state as Record<string, unknown>) : null,
    sync_result: typeof row.sync_result === "object" && row.sync_result ? (row.sync_result as Record<string, unknown>) : null,
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
  };
}

function countBy<T extends string>(
  items: Record<string, unknown>[],
  key: string,
  values: readonly T[]
): Record<T, number> {
  const initial = Object.fromEntries(values.map((value) => [value, 0])) as Record<T, number>;

  return items.reduce<Record<T, number>>((counts, item) => {
    const value = item[key];

    if (typeof value === "string" && values.includes(value as T)) {
      const countKey = value as T;
      counts[countKey] = (counts[countKey] ?? 0) + 1;
    }

    return counts;
  }, initial);
}

function toAdminDataError(error: unknown) {
  if (error instanceof Error) {
    return new Error(
      `Linkon DB를 불러오지 못했습니다. Supabase SQL Editor에서 supabase/schema.sql이 적용되어 있는지 확인해 주세요. 원인: ${error.message}`
    );
  }

  return new Error(
    "Linkon DB를 불러오지 못했습니다. Supabase SQL Editor에서 supabase/schema.sql이 적용되어 있는지 확인해 주세요."
  );
}

export async function getAdminOverview() {
  try {
    const admin = createAdminClient("linkon");
    const { data: users, error: usersError } = await admin
      .from("users")
      .select("id,email,name,role,account_status,plan,created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (usersError) {
      throw usersError;
    }

    const { data: serviceAccounts, error: serviceError } = await admin
      .from("service_accounts")
      .select("service")
      .limit(5000);

    if (serviceError) {
      throw serviceError;
    }

    const { data: auditLogs, error: auditError } = await admin
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    if (auditError) {
      throw auditError;
    }

    const normalizedUsers = (users ?? []).map((row) =>
      normalizeCanonicalUserProfile(row as Record<string, unknown>)
    );
    const serviceRows = (serviceAccounts ?? []) as Record<string, unknown>[];

    return {
      totalUsers: normalizedUsers.length,
      statusCounts: countBy(normalizedUsers as unknown as Record<string, unknown>[], "account_status", [
        "active",
        "suspended",
        "deleted",
      ] as const),
      planCounts: countBy(normalizedUsers as unknown as Record<string, unknown>[], "plan", [
        "free",
        "standard",
        "premium",
        "enterprise",
      ] as const),
      serviceAccountCounts: countBy(serviceRows, "service", SERVICE_NAMES),
      recentUsers: normalizedUsers.slice(0, 6).map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        account_status: user.account_status,
        plan: user.plan,
        created_at: user.created_at,
      })),
      recentAuditLogs: (auditLogs ?? []).map((row) => normalizeAuditLog(row as AuditRow)),
    } satisfies AdminOverview;
  } catch (error) {
    throw toAdminDataError(error);
  }
}

export async function listAdminUsers(filters: AdminListFilters = {}) {
  const admin = createAdminClient("linkon");
  let query = admin
    .from("users")
    .select("*, service_accounts(*)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filters.status && filters.status !== "all") {
    query = query.eq("account_status", filters.status);
  }

  if (filters.plan && filters.plan !== "all") {
    query = query.eq("plan", filters.plan);
  }

  if (filters.query) {
    const safeQuery = filters.query.replace(/[%_]/g, "");
    query = query.or(`email.ilike.%${safeQuery}%,name.ilike.%${safeQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load admin users: ${error.message}`);
  }

  return (data ?? []).map((row) => normalizeAdminUser(row as UserRow));
}

export async function getAdminUserDetail(userId: string) {
  const admin = createAdminClient("linkon");
  const { data, error } = await admin
    .from("users")
    .select("*, service_accounts(*)")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Failed to load user detail: ${error.message}`);
  }

  const { data: auditData, error: auditError } = await admin
    .from("admin_audit_logs")
    .select("*")
    .eq("target_uid", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (auditError) {
    throw new Error(`Failed to load audit logs: ${auditError.message}`);
  }

  return {
    ...normalizeAdminUser(data as UserRow),
    audit_logs: (auditData ?? []).map((row) => normalizeAuditLog(row as AuditRow)),
  } satisfies AdminUserDetail;
}

export async function createAdminAuditLog(entry: AdminAuditLogRecord) {
  const admin = createAdminClient("linkon");
  const { error } = await admin.from("admin_audit_logs").insert(entry);

  if (error) {
    throw new Error(`Failed to create admin audit log: ${error.message}`);
  }
}
