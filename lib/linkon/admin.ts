import { createAdminClient } from "@/lib/supabase/admin";
import {
  AdminAuditLogRecord,
  AdminListFilters,
  CanonicalUserProfile,
  ServiceAccountRecord,
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

function normalizeAdminUser(row: UserRow): AdminUserListItem {
  return {
    ...normalizeCanonicalUserProfile(row),
    service_accounts: Array.isArray(row.service_accounts) ? row.service_accounts : [],
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
