import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { nextPath: "/", reason: "default_home" },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
