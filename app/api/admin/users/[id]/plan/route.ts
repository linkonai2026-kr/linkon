import { NextResponse } from "next/server";
import { changeUserPlan } from "@/lib/linkon/admin-actions";
import { PLAN_TIERS } from "@/lib/linkon/types";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSuperAdminRequest();

    if ("error" in auth) {
      return auth.error;
    }

    const body = await request.json();
    const plan = body.plan;

    if (!PLAN_TIERS.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const { id } = await context.params;
    const result = await changeUserPlan(auth.profile.id, id, plan);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Plan update failed.",
      },
      { status: 500 }
    );
  }
}
