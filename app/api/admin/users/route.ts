import { NextRequest, NextResponse } from "next/server";
import { listAdminUsers } from "@/lib/linkon/admin";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? undefined;
    const status = searchParams.get("status") ?? "all";
    const plan = searchParams.get("plan") ?? "all";

    const users = await listAdminUsers({
      query,
      status: status as "all",
      plan: plan as "all",
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load the admin user list.",
      },
      { status: 500 }
    );
  }
}
