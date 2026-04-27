import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Image
        src="/assets/linkon-no.png"
        alt="Linkon"
        width={120}
        height={40}
        style={{ objectFit: "contain", marginBottom: "var(--space-6)" }}
      />
      <p className="lp-kicker">404</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>
        주소가 변경되었거나 삭제된 페이지일 수 있습니다. Linkon 홈에서 다시 시작해 주세요.
      </p>
      <Link href="/" className="btn btn--primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
