import { NextResponse } from "next/server";
import { getAdminOverview } from "@/lib/linkon/admin";
import { requireSuperAdminRequest } from "@/lib/linkon/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireSuperAdminRequest();

    if (auth.error) {
      return auth.error;
    }

    return NextResponse.json(
      { overview: await getAdminOverview() },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "관리자 대시보드 정보를 불러오지 못했습니다.",
      },
      { status: 500 }
    );
  }
}
