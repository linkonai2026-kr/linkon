"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SyncResult {
  service: string;
  success: boolean;
}

const SERVICE_INFO = {
  vion: {
    name: "Vion",
    desc: "심리 및 실버 케어 AI",
    logo: "/assets/vion-no.png",
    color: "vion",
    url: process.env.NEXT_PUBLIC_VION_URL ?? "#",
  },
  rion: {
    name: "Rion",
    desc: "법률 비서 AI",
    logo: "/assets/rion-no.png",
    color: "rion",
    url: process.env.NEXT_PUBLIC_RION_URL ?? "#",
  },
  taxon: {
    name: "Taxon",
    desc: "재무 관리 AI",
    logo: "/assets/taxon-no.png",
    color: "taxon",
    url: process.env.NEXT_PUBLIC_TAXON_URL ?? "#",
  },
} as const;

type ServiceKey = keyof typeof SERVICE_INFO;

export default function SelectServiceClient() {
  const router = useRouter();
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [loading, setLoading] = useState<ServiceKey | null>(null);

  useEffect(() => {
    // 세션 스토리지에서 동기화 결과 읽기
    try {
      const stored = sessionStorage.getItem("linkon_sync");
      if (stored) {
        setSyncResults(JSON.parse(stored));
        sessionStorage.removeItem("linkon_sync");
      }
    } catch {
      // 무시
    }
  }, []);

  const getSyncStatus = (service: string) => {
    const result = syncResults.find((r) => r.service === service);
    if (!result) return null;
    return result.success;
  };

  const handleServiceClick = async (service: ServiceKey) => {
    setLoading(service);
    // /api/auth/token?service=vion 으로 이동 → magic link → 해당 서비스 자동 로그인
    window.location.href = `/api/auth/token?service=${service}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "520px" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "var(--radius-full)",
              background: "rgba(22, 163, 74, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-4)",
            }}
            aria-hidden="true"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16l8 8 12-12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="auth-title">가입 완료!</h1>
          <p className="auth-subtitle">
            Linkon 계정이 생성되었습니다.<br />
            이용할 서비스를 선택하면 바로 시작할 수 있어요.
          </p>
        </div>

        {/* 서비스 카드 목록 */}
        <div className="service-select-grid">
          {(Object.entries(SERVICE_INFO) as [ServiceKey, typeof SERVICE_INFO[ServiceKey]][]).map(
            ([key, info]) => {
              const syncOk = getSyncStatus(key);
              const isLoading = loading === key;

              return (
                <button
                  key={key}
                  type="button"
                  className={`service-select-card service-select-card--${info.color}`}
                  onClick={() => handleServiceClick(key)}
                  disabled={isLoading || loading !== null}
                  style={{
                    background: "var(--bg-primary)",
                    cursor: loading !== null && !isLoading ? "not-allowed" : "pointer",
                    opacity: loading !== null && !isLoading ? 0.6 : 1,
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                    padding: "var(--space-5)",
                    borderRadius: "var(--radius-lg)",
                    width: "100%",
                    textAlign: "left",
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}
                >
                  <Image
                    src={info.logo}
                    alt={info.name}
                    className="service-select-card__logo"
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="service-select-card__info" style={{ flex: 1 }}>
                    <div className="service-select-card__name">{info.name}</div>
                    <div className="service-select-card__desc">{info.desc}</div>
                    {syncOk !== null && (
                      <div
                        className={`service-select-card__sync service-select-card__sync--${syncOk ? "ok" : "fail"}`}
                        style={{ marginTop: "4px" }}
                      >
                        {syncOk ? "✓ 연동 완료" : "⚠ 연동 중 오류 — 로그인 후 이용 가능"}
                      </div>
                    )}
                  </div>
                  <div className="service-select-card__arrow">
                    {isLoading ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-spin" aria-label="로딩 중">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="25 15"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            marginTop: "var(--space-5)",
          }}
        >
          나중에 선택해도 됩니다.{" "}
          <Link href="/" style={{ color: "var(--linkon-accent)" }}>
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
