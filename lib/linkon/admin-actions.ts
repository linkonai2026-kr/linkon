import { createAdminClient } from "@/lib/supabase/admin";
import { createAdminAuditLog, getAdminUserDetail } from "@/lib/linkon/admin";
import { syncAllServices, toServiceSyncPayload } from "@/lib/linkon/service-sync";
import { getCanonicalUserProfile, updateCanonicalUserProfile } from "@/lib/linkon/users";
import { AccountStatus, PlanTier, UserRole } from "@/lib/linkon/types";

const BLOCK_BAN_DURATION = "876000h";

async function getAuthUser(userId: string) {
  const admin = createAdminClient("linkon");
  const { data, error } = await admin.auth.admin.getUserById(userId);

  if (error || !data.user?.email) {
    throw new Error(error?.message ?? "The auth user could not be found.");
  }

  return data.user;
}

async function countActiveSuperAdmins() {
  const admin = createAdminClient("linkon");
  const { count, error } = await admin
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin")
    .eq("account_status", "active")
    .is("deleted_at", null);

  if (error) {
    throw new Error(`Failed to count super admins: ${error.message}`);
  }

  return count ?? 0;
}

async function assertAdminActionAllowed(
  actorUid: string,
  targetUid: string,
  options: {
    nextRole?: UserRole;
    nextStatus?: AccountStatus;
    deleting?: boolean;
  } = {}
) {
  const targetProfile = await getCanonicalUserProfile(targetUid);

  if (!targetProfile) {
    throw new Error("The target user account could not be found.");
  }

  const removingOwnAccess =
    actorUid === targetUid &&
    (options.deleting ||
      (options.nextRole && options.nextRole !== "super_admin") ||
      (options.nextStatus && options.nextStatus !== "active"));

  if (removingOwnAccess) {
    throw new Error("You cannot suspend, delete, or demote the super admin account you are using right now.");
  }

  const wouldRemoveSuperAdmin =
    targetProfile.role === "super_admin" &&
    (options.deleting ||
      (options.nextRole !== undefined && options.nextRole !== "super_admin") ||
      (options.nextStatus !== undefined && options.nextStatus !== "active"));

  if (wouldRemoveSuperAdmin) {
    const activeSuperAdminCount = await countActiveSuperAdmins();

    if (activeSuperAdminCount <= 1) {
      throw new Error("The last active super admin account cannot be suspended, deleted, or demoted.");
    }
  }

  return targetProfile;
}

async function updateLinkonAuthState(
  userId: string,
  patch: {
    role: UserRole;
    accountStatus: AccountStatus;
    plan: PlanTier;
    billingState: "manual" | "active" | "past_due" | "canceled";
    deletedAt: string | null;
    suspensionReason: string | null;
  }
) {
  const admin = createAdminClient("linkon");
  const authUser = await getAuthUser(userId);
  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...authUser.app_metadata,
      linkon_role: patch.role,
      linkon_account_status: patch.accountStatus,
      linkon_plan: patch.plan,
      linkon_billing_state: patch.billingState,
      linkon_deleted_at: patch.deletedAt,
      linkon_suspension_reason: patch.suspensionReason,
    },
    ban_duration: patch.accountStatus === "active" ? "none" : BLOCK_BAN_DURATION,
  });

  if (error) {
    throw new Error(`Failed to update Linkon auth state: ${error.message}`);
  }
}

async function syncAndAudit(
  actorUid: string,
  targetUid: string,
  action: string,
  mode: "upsert" | "delete" = "upsert",
  beforeState?: Awaited<ReturnType<typeof getAdminUserDetail>>
) {
  const before = beforeState ?? (await getAdminUserDetail(targetUid));
  const authUser = await getAuthUser(targetUid);
  const results = await syncAllServices(
    toServiceSyncPayload(before, authUser),
    actorUid,
    mode
  );
  const after = await getAdminUserDetail(targetUid);

  await createAdminAuditLog({
    actor_uid: actorUid,
    target_uid: targetUid,
    action,
    before_state: before,
    after_state: after,
    sync_result: {
      mode,
      results,
    },
  });

  return {
    user: after,
    syncResults: results,
  };
}

