import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LaunchNotificationTabs from "@/components/launch-notification-tabs";
import ServiceLaunchBtn from "@/components/service-launch-btn";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Linkon | 하나의 계정으로 만나는 AI 서비스",
  description:
    "Vion, Rion, Taxon을 하나의 Linkon 계정으로 시작하는 통합 AI 서비스 플랫폼입니다.",
};

const services = [
  {
    key: "vion",
    name: "Vion",
    label: "케어 AI",
    status: "이용 가능",
    logo: "/assets/vion-noback.png",
    mockup: "/assets/vion-mockup.png",
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
    mockup: "/assets/rion-mockup.png",
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
    mockup: "/assets/taxon-mockup.png",
    href: "/taxon",
    color: "taxon",
    description:
      "사업자의 세무 상태와 신고 준비 흐름을 선명하게 정리하는 세무 관리 AI입니다.",
    actionLabel: "출시 알림 받기",
  },
] as const;

const trustItems = [
  "한 번의 가입으로 시작",
  "서비스별 계정 자동 연결",
  "민감한 전문 데이터는 각 서비스에서 보호",
  "모바일에서도 편하게 이용",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "#services", label: "서비스" },
          { href: "#trust", label: "이용 흐름" },
          { href: "#launch", label: "출시 알림" },
        ]}
        ctaHref="/register"
        ctaLabel="통합 계정 만들기"
      />

      <main className="lp-page lp-page--public">
        <section className="lp-hero lp-hero--public">
          <div className="lp-hero__grid lp-hero__grid--public container">
            <div className="lp-hero__copy lp-hero__copy--public">
              <p className="lp-kicker">Linkon AI Services</p>
              <h1>
                하나의 계정으로
                <span>필요한 AI 서비스를 바로 시작하세요.</span>
              </h1>
              <p>
                Linkon은 케어 AI Vion, 법률 비서 AI Rion, 세무 관리 AI Taxon을
                하나의 계정으로 연결합니다. 가입은 간단하게, 서비스 이용은 자연스럽게 이어집니다.
              </p>
              <div className="lp-hero__actions">
                <Link href="/register" className="btn btn--primary btn--lg">
                  통합 계정 만들기
                </Link>
                <Link href="/login" className="btn btn--outline btn--lg">
                  이미 계정이 있어요
                </Link>
              </div>
              <div className="lp-trust-row" aria-label="Linkon 이용 장점">
                {trustItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="lp-product-showcase" aria-label="Linkon 서비스 미리보기">
              <div className="lp-showcase-brand">
                <Image
                  src="/assets/linkon-noback.png"
                  alt="Linkon"
                  width={86}
                  height={86}
                  priority
                />
                <div>
                  <span>Unified account</span>
                  <strong>Linkon으로 연결되는 AI 서비스</strong>
                </div>
              </div>

              <div className="lp-mockup-stack">
                {services.map((service, index) => (
                  <figure
                    key={service.key}
                    className={`lp-mockup-card lp-mockup-card--${service.color} lp-mockup-card--${index + 1}`}
                  >
                    <div className="lp-mockup-card__body">
                      <Image
                        src={`/assets/${service.key}-no.png`}
                        alt={service.name}
                        width={120}
                        height={40}
                        className="lp-mockup-card__logo"
                      />
                      <p className="lp-mockup-card__tagline">{service.label}</p>
                    </div>
                    <figcaption>
                      <Image src={service.logo} alt="" width={24} height={24} aria-hidden />
                      <span>{service.status === "이용 가능" ? "서비스 중" : "출시 예정"}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section lp-services" id="services">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Services</p>
              <h2 className="section-title">지금 필요한 AI를 선택하세요</h2>
              <p className="section-desc">
                각 서비스는 전문 영역에 집중하고, 사용자는 Linkon 계정 하나로 편하게 시작합니다.
              </p>
            </div>

            <div className="services-grid lp-services-grid">
              {services.map((service) => (
                <article
                  key={service.key}
                  className={`service-card lp-service-card lp-service-card--public service-card--${service.color}`}
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
                    <div className={`service-logo-wrap service-logo-wrap--${service.color}`}>
                      <Image
                        src={service.logo}
                        alt={`${service.name} 로고`}
                        className="service-logo-img"
                        width={48}
                        height={48}
                      />
                    </div>
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

        <section className="section section--alt lp-trust-section" id="trust">
          <div className="container lp-trust-grid">
            <div className="lp-trust-copy">
              <p className="section-label">How It Works</p>
              <h2 className="section-title">가입은 한 번, 이용은 필요한 만큼</h2>
              <p className="about-body">
                Linkon에서 계정을 만들면 Vion을 바로 시작할 수 있고, Rion과 Taxon은 출시 알림을 받아볼 수 있습니다.
                이후 새 서비스가 열리면 같은 계정으로 자연스럽게 이어집니다.
              </p>
            </div>

            <div className="lp-flow-cards">
              <article>
                <span>01</span>
                <strong>Linkon 계정 만들기</strong>
                <p>이메일과 비밀번호만으로 통합 계정을 생성합니다.</p>
              </article>
              <article>
                <span>02</span>
                <strong>서비스 선택하기</strong>
                <p>Vion을 바로 이용하거나 Rion, Taxon 출시 알림을 신청합니다.</p>
              </article>
              <article>
                <span>03</span>
                <strong>필요할 때 다시 연결</strong>
                <p>같은 계정으로 서비스 간 이동과 재접근을 더 쉽게 이어갑니다.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section teaser-section" id="launch">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Coming Soon</p>
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
