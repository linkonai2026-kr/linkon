"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigError } from "@/lib/supabase/config";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("올바른 이메일 주소를 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/api/auth/callback?next=/reset-password`;

      // 보안: 이메일 존재 여부와 무관하게 동일 성공 메시지 표시.
      // (사용자 열거 공격 방지)
      await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });
      setSubmitted(true);
    } catch (resetError) {
      if (isSupabaseConfigError(resetError)) {
        setError("로그인 설정이 아직 완료되지 않았습니다. 운영팀에 문의해 주세요.");
        return;
      }
      // 네트워크 오류여도 사용자 열거 방지를 위해 성공 표시
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--split">
      <aside className="auth-panel">
        <Image src="/assets/linkon-noback.png" alt="" width={72} height={72} />
        <p className="lp-kicker">비밀번호 재설정</p>
        <h1>가입하신 이메일로 재설정 안내를 보내드립니다.</h1>
        <p>
          입력한 주소가 Linkon에 등록되어 있다면, 잠시 후 메일함에서 재설정 링크를
          확인하실 수 있습니다.
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

        <h2 className="auth-title">비밀번호 찾기</h2>
        <p className="auth-subtitle">
          가입 시 사용한 이메일을 입력하면 재설정 링크를 보내드립니다.
        </p>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        {submitted ? (
          <div role="status" style={{ marginTop: "var(--space-4)" }}>
            <div
              className="error-box"
              style={{
                background: "var(--color-live-bg)",
                color: "var(--color-live)",
                borderLeftColor: "var(--color-live)",
              }}
            >
              입력하신 이메일로 재설정 안내를 발송했습니다. 메일함을 확인해 주세요.
              메일이 보이지 않으면 스팸함도 확인해 보세요.
            </div>
            <p className="auth-switch" style={{ marginTop: "var(--space-5)" }}>
              <Link href="/login">로그인 화면으로 돌아가기</Link>
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
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
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%", marginTop: "var(--space-4)" }}
                disabled={loading}
              >
                {loading ? "발송 중..." : "재설정 링크 받기"}
              </button>
            </form>

            <p className="auth-switch">
              <Link href="/login">로그인으로 돌아가기</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
