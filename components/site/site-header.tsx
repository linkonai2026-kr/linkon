"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export default function SiteHeader({
  navItems,
  ctaHref = "/register",
  ctaLabel = "통합 계정 만들기",
  theme = "light",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

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
    let mounted = true;
    const supabase = createClient();

    const refreshSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const data = (await response.json()) as { authenticated?: boolean };

        if (mounted) {
          setIsSignedIn(Boolean(data.authenticated));
        }
      } catch {
        if (mounted) {
          setIsSignedIn(false);
        }
      }
    };

    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsSignedIn(true);
      } else {
        refreshSession();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const navClassName = [
    "nav",
    theme === "dark" ? "sp-nav" : "",
    scrolled ? "nav--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const actionHref = isSignedIn ? "/select-service" : ctaHref;
  const actionLabel = isSignedIn ? "서비스 선택" : ctaLabel;

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

        {isSignedIn && <span className="nav__session">로그인됨</span>}

        <Link href={actionHref} className="btn btn--primary btn--sm nav__cta">
          {actionLabel}
        </Link>

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
          {isSignedIn && <span className="nav__drawer-session">로그인된 상태입니다</span>}
          <Link
            href={actionHref}
            className="btn btn--primary nav__drawer-cta"
            onClick={() => setOpen(false)}
          >
            {actionLabel}
          </Link>
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
