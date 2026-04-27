import { NextResponse } from "next/server";
import { changeServiceAccess } from "@/lib/linkon/admin-actions";
import { requireSuperAdminRequest } from "@/lib/linkon/http";
import { SERVICE_NAMES, SERVICE_ROLES, ServiceName } from "@/lib/linkon/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; service: string }> }
) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const { id, service } = await context.params;

    if (!SERVICE_NAMES.includes(service as (typeof SERVICE_NAMES)[number])) {
      return NextResponse.json({ error: "Invalid service." }, { status: 400 });
    }

    const serviceName = service as ServiceName;

    const body = await request.json();
    const isEnabled =
      typeof body.isEnabled === "boolean" ? body.isEnabled : undefined;
    const serviceRole =
      typeof body.serviceRole === "string" &&
      SERVICE_ROLES.includes(body.serviceRole)
        ? body.serviceRole
        : undefined;

    if (isEnabled === undefined && serviceRole === undefined) {
      return NextResponse.json(
        { error: "A service access or role change is required." },
        { status: 400 }
      );
    }

    const result = await changeServiceAccess(auth.profile.id, id, serviceName, {
      isEnabled,
      serviceRole,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Service access update failed.",
      },
      { status: 500 }
    );
  }
}
