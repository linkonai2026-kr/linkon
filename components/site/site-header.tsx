import Image from "next/image";
import Link from "next/link";

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
  ctaLabel = "회원가입",
  theme = "light",
}: SiteHeaderProps) {
  const navClassName = theme === "dark" ? "nav sp-nav" : "nav";

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
          <span>{ctaLabel}</span>
        </Link>

        <button
          className="nav__hamburger"
          id="hamburger"
          aria-label="메뉴 열기"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="nav__drawer" id="drawer" aria-hidden="true">
        <div className="nav__drawer-inner">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav__drawer-link">
              {item.label}
            </Link>
          ))}
          <Link href={ctaHref} className="btn btn--primary nav__drawer-cta">
            {ctaLabel}
          </Link>
        </div>
      </div>
      <div className="nav__overlay" id="nav-overlay" aria-hidden="true"></div>
    </header>
  );
}
