import Link from "next/link";
import NeuralOrb from "./motion/neural-orb";

/**
 * 홈 hero — 단일 정적 레이아웃 + 단일 NeuralOrb 배경 데코.
 *
 * 2026-05-14 단순화: PinnedStory 3단계 + Canvas 3개를 제거하고 원래 hero 마크업으로 복원.
 * 시네마틱 톤은 `.lp-hero--cinematic` 그라데이션 h1 + `.glow-aura` + 단일 오브로 유지.
 */
export default function HomeHero() {
  return (
    <section className="lp-hero lp-hero--public lp-hero--cinematic">
      <div className="ai-stage-bg" aria-hidden="true" />
      <div className="glow-aura" aria-hidden="true" />
      <div className="hero-orb-frame" aria-hidden="true">
        <NeuralOrb accent="#7B61FF" glow="rgba(123, 97, 255, 0.32)" maxNodes={48} mode="scatter" />
      </div>
      <div className="lp-hero__centered container">
        <p className="lp-kicker">Linkon AI 서비스</p>
        <h1>
          하나의 계정으로
          <span>필요한 AI 서비스를 바로 시작하세요.</span>
        </h1>
        <p className="lp-hero__desc">
          Linkon 계정 하나로 Vion, Rion, Taxon을 연결합니다.
        </p>
        <div className="lp-hero__actions">
          <Link href="/register" className="btn btn--primary btn--lg cta-pulse">
            통합 계정 만들기
          </Link>
          <Link href="/login" className="lp-hero__login-link">
            로그인하기 →
          </Link>
        </div>

        <div className="lp-trust-row" aria-label="서비스 특징">
          <span>무료로 시작</span>
          <span>가입 2분 소요</span>
          <span>카드 등록 불필요</span>
        </div>
      </div>
    </section>
  );
}
