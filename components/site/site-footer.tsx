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
            width={90}
            height={30}
          />
          <p className="footer-tagline">
            Vion, Rion, Taxon을 하나의 통합 계정과 권한 체계로 연결하는 AI 서비스 관제 플랫폼입니다.
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
                Vion | 케어 AI
              </Link>
            </li>
            <li>
              <Link href="/rion" className="footer-link footer-link--active">
                Rion | 법률 비서 AI
              </Link>
            </li>
            <li>
              <Link href="/taxon" className="footer-link footer-link--active">
                Taxon | 세무 관리 AI
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">문의</h4>
          <p className="footer-contact-desc">
            서비스 제휴, 도입 문의, 출시 알림 관련 제안은 이메일로 편하게 보내주세요.
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
