"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getInitialErrorMessage(errorCode: string | null) {
  if (errorCode === "auth_callback_failed") {
    return "로그인을 완료하지 못했습니다. 다시 시도해 주세요.";
  }

  if (errorCode === "account_suspended") {
    return "이 계정은 이용이 정지되었습니다. Linkon 운영팀에 문의해 주세요.";
  }

  if (errorCode === "account_deleted") {
    return "이 계정은 더 이상 활성 상태가 아닙니다. 새 계정을 만들거나 운영팀에 문의해 주세요.";
  }

  if (errorCode === "admin_required") {
    return "이 영역은 최고 관리자 권한이 필요합니다.";
  }

  return "";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/select-service";

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    getInitialErrorMessage(searchParams.get("error"))
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="auth-page">
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

        <h1 className="auth-title">다시 만나서 반가워요</h1>
        <p className="auth-subtitle">Linkon 통합 계정으로 로그인해 주세요.</p>

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

        <p
          style={{
            textAlign: "center",
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            marginTop: "var(--space-4)",
          }}
        >
          아직 Linkon 계정이 없나요?{" "}
          <Link
            href="/register"
            style={{ color: "var(--linkon-accent)", fontWeight: 600 }}
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
