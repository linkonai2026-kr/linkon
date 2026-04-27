import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBlockedReason, ensureCanonicalUserProfile } from "@/lib/linkon/users";
import {
  findServiceAccount,
  recordServiceAccess,
  toServiceSyncPayload,
  syncServiceUserState,
} from "@/lib/linkon/service-sync";
import { ServiceName } from "@/lib/linkon/types";

export const dynamic = "force-dynamic";

const SERVICE_URLS: Record<ServiceName, string> = {
  vion: process.env.NEXT_PUBLIC_VION_URL ?? "",
  rion: process.env.NEXT_PUBLIC_RION_URL ?? "",
  taxon: process.env.NEXT_PUBLIC_TAXON_URL ?? "",
};

function getSafeReturnTo(returnTo: string | null, serviceUrl: string) {
  if (!returnTo) return null;

  try {
    const parsedReturnTo = new URL(returnTo);
    const parsedServiceUrl = new URL(serviceUrl);
    return parsedReturnTo.origin === parsedServiceUrl.origin ? returnTo : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service") as ServiceName | null;
    const returnTo = searchParams.get("returnTo");

    if (!service || !["vion", "rion", "taxon"].includes(service)) {
      return NextResponse.json(
        { error: "Invalid service." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/api/auth/token?service=${service}`
      );
    }

    const profile = await ensureCanonicalUserProfile(user);
    const blockedReason = getBlockedReason(profile);

    if (blockedReason) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${blockedReason}`
      );
    }

    const serviceUrl = SERVICE_URLS[service];
    if (!serviceUrl) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/select-service?error=service_unavailable`
      );
    }

    const existingServiceAccount = await findServiceAccount(user.id, service);

    if (existingServiceAccount && existingServiceAccount.is_enabled === false) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/select-service?error=service_disabled`
      );
    }

    const syncResult = await syncServiceUserState(
      service,
      toServiceSyncPayload(profile, user),
      user.id,
      "upsert"
    );

    if (!syncResult.success) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/select-service?error=service_sync_failed`
      );
    }

    await recordServiceAccess(user.id, service);

    const callbackUrl = new URL(`${serviceUrl}/api/auth/linkon-callback`);
    const safeReturnTo = getSafeReturnTo(returnTo, serviceUrl);

    if (safeReturnTo) {
      callbackUrl.searchParams.set("returnTo", safeReturnTo);
    }

    const serviceAdmin = await import("@/lib/supabase/admin");
    const { data, error } = await serviceAdmin
      .createAdminClient(service)
      .auth.admin.generateLink({
        type: "magiclink",
        email: user.email,
        options: { redirectTo: callbackUrl.toString() },
      });

    if (error || !data?.properties?.action_link) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/select-service?error=service_signin_failed`
      );
    }

    return NextResponse.redirect(data.properties.action_link);
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/select-service?error=service_signin_failed`
    );
  }
}
