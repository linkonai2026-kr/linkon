"use client";

import { m } from "motion/react";
import { useMotionState } from "./motion/motion-provider";

/**
 * sp-feature-card 마스크 리빌 + 호버 광 막대.
 *
 * variants 의 hidden/visible 은 부모 ServiceFeaturesGrid 의 stagger 와 동기화된다.
 */
export default function ServiceFeatureCard({
  children,
  accent,
}: {
  children: React.ReactNode;
  /** 서비스 색 (CSS hex/rgba). 호버 시 카드 좌측 광 막대 색으로 사용. */
  accent: string;
}) {
  const { reduceMotion } = useMotionState();

  if (reduceMotion) {
    return (
      <article className="sp-feature-card" style={{ "--sp-feature-accent": accent } as React.CSSProperties}>
        {children}
      </article>
    );
  }

  return (
    <m.article
      className="sp-feature-card sp-feature-card--motion"
      style={{ "--sp-feature-accent": accent } as React.CSSProperties}
      variants={{
        hidden: { opacity: 0, y: 24, clipPath: "inset(0 30% 0 0)" },
        visible: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      whileHover={{ y: -4 }}
    >
      {children}
    </m.article>
  );
}
