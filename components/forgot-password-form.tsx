"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigError } from "@/lib/supabase/config";

type ViewState = "input" | "sent";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<ViewState>("input");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/api/auth/callback?next=/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo }
      );

      if (resetError) {
        setError("이메일 전송에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      setView("sent");
    } catch (err) {
      if (isSupabaseConfigError(err)) {
        setError("서비스 설정이 아직 완료되지 않았습니다. 운영팀에 문의해 주세요.");
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
        <Image src="/assets/linkon-noback.png" alt="" width={56} height={56} />
        <p className="lp-kicker">Linkon Account</p>
        <h1>비밀번호를 잊으셨나요?</h1>
        <p>
          가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
          링크는 발송 후 1시간 동안 유효합니다.
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

        {view === "input" ? (
          <>
            <h2 className="auth-title">비밀번호 찾기</h2>
            <p className="auth-subtitle">
              가입한 이메일을 입력하면 재설정 링크를 보내드립니다.
            </p>

            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}

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
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%", marginTop: "var(--space-4)" }}
                disabled={loading || !email.trim()}
              >
                {loading ? "전송 중..." : "재설정 링크 보내기"}
              </button>
            </form>
          </>
        ) : (
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
            <h2 className="auth-title">이메일을 확인해 주세요</h2>
            <p className="auth-subtitle">
              <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
              {" "}으로 비밀번호 재설정 링크를 보냈습니다.
              메일함을 확인해 주세요. 링크는 1시간 동안 유효합니다.
            </p>
            <p
              className="auth-subtitle"
              style={{ marginTop: "var(--space-3)", fontSize: "var(--text-xs)" }}
            >
              메일이 오지 않으면 스팸함을 확인하거나{" "}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--linkon-accent)",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "inherit",
                  padding: 0,
                }}
                onClick={() => setView("input")}
              >
                다시 시도
              </button>
              해 주세요.
            </p>
          </>
        )}

        <p className="auth-switch">
          <Link href="/login">← 로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
