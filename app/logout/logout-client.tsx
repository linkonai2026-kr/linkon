"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isAllowedServiceReturnTo } from "@/lib/linkon/service-config";
import { ServiceName } from "@/lib/linkon/types";

const SUPPORTED_SERVICES: readonly ServiceName[] = ["vion", "rion", "taxon"];

function isServiceName(value: string | null): value is ServiceName {
  return value !== null && (SUPPORTED_SERVICES as readonly string[]).includes(value);
}

export default function LogoutClient() {
  const params = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // 1) 브라우저 측 Supabase 세션 정리
      try {
        await createClient().auth.signOut();
      } catch {
        // 무시 — 어차피 다음 단계에서 서버 쿠키를 비움
      }

      // 2) 서버 측 쿠키 정리 (Linkon Supabase SSR 쿠키)
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
      } catch {
        // 무시 — 사용자 경험 우선으로 진행
      }

      if (cancelled) return;

      // 3) 안전한 returnTo 결정 후 리디렉트
      const serviceParam = params.get("service");
      const service: ServiceName = isServiceName(serviceParam) ? serviceParam : "vion";

      const candidate =
        params.get("returnTo") ||
        params.get("redirectTo") ||
        params.get("next");

      const target =
        candidate && isAllowedServiceReturnTo(service, candidate)
          ? candidate
          : "/login";

      window.location.replace(target);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        로그아웃 중...
      </div>
    </div>
  );
}
