import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LaunchNotificationTabs from "@/components/launch-notification-tabs";
import MainScripts from "@/components/main-scripts";
import ServiceLaunchBtn from "@/components/service-launch-btn";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Linkon | 통합 AI 서비스 플랫폼",
  description:
    "Vion, Rion, Taxon을 하나의 계정과 관리자 기준으로 연결하는 Linkon 통합 AI 서비스 플랫폼입니다.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "#services", label: "서비스" },
          { href: "#about", label: "소개" },
          { href: "#launch", label: "출시 알림" },
        ]}
        ctaHref="/register"
        ctaLabel="회원가입"
      />

      <main>
        <section className="hero" id="home">
          <div className="hero__orb hero__orb--teal" aria-hidden="true"></div>
          <div className="hero__orb hero__orb--blue" aria-hidden="true"></div>
          <div className="hero__orb hero__orb--red" aria-hidden="true"></div>

          <div className="container hero__content">
            <p className="hero__eyebrow" data-animate="fade-up" style={{ color: "var(--gold-primary)" }}>
              하나의 계정으로 연결되는 세 가지 AI 서비스
            </p>
            <h1 className="hero__title font-serif" data-animate="fade-up" data-delay="100">
              케어, 법률, 재무를
              <br />
              Linkon에서 한 번에 연결합니다.
            </h1>
            <p className="hero__sub" data-animate="fade-up" data-delay="200">
              사용자는 하나의 계정으로 서비스를 시작하고, 운영자는 하나의 기준으로
              권한과 서비스 연동을 관리할 수 있습니다.
            </p>
            <div className="hero__actions" data-animate="fade-up" data-delay="300">
              <Link href="/register" className="btn btn--primary btn--lg">
                <span>무료로 시작하기</span>
              </Link>
              <Link href="#services" className="btn btn--outline btn--lg">
                서비스 둘러보기
              </Link>
            </div>
          </div>

          <div className="hero__scroll-hint" aria-hidden="true">
            <span className="hero__scroll-text">Scroll</span>
            <div className="hero__scroll-arrow"></div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <p className="section-label">Services</p>
              <h2 className="section-title">
                전문 서비스는 각각 다르게,
                <br />
                계정과 운영 기준은 하나로
              </h2>
              <p className="section-desc">
                Linkon은 서비스 진입, 계정 관리, 권한 제어, 출시 준비를 하나의
                흐름으로 묶어 MVP 이후 확장까지 고려합니다.
              </p>
            </div>

            <div className="services-grid">
              <article
                className="service-card service-card--live"
                data-service="vion"
                data-animate="fade-up"
                data-delay="100"
              >
                <div className="card-glow-top card-glow-top--vion"></div>
                <div className="card-header">
                  <div className="service-logo-wrap service-logo-wrap--vion">
                    <Image
                      src="/assets/vion-noback.png"
                      alt="Vion 로고"
                      className="service-logo-img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="status-badge status-badge--live">서비스 중</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Vion</h3>
                  <p className="service-tagline">심리 및 실버 케어 AI</p>
                  <p className="service-desc">
                    감정 상태 확인, 일상 체크인, 가족 케어 흐름을 돕는 AI 기반
                    케어 서비스입니다.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/vion" className="btn btn--vion btn--full">
                    Vion 자세히 보기
                  </Link>
                  <ServiceLaunchBtn
                    service="vion"
                    label="Vion 시작하기"
                    className="btn btn--outline btn--full"
                    style={{ marginTop: "var(--space-2)" }}
                  />
                </div>
              </article>

              <article
                className="service-card service-card--soon"
                data-service="rion"
                data-animate="fade-up"
                data-delay="200"
              >
                <div className="card-glow-top card-glow-top--rion"></div>
                <div className="card-header">
                  <div className="service-logo-wrap service-logo-wrap--rion">
                    <Image
                      src="/assets/rion-noback.png"
                      alt="Rion 로고"
                      className="service-logo-img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="status-badge status-badge--soon">출시 예정</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Rion</h3>
                  <p className="service-tagline">법률 비서 AI</p>
                  <p className="service-desc">
                    어려운 계약서와 법률 절차를 이해하기 쉬운 안내로 바꾸는 AI
                    법률 비서입니다.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/rion" className="btn btn--outline btn--full">
                    Rion 미리보기
                  </Link>
                  <Link
                    href="#launch"
                    className="btn btn--rion btn--full"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    출시 알림 받기
                  </Link>
                </div>
              </article>

              <article
                className="service-card service-card--soon"
                data-service="taxon"
                data-animate="fade-up"
                data-delay="300"
              >
                <div className="card-glow-top card-glow-top--taxon"></div>
                <div className="card-header">
                  <div className="service-logo-wrap service-logo-wrap--taxon">
                    <Image
                      src="/assets/taxon-noback.png"
                      alt="Taxon 로고"
                      className="service-logo-img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="status-badge status-badge--soon">출시 예정</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Taxon</h3>
                  <p className="service-tagline">재무 관리 AI</p>
                  <p className="service-desc">
                    사업 재무 상태, 반복 보고, 세무 준비 흐름을 더 명확하게
                    정리하는 AI 재무 관리 서비스입니다.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/taxon" className="btn btn--outline btn--full">
                    Taxon 미리보기
                  </Link>
                  <Link
                    href="#launch"
                    className="btn btn--taxon btn--full"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    출시 알림 받기
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--alt" id="about">
          <div className="container about-grid">
            <div className="about-text" data-animate="fade-up">
              <p className="section-label">Why Linkon</p>
              <h2 className="section-title">
                사용자에게는 깔끔하게,
                <br />
                운영팀에게는 통제 가능하게
              </h2>
              <p className="about-body">
                Linkon은 단순 랜딩페이지가 아니라 통합 계정, 서비스 접근,
                관리자 조치, 감사 로그, 서비스 동기화를 관리하는 운영 기준점입니다.
              </p>
              <p className="about-body">
                사용자는 하나의 자연스러운 경험을 보고, 운영팀은 하나의 소스에서
                권한과 상태를 관리할 수 있습니다.
              </p>
              <div className="about-stats">
                <div className="stat-item" data-animate="scale-up" data-delay="100">
                  <span className="stat-number" data-countup="3">
                    3
                  </span>
                  <span className="stat-label">연결 서비스</span>
                </div>
                <div className="stat-item" data-animate="scale-up" data-delay="200">
                  <span className="stat-number" data-countup="1">
                    1
                  </span>
                  <span className="stat-label">통합 계정 기준</span>
                </div>
                <div className="stat-item" data-animate="scale-up" data-delay="300">
                  <span className="stat-number" data-countup="24" data-suffix="/7">
                    24/7
                  </span>
                  <span className="stat-label">운영 가시성</span>
                </div>
              </div>
            </div>

            <div className="about-visual" data-animate="fade-in" data-delay="200">
              <div className="service-diagram" data-active-service="vion">
                <div className="service-diagram__ring service-diagram__ring--outer" aria-hidden="true"></div>
                <div className="service-diagram__ring service-diagram__ring--inner" aria-hidden="true"></div>
                <div className="service-diagram__core">
                  <span className="service-diagram__core-label">Linkon</span>
                  <p className="service-diagram__core-copy">
                    계정, 권한, 출시 준비, 서비스 동기화를 하나로 연결합니다.
                  </p>
                </div>
                <button
                  className="service-diagram__node service-diagram__node--vion is-active"
                  type="button"
                  data-service-node="vion"
                  aria-pressed="true"
                >
                  <Image
                    src="/assets/vion-noback.png"
                    alt=""
                    className="service-diagram__node-logo"
                    width={32}
                    height={32}
                    aria-hidden={true}
                  />
                  <span className="service-diagram__node-name">Vion</span>
                  <span className="service-diagram__node-tag">케어와 심리 지원</span>
                </button>
                <button
                  className="service-diagram__node service-diagram__node--rion"
                  type="button"
                  data-service-node="rion"
                  aria-pressed="false"
                >
                  <Image
                    src="/assets/rion-noback.png"
                    alt=""
                    className="service-diagram__node-logo"
                    width={32}
                    height={32}
                    aria-hidden={true}
                  />
                  <span className="service-diagram__node-name">Rion</span>
                  <span className="service-diagram__node-tag">법률 안내</span>
                </button>
                <button
                  className="service-diagram__node service-diagram__node--taxon"
                  type="button"
                  data-service-node="taxon"
                  aria-pressed="false"
                >
                  <Image
                    src="/assets/taxon-noback.png"
                    alt=""
                    className="service-diagram__node-logo"
                    width={32}
                    height={32}
                    aria-hidden={true}
                  />
                  <span className="service-diagram__node-name">Taxon</span>
                  <span className="service-diagram__node-tag">재무 운영</span>
                </button>
                <div className="service-diagram__detail" id="about-diagram-detail" aria-live="polite">
                  <p className="service-diagram__detail-eyebrow">Service Focus</p>
                  <div className="service-diagram__detail-panel is-active" data-service-panel="vion">
                    <h3 className="service-diagram__detail-title">Vion</h3>
                    <p className="service-diagram__detail-copy">
                      일상 심리 케어와 실버 케어 흐름을 더 꾸준히 이어갑니다.
                    </p>
                  </div>
                  <div className="service-diagram__detail-panel" data-service-panel="rion" hidden>
                    <h3 className="service-diagram__detail-title">Rion</h3>
                    <p className="service-diagram__detail-copy">
                      법률 문서와 절차를 더 이해하기 쉬운 안내로 정리합니다.
                    </p>
                  </div>
                  <div className="service-diagram__detail-panel" data-service-panel="taxon" hidden>
                    <h3 className="service-diagram__detail-title">Taxon</h3>
                    <p className="service-diagram__detail-copy">
                      사업 재무와 세무 준비 흐름을 더 선명하게 보여줍니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section teaser-section" id="launch">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <p className="section-label">Coming Soon</p>
              <h2 className="section-title">
                Rion과 Taxon 출시 소식을
                <br />
                가장 먼저 받아보세요
              </h2>
              <p className="section-desc">
                관심 있는 서비스를 선택하고 이메일을 남기면 출시 안내와 초기 이용
                소식을 보내드립니다.
              </p>
            </div>

            <LaunchNotificationTabs />
          </div>
        </section>
      </main>

      <SiteFooter />
      <MainScripts />
    </>
  );
}
