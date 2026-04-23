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
            Unified AI services for care, legal guidance, and finance operations.
          </p>
          <p className="footer-email">
            <a href="mailto:linkon.ai2026@gmail.com">linkon.ai2026@gmail.com</a>
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-list">
            <li>
              <Link href="/vion" className="footer-link footer-link--active">
                Vion | Mental wellness and silver care
              </Link>
            </li>
            <li>
              <Link href="/rion" className="footer-link footer-link--active">
                Rion | Legal co-pilot
              </Link>
            </li>
            <li>
              <Link href="/taxon" className="footer-link footer-link--active">
                Taxon | Business finance operations
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">Contact</h4>
          <p className="footer-contact-desc">
            For launch inquiries, partnerships, or enterprise onboarding, contact
            the Linkon team directly.
          </p>
          <a href="mailto:linkon.ai2026@gmail.com" className="btn btn--outline btn--sm">
            Email us
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">&copy; 2026 Linkon. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="footer-legal-link">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
