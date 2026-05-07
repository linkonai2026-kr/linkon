"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const mismatch = Boolean(passwordConfirm && password !== passwordConfirm);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        if (updateError.message.toLowerCase().includes("same password")) {
          setError("이전과 다른 비밀번호를 입력해 주세요.");
        } else {
          setError("비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다.");
        }
        return;
      }

      setDone(true);
    } catch {
      setError("네트워크 오류가 발생했습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--split">
      <aside className="auth-panel">
        <Image src="/assets/linkon-noback.png" alt="" width={56} height={56} />
        <p className="lp-kicker">Linkon Account</p>
        <h1>새 비밀번호를 설정하세요.</h1>
        <p>
          8자 이상의 새 비밀번호를 입력해 주세요.
          변경 후 Linkon 통합 계정으로 바로 서비스를 이용할 수 있습니다.
        </p>
        <div className="auth-panel__services">
          <Image src="/assets/vion-noback.png" alt="Vion" width={40} height={40} />
          <Image src="/assets/rion-noback.png" alt="Rion" width={40} height={40} />
          <Image src="/assets/taxon-noback.png" alt="Taxon" width={40} height={40} />
        </div>
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

        {done ? (
          <>
            <div className="auth-success-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="#16a34a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="auth-title">비밀번호가 변경되었습니다</h2>
            <p className="auth-subtitle">새 비밀번호로 Linkon 계정에 로그인할 수 있습니다.</p>
            <Link
              href="/login"
              className="btn btn--primary"
              style={{ display: "block", width: "100%", marginTop: "var(--space-6)", textAlign: "center" }}
            >
              로그인으로 돌아가기
            </Link>
          </>
        ) : (
          <>
            <h2 className="auth-title">새 비밀번호 설정</h2>
            <p className="auth-subtitle">새로 사용할 비밀번호를 입력해 주세요.</p>

            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  새 비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="8자 이상 입력해 주세요"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password-confirm">
                  새 비밀번호 확인
                </label>
                <input
                  id="password-confirm"
                  type="password"
                  className={`form-input ${mismatch ? "is-error" : ""}`}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
                {mismatch && (
                  <p className="form-error">비밀번호가 서로 일치하지 않습니다.</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%", marginTop: "var(--space-4)" }}
                disabled={loading || mismatch || password.length < 8}
              >
                {loading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          </>
        )}

        <p className="auth-switch">
          <Link href="/login">← 로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
