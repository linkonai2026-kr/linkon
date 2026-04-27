import Image from "next/image";
import Link from "next/link";
import MainScripts from "@/components/main-scripts";
import ServiceLaunchBtn from "@/components/service-launch-btn";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { ServicePageContent } from "@/lib/site/content";

function FeatureIcon({
  type,
  accentClass,
}: {
  type: ServicePageContent["features"][number]["icon"];
  accentClass: ServicePageContent["accentClass"];
}) {
  const stroke =
    accentClass === "vion"
      ? "#00C9B1"
      : accentClass === "rion"
        ? "#0056A0"
        : "#DC143C";

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 19 6v5c0 4.5-2.7 8.4-7 10-4.3-1.6-7-5.5-7-10V6l7-3Z"
          stroke={stroke}
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 18V9m7 9V5m7 13v-7"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "document") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 4h6l4 4v12H8z" stroke={stroke} strokeWidth="1.8" />
        <path d="M14 4v4h4" stroke={stroke} strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "people") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4 20a4 4 0 0 1 8 0m2 0a4 4 0 0 1 6 0"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "pulse") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12h4l2-4 4 8 2-4h6"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 4 1.9 4.1L18 10l-4.1 1.9L12 16l-1.9-4.1L6 10l4.1-1.9L12 4Z"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicePage({ content }: { content: ServicePageContent }) {
  const isLive = content.status === "live";
  const accentColor =
    content.accentClass === "vion"
      ? "#00C9B1"
      : content.accentClass === "rion"
        ? "#0056A0"
        : "#DC143C";
  const accentDim =
    content.accentClass === "vion"
      ? "rgba(0, 201, 177, 0.12)"
      : content.accentClass === "rion"
        ? "rgba(0, 86, 160, 0.12)"
        : "rgba(220, 20, 60, 0.12)";
  const heroBgStyle = {
    backgroundImage: `url('${content.backgroundImage}'), linear-gradient(135deg, #071019 0%, #0f2232 100%)`,
  };
  const pageVars = {
    ["--sp-overlay-end" as string]: content.overlayColor,
    ["--sp-accent-color" as string]: accentColor,
    ["--sp-icon-bg" as string]: accentDim,
    ["--sp-tint-color" as string]: accentColor,
  };

  return (
    <>
      <SiteHeader
        theme="dark"
        navItems={[
          { href: "#overview", label: "소개" },
          { href: "#features", label: "기능" },
          { href: "#cta", label: isLive ? "시작하기" : "출시 알림" },
        ]}
        ctaHref={content.heroPrimaryHref}
        ctaLabel={content.navLabel}
      />

      <main>
        <section className="sp-hero" id="home" style={pageVars}>
          <div className="sp-hero__bg" style={heroBgStyle}></div>
          <div className="sp-hero__overlay"></div>
          <div className="sp-hero__tint"></div>

          <div className="sp-hero__content">
            <div className="container">
              <Link href="/" className="sp-back" data-animate="fade-in">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M10 3 5 8l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Linkon 홈으로
              </Link>

              <div className="sp-hero__badge" data-animate="fade-up">
                <span className="sp-hero__badge-dot"></span>
                <span>{isLive ? "현재 이용 가능" : "출시 예정"}</span>
              </div>

              <div className="sp-hero__wordmark" data-animate="fade-up" data-delay="100">
                <div className="sp-hero__logo-card">
                  <Image
                    src={content.logo}
                    alt={content.name}
                    className="sp-hero__logo-img"
                    width={240}
                    height={72}
                    priority
                  />
                </div>
              </div>

              <p className="sp-hero__tagline" data-animate="fade-up" data-delay="200">
                {content.tagline}
              </p>
              <p className="sp-hero__desc" data-animate="fade-up" data-delay="300">
                {content.heroDescription}
              </p>
              <div className="sp-hero__actions" data-animate="fade-up" data-delay="400">
                {isLive ? (
                  <ServiceLaunchBtn
                    service={content.slug}
                    label={content.heroPrimaryLabel}
                    className={`btn btn--${content.accentClass} btn--lg`}
                  />
                ) : (
                  <Link href={content.heroPrimaryHref} className={`btn btn--${content.accentClass} btn--lg`}>
                    {content.heroPrimaryLabel}
                  </Link>
                )}
                <Link
                  href="#overview"
                  className="btn btn--outline btn--lg"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "white" }}
                >
                  {content.heroSecondaryLabel}
                </Link>
              </div>
            </div>
          </div>

          <div className="sp-hero__scroll" aria-hidden="true">
            <span>Scroll</span>
            <div className="sp-hero__scroll-line"></div>
          </div>
        </section>

        <section className="sp-intro" id="overview">
          <div className="container sp-intro__grid">
            <div className="sp-intro__text" data-animate="fade-up">
              <p className="section-label">{content.introLabel}</p>
              <h2 className="section-title font-serif">{content.introTitle}</h2>
              {content.introBody.map((paragraph) => (
                <p key={paragraph} className="sp-intro__body">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="sp-intro__visual" data-animate="fade-in">
              <Image
                src={content.backgroundImage}
                alt={`${content.name} mockup`}
                width={1200}
                height={900}
              />
            </div>
          </div>
        </section>

        <section className="sp-features" id="features">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <p className="section-label">{content.featuresLabel}</p>
              <h2 className="section-title font-serif">{content.featuresTitle}</h2>
              <p className="section-desc">
                모든 서비스는 Linkon 통합 계정, 관리자 권한 정책, 서비스 동기화
                기준 위에서 안정적으로 연결됩니다.
              </p>
            </div>

            <div className="sp-features__grid">
              {content.features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="sp-feature-card"
                  data-animate="fade-up"
                  data-delay={String((index % 3) * 100)}
                >
                  <div className="sp-feature-icon">
                    <FeatureIcon type={feature.icon} accentClass={content.accentClass} />
                  </div>
                  <h3 className="sp-feature-title">{feature.title}</h3>
                  <p className="sp-feature-desc">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`sp-cta ${isLive ? "" : "sp-cta--soon"}`} id="cta">
          <div className="container">
            <div className="sp-cta__inner" data-animate="fade-up">
              {!isLive && <div className="sp-coming-badge">출시 준비 중</div>}
              <h2 className="sp-cta__title font-serif">{content.ctaTitle}</h2>
              <p className="sp-cta__desc">{content.ctaDescription}</p>

              {isLive ? (
                <div className="hero__actions" style={{ justifyContent: "center" }}>
                  <ServiceLaunchBtn
                    service={content.slug}
                    label={content.ctaPrimaryLabel}
                    className={`btn btn--${content.accentClass} btn--lg`}
                  />
                  <Link href="/" className="btn btn--outline btn--lg">
                    {content.ctaSecondaryLabel}
                  </Link>
                </div>
              ) : (
                <div className="sp-notify-form" id="notify">
                  <form className="notify-form" data-service={content.slug}>
                    <div className="notify-form__row">
                      <input
                        className="notify-form__input"
                        type="email"
                        name="email"
                        placeholder="이메일 주소를 입력해 주세요"
                        aria-label="이메일 주소"
                      />
                      <button type="submit" className={`btn btn--${content.accentClass}`}>
                        {content.ctaPrimaryLabel}
                      </button>
                    </div>
                  </form>
                  <p className="notify-form__note">
                    Linkon 계정을 먼저 만들어두면 출시 후 더 빠르게 시작할 수 있습니다.
                  </p>
                  <Link href={content.ctaPrimaryHref} className="btn btn--outline btn--lg">
                    {content.ctaSecondaryLabel}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MainScripts />
    </>
  );
}
