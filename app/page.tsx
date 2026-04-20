/**
 * 메인 홈페이지 (index.html → RSC)
 *
 * 기존 HTML 구조를 React로 이관.
 * 인터랙티브 기능(nav scroll, mobile menu, i18n, etc.)은
 * MainScripts 클라이언트 컴포넌트를 통해 기존 JS 파일 재사용.
 */

import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import MainScripts from "@/components/main-scripts";
import ServiceLaunchBtn from "@/components/service-launch-btn";

export const metadata: Metadata = {
  title: "Linkon — AI 기반 전문 서비스",
  description: "심리 케어, 법률 자문, 재무 관리를 하나의 AI 플랫폼에서. Linkon이 삶의 중요한 순간마다 곁에 있습니다.",
};

export default function HomePage() {
  return (
    <>
      {/* ===== NAVIGATION ===== */}
      <header className="nav" id="nav">
        <div className="nav__inner container">
          <Link href="/" className="nav__logo" aria-label="Linkon 홈">
            <Image src="/assets/linkon-no.png" alt="Linkon" className="nav__logo-img" width={100} height={32} priority />
          </Link>

          <nav className="nav__links" aria-label="주요 메뉴">
            <Link href="#services" className="nav__link">서비스</Link>
            <Link href="#about" className="nav__link">회사 소개</Link>
            <Link href="#contact" className="nav__link">문의하기</Link>
          </nav>

          <div className="lang-toggle" role="group" aria-label="언어 선택">
            <button className="lang-btn is-active" data-lang="ko">KO</button>
            <span className="lang-divider" aria-hidden="true">|</span>
            <button className="lang-btn" data-lang="en">EN</button>
          </div>

          <Link href="/register" className="btn btn--primary btn--sm nav__cta">
            <span>회원가입</span>
            <svg className="btn__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <button className="nav__hamburger" id="hamburger" aria-label="메뉴 열기" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>

        <div className="nav__drawer" id="drawer" aria-hidden="true">
          <div className="nav__drawer-inner">
            <Link href="#services" className="nav__drawer-link">서비스</Link>
            <Link href="#about" className="nav__drawer-link">회사 소개</Link>
            <Link href="#contact" className="nav__drawer-link">문의하기</Link>
            <Link href="/register" className="btn btn--primary nav__drawer-cta">회원가입</Link>
          </div>
        </div>
        <div className="nav__overlay" id="nav-overlay" aria-hidden="true"></div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section className="hero" id="home">
          <div className="hero__orb hero__orb--teal" aria-hidden="true"></div>
          <div className="hero__orb hero__orb--blue" aria-hidden="true"></div>
          <div className="hero__orb hero__orb--red" aria-hidden="true"></div>

          <div className="container hero__content">
            <p className="hero__eyebrow" data-animate="fade-up" style={{ color: "var(--gold-primary)" }}>
              AI 기반 전문 서비스 플랫폼
            </p>
            <h1 className="hero__title font-serif" data-animate="fade-up" data-delay="100">
              더 나은 삶을 위한<br />
              <span className="text-gradient">AI 서비스</span>
            </h1>
            <p className="hero__sub" data-animate="fade-up" data-delay="200">
              심리 케어부터 법률, 재무까지 —<br className="hide-mobile" /> 전문 AI가 함께합니다.
            </p>
            <div className="hero__actions" data-animate="fade-up" data-delay="300">
              <Link href="/register" className="btn btn--primary btn--lg">
                <span>무료로 시작하기</span>
                <svg className="btn__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="#services" className="btn btn--outline btn--lg">서비스 살펴보기</Link>
            </div>
          </div>

          <div className="hero__scroll-hint" aria-hidden="true">
            <span className="hero__scroll-text">스크롤</span>
            <div className="hero__scroll-arrow"></div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section className="section" id="services">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <p className="section-label">서비스</p>
              <h2 className="section-title">Linkon이 제공하는<br />전문 AI 서비스</h2>
              <p className="section-desc">각 분야에 특화된 AI가 더 명확하고 더 따뜻한 방식으로 당신의 결정을 돕습니다.</p>
            </div>

            <div className="services-grid">
              {/* VION */}
              <article className="service-card service-card--live" data-service="vion" data-animate="fade-up" data-delay="100">
                <div className="card-glow-top card-glow-top--vion"></div>
                <div className="card-header">
                  <div className="service-logo-wrap service-logo-wrap--vion">
                    <Image src="/assets/vion-noback.png" alt="Vion 로고" className="service-logo-img" width={48} height={48} />
                  </div>
                  <span className="status-badge status-badge--live">서비스 중</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Vion</h3>
                  <p className="service-tagline">심리 및 실버 케어</p>
                  <p className="service-desc">임상심리 상담사가 직접 설계한 AI 심리 상담 서비스입니다. 실제 임상 기록과 상담 기법을 바탕으로, 전담 전문가와 함께 당신의 마음을 돌봅니다.</p>
                </div>
                <div className="card-footer">
                  <Link href="/vion" className="btn btn--vion btn--full">
                    <span>서비스 자세히 보기</span>
                    <svg className="btn__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <ServiceLaunchBtn
                    service="vion"
                    label="서비스 시작하기"
                    className="btn btn--outline btn--full"
                    style={{ marginTop: "var(--space-2)" }}
                  />
                </div>
              </article>

              {/* RION */}
              <article className="service-card service-card--soon" data-service="rion" data-animate="fade-up" data-delay="200">
                <div className="card-glow-top card-glow-top--rion"></div>
                <div className="card-header">
                  <div className="service-logo-wrap service-logo-wrap--rion">
                    <Image src="/assets/rion-noback.png" alt="Rion 로고" className="service-logo-img" width={48} height={48} />
                  </div>
                  <span className="status-badge status-badge--soon">출시 예정</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Rion</h3>
                  <p className="service-tagline">법률 비서</p>
                  <p className="service-desc">현직 변호사가 직접 가르친 AI 법률 비서입니다. 실제 판례를 기반으로 답변하며, 유료 회원에게는 변호사 직인이 포함된 공식 법률 문서를 발급합니다.</p>
                </div>
                <div className="card-footer">
                  <Link href="/rion" className="btn btn--outline btn--full">
                    <span>서비스 미리보기</span>
                    <svg className="btn__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </article>

              {/* TAXON */}
              <article className="service-card service-card--soon" data-service="taxon" data-animate="fade-up" data-delay="300">
                <div className="card-glow-top card-glow-top--taxon"></div>
                <div className="card-header">
                  <div className="service-logo-wrap service-logo-wrap--taxon">
                    <Image src="/assets/taxon-noback.png" alt="Taxon 로고" className="service-logo-img" width={48} height={48} />
                  </div>
                  <span className="status-badge status-badge--soon">출시 예정</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Taxon</h3>
                  <p className="service-tagline">재무 관리</p>
                  <p className="service-desc">공인회계사·세무사가 직접 설계한 AI 재무 관리 서비스입니다. 실제 세무 기록을 토대로 답변하며, 유료 회원에게는 전문가 직인이 포함된 공식 세무 문서를 발급합니다.</p>
                </div>
                <div className="card-footer">
                  <Link href="/taxon" className="btn btn--outline btn--full">
                    <span>서비스 미리보기</span>
                    <svg className="btn__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section className="section section--alt" id="about">
          <div className="container about-grid">
            <div className="about-text" data-animate="fade-up">
              <p className="section-label">회사 소개</p>
              <h2 className="section-title">기술로 삶의 문제를<br />해결합니다</h2>
              <p className="about-body">
                Linkon은 전문 지식의 장벽을 낮추고 누구나 고품질의 AI 서비스를 누릴 수 있도록 설계된 서비스 플랫폼입니다.
              </p>
              <p className="about-body">
                심리 상담, 법률 자문, 재무 관리까지 삶의 중요한 순간마다 Linkon의 AI가 곁에서 돕습니다.
              </p>
              <div className="about-stats">
                <div className="stat-item" data-animate="scale-up" data-delay="100">
                  <span className="stat-number" data-countup="3">3</span>
                  <span className="stat-label">전문 서비스</span>
                </div>
                <div className="stat-item" data-animate="scale-up" data-delay="200">
                  <span className="stat-number" data-countup="100" data-suffix="%">100%</span>
                  <span className="stat-label">AI 기반</span>
                </div>
                <div className="stat-item" data-animate="scale-up" data-delay="300">
                  <span className="stat-number" data-countup="24" data-suffix="/7">24/7</span>
                  <span className="stat-label">언제 어디서나</span>
                </div>
              </div>
            </div>

            <div className="about-visual" data-animate="fade-in" data-delay="200">
              <div className="service-diagram" data-active-service="vion">
                <div className="service-diagram__ring service-diagram__ring--outer" aria-hidden="true"></div>
                <div className="service-diagram__ring service-diagram__ring--inner" aria-hidden="true"></div>
                <div className="service-diagram__core">
                  <span className="service-diagram__core-label">Linkon</span>
                  <p className="service-diagram__core-copy">세 가지 전문 AI 서비스가 하나의 플랫폼에서 연결됩니다.</p>
                </div>
                <button className="service-diagram__node service-diagram__node--vion is-active" type="button" data-service-node="vion" aria-pressed="true">
                  <Image src="/assets/vion-noback.png" alt="" className="service-diagram__node-logo" width={32} height={32} aria-hidden={true} />
                  <span className="service-diagram__node-name">Vion</span>
                  <span className="service-diagram__node-tag">마음과 일상의 케어</span>
                </button>
                <button className="service-diagram__node service-diagram__node--rion" type="button" data-service-node="rion" aria-pressed="false">
                  <Image src="/assets/rion-noback.png" alt="" className="service-diagram__node-logo" width={32} height={32} aria-hidden={true} />
                  <span className="service-diagram__node-name">Rion</span>
                  <span className="service-diagram__node-tag">법률의 장벽을 낮추는 안내</span>
                </button>
                <button className="service-diagram__node service-diagram__node--taxon" type="button" data-service-node="taxon" aria-pressed="false">
                  <Image src="/assets/taxon-noback.png" alt="" className="service-diagram__node-logo" width={32} height={32} aria-hidden={true} />
                  <span className="service-diagram__node-name">Taxon</span>
                  <span className="service-diagram__node-tag">숫자를 더 선명하게 보는 시선</span>
                </button>
                <div className="service-diagram__detail" id="about-diagram-detail" aria-live="polite">
                  <p className="service-diagram__detail-eyebrow">Service Focus</p>
                  <div className="service-diagram__detail-panel is-active" data-service-panel="vion">
                    <h3 className="service-diagram__detail-title">Vion</h3>
                    <p className="service-diagram__detail-copy">감정 분석과 대화 기반 케어를 통해 언제든 기대어 쉴 수 있는 심리 AI입니다.</p>
                  </div>
                  <div className="service-diagram__detail-panel" data-service-panel="rion" hidden>
                    <h3 className="service-diagram__detail-title">Rion</h3>
                    <p className="service-diagram__detail-copy">어려운 법률 문서와 절차를 일상 언어로 풀어내는 AI 법률 파트너입니다.</p>
                  </div>
                  <div className="service-diagram__detail-panel" data-service-panel="taxon" hidden>
                    <h3 className="service-diagram__detail-title">Taxon</h3>
                    <p className="service-diagram__detail-copy">자산 분석부터 절세 전략까지 재무 의사결정을 더 정확하게 돕는 AI입니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMING SOON ===== */}
        <section className="section teaser-section" id="coming-soon">
          <div className="container">
            <div className="section-header" data-animate="fade-up">
              <p className="section-label">곧 만나보세요</p>
              <h2 className="section-title">더 많은 AI 서비스가<br />출시 예정입니다</h2>
            </div>

            <div className="teaser-tabs" data-animate="fade-up" data-delay="100" role="tablist" aria-label="출시 예정 서비스">
              <button className="teaser-tab teaser-tab--rion active" id="tab-rion" type="button" data-tab="rion" role="tab" aria-selected="true" aria-controls="panel-rion">Rion</button>
              <button className="teaser-tab teaser-tab--taxon" id="tab-taxon" type="button" data-tab="taxon" role="tab" aria-selected="false" aria-controls="panel-taxon" tabIndex={-1}>Taxon</button>
            </div>

            <div className="teaser-panel active" id="panel-rion" role="tabpanel" aria-labelledby="tab-rion" data-animate="fade-up" data-delay="200" tabIndex={0}>
              <div className="teaser-logo teaser-logo--rion">
                <Image src="/assets/rion-no.png" alt="Rion 로고" className="teaser-logo-img" width={64} height={64} />
              </div>
              <h3 className="teaser-name">Rion <span className="teaser-tagline">— 법률 비서</span></h3>
              <p className="teaser-desc">복잡한 법률 문서도 Rion과 함께라면 쉽게 이해할 수 있습니다. AI 법률 비서가 당신의 권리를 지켜드립니다.</p>
              <Link href="/register" className="btn btn--rion" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span>출시 알림 받기 (회원가입)</span>
              </Link>
            </div>

            <div className="teaser-panel" id="panel-taxon" role="tabpanel" aria-labelledby="tab-taxon" tabIndex={0} hidden>
              <div className="teaser-logo teaser-logo--taxon">
                <Image src="/assets/taxon-no.png" alt="Taxon 로고" className="teaser-logo-img" width={64} height={64} />
              </div>
              <h3 className="teaser-name">Taxon <span className="teaser-tagline">— 재무 관리</span></h3>
              <p className="teaser-desc">AI가 분석하는 스마트한 재무 관리. 자산 현황 파악부터 절세 전략까지, Taxon이 당신의 재무 파트너가 되어드립니다.</p>
              <Link href="/register" className="btn btn--taxon" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span>출시 알림 받기 (회원가입)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Image src="/assets/linkon-no.png" alt="Linkon" className="footer-logo" width={80} height={26} />
            <p className="footer-tagline">더 나은 삶을 위한 AI 서비스 플랫폼</p>
            <p className="footer-email"><a href="mailto:linkon.ai2026@gmail.com">linkon.ai2026@gmail.com</a></p>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">서비스</h4>
            <ul className="footer-list">
              <li><Link href="/vion" className="footer-link footer-link--active">Vion — 심리 및 실버 케어</Link></li>
              <li><span className="footer-link footer-link--muted">Rion — 법률 비서 <em>(출시 예정)</em></span></li>
              <li><span className="footer-link footer-link--muted">Taxon — 재무 관리 <em>(출시 예정)</em></span></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">문의하기</h4>
            <p className="footer-contact-desc">서비스 관련 문의 또는 제안이 있으시면 이메일로 연락해 주세요.</p>
            <a href="mailto:linkon.ai2026@gmail.com" className="btn btn--outline btn--sm">이메일 문의</a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p className="footer-copy">&copy; 2025 Linkon. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="/privacy" className="footer-legal-link">개인정보처리방침</Link>
              <Link href="/terms" className="footer-legal-link">이용약관</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 기존 JS 파일 로드 (클라이언트 컴포넌트) */}
      <MainScripts />
    </>
  );
}
