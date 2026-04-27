"use client";

import Image from "next/image";
import Link from "next/link";
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

export default function SiteHeader({
  navItems,
  ctaHref = "/register",
  ctaLabel = "통합 계정 만들기",
  theme = "light",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navClassName = [
    "nav",
    theme === "dark" ? "sp-nav" : "",
    scrolled ? "nav--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

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

        <Link href={ctaHref} className="btn btn--primary btn--sm nav__cta">
          {ctaLabel}
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
          <Link
            href={ctaHref}
            className="btn btn--primary nav__drawer-cta"
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
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
