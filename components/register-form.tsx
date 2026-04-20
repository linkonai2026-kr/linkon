"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3;

interface SyncResult {
  service: string;
  success: boolean;
}

const SERVICE_INFO = {
  vion: {
    name: "Vion",
    desc: "심리 및 실버 케어 AI",
    logo: "/assets/vion-noback.png",
    color: "vion",
  },
  rion: {
    name: "Rion",
    desc: "법률 비서 AI",
    logo: "/assets/rion-noback.png",
    color: "rion",
  },
  taxon: {
    name: "Taxon",
    desc: "재무 관리 AI",
    logo: "/assets/taxon-noback.png",
    color: "taxon",
  },
} as const;

type ServiceKey = keyof typeof SERVICE_INFO;

export default function RegisterForm() {
  const router = useRouter();

  // 폼 데이터
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [preferredService, setPreferredService] = useState<ServiceKey | "">("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 스텝 1 유효성 검사
  const validateStep1 = () => {
    if (!name.trim()) return "이름을 입력해 주세요.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "올바른 이메일 주소를 입력해 주세요.";
    if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (password !== passwordConfirm) return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  // 스텝 3 유효성 검사
  const validateStep3 = () => {
    if (!termsAgreed) return "이용약관에 동의해 주세요.";
    if (!privacyAgreed) return "개인정보처리방침에 동의해 주세요.";
    return "";
  };

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const err = validateStep3();
    if (err) { setError(err); return; }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          preferredService: preferredService || undefined,
          termsAgreed,
          marketingAgreed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "가입 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      if (data.autoLogin && data.magicLink) {
        // magic link로 자동 로그인 → Supabase가 /api/auth/callback으로 redirect
        // syncResults를 세션 스토리지에 저장 (select-service 페이지에서 사용)
        sessionStorage.setItem(
          "linkon_sync",
          JSON.stringify(data.syncResults)
        );
        window.location.href = data.magicLink;
      } else {
        // 자동 로그인 불가 → 이메일/비밀번호로 직접 로그인
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError("가입은 완료됐습니다. 로그인 페이지에서 로그인해 주세요.");
          router.push("/login");
          return;
        }
        sessionStorage.setItem(
          "linkon_sync",
          JSON.stringify(data.syncResults)
        );
        router.push("/select-service");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* 로고 */}
        <div className="auth-logo">
          <Image src="/assets/linkon-no.png" alt="Linkon" width={100} height={32} style={{ objectFit: "contain" }} />
        </div>

        {/* 스텝 인디케이터 */}
        <div className="step-indicator" aria-label={`3단계 중 ${step}단계`}>
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className={`step-dot ${
                s < step ? "is-done" : s === step ? "is-active" : ""
              }`}
            />
          ))}
        </div>

        {/* ── 스텝 1: 기본 정보 ── */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
            <h1 className="auth-title">Linkon 가입하기</h1>
            <p className="auth-subtitle">한 번 가입으로 세 가지 AI 서비스를 모두 이용하세요</p>

            {error && <div className="error-box" role="alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="name">이름</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-confirm">비밀번호 확인</label>
              <input
                id="password-confirm"
                type="password"
                className={`form-input ${
                  passwordConfirm && password !== passwordConfirm ? "is-error" : ""
                }`}
                placeholder="비밀번호 재입력"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
              {passwordConfirm && password !== passwordConfirm && (
                <p className="form-error">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            <button type="submit" className="btn btn--primary" style={{ width: "100%", marginTop: "var(--space-4)" }}>
              다음
            </button>

            <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-4)" }}>
              이미 계정이 있으신가요?{" "}
              <Link href="/login" style={{ color: "var(--linkon-accent)", fontWeight: 600 }}>로그인</Link>
            </p>
          </form>
        )}

        {/* ── 스텝 2: 관심 서비스 선택 ── */}
        {step === 2 && (
          <div>
            <h2 className="auth-title">어떤 서비스에 관심 있으세요?</h2>
            <p className="auth-subtitle">선택 사항입니다. 서비스 개선에 활용됩니다.</p>

            <div className="service-choice-grid">
              {(Object.entries(SERVICE_INFO) as [ServiceKey, typeof SERVICE_INFO[ServiceKey]][]).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  className={`service-choice ${
                    preferredService === key ? `is-selected-${info.color}` : ""
                  }`}
                  onClick={() =>
                    setPreferredService((prev) => (prev === key ? "" : key))
                  }
                  aria-pressed={preferredService === key}
                >
                  <Image
                    src={info.logo}
                    alt={info.name}
                    className="service-choice__logo"
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="service-choice__info">
                    <div className="service-choice__name">{info.name}</div>
                    <div className="service-choice__desc">{info.desc}</div>
                  </div>
                  {preferredService === key && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M5 10l4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button
                type="button"
                className="btn btn--outline"
                style={{ flex: 1 }}
                onClick={() => { setStep(1); setError(""); }}
              >
                이전
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 2 }}
                onClick={handleNextStep}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* ── 스텝 3: 약관 동의 ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="auth-title">약관 동의</h2>
            <p className="auth-subtitle">서비스 이용을 위해 약관에 동의해 주세요.</p>

            {error && <div className="error-box" role="alert">{error}</div>}

            <div style={{ marginBottom: "var(--space-4)" }}>
              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  required
                />
                <span className="terms-check__label">
                  (필수){" "}
                  <Link href="/terms" target="_blank">이용약관</Link>에 동의합니다.
                </span>
              </label>

              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  required
                />
                <span className="terms-check__label">
                  (필수){" "}
                  <Link href="/privacy" target="_blank">개인정보처리방침</Link>에 동의합니다.
                </span>
              </label>

              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={marketingAgreed}
                  onChange={(e) => setMarketingAgreed(e.target.checked)}
                />
                <span className="terms-check__label">
                  (선택) 마케팅 정보 수신에 동의합니다.
                </span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button
                type="button"
                className="btn btn--outline"
                style={{ flex: 1 }}
                onClick={() => { setStep(2); setError(""); }}
                disabled={loading}
              >
                이전
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                style={{ flex: 2 }}
                disabled={loading || !termsAgreed || !privacyAgreed}
              >
                {loading ? "가입 처리 중..." : "가입하기"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
