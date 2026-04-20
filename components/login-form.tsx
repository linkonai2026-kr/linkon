"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/select-service";

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") === "auth_callback_failed"
    ? "인증에 실패했습니다. 다시 시도해 주세요."
    : ""
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <Image src="/assets/linkon-no.png" alt="Linkon" width={100} height={32} style={{ objectFit: "contain" }} />
        </div>

        <h1 className="auth-title">다시 만나서 반가워요</h1>
        <p className="auth-subtitle">Linkon 계정으로 로그인하세요</p>

        {error && <div className="error-box" role="alert">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-4)" }}>
          계정이 없으신가요?{" "}
          <Link href="/register" style={{ color: "var(--linkon-accent)", fontWeight: 600 }}>회원가입</Link>
        </p>
      </div>
    </div>
  );
}
