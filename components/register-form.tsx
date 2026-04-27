"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3;

const SERVICE_INFO = {
  vion: {
    name: "Vion",
    desc: "심리 및 시니어 케어 AI",
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
    desc: "세무 관리 AI",
    logo: "/assets/taxon-noback.png",
    color: "taxon",
  },
} as const;

type ServiceKey = keyof typeof SERVICE_INFO;

function isServiceKey(value: string | null): value is ServiceKey {
  return value === "vion" || value === "rion" || value === "taxon";
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get("service");
  const initialPreferredService = isServiceKey(serviceFromQuery)
    ? serviceFromQuery
    : "";
  const returnTo = searchParams.get("returnTo") ?? undefined;

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [preferredService, setPreferredService] = useState<ServiceKey | "">(
    initialPreferredService
  );
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateStep1 = () => {
    if (!name.trim()) return "이름을 입력해 주세요.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "올바른 이메일 주소를 입력해 주세요.";
    }
    if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (password !== passwordConfirm) return "비밀번호가 서로 일치하지 않습니다.";
    return "";
  };

  const validateStep3 = () => {
    if (!termsAgreed) return "이용약관에 동의해 주세요.";
    if (!privacyAgreed) return "개인정보처리방침에 동의해 주세요.";
    return "";
  };

  const handleNextStep = () => {
    setError("");

    if (step === 1) {
      const validationError = validateStep1();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setStep((currentStep) => (currentStep + 1) as Step);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateStep3();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          preferredService: preferredService || undefined,
          returnTo,
          termsAgreed,
          marketingAgreed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "회원가입에 실패했습니다.");
        setLoading(false);
        return;
      }

      if (data.autoLogin && data.magicLink) {
        sessionStorage.setItem("linkon_sync", JSON.stringify(data.syncResults));
        window.location.href = data.magicLink;
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("회원가입은 완료되었지만 자동 로그인을 할 수 없습니다. 직접 로그인해 주세요.");
        router.push("/login");
        return;
      }

      sessionStorage.setItem("linkon_sync", JSON.stringify(data.syncResults));
      router.push(data.nextPath ?? "/select-service");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
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

        <div className="step-indicator" aria-label={`Step ${step} of 3`}>
          {([1, 2, 3] as Step[]).map((currentStep) => (
            <div
              key={currentStep}
              className={`step-dot ${
                currentStep < step
                  ? "is-done"
                  : currentStep === step
                    ? "is-active"
                    : ""
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleNextStep();
            }}
          >
            <h1 className="auth-title">Linkon 통합 계정 만들기</h1>
            <p className="auth-subtitle">
              하나의 계정으로 Vion, Rion, Taxon을 연결합니다.
            </p>

            {error && <div className="error-box" role="alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                이름
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="8자 이상 입력해 주세요"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-confirm">
                비밀번호 확인
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
            >
              다음
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-4)",
              }}
            >
              이미 계정이 있나요?{" "}
              <Link
                href="/login"
                style={{ color: "var(--linkon-accent)", fontWeight: 600 }}
              >
                로그인
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <div>
            <h2 className="auth-title">가장 관심 있는 서비스를 선택해 주세요</h2>
            <p className="auth-subtitle">
              선택 사항이며, 첫 화면과 안내를 더 자연스럽게 맞추는 데 사용됩니다.
            </p>

            <div className="service-choice-grid">
              {(Object.entries(SERVICE_INFO) as [ServiceKey, (typeof SERVICE_INFO)[ServiceKey]][]).map(
                ([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    className={`service-choice ${
                      preferredService === key ? `is-selected-${info.color}` : ""
                    }`}
                    onClick={() =>
                      setPreferredService((current) => (current === key ? "" : key))
                    }
                  >
                    <Image src={info.logo} alt={info.name} width={48} height={48} />
                    <div className="service-choice__body">
                      <strong>{info.name}</strong>
                      <span>{info.desc}</span>
                    </div>
                  </button>
                )
              )}
            </div>

            <div className="auth-actions" style={{ marginTop: "var(--space-5)" }}>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setStep(1)}
                style={{ flex: 1 }}
              >
                이전
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleNextStep}
                style={{ flex: 1 }}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="auth-title">약관 확인 및 동의</h2>
            <p className="auth-subtitle">
              계정 생성을 위해 필수 약관을 확인해 주세요.
            </p>

            {error && <div className="error-box" role="alert">{error}</div>}

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(event) => setTermsAgreed(event.target.checked)}
              />
              <span>
                Linkon{" "}
                <Link href="/terms" target="_blank">
                  이용약관
                </Link>
                에 동의합니다.
              </span>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(event) => setPrivacyAgreed(event.target.checked)}
              />
              <span>
                Linkon{" "}
                <Link href="/privacy" target="_blank">
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={marketingAgreed}
                onChange={(event) => setMarketingAgreed(event.target.checked)}
              />
              <span>출시 소식과 제품 업데이트를 이메일로 받아보겠습니다.</span>
            </label>

            <div className="auth-actions" style={{ marginTop: "var(--space-5)" }}>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setStep(2)}
                style={{ flex: 1 }}
                disabled={loading}
              >
                이전
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? "계정 생성 중..." : "계정 만들기"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
