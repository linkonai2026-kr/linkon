"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getInitialErrorMessage(errorCode: string | null) {
  if (errorCode === "auth_callback_failed") {
    return "Login could not be completed. Please try again.";
  }

  if (errorCode === "account_suspended") {
    return "This account is suspended. Please contact the Linkon team.";
  }

  if (errorCode === "account_deleted") {
    return "This account is no longer active. Please create a new account or contact support.";
  }

  if (errorCode === "admin_required") {
    return "This area requires super admin access.";
  }

  if (errorCode === "service_unavailable") {
    return "This service is not configured yet. Please try again shortly.";
  }

  if (errorCode === "service_disabled") {
    return "Access to this service is disabled by an administrator.";
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
  const [error, setError] = useState(
    getInitialErrorMessage(searchParams.get("error"))
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

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
          : "The email or password is incorrect."
      );
      setLoading(false);
      return;
    }

    window.location.assign(redirect);
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

        <h1 className="auth-title">Sign in to Linkon</h1>
        <p className="auth-subtitle">
          Use your unified Linkon account to continue.
        </p>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Sign in"}
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
          Need a Linkon account?{" "}
          <Link
            href="/register"
            style={{ color: "var(--linkon-accent)", fontWeight: 600 }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
