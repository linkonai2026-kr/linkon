import Link from "next/link";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";

interface LegalPageProps {
  title: string;
  description: string;
  updatedAt: string;
  sections: ReadonlyArray<{
    heading: string;
    body: ReadonlyArray<string>;
  }>;
}

export default function LegalPage({
  title,
  description,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "/", label: "홈" },
          { href: "/privacy", label: "개인정보처리방침" },
          { href: "/terms", label: "이용약관" },
        ]}
        ctaHref="/register"
        ctaLabel="회원가입"
      />
      <main className="legal-page">
        <div className="legal-wrap">
          <Link href="/" className="legal-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 4 6 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Linkon 홈으로
          </Link>

          <p className="section-label">Legal</p>
          <h1 className="legal-title font-serif">{title}</h1>
          <p className="legal-date">최종 업데이트: {updatedAt}</p>
          <p className="legal-lead">{description}</p>

          {sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
