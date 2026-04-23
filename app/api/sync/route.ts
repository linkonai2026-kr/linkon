import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookAuth } from "@/lib/auth/token";
import { ensureCanonicalUserProfile } from "@/lib/linkon/users";
import { syncServiceUserState } from "@/lib/linkon/service-sync";
import { ServiceName } from "@/lib/linkon/types";

export const dynamic = "force-dynamic";

interface SyncBody {
  event: "user.created" | "user.updated";
  service: ServiceName;
  email: string;
  name?: string;
  serviceUid?: string;
}

async function findLinkonAuthUserByEmail(email: string) {
  const linkonAdmin = createAdminClient("linkon");
  let page = 1;

  while (page <= 20) {
    const { data, error } = await linkonAdmin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(error.message);
    }

    const match = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
    );

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

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const authHeader = req.headers.get("Authorization");

    if (!verifyWebhookAuth(rawBody, authHeader)) {
      return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
    }

    let body: SyncBody;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "The request body is invalid." },
        { status: 400 }
      );
    }

    const { event, service, email, name, serviceUid } = body;

    if (!email || !service) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const linkonAdmin = createAdminClient("linkon");
    const existingUser = await findLinkonAuthUserByEmail(email);

    const linkonAuthUser =
      existingUser ??
      (
        await linkonAdmin.auth.admin.createUser({
          email,
          password: `${Math.random().toString(36).slice(-10)}Aa1!`,
          email_confirm: true,
          user_metadata: {
            full_name: name ?? "",
            needs_password_setup: true,
          },
        })
      ).data.user;

    if (!linkonAuthUser) {
      return NextResponse.json(
        { error: "The Linkon account could not be created or found." },
        { status: 500 }
      );
    }

    const profile = await ensureCanonicalUserProfile(linkonAuthUser);

    if (serviceUid) {
      const { error } = await linkonAdmin.from("service_accounts").upsert(
        {
          linkon_uid: profile.id,
          service,
          service_uid: serviceUid,
          service_email: email,
          sync_status: "succeeded",
          sync_error: null,
          last_synced_at: new Date().toISOString(),
        },
        { onConflict: "linkon_uid,service" }
      );

      if (error) {
        throw new Error(error.message);
      }
    }

    if (event === "user.updated") {
      await syncServiceUserState(
        service,
        {
          linkonUid: profile.id,
          email,
          name: name ?? profile.name,
          role: profile.role,
          accountStatus: profile.account_status,
          plan: profile.plan,
          billingState: profile.billing_state,
          suspensionReason: profile.suspension_reason,
          deletedAt: profile.deleted_at,
        },
        profile.id,
        "upsert"
      );
    }

    return NextResponse.json({
      ok: true,
      linkonUid: profile.id,
      service,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The sync request could not be completed.",
      },
      { status: 500 }
    );
  }
}
