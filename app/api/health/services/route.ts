import { NextResponse } from "next/server";
import { getServiceHealth } from "@/lib/linkon/service-config";

export const dynamic = "force-dynamic";

export async function GET() {
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
