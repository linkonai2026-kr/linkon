import { NextResponse } from "next/server";
import { resyncUser } from "@/lib/linkon/admin-actions";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const { id } = await context.params;
    const result = await resyncUser(auth.profile.id, id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Service resync failed.",
      },
      { status: 500 }
    );
  }
}
