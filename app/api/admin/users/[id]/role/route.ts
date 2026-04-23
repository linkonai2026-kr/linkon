import { NextResponse } from "next/server";
import { changeUserRole } from "@/lib/linkon/admin-actions";
import { USER_ROLES } from "@/lib/linkon/types";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const body = await request.json();
    const role = body.role;

    if (!USER_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const { id } = await context.params;
    const result = await changeUserRole(auth.profile.id, id, role);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Role update failed.",
      },
      { status: 500 }
    );
  }
}
