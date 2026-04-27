"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SyncResult {
  service: string;
  success: boolean;
}

const SERVICE_INFO = {
  vion: {
    name: "Vion",
    desc: "심리 및 시니어 케어 AI",
    logo: "/assets/vion-no.png",
    color: "vion",
  },
  rion: {
    name: "Rion",
    desc: "법률 비서 AI",
    logo: "/assets/rion-no.png",
    color: "rion",
  },
  taxon: {
    name: "Taxon",
    desc: "세무 관리 AI",
    logo: "/assets/taxon-no.png",
    color: "taxon",
  },
} as const;

type ServiceKey = keyof typeof SERVICE_INFO;

export default function SelectServiceClient() {
  const searchParams = useSearchParams();
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [loading, setLoading] = useState<ServiceKey | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("linkon_sync");
      if (stored) {
        setSyncResults(JSON.parse(stored));
        sessionStorage.removeItem("linkon_sync");
      }
    } catch {
      // Ignore malformed session storage values.
    }
  }, []);

  useEffect(() => {
    const error = searchParams.get("error");

    if (error === "service_unavailable") {
      setErrorMessage("아직 연결 준비 중인 서비스입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (error === "service_sync_failed") {
      setErrorMessage("이 서비스와 계정 동기화에 실패했습니다. 다시 시도하거나 관리자에게 문의해 주세요.");
      return;
    }

    if (error === "service_disabled") {
      setErrorMessage("관리자에 의해 이 서비스 접근 권한이 비활성화되었습니다.");
      return;
    }

    if (error === "service_signin_failed") {
      setErrorMessage("서비스 자동 로그인을 만들지 못했습니다. 다시 시도해 주세요.");
      return;
    }

    setErrorMessage("");
  }, [searchParams]);

  const getSyncStatus = (service: string) => {
    const result = syncResults.find((item) => item.service === service);
    return result ? result.success : null;
  };

  const handleServiceClick = (service: ServiceKey) => {
    setLoading(service);
    window.location.href = `/api/auth/token?service=${service}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "520px" }}>
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
              <path
                d="M6 16l8 8 12-12"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="auth-title">계정 준비가 완료되었습니다</h1>
          <p className="auth-subtitle">
            Linkon 통합 계정이 활성화되었습니다.
            <br />
            계속 이용할 서비스를 선택해 주세요.
          </p>
        </div>

        {errorMessage && (
          <div className="error-box" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="service-select-grid">
          {(Object.entries(SERVICE_INFO) as [ServiceKey, (typeof SERVICE_INFO)[ServiceKey]][]).map(
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
                        {syncOk ? "동기화 완료" : "이전 동기화 확인 필요"}
                      </div>
                    )}
                  </div>
                  <div className="service-select-card__arrow">
                    {isLoading ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="animate-spin"
                        aria-label="불러오는 중"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="25 15"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M4 10h12M12 6l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
          나중에 선택하고 싶다면{" "}
          <Link href="/" style={{ color: "var(--linkon-accent)" }}>
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
