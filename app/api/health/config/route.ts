import { NextResponse } from "next/server";
import { getConfigHealth } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getConfigHealth(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
