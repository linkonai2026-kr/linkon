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
    desc: "Mental wellness and silver care",
    logo: "/assets/vion-no.png",
    color: "vion",
  },
  rion: {
    name: "Rion",
    desc: "Legal co-pilot",
    logo: "/assets/rion-no.png",
    color: "rion",
  },
  taxon: {
    name: "Taxon",
    desc: "Business finance operations",
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
      setErrorMessage("This service is not configured yet. Please try again shortly.");
      return;
    }

    if (error === "service_sync_failed") {
      setErrorMessage("Account sync failed for this service. Please retry or contact an administrator.");
      return;
    }

    if (error === "service_signin_failed") {
      setErrorMessage("Automatic sign-in could not be created for this service. Please try again.");
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
          <h1 className="auth-title">Account ready</h1>
          <p className="auth-subtitle">
            Your Linkon account is active.
            <br />
            Choose a service to continue.
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
                        {syncOk ? "Sync ready" : "Previous sync had issues"}
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
                        aria-label="Loading"
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
          Prefer to decide later?{" "}
          <Link href="/" style={{ color: "var(--linkon-accent)" }}>
            Return to home
          </Link>
        </p>
      </div>
    </div>
  );
}
