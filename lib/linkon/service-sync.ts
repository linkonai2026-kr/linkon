import { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CanonicalUserProfile,
  ServiceAccountRecord,
  ServiceName,
  ServiceSyncJobRecord,
  ServiceSyncOutcome,
  ServiceSyncPayload,
} from "@/lib/linkon/types";

const SERVICE_METADATA_KEY = "linkon";
const SUSPEND_BAN_DURATION = "876000h";

function getLinkonAdmin() {
  return createAdminClient("linkon");
}

function randomPassword() {
  return `${Math.random().toString(36).slice(-10)}Aa1!`;
}

async function findServiceAccount(linkonUid: string, service: ServiceName) {
  const admin = getLinkonAdmin();
  const { data, error } = await admin
    .from("service_accounts")
    .select("*")
    .eq("linkon_uid", linkonUid)
    .eq("service", service)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read service account for ${service}: ${error.message}`);
  }

  return (data as ServiceAccountRecord | null) ?? null;
}

async function saveServiceAccount(record: ServiceAccountRecord) {
  const admin = getLinkonAdmin();
  const { error } = await admin.from("service_accounts").upsert(
    {
      ...record,
      last_synced_at: record.last_synced_at ?? new Date().toISOString(),
      sync_status: record.sync_status ?? "succeeded",
    },
    {
      onConflict: "linkon_uid,service",
    }
  );

  if (error) {
    throw new Error(`Failed to persist service account for ${record.service}: ${error.message}`);
  }
}

async function createSyncJob(job: ServiceSyncJobRecord) {
  const admin = getLinkonAdmin();
  const { data, error } = await admin
    .from("service_sync_jobs")
    .insert({
      ...job,
      attempts: 0,
      last_error: null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create sync job: ${error.message}`);
  }

  return data as ServiceSyncJobRecord;
}

async function updateSyncJob(jobId: string, patch: Partial<ServiceSyncJobRecord>) {
  const admin = getLinkonAdmin();
  const { error } = await admin
    .from("service_sync_jobs")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(`Failed to update sync job: ${error.message}`);
  }
}

async function findServiceUserByEmail(service: ServiceName, email: string) {
  const admin = createAdminClient(service);
  let page = 1;

  while (page < 20) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(`Failed to list ${service} users: ${error.message}`);
    }

    const match = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());

    if (match) {
      return match;
    }

    if (!data.nextPage) {
      break;
    }

    page = data.nextPage;
  }

  return null;
}

async function resolveServiceUser(service: ServiceName, payload: ServiceSyncPayload) {
  const existingAccount = await findServiceAccount(payload.linkonUid, service);

  if (existingAccount?.service_uid) {
    return existingAccount.service_uid;
  }

  const existingUser = await findServiceUserByEmail(service, payload.email);
  return existingUser?.id ?? null;
}

async function upsertServiceUser(service: ServiceName, payload: ServiceSyncPayload) {
  const admin = createAdminClient(service);
  const existingUid = await resolveServiceUser(service, payload);

  const userMetadata = {
    full_name: payload.name,
  };

  const appMetadata = {
    [SERVICE_METADATA_KEY]: {
      linkon_uid: payload.linkonUid,
      account_status: payload.accountStatus,
      plan: payload.plan,
      role: payload.role,
      billing_state: payload.billingState,
      deleted_at: payload.deletedAt,
      suspension_reason: payload.suspensionReason,
      synced_at: new Date().toISOString(),
    },
  };

  if (!existingUid) {
    const { data, error } = await admin.auth.admin.createUser({
      email: payload.email,
      password: payload.password ?? randomPassword(),
      email_confirm: true,
      user_metadata: userMetadata,
      app_metadata: appMetadata,
      ban_duration: payload.accountStatus === "suspended" ? SUSPEND_BAN_DURATION : "none",
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.user?.id ?? null;
  }

  const { data, error } = await admin.auth.admin.updateUserById(existingUid, {
    email: payload.email,
    user_metadata: userMetadata,
    app_metadata: appMetadata,
    ban_duration: payload.accountStatus === "suspended" ? SUSPEND_BAN_DURATION : "none",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user?.id ?? existingUid;
}

async function deleteServiceUser(service: ServiceName, payload: ServiceSyncPayload) {
  const admin = createAdminClient(service);
  const serviceUid = await resolveServiceUser(service, payload);

  if (!serviceUid) {
    return null;
  }

  const { error } = await admin.auth.admin.deleteUser(serviceUid, true);

  if (error) {
    throw new Error(error.message);
  }

  return serviceUid;
}

export async function syncServiceUserState(
  service: ServiceName,
  payload: ServiceSyncPayload,
  actorUid: string | null,
  mode: "upsert" | "delete"
) {
  const job = await createSyncJob({
    linkon_uid: payload.linkonUid,
    service,
    action: mode === "delete" ? "delete" : "upsert",
    status: "processing",
    payload: payload as unknown as Record<string, unknown>,
    actor_uid: actorUid,
  });

  try {
    const serviceUid = mode === "delete"
      ? await deleteServiceUser(service, payload)
      : await upsertServiceUser(service, payload);

    await saveServiceAccount({
      linkon_uid: payload.linkonUid,
      service,
      service_uid: serviceUid,
      service_email: payload.email,
      sync_status: "succeeded",
      sync_error: null,
      last_synced_at: new Date().toISOString(),
      deleted_at: mode === "delete" ? new Date().toISOString() : null,
    });

    await updateSyncJob(String(job.id), {
      status: "succeeded",
      attempts: 1,
      last_error: null,
      synced_at: new Date().toISOString(),
    });

    return {
      service,
      success: true,
      serviceUid,
      error: null,
    } satisfies ServiceSyncOutcome;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";

    await saveServiceAccount({
      linkon_uid: payload.linkonUid,
      service,
      service_uid: await resolveServiceUser(service, payload),
      service_email: payload.email,
      sync_status: "failed",
      sync_error: message,
      last_synced_at: new Date().toISOString(),
    });

    await updateSyncJob(String(job.id), {
      status: "failed",
      attempts: 1,
      last_error: message,
    });

    return {
      service,
      success: false,
      serviceUid: null,
      error: message,
    } satisfies ServiceSyncOutcome;
  }
}

export async function syncAllServices(
  payload: ServiceSyncPayload,
  actorUid: string | null,
  mode: "upsert" | "delete" = "upsert"
) {
  const outcomes = await Promise.all(
    (["vion", "rion", "taxon"] as ServiceName[]).map((service) =>
      syncServiceUserState(service, payload, actorUid, mode)
    )
  );

  const admin = getLinkonAdmin();
  await admin
    .from("users")
    .update({
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.linkonUid);

  return outcomes;
}

export function toServiceSyncPayload(profile: CanonicalUserProfile, user: Pick<User, "email" | "user_metadata">, password?: string) {
  return {
    linkonUid: profile.id,
    email: user.email ?? profile.email,
    name: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : profile.name,
    role: profile.role,
    accountStatus: profile.account_status,
    plan: profile.plan,
    billingState: profile.billing_state,
    suspensionReason: profile.suspension_reason,
    deletedAt: profile.deleted_at,
    password,
  } satisfies ServiceSyncPayload;
}
