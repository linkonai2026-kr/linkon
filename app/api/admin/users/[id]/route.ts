import { NextResponse } from "next/server";
import { getAdminUserDetail } from "@/lib/linkon/admin";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const { id } = await context.params;
    const user = await getAdminUserDetail(id);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load user details.",
      },
      { status: 500 }
    );
  }
}
