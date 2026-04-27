"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getInitialErrorMessage(errorCode: string | null) {
  if (errorCode === "auth_callback_failed") {
    return "로그인을 완료하지 못했습니다. 다시 시도해 주세요.";
  }

  if (errorCode === "account_suspended") {
    return "정지된 계정입니다. Linkon 운영팀에 문의해 주세요.";
  }

  if (errorCode === "account_deleted") {
    return "더 이상 활성화되지 않은 계정입니다. 새 계정을 만들거나 문의해 주세요.";
  }

  if (errorCode === "admin_required") {
    return "최고 관리자 권한이 필요한 화면입니다.";
  }

  if (errorCode === "service_unavailable") {
    return "아직 연결 준비 중인 서비스입니다. 잠시 후 다시 시도해 주세요.";
  }

  if (errorCode === "service_disabled") {
    return "관리자에 의해 해당 서비스 접근 권한이 비활성화되었습니다.";
  }

  return "";
}

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/select-service";
  }

  return value;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(getInitialErrorMessage(searchParams.get("error")));

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          data && typeof data.error === "string"
            ? data.error
            : "이메일 또는 비밀번호가 올바르지 않습니다."
        );
        return;
      }

      window.location.assign(redirect);
    } catch {
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
        <h1>하나의 계정으로 모든 서비스를 시작하세요.</h1>
        <p>
          Vion, Rion, Taxon의 접근 권한과 요금제는 Linkon 계정 상태를 기준으로
          안전하게 관리됩니다.
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
        <p className="auth-subtitle">통합 Linkon 계정으로 계속 진행합니다.</p>

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
              placeholder="비밀번호를 입력해 주세요"
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
          아직 계정이 없나요?{" "}
          <Link href="/register">통합 계정 만들기</Link>
        </p>
      </div>
    </div>
  );
}
