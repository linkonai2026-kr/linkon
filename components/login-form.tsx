"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigError } from "@/lib/supabase/config";

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed: "로그인을 완료하지 못했습니다. 다시 시도해 주세요.",
  account_suspended: "정지된 계정입니다. Linkon 운영팀에 문의해 주세요.",
  account_deleted: "더 이상 활성화되지 않은 계정입니다. Linkon 운영팀에 문의해 주세요.",
  admin_required: "최고 관리자 권한이 필요한 화면입니다.",
  service_return_to_invalid: "서비스 복귀 주소가 올바르지 않습니다. 다시 진입해 주세요.",
  service_unavailable: "서비스 연결 설정이 아직 완료되지 않았습니다.",
  service_setup_required: "서비스 자동 로그인을 준비 중입니다. 연결 설정 완료 후 이용할 수 있습니다.",
  service_sync_failed: "서비스 계정 연결에 실패했습니다. 다시 시도하거나 운영팀에 문의해 주세요.",
  service_signin_failed: "서비스 자동 로그인을 완료하지 못했습니다. 다시 시도해 주세요.",
  service_disabled: "관리자 설정에 따라 해당 서비스 접근 권한이 비활성화되었습니다.",
};

type ServiceName = "vion" | "rion" | "taxon";

function getInitialErrorMessage(errorCode: string | null) {
  return errorCode ? ERROR_MESSAGES[errorCode] ?? "" : "";
}

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  if (value === "/select-service" || value.startsWith("/select-service?")) {
    return null;
  }

  return value;
}

function getSafeService(value: string | null): ServiceName | null {
  if (value === "vion" || value === "rion" || value === "taxon") {
    return value;
  }

  return null;
}

function getServiceReturnTo(searchParams: ReturnType<typeof useSearchParams>) {
  return searchParams.get("redirectTo") ?? searchParams.get("returnTo") ?? searchParams.get("next");
}

function buildServiceTokenPath(service: ServiceName, returnTo: string | null) {
  const params = new URLSearchParams({ service });

  if (returnTo) {
    params.set("returnTo", returnTo);
  }

  return `/api/auth/token?${params.toString()}`;
}

function buildRegisterHref(service: ServiceName | null, returnTo: string | null) {
  if (!service) {
    return "/register";
  }

  const params = new URLSearchParams({ service });

  if (returnTo) {
    params.set("returnTo", returnTo);
  }

  return `/register?${params.toString()}`;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get("redirect"));
  const service = getSafeService(searchParams.get("service"));
  const returnTo = getServiceReturnTo(searchParams);
  const serviceHandoffPath = service ? buildServiceTokenPath(service, returnTo) : null;
  const registerHref = buildRegisterHref(service, returnTo);

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(getInitialErrorMessage(searchParams.get("error")));

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      try {
        sessionStorage.setItem(
          "linkon_session_snapshot",
          JSON.stringify({
            authenticated: true,
            email: email.trim().toLowerCase(),
            role: null,
            accountStatus: null,
            isSuperAdmin: false,
          })
        );
        window.dispatchEvent(new Event("linkon:session-changed"));
      } catch {
        // Session snapshot is only a client-side convenience cache.
      }

      window.location.assign(redirect ?? serviceHandoffPath ?? "/");
    } catch (loginError) {
      if (isSupabaseConfigError(loginError)) {
        setError("로그인 설정이 아직 완료되지 않았습니다. 운영팀에 문의해 주세요.");
        return;
      }

      setError("네트워크 오류가 발생했습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--split">
      <aside className="auth-panel">
        <Image src="/assets/linkon-noback.png" alt="" width={72} height={72} />
        <p className="lp-kicker">Linkon Account</p>
        <h1>하나의 계정으로 필요한 AI 서비스를 시작하세요.</h1>
        <p>
          Vion, Rion, Taxon을 하나의 Linkon 계정으로 연결합니다. 로그인 후 원하는 서비스로
          자연스럽게 이어집니다.
        </p>
      </aside>

      <div className="auth-card">
        <div className="auth-logo">
          <Image
            src="/assets/linkon-no.png"
            alt="Linkon"
            width={100}
            height={32}
            style={{ objectFit: "contain" }}
          />
        </div>

        <h2 className="auth-title">로그인</h2>
        <p className="auth-subtitle">Linkon 통합 계정으로 계속 진행합니다.</p>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="비밀번호를 입력해 주세요."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: "100%", marginTop: "var(--space-4)" }}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="auth-switch">
          아직 계정이 없나요? <Link href={registerHref}>통합 계정 만들기</Link>
        </p>
      </div>
    </div>
  );
}
