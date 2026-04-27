import Image from "next/image";
import Link from "next/link";
import LaunchNotificationTabs from "@/components/launch-notification-tabs";
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
        <path d="M12 3 19 6v5c0 4.5-2.7 8.4-7 10-4.3-1.6-7-5.5-7-10V6l7-3Z" stroke={stroke} strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 18V9m7 9V5m7 13v-7" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
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
        <path d="M3 12h4l2-4 4 8 2-4h6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 4 1.9 4.1L18 10l-4.1 1.9L12 16l-1.9-4.1L6 10l4.1-1.9L12 4Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServicePage({ content }: { content: ServicePageContent }) {
  const isLive = content.status === "live";

  return (
    <>
      <SiteHeader
        navItems={[
          { href: "#overview", label: "소개" },
          { href: "#features", label: "기능" },
          { href: "#cta", label: isLive ? "시작하기" : "출시 알림" },
        ]}
        ctaHref={content.heroPrimaryHref}
        ctaLabel={content.navLabel}
      />

      <main className={`sp-page sp-page--${content.accentClass}`}>
        <section className="sp-hero sp-hero--redesigned">
          <div className="sp-hero__bg">
            <Image
              src={content.backgroundImage}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="sp-hero__overlay" style={{ background: content.overlayColor }} />

          <div className="container sp-hero__content">
            <Link href="/" className="sp-back">
              Linkon 홈으로
            </Link>
            <div className="sp-hero__badge">
              <span className="sp-hero__badge-dot" />
              <span>{isLive ? "현재 이용 가능" : "출시 예정"}</span>
            </div>
            <Image src={content.logo} alt={content.name} width={220} height={72} className="sp-hero__brand" />
            <p className="sp-hero__tagline">{content.tagline}</p>
            <p className="sp-hero__desc">{content.heroDescription}</p>
            <div className="sp-hero__actions">
              {isLive ? (
                <ServiceLaunchBtn
                  service={content.slug}
                  label={content.heroPrimaryLabel}
                  loadingLabel="연결 중..."
                  className={`btn btn--${content.accentClass} btn--lg`}
                />
              ) : (
                <Link href="#notify" className={`btn btn--${content.accentClass} btn--lg`}>
                  {content.heroPrimaryLabel}
                </Link>
              )}
              <Link href="#overview" className="btn btn--outline btn--lg sp-hero__secondary">
                {content.heroSecondaryLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className="sp-intro" id="overview">
          <div className="container sp-intro__grid">
            <div className="sp-intro__text">
              {content.expertBadge && (
                <p className="sp-expert-badge">{content.expertBadge}</p>
              )}
              <p className="section-label">{content.introLabel}</p>
              <h2 className="section-title">{content.introTitle}</h2>
              {content.introBody.map((paragraph) => (
                <p key={paragraph} className="sp-intro__body">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="sp-intro__visual sp-intro__visual--who">
              <div className="sp-who-grid">
                {content.whoCards.map((card) => (
                  <div key={card.label} className={`sp-who-card sp-who-card--${content.accentClass}`}>
                    <span className="sp-who-icon">{card.emoji}</span>
                    <strong className="sp-who-label">{card.label}</strong>
                    <p className="sp-who-desc">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="sp-features" id="features">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{content.featuresLabel}</p>
              <h2 className="section-title">{content.featuresTitle}</h2>
              <p className="section-desc">
                모든 서비스는 Linkon 통합 계정과 권한 기준 위에서 안정적으로 연결됩니다.
              </p>
            </div>

            <div className="sp-features__grid">
              {content.features.map((feature) => (
                <article key={feature.title} className="sp-feature-card">
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
            <div className="sp-cta__inner">
              {!isLive && <div className="sp-coming-badge">출시 준비 중</div>}
              <h2 className="sp-cta__title">{content.ctaTitle}</h2>
              <p className="sp-cta__desc">{content.ctaDescription}</p>

              {isLive ? (
                <div className="hero__actions" style={{ justifyContent: "center" }}>
                  <ServiceLaunchBtn
                    service={content.slug}
                    label={content.ctaPrimaryLabel}
                    loadingLabel="연결 중..."
                    className={`btn btn--${content.accentClass} btn--lg`}
                  />
                  <Link href="/" className="btn btn--outline btn--lg">
                    {content.ctaSecondaryLabel}
                  </Link>
                </div>
              ) : (
                <div id="notify">
                  <LaunchNotificationTabs />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
