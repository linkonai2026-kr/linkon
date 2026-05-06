"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  navItems: NavItem[];
  ctaHref?: string;
  ctaLabel?: string;
  theme?: "light" | "dark";
}

interface SessionState {
  authenticated: boolean;
  email: string | null;
  role: string | null;
  accountStatus: string | null;
  isSuperAdmin: boolean;
}

const SESSION_CACHE_KEY = "linkon_session_snapshot";

const signedOutSession: SessionState = {
  authenticated: false,
  email: null,
  role: null,
  accountStatus: null,
  isSuperAdmin: false,
};

function normalizeSession(data: Partial<SessionState> | null | undefined): SessionState {
  return {
    authenticated: Boolean(data?.authenticated),
    email: data?.email ?? null,
    role: data?.role ?? null,
    accountStatus: data?.accountStatus ?? null,
    isSuperAdmin: Boolean(data?.isSuperAdmin),
  };
}

function readCachedSession(): SessionState | null {
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    return cached ? normalizeSession(JSON.parse(cached) as Partial<SessionState>) : null;
  } catch {
    return null;
  }
}

function writeCachedSession(session: SessionState) {
  try {
    if (session.authenticated) {
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
      return;
    }

    sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {
    // sessionStorage can be unavailable in private/locked browser contexts.
  }
}

export default function SiteHeader({
  navItems,
  ctaHref = "/register",
  ctaLabel = "통합 계정 만들기",
  theme = "light",
}: SiteHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<SessionState>(signedOutSession);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const cachedSession = readCachedSession();
    if (cachedSession) {
      setSession(cachedSession);
    }

    const controller = new AbortController();

    const refreshSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        const data = normalizeSession((await response.json()) as Partial<SessionState>);
        setSession(data);
        writeCachedSession(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSession(signedOutSession);
        writeCachedSession(signedOutSession);
      }
    };

    const handleSessionChanged = () => {
      const nextSession = readCachedSession();
      setSession(nextSession ?? signedOutSession);
      void refreshSession();
    };

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    };

    void refreshSession();
    window.addEventListener("linkon:session-changed", handleSessionChanged);
    window.addEventListener("focus", refreshSession);
    document.addEventListener("visibilitychange", handleVisibilityRefresh);

    return () => {
      controller.abort();
      window.removeEventListener("linkon:session-changed", handleSessionChanged);
      window.removeEventListener("focus", refreshSession);
      document.removeEventListener("visibilitychange", handleVisibilityRefresh);
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      setSession(signedOutSession);
      writeCachedSession(signedOutSession);
      window.dispatchEvent(new Event("linkon:session-changed"));
      setOpen(false);
      setLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  }

  const navClassName = [
    "nav",
    theme === "dark" ? "sp-nav" : "",
    scrolled ? "nav--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const isSignedIn = session.authenticated;

  return (
    <header className={navClassName} id="nav">
      <div className="nav__inner container">
        <Link href="/" className="nav__logo" aria-label="Linkon 홈">
          <Image
            src="/assets/linkon-no.png"
            alt="Linkon"
            className="nav__logo-img"
            width={100}
            height={32}
            priority
          />
        </Link>

        <nav className="nav__links" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav__account" aria-label="계정 메뉴">
          {isSignedIn ? (
            <>
              <span className="nav__session" title={session.email ?? undefined}>
                {session.email}
              </span>
              <Link href="/select-service" className="btn btn--outline btn--sm nav__account-link">
                서비스 선택
              </Link>
              {session.isSuperAdmin && (
                <Link href="/admin" className="btn btn--primary btn--sm nav__account-link">
                  관리자
                </Link>
              )}
              <button
                type="button"
                className="btn btn--ghost btn--sm nav__account-link"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn--outline btn--sm nav__account-link">
                로그인
              </Link>
              <Link href={ctaHref} className="btn btn--primary btn--sm nav__account-link">
                {ctaLabel}
              </Link>
            </>
          )}
        </div>

        <button
          className={`nav__hamburger ${open ? "is-open" : ""}`}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="nav__drawer-inner">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav__drawer-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isSignedIn ? (
            <div className="nav__drawer-account">
              <span className="nav__drawer-session">{session.email}</span>
              <Link
                href="/select-service"
                className="btn btn--outline nav__drawer-cta"
                onClick={() => setOpen(false)}
              >
                서비스 선택
              </Link>
              {session.isSuperAdmin && (
                <Link
                  href="/admin"
                  className="btn btn--primary nav__drawer-cta"
                  onClick={() => setOpen(false)}
                >
                  관리자 페이지
                </Link>
              )}
              <button
                type="button"
                className="btn btn--ghost nav__drawer-cta"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn--outline nav__drawer-cta"
                onClick={() => setOpen(false)}
              >
                로그인
              </Link>
              <Link
                href={ctaHref}
                className="btn btn--primary nav__drawer-cta"
                onClick={() => setOpen(false)}
              >
                {ctaLabel}
              </Link>
            </>
          )}
        </div>
      </div>
      <button
        className={`nav__overlay ${open ? "is-visible" : ""}`}
        aria-hidden={!open}
        aria-label="메뉴 닫기"
        onClick={() => setOpen(false)}
        type="button"
      />
    </header>
  );
}
