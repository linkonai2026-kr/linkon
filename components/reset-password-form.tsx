"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigError } from "@/lib/supabase/config";
import PasswordChecklist, { isPasswordValid } from "@/components/password-checklist";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!isPasswordValid(password)) {
      setError("비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          updateError.message.includes("expired") || updateError.message.includes("invalid")
            ? "재설정 링크가 만료되었거나 유효하지 않습니다. 다시 요청해 주세요."
            : "비밀번호 변경에 실패했어요. 잠시 후 다시 시도해 주세요.",
        );
        return;
      }

      router.push("/login?reset=success");
    } catch (updateError) {
      if (isSupabaseConfigError(updateError)) {
        setError("로그인 설정이 아직 완료되지 않았습니다. 운영팀에 문의해 주세요.");
        return;
      }
      setError("네트워크 오류가 발생했어요. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--split">
      <aside className="auth-panel">
        <Image src="/assets/linkon-noback.png" alt="" width={72} height={72} />
        <p className="lp-kicker">새 비밀번호 설정</p>
        <h1>안전한 새 비밀번호로 다시 시작하세요.</h1>
        <p>
          새 비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다. 설정이 완료되면
          바로 로그인할 수 있습니다.
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

        <h2 className="auth-title">비밀번호 재설정</h2>
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
              placeholder="8자 이상, 영문과 숫자 포함"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              aria-describedby="password-rules"
            />
            <div id="password-rules">
              <PasswordChecklist value={password} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-confirm">
              새 비밀번호 확인
            </label>
            <input
              id="password-confirm"
              type="password"
              className={`form-input ${
                passwordConfirm && password !== passwordConfirm ? "is-error" : ""
              }`}
              placeholder="비밀번호를 다시 입력해 주세요"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
              autoComplete="new-password"
            />
            {passwordConfirm && password !== passwordConfirm && (
              <p className="form-error">비밀번호가 서로 일치하지 않습니다.</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: "100%", marginTop: "var(--space-4)" }}
            disabled={loading}
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>

        <p className="auth-switch">
          <Link href="/login">로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
