export const USER_ROLES = ["customer", "admin", "super_admin"] as const;
export const ACCOUNT_STATUSES = ["active", "suspended", "deleted"] as const;
export const PLAN_TIERS = ["free", "standard", "premium", "enterprise"] as const;
export const BILLING_STATES = ["manual", "active", "past_due", "canceled"] as const;
export const SERVICE_NAMES = ["vion", "rion", "taxon"] as const;
export const SERVICE_ROLES = ["user", "service_admin"] as const;
export const SYNC_ACTIONS = ["upsert", "status", "plan", "role", "delete", "resync"] as const;
export const SYNC_JOB_STATUSES = ["pending", "processing", "succeeded", "failed"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
export type PlanTier = (typeof PLAN_TIERS)[number];
export type BillingState = (typeof BILLING_STATES)[number];
export type ServiceName = (typeof SERVICE_NAMES)[number];
export type ServiceRole = (typeof SERVICE_ROLES)[number];
export type SyncAction = (typeof SYNC_ACTIONS)[number];
export type SyncJobStatus = (typeof SYNC_JOB_STATUSES)[number];

export interface CanonicalUserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  account_status: AccountStatus;
  plan: PlanTier;
  billing_state: BillingState;
  deleted_at: string | null;
  suspension_reason: string | null;
  last_synced_at: string | null;
  last_login_at: string | null;
  primary_service: ServiceName | null;
  most_used_service: ServiceName | null;
  last_used_service: ServiceName | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceAccountRecord {
  id?: string;
  linkon_uid: string;
  service: ServiceName;
  service_uid: string | null;
  service_email?: string | null;
  is_enabled?: boolean;
  service_role?: ServiceRole;
  sync_status?: SyncJobStatus | null;
  sync_error?: string | null;
  last_synced_at?: string | null;
  last_accessed_at?: string | null;
  usage_count?: number;
  deleted_at?: string | null;
  created_at?: string;
}

export interface LinkonUserContextRecord {
  id?: string;
  linkon_uid: string;
  user_traits: Record<string, unknown>;
  interest_tags: string[];
  preferred_service: ServiceName | null;
  memo_summary: string | null;
  risk_flags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AdminAuditLogRecord {
  id?: string;
  actor_uid: string | null;
  target_uid: string;
  action: string;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  sync_result: Record<string, unknown> | null;
  created_at?: string;
}

export interface ServiceSyncJobRecord {
  id?: string;
  linkon_uid: string;
  service: ServiceName;
  action: SyncAction;
  status: SyncJobStatus;
  payload: Record<string, unknown>;
  actor_uid: string | null;
  attempts?: number;
  last_error?: string | null;
  synced_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceSyncPayload {
  linkonUid: string;
  email: string;
  name: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  plan: PlanTier;
  billingState: BillingState;
  suspensionReason: string | null;
  deletedAt: string | null;
  serviceRole?: ServiceRole;
  serviceEnabled?: boolean;
  password?: string;
}

export interface ServiceSyncOutcome {
  service: ServiceName;
  success: boolean;
  serviceUid: string | null;
  error: string | null;
}

export interface AdminListFilters {
  query?: string;
  status?: AccountStatus | "all";
  plan?: PlanTier | "all";
}
