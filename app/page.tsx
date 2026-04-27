import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LaunchNotificationTabs from "@/components/launch-notification-tabs";
import ServiceLaunchBtn from "@/components/service-launch-btn";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Linkon | 통합 계정과 서비스 권한 관리",
  description:
    "Linkon은 Vion, Rion, Taxon을 하나의 계정, 요금제, 접근 권한으로 연결하는 통합 관제 서버입니다.",
};

const services = [
  {
    key: "vion",
    name: "Vion",
    label: "케어 AI",
    status: "운영 중",
    logo: "/assets/vion-noback.png",
    href: "/vion",
    color: "vion",
    description:
      "심리 케어와 일상 체크인을 돕는 AI 서비스입니다. Linkon 계정으로 바로 접근할 수 있습니다.",
    points: ["통합 로그인", "서비스 계정 자동 연결", "운영 중"],
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
    points: ["출시 알림", "법률 문서 흐름", "권한 준비"],
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
      "사업자의 세무 상태, 반복 보고, 신고 준비 흐름을 선명하게 정리하는 세무 AI입니다.",
    points: ["출시 알림", "세무 요약", "권한 준비"],
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "#services", label: "서비스" },
          { href: "#control", label: "관리 기준" },
          { href: "#launch", label: "출시 알림" },
        ]}
        ctaHref="/register"
        ctaLabel="통합 계정 만들기"
      />

      <main className="lp-page">
        <section className="lp-hero">
          <div className="lp-hero__grid container">
            <div className="lp-hero__copy">
              <p className="lp-kicker">Unified AI Service Control Plane</p>
              <h1>
                하나의 Linkon 계정으로
                <span> 케어, 법률, 세무 AI를 연결합니다.</span>
              </h1>
              <p>
                Linkon은 Vion, Rion, Taxon의 통합 로그인, 요금제, 접근 권한,
                서비스별 관리자 권한을 관리하는 공식 관제 서버입니다.
              </p>
              <div className="lp-hero__actions">
                <Link href="/register" className="btn btn--primary btn--lg">
                  무료로 시작하기
                </Link>
                <Link href="#services" className="btn btn--outline btn--lg">
                  서비스 둘러보기
                </Link>
              </div>
              <div className="lp-trust-row" aria-label="Linkon 관리 범위">
                <span>통합 계정</span>
                <span>서비스 접근 권한</span>
                <span>요금제 관리</span>
                <span>감사 로그</span>
              </div>
            </div>

            <div className="lp-command-card" aria-label="Linkon 관제 요약">
              <div className="lp-command-card__top">
                <span>Linkon Control</span>
                <strong>Live</strong>
              </div>
              <div className="lp-command-card__identity">
                <div>
                  <small>Unified user</small>
                  <strong>one-account@linkon</strong>
                </div>
                <span className="lp-status-dot" />
              </div>
              <div className="lp-service-stack">
                {services.map((service) => (
                  <div key={service.key} className={`lp-mini-service lp-mini-service--${service.color}`}>
                    <Image src={service.logo} alt="" width={34} height={34} />
                    <div>
                      <strong>{service.name}</strong>
                      <span>{service.status}</span>
                    </div>
                    <em>{service.key === "vion" ? "enabled" : "ready"}</em>
                  </div>
                ))}
              </div>
              <div className="lp-command-card__footer">
                <span>최근 동기화</span>
                <strong>계정, 권한, 요금제 기준 정상</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section lp-services" id="services">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Services</p>
              <h2 className="section-title">각 서비스는 전문적으로, 계정 관리는 하나로</h2>
              <p className="section-desc">
                전문 데이터는 각 서비스에 두고, Linkon은 공통으로 필요한 계정과 권한만 안정적으로 관리합니다.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service) => (
                <article key={service.key} className={`service-card lp-service-card service-card--${service.color}`}>
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
                    <span className={`status-badge ${service.key === "vion" ? "status-badge--live" : "status-badge--soon"}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3 className="service-name">{service.name}</h3>
                    <p className="service-tagline">{service.label}</p>
                    <p className="service-desc">{service.description}</p>
                    <ul className="lp-card-points">
                      {service.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-footer">
                    <Link href={service.href} className="btn btn--outline btn--full">
                      자세히 보기
                    </Link>
                    {service.key === "vion" ? (
                      <ServiceLaunchBtn
                        service="vion"
                        label="Vion 시작하기"
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
                        출시 알림 받기
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt lp-control" id="control">
          <div className="container lp-control__grid">
            <div>
              <p className="section-label">Control Model</p>
              <h2 className="section-title">Linkon은 통합 관제만 맡습니다</h2>
              <p className="about-body">
                Linkon에는 이메일, 이름, 역할, 계정 상태, 요금제, 서비스 연결 여부,
                서비스별 관리자 권한, 이용 요약, 감사 로그만 저장합니다.
              </p>
              <p className="about-body">
                상담 내용, 법률 문서 원문, 세무 파일, PDF 리포트처럼 민감하고 전문적인 데이터는
                Vion, Rion, Taxon 각 서비스 서버에서만 관리합니다.
              </p>
            </div>
            <div className="lp-principles">
              <article>
                <strong>사용자에게는 단순하게</strong>
                <span>한 번 가입하고 필요한 서비스를 선택합니다.</span>
              </article>
              <article>
                <strong>운영자에게는 명확하게</strong>
                <span>상태, 요금제, 접근 권한을 한 화면에서 확인합니다.</span>
              </article>
              <article>
                <strong>서비스에는 가볍게</strong>
                <span>전문 데이터는 각 서비스가 소유하고 Linkon은 권한만 전달합니다.</span>
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
