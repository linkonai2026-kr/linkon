import { NextResponse } from "next/server";
import { changeUserStatus } from "@/lib/linkon/admin-actions";
import { ACCOUNT_STATUSES } from "@/lib/linkon/types";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const body = await request.json();
    const status = body.status;
    const suspensionReason =
      typeof body.suspensionReason === "string" ? body.suspensionReason : null;

    if (!ACCOUNT_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid account status." }, { status: 400 });
    }

    const { id } = await context.params;
    const result = await changeUserStatus(auth.profile.id, id, status, suspensionReason);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Status update failed.",
      },
      { status: 500 }
    );
  }
}
