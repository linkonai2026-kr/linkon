"use client";

import NeuralOrb from "./motion/neural-orb";

type ServiceHeroOrbProps = {
  accent: string;
  glow: string;
};

/**
 * 서비스 상세 hero 오른쪽 절반에 떠 있는 신경망 오브.
 * 모바일/reduced-motion 환경에서는 NeuralOrb 내부에서 자동으로 정적 글로우 원으로 폴백.
 */
export default function ServiceHeroOrb({ accent, glow }: ServiceHeroOrbProps) {
  return (
    <div className="sp-hero__orb" aria-hidden="true">
      <NeuralOrb accent={accent} glow={glow} maxNodes={64} mode="scatter" />
    </div>
  );
}
