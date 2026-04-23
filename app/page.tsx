import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MainScripts from "@/components/main-scripts";
import ServiceLaunchBtn from "@/components/service-launch-btn";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Linkon | Unified AI Service Platform",
  description:
    "Launch-ready access to Vion, Rion, and Taxon with unified identity, service routing, and admin control.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "#services", label: "Services" },
          { href: "#about", label: "About" },
          { href: "#launch", label: "Launch" },
        ]}
        ctaHref="/register"
        ctaLabel="Create account"
      />

      <main>
        <section className="hero" id="home">
          <div className="hero__orb hero__orb--teal" aria-hidden="true"></div>
          <div className="hero__orb hero__orb--blue" aria-hidden="true"></div>
          <div className="hero__orb hero__orb--red" aria-hidden="true"></div>

          <div className="container hero__content">
            <p className="hero__eyebrow" data-animate="fade-up" style={{ color: "var(--gold-primary)" }}>
              One platform. Three focused AI services.
            </p>
            <h1 className="hero__title font-serif" data-animate="fade-up" data-delay="100">
              Linkon unifies care,
              <br />
              legal, and finance access.
            </h1>
            <p className="hero__sub" data-animate="fade-up" data-delay="200">
              Users get one account, one launch surface, and one reliable admin layer
              across the full Linkon ecosystem.
            </p>
            <div className="hero__actions" data-animate="fade-up" data-delay="300">
              <Link href="/register" className="btn btn--primary btn--lg">
                <span>Start with Linkon</span>
              </Link>
              <Link href="#services" className="btn btn--outline btn--lg">
                Explore services
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
                Specialized products,
                <br />
                one identity layer
              </h2>
              <p className="section-desc">
                Linkon keeps product entry, account control, and launch readiness
                consistent while each service focuses on a distinct user problem.
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
                      alt="Vion logo"
                      className="service-logo-img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="status-badge status-badge--live">Live now</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Vion</h3>
                  <p className="service-tagline">Mental wellness and silver care</p>
                  <p className="service-desc">
                    An AI-assisted care experience for emotional support, structured
                    check-ins, and aging-family workflows.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/vion" className="btn btn--vion btn--full">
                    Learn about Vion
                  </Link>
                  <ServiceLaunchBtn
                    service="vion"
                    label="Launch Vion"
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
                      alt="Rion logo"
                      className="service-logo-img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="status-badge status-badge--soon">Launching soon</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Rion</h3>
                  <p className="service-tagline">Legal co-pilot</p>
                  <p className="service-desc">
                    A legal workflow product built to make documents, risks, and next
                    steps much easier to understand and act on.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/rion" className="btn btn--outline btn--full">
                    Preview Rion
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn--rion btn--full"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    Join the waitlist
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
                      alt="Taxon logo"
                      className="service-logo-img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="status-badge status-badge--soon">Launching soon</span>
                </div>
                <div className="card-body">
                  <h3 className="service-name">Taxon</h3>
                  <p className="service-tagline">Business finance operations</p>
                  <p className="service-desc">
                    A finance and tax operations layer focused on visibility,
                    recurring workflows, and cleaner admin control.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/taxon" className="btn btn--outline btn--full">
                    Preview Taxon
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn--taxon btn--full"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    Join the waitlist
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
                Product polish on the outside,
                <br />
                operational control underneath
              </h2>
              <p className="about-body">
                Linkon is not just a landing page. It is the canonical control plane
                for account identity, service access, admin actions, and audit-ready
                synchronization.
              </p>
              <p className="about-body">
                That means users see one clean experience while operators keep one
                source of truth for permissions, account state, and service rollout.
              </p>
              <div className="about-stats">
                <div className="stat-item" data-animate="scale-up" data-delay="100">
                  <span className="stat-number" data-countup="3">
                    3
                  </span>
                  <span className="stat-label">Connected services</span>
                </div>
                <div className="stat-item" data-animate="scale-up" data-delay="200">
                  <span className="stat-number" data-countup="1">
                    1
                  </span>
                  <span className="stat-label">Unified identity layer</span>
                </div>
                <div className="stat-item" data-animate="scale-up" data-delay="300">
                  <span className="stat-number" data-countup="24" data-suffix="/7">
                    24/7
                  </span>
                  <span className="stat-label">Admin visibility</span>
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
                    One control plane for launch, permissions, and downstream sync.
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
                  <span className="service-diagram__node-tag">Care and wellbeing</span>
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
                  <span className="service-diagram__node-tag">Legal guidance</span>
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
                  <span className="service-diagram__node-tag">Finance operations</span>
                </button>
                <div className="service-diagram__detail" id="about-diagram-detail" aria-live="polite">
                  <p className="service-diagram__detail-eyebrow">Service focus</p>
                  <div className="service-diagram__detail-panel is-active" data-service-panel="vion">
                    <h3 className="service-diagram__detail-title">Vion</h3>
                    <p className="service-diagram__detail-copy">
                      Guided care and emotional support for daily wellness and silver care journeys.
                    </p>
                  </div>
                  <div className="service-diagram__detail-panel" data-service-panel="rion" hidden>
                    <h3 className="service-diagram__detail-title">Rion</h3>
                    <p className="service-diagram__detail-copy">
                      Plain-language legal help, document clarity, and structured next steps.
                    </p>
                  </div>
                  <div className="service-diagram__detail-panel" data-service-panel="taxon" hidden>
                    <h3 className="service-diagram__detail-title">Taxon</h3>
                    <p className="service-diagram__detail-copy">
                      A clearer operating view for finance tasks, reporting, and tax readiness.
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
              <p className="section-label">Launch path</p>
              <h2 className="section-title">
                Ready to onboard users this week,
                <br />
                built to scale after launch
              </h2>
            </div>

            <div
              className="teaser-panel active"
              id="panel-launch"
              role="region"
              data-animate="fade-up"
              data-delay="200"
              tabIndex={0}
            >
              <h3 className="teaser-name">
                Linkon MVP <span className="teaser-tagline">Launch-ready operating surface</span>
              </h3>
              <p className="teaser-desc">
                The MVP now ships a public product surface, unified signup and login,
                service handoff, protected admin console, audit logging, and
                downstream synchronization hooks for Vion, Rion, and Taxon.
              </p>
              <div className="hero__actions" style={{ justifyContent: "center", marginTop: "var(--space-5)" }}>
                <Link href="/register" className="btn btn--primary btn--lg">
                  Create a Linkon account
                </Link>
                <Link href="/admin" className="btn btn--outline btn--lg">
                  Open admin console
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MainScripts />
    </>
  );
}
