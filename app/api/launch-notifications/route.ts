import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SERVICES = ["rion", "taxon"] as const;

type LaunchService = (typeof SERVICES)[number];

interface LaunchNotificationBody {
  email?: string;
  service?: LaunchService;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isLaunchService(service: unknown): service is LaunchService {
  return typeof service === "string" && SERVICES.includes(service as LaunchService);
}

export async function POST(request: Request) {
  let body: LaunchNotificationBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const service = body.service;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "올바른 이메일 주소를 입력해 주세요." },
      { status: 400 }
    );
  }

  if (!isLaunchService(service)) {
    return NextResponse.json(
      { error: "출시 알림을 받을 서비스를 다시 선택해 주세요." },
      { status: 400 }
    );
  }

  const admin = createAdminClient("linkon");
  const { error } = await admin.from("launch_notifications").upsert(
    {
      email,
      service,
      source: "homepage",
    },
    {
      onConflict: "email,service",
      ignoreDuplicates: true,
    }
  );

  if (error) {
    return NextResponse.json(
      { error: `출시 알림 신청을 저장하지 못했습니다: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
