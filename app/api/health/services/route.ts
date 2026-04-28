import { NextResponse } from "next/server";
import { requireSuperAdminRequest } from "@/lib/linkon/http";
import { getServiceHealth } from "@/lib/linkon/service-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireSuperAdminRequest().catch(() => ({
    error: NextResponse.json({ error: "Authentication is required." }, { status: 401 }),
  }));

  if (auth.error) {
    return auth.error;
  }

  const services = getServiceHealth();

  return NextResponse.json(
    {
      ok: services.every((service) => service.urlReady),
      services,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
