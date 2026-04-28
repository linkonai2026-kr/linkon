import { NextResponse } from "next/server";
import { requireSuperAdminRequest } from "@/lib/linkon/http";
import { getConfigHealth } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireSuperAdminRequest();

  if (auth.error) {
    return auth.error;
  }

  return NextResponse.json(getConfigHealth(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