export async function changeUserRole(actorUid: string, targetUid: string, role: UserRole) {
  const before = await getAdminUserDetail(targetUid);
  const currentProfile = await assertAdminActionAllowed(actorUid, targetUid, {
    nextRole: role,
  });
  const nextProfile = await updateCanonicalUserProfile(targetUid, { role });

  await updateLinkonAuthState(targetUid, {
    role,
    accountStatus: nextProfile.account_status,
    plan: nextProfile.plan,
    billingState: nextProfile.billing_state,
    deletedAt: nextProfile.deleted_at,
    suspensionReason: nextProfile.suspension_reason,
  });

  return syncAndAudit(
    actorUid,
    targetUid,
    currentProfile.role === role ? "role.reconfirmed" : "role.updated",
    "upsert",
    before
  );
}

export async function changeUserPlan(actorUid: string, targetUid: string, plan: PlanTier) {
  const before = await getAdminUserDetail(targetUid);
  const currentProfile = await assertAdminActionAllowed(actorUid, targetUid);
  const nextProfile = await updateCanonicalUserProfile(targetUid, {
    plan,
    billing_state: "active",
  });

  await updateLinkonAuthState(targetUid, {
    role: nextProfile.role,
    accountStatus: nextProfile.account_status,
    plan: nextProfile.plan,
    billingState: nextProfile.billing_state,
    deletedAt: nextProfile.deleted_at,
    suspensionReason: nextProfile.suspension_reason,
  });

  return syncAndAudit(
    actorUid,
    targetUid,
    currentProfile.plan === plan ? "plan.reconfirmed" : "plan.updated",
    "upsert",
    before
  );
}

export async function changeUserStatus(
  actorUid: string,
  targetUid: string,
  accountStatus: AccountStatus,
  suspensionReason: string | null = null
) {
  const before = await getAdminUserDetail(targetUid);
  const currentProfile = await assertAdminActionAllowed(actorUid, targetUid, {
    nextStatus: accountStatus,
  });
  const nextProfile = await updateCanonicalUserProfile(targetUid, {
    account_status: accountStatus,
    suspension_reason: accountStatus === "suspended" ? suspensionReason : null,
    deleted_at: accountStatus === "deleted" ? new Date().toISOString() : null,
  });

  await updateLinkonAuthState(targetUid, {
    role: nextProfile.role,
    accountStatus: nextProfile.account_status,
    plan: nextProfile.plan,
    billingState: nextProfile.billing_state,
    deletedAt: nextProfile.deleted_at,
    suspensionReason: nextProfile.suspension_reason,
  });

  return syncAndAudit(
    actorUid,
    targetUid,
    currentProfile.account_status === accountStatus
      ? "status.reconfirmed"
      : "status.updated",
    accountStatus === "deleted" ? "delete" : "upsert",
    before
  );
}

export async function deleteUserAccount(actorUid: string, targetUid: string) {
  const before = await getAdminUserDetail(targetUid);
  const currentProfile = await assertAdminActionAllowed(actorUid, targetUid, {
    deleting: true,
  });
  const nextProfile = await updateCanonicalUserProfile(targetUid, {
    account_status: "deleted",
    suspension_reason: "Deleted by administrator.",
    deleted_at: new Date().toISOString(),
  });

  await updateLinkonAuthState(targetUid, {
    role: nextProfile.role,
    accountStatus: nextProfile.account_status,
    plan: nextProfile.plan,
    billingState: nextProfile.billing_state,
    deletedAt: nextProfile.deleted_at,
    suspensionReason: nextProfile.suspension_reason,
  });

  return syncAndAudit(
    actorUid,
    targetUid,
    currentProfile.account_status === "deleted"
      ? "user.delete_reconfirmed"
      : "user.deleted",
    "delete",
    before
  );
}

export async function resyncUser(actorUid: string, targetUid: string) {
  await assertAdminActionAllowed(actorUid, targetUid);
  const before = await getAdminUserDetail(targetUid);
  const mode = before.account_status === "deleted" || before.deleted_at ? "delete" : "upsert";
  return syncAndAudit(actorUid, targetUid, "user.resynced", mode, before);
}
