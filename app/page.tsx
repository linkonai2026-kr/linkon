import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LaunchNotificationTabs from "@/components/launch-notification-tabs";
import ServiceLaunchBtn from "@/components/service-launch-btn";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import HomeHero from "@/components/site/home-hero";
import HomeTrustStory from "@/components/site/home-trust-story";

export const metadata: Metadata = {
  title: "Linkon | 일상에 필요한 AI 서비스를 연결하는 브랜드",
  description:
    "Linkon은 Vion, Rion, Taxon을 통해 일상 케어, 법률 이해, 세무 관리를 더 쉽게 시작할 수 있도록 돕는 AI 서비스 브랜드입니다.",
  openGraph: {
    title: "Linkon | 일상에 필요한 AI 서비스를 연결하는 브랜드",
    description:
      "Vion, Rion, Taxon으로 마음과 일상, 법률과 세무까지 더 편안하게 시작할 수 있도록 돕습니다.",
    images: [{ url: "/assets/linkon.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkon | 일상에 필요한 AI 서비스를 연결하는 브랜드",
    description:
      "일상 케어, 법률 이해, 세무 관리를 더 쉽게 시작할 수 있도록 돕는 Linkon의 AI 서비스 브랜드를 만나보세요.",
    images: ["/assets/linkon.png"],
  },
};

const services = [
  {
    key: "vion",
    name: "Vion",
    label: "케어 AI",
    status: "이용 가능",
    logo: "/assets/vion-noback.png",
    href: "/vion",
    color: "vion",
    description:
      "마음과 일상 체크인을 돕는 케어 AI입니다. Linkon 계정으로 바로 시작할 수 있습니다.",
    actionLabel: "Vion 시작하기",
  },
  {
    key: "rion",
    name: "Rion",
    label: "법률 비서 AI",
    status: "출시 예정",
    logo: "/assets/rion-noback.png",
    href: "/rion",
    color: "rion",
    description:
      "계약서와 법률 절차를 이해하기 쉬운 안내로 정리하는 법률 비서 AI입니다.",
    actionLabel: "출시 알림 받기",
  },
  {
    key: "taxon",
    name: "Taxon",
    label: "세무 관리 AI",
    status: "출시 예정",
    logo: "/assets/taxon-noback.png",
    href: "/taxon",
    color: "taxon",
    description:
      "사업자의 세무 상태와 신고 준비 흐름을 선명하게 정리하는 세무 관리 AI입니다.",
    actionLabel: "출시 알림 받기",
  },
] as const;


export default function HomePage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "#services", label: "서비스" },
          { href: "#trust", label: "이용 방법" },
          { href: "#launch", label: "출시 알림" },
        ]}
        ctaHref="/register"
        ctaLabel="통합 계정 만들기"
      />

      <main id="main-content" className="lp-page lp-page--public">
        <HomeHero />

        <section className="section lp-services" id="services">
          <div className="container">
            <div className="section-header">
              <p className="section-label">서비스 소개</p>
              <h2 className="section-title">지금 필요한 AI를 선택하세요</h2>
              <p className="section-desc">
                각 서비스는 전문 영역에 집중하고, 사용자는 Linkon 계정 하나로 편하게 시작합니다.
              </p>
            </div>

            <div className="services-grid lp-services-grid">
              {services.map((service) => (
                <article
                  key={service.key}
                  className={`service-card lp-service-card lp-service-card--public service-card--${service.color} brand-shimmer`}
                >
                  <div className="lp-service-card__visual">
                    <Image
                      src={service.logo}
                      alt=""
                      aria-hidden
                      width={80}
                      height={80}
                      className="lp-service-card__icon"
                    />
                  </div>

                  <div className="card-header">
                    <span
                      className={`status-badge ${
                        service.key === "vion" ? "status-badge--live" : "status-badge--soon"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="service-name">{service.name}</h3>
                    <p className="service-tagline">{service.label}</p>
                    <p className="service-desc">{service.description}</p>
                  </div>

                  <div className="card-footer">
                    <Link href={service.href} className="btn btn--outline btn--full">
                      자세히 보기
                    </Link>
                    {service.key === "vion" ? (
                      <ServiceLaunchBtn
                        service="vion"
                        label={service.actionLabel}
                        href="https://vion-sandy.vercel.app/"
                        loadingLabel="연결 중..."
                        className="btn btn--vion btn--full"
                        style={{ marginTop: "var(--space-2)" }}
                      />
                    ) : (
                      <Link
                        href="#launch"
                        className={`btn btn--${service.color} btn--full`}
                        style={{ marginTop: "var(--space-2)" }}
                      >
                        {service.actionLabel}
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <HomeTrustStory />

        <section className="section teaser-section lp-launch-section" id="launch">
          <div className="glow-aura" aria-hidden="true" />
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div className="section-header">
              <p className="section-label">출시 예정</p>
              <h2 className="section-title">Rion과 Taxon 출시 소식을 먼저 받아보세요</h2>
              <p className="section-desc">
                관심 있는 서비스를 선택하고 이메일을 남기면 출시 일정과 초기 이용 안내를 보내드립니다.
              </p>
            </div>

            <LaunchNotificationTabs />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
