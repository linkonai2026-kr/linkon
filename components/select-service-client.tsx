"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SyncResult {
  service: string;
  success: boolean;
}

interface SessionState {
  authenticated?: boolean;
  email?: string | null;
  isSuperAdmin?: boolean;
}

const SERVICE_INFO = {
  vion: {
    name: "Vion",
    desc: "일상 케어와 마음 관리를 돕는 AI",
    logo: "/assets/vion-no.png",
    color: "vion",
  },
  rion: {
    name: "Rion",
    desc: "법률 문서 이해를 돕는 AI",
    logo: "/assets/rion-no.png",
    color: "rion",
  },
  taxon: {
    name: "Taxon",
    desc: "세무와 정산 관리를 돕는 AI",
    logo: "/assets/taxon-no.png",
    color: "taxon",
  },
} as const;

type ServiceKey = keyof typeof SERVICE_INFO;

function getErrorMessage(error: string | null) {
  if (error === "service_unavailable") {
    return "아직 연결 준비 중인 서비스입니다. 잠시 후 다시 시도해 주세요.";
  }

  if (error === "service_sync_failed") {
    return "서비스 계정 동기화에 실패했습니다. 다시 시도하거나 관리자에게 문의해 주세요.";
  }

  if (error === "service_setup_required") {
    return "서비스 자동 로그인을 준비 중입니다. 연결 설정이 완료되면 바로 이용할 수 있습니다.";
  }

  if (error === "service_disabled") {
    return "관리자에 의해 해당 서비스 접근 권한이 비활성화되었습니다.";
  }

  if (error === "service_signin_failed") {
    return "서비스 자동 로그인을 완료하지 못했습니다. 다시 시도해 주세요.";
  }

  return "";
}

export default function SelectServiceClient() {
  const searchParams = useSearchParams();
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [loading, setLoading] = useState<ServiceKey | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState<SessionState>({});

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
    setErrorMessage(getErrorMessage(searchParams.get("error")));
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const data = (await response.json()) as SessionState;

        if (mounted) {
          setSession(data);
        }
      } catch {
        if (mounted) {
          setSession({});
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const getSyncStatus = (service: string) => {
    const result = syncResults.find((item) => item.service === service);
    return result ? result.success : null;
  };

  const handleServiceClick = (service: ServiceKey) => {
    setLoading(service);
    window.location.href = `/api/auth/token?service=${service}`;
  };

  return (
    <div className="auth-page auth-page--split">
      <aside className="auth-panel">
        <Image src="/assets/linkon-noback.png" alt="" width={72} height={72} />
        <p className="lp-kicker">Service Gateway</p>
        <h1>이용할 AI 서비스를 선택하세요</h1>
        <p>
          Linkon 통합 계정으로 Vion, Rion, Taxon을 연결합니다. 서비스 계정이 없으면 첫 진입 시
          안전하게 생성하거나 연결합니다.
        </p>
      </aside>

      <div className="auth-card" style={{ maxWidth: "560px" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div className="auth-success-icon" aria-hidden="true">
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
          <h2 className="auth-title">로그인되어 있습니다</h2>
          <p className="auth-subtitle">
            {session.email
              ? `${session.email} 계정으로 이용할 서비스를 선택해 주세요.`
              : "계정 준비가 완료되었습니다. 이용할 서비스를 선택해 주세요."}
          </p>
          {session.isSuperAdmin && (
            <Link href="/admin" className="btn btn--outline btn--sm">
              관리자 페이지로 이동
            </Link>
          )}
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
                >
                  <Image
                    src={info.logo}
                    alt={info.name}
                    className="service-select-card__logo"
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="service-select-card__info">
                    <div className="service-select-card__name">{info.name}</div>
                    <div className="service-select-card__desc">{info.desc}</div>
                    {syncOk !== null && (
                      <div
                        className={`service-select-card__sync service-select-card__sync--${
                          syncOk ? "ok" : "fail"
                        }`}
                      >
                        {syncOk ? "동기화 완료" : "동기화 확인 필요"}
                      </div>
                    )}
                  </div>
                  <div className="service-select-card__arrow">
                    {isLoading ? (
                      <span aria-label="연결 중">...</span>
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

        <p className="auth-switch">
          나중에 선택하고 싶다면 <Link href="/">홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
