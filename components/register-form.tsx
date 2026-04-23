"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3;

const SERVICE_INFO = {
  vion: {
    name: "Vion",
    desc: "Mental wellness and silver care",
    logo: "/assets/vion-noback.png",
    color: "vion",
  },
  rion: {
    name: "Rion",
    desc: "Legal co-pilot",
    logo: "/assets/rion-noback.png",
    color: "rion",
  },
  taxon: {
    name: "Taxon",
    desc: "Business finance operations",
    logo: "/assets/taxon-noback.png",
    color: "taxon",
  },
} as const;

type ServiceKey = keyof typeof SERVICE_INFO;

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [preferredService, setPreferredService] = useState<ServiceKey | "">("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateStep1 = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (password !== passwordConfirm) return "Passwords do not match.";
    return "";
  };

  const validateStep3 = () => {
    if (!termsAgreed) return "You must agree to the Terms of Service.";
    if (!privacyAgreed) return "You must agree to the Privacy Policy.";
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
          termsAgreed,
          marketingAgreed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Registration failed.");
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
        setError("Registration completed, but automatic sign-in was unavailable. Please sign in manually.");
        router.push("/login");
        return;
      }

      sessionStorage.setItem("linkon_sync", JSON.stringify(data.syncResults));
      router.push("/select-service");
    } catch {
      setError("A network error occurred. Please try again.");
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
            <h1 className="auth-title">Create your Linkon account</h1>
            <p className="auth-subtitle">
              One account gives you access to the full Linkon ecosystem.
            </p>

            {error && <div className="error-box" role="alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
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
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-confirm">
                Confirm password
              </label>
              <input
                id="password-confirm"
                type="password"
                className={`form-input ${
                  passwordConfirm && password !== passwordConfirm ? "is-error" : ""
                }`}
                placeholder="Re-enter your password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                required
                autoComplete="new-password"
              />
              {passwordConfirm && password !== passwordConfirm && (
                <p className="form-error">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary"
              style={{ width: "100%", marginTop: "var(--space-4)" }}
            >
              Continue
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
                marginTop: "var(--space-4)",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{ color: "var(--linkon-accent)", fontWeight: 600 }}
              >
                Sign in
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <div>
            <h2 className="auth-title">Which service matters most right now?</h2>
            <p className="auth-subtitle">
              This is optional and only helps us improve the onboarding flow.
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
                Back
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleNextStep}
                style={{ flex: 1 }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="auth-title">Review and agree</h2>
            <p className="auth-subtitle">
              Please confirm the required policies before creating your account.
            </p>

            {error && <div className="error-box" role="alert">{error}</div>}

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(event) => setTermsAgreed(event.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" target="_blank">
                  Terms of Service
                </Link>
                .
              </span>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(event) => setPrivacyAgreed(event.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link href="/privacy" target="_blank">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={marketingAgreed}
                onChange={(event) => setMarketingAgreed(event.target.checked)}
              />
              <span>I want to receive launch and product updates by email.</span>
            </label>

            <div className="auth-actions" style={{ marginTop: "var(--space-5)" }}>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setStep(2)}
                style={{ flex: 1 }}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
