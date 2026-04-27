import { NextResponse } from "next/server";
import { recordServiceAccess } from "@/lib/linkon/service-sync";
import { ServiceName, SERVICE_NAMES } from "@/lib/linkon/types";

export const dynamic = "force-dynamic";

interface ServiceUsageBody {
  service?: string;
  linkon_uid?: string;
  event_type?: string;
}

function isServiceName(value: unknown): value is ServiceName {
  return typeof value === "string" && SERVICE_NAMES.includes(value as ServiceName);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isAuthorized(request: Request) {
  const secret = process.env.LINKON_WEBHOOK_SECRET;

  if (!secret) {
    return false;
  }

  const headerValue = request.headers.get("x-linkon-webhook-secret");
  return headerValue === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: ServiceUsageBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const service = body.service;
  const linkonUid = body.linkon_uid;

  if (!isServiceName(service)) {
    return NextResponse.json({ error: "Invalid service." }, { status: 400 });
  }

  if (!linkonUid || !isUuid(linkonUid)) {
    return NextResponse.json({ error: "Invalid Linkon user id." }, { status: 400 });
  }

  // Linkon stores only aggregate usage metadata. Service-specific content,
  // documents, PDFs, and detailed histories remain in each service database.
  await recordServiceAccess(linkonUid, service);

  return NextResponse.json({
    ok: true,
    event_type: body.event_type ?? "service_access",
  });
}
