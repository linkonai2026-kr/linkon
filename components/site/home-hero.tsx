"use client";

import Link from "next/link";
import PinnedStory from "./motion/pinned-story";
import PinnedStoryStep from "./motion/pinned-story-step";
import NeuralOrb from "./motion/neural-orb";

/**
 * 홈 hero — 핀 고정 3단계 스토리텔링.
 *
 * 단계:
 *  0) "하나의 계정으로..."   + Linkon 보라 오브 (scatter)
 *  1) "Vion·Rion·Taxon 신경망" + 3색 분기 오브 (branch)
 *  2) "지금 시작하세요"      + 중심 수렴 오브 (merge) + CTA 강조
 *
 * 모바일/reduced-motion 에서는 핀이 해제되고 3단계가 일반 흐름으로 그대로 보임.
 */
export default function HomeHero() {
  return (
    <PinnedStory
      steps={3}
      viewportLength={2.4}
      className="lp-hero lp-hero--public lp-hero--cinematic"
      decoration={
        <>
          <div className="ai-stage-bg" aria-hidden="true" />
          <div className="glow-aura glow-aura--rotating" aria-hidden="true" />
        </>
      }
      innerClassName="lp-hero__centered container"
    >
      <PinnedStoryStep index={0}>
        <p className="lp-kicker">Linkon AI 서비스</p>
        <h1>
          하나의 계정으로
          <span>필요한 AI 서비스를 바로 시작하세요.</span>
        </h1>
        <p className="lp-hero__desc">
          Linkon 계정 하나로 Vion, Rion, Taxon을 연결합니다.
        </p>
        <div className="lp-hero__actions">
          <Link href="/register" className="btn btn--primary btn--lg">
            통합 계정 만들기
          </Link>
          <Link href="/login" className="btn btn--outline btn--lg">
            로그인하기
          </Link>
        </div>
        <div className="hero-orb-frame" aria-hidden="true">
          <NeuralOrb accent="#7B61FF" glow="rgba(123, 97, 255, 0.32)" maxNodes={48} mode="scatter" />
        </div>
      </PinnedStoryStep>

      <PinnedStoryStep index={1}>
        <p className="lp-kicker">하나의 신경망</p>
        <h1>
          Vion·Rion·Taxon이
          <span>하나의 신경망으로 이어집니다.</span>
        </h1>
        <p className="lp-hero__desc">
          마음과 일상, 법률, 세무 — 세 가지 AI를 같은 계정으로 자유롭게 오갑니다.
        </p>
        <div className="lp-hero__actions">
          <Link href="#services" className="btn btn--primary btn--lg">
            서비스 살펴보기
          </Link>
        </div>
        <div className="hero-orb-frame" aria-hidden="true">
          <NeuralOrb accent="#7B61FF" glow="rgba(123, 97, 255, 0.28)" maxNodes={60} mode="branch" />
        </div>
      </PinnedStoryStep>

      <PinnedStoryStep index={2}>
        <p className="lp-kicker">지금 시작</p>
        <h1>
          한 번의 가입으로
          <span>모든 AI 서비스를 시작하세요.</span>
        </h1>
        <p className="lp-hero__desc">
          Vion은 바로 이용할 수 있고, Rion과 Taxon은 곧 같은 계정으로 만날 수 있습니다.
        </p>
        <div className="lp-hero__actions">
          <Link href="/register" className="btn btn--primary btn--lg cta-pulse">
            통합 계정 만들기
          </Link>
          <Link href="/login" className="btn btn--outline btn--lg">
            로그인하기
          </Link>
        </div>
        <div className="hero-orb-frame" aria-hidden="true">
          <NeuralOrb accent="#7B61FF" glow="rgba(212, 175, 55, 0.32)" maxNodes={56} mode="merge" />
        </div>
      </PinnedStoryStep>
    </PinnedStory>
  );
}
