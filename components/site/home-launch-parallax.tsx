"use client";

import ParallaxLayer from "./motion/parallax-layer";

/**
 * Launch Notification 섹션 배경 패럴럭스 광원.
 * 본문 폼은 그대로 두고 뒤에 떠 있는 그라데이션 광원만 부드럽게 이동.
 */
export default function HomeLaunchParallax() {
  return (
    <ParallaxLayer y={[60, -60]} opacity={[0.7, 1]} className="lp-launch-parallax" as="div">
      <div className="glow-aura glow-aura--rotating" aria-hidden="true" />
    </ParallaxLayer>
  );
}
