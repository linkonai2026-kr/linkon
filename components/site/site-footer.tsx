import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image
            src="/assets/linkon-no.png"
            alt="Linkon"
            className="footer-logo"
            width={80}
            height={26}
          />
          <p className="footer-tagline">
            케어, 법률, 재무 서비스를 하나의 계정으로 연결하는 AI 플랫폼
          </p>
          <p className="footer-email">
            <a href="mailto:linkon.ai2026@gmail.com">linkon.ai2026@gmail.com</a>
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-heading">서비스</h4>
          <ul className="footer-list">
            <li>
              <Link href="/vion" className="footer-link footer-link--active">
                Vion | 심리 및 실버 케어
              </Link>
            </li>
            <li>
              <Link href="/rion" className="footer-link footer-link--active">
                Rion | 법률 비서 AI
              </Link>
            </li>
            <li>
              <Link href="/taxon" className="footer-link footer-link--active">
                Taxon | 재무 관리 AI
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">문의</h4>
          <p className="footer-contact-desc">
            서비스 제휴, 도입 문의, 출시 관련 제안은 이메일로 편하게 연락해 주세요.
          </p>
          <a href="mailto:linkon.ai2026@gmail.com" className="btn btn--outline btn--sm">
            이메일 문의
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">&copy; 2026 Linkon. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy" className="footer-legal-link">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="footer-legal-link">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
