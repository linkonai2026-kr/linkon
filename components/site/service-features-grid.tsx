"use client";

import { m } from "motion/react";
import { useMotionState } from "./motion/motion-provider";

/**
 * sp-features__grid 를 motion 래퍼로 감싸 카드별 stagger 리빌.
 * reduced-motion 환경에서는 즉시 정적 마크업으로 폴백.
 */
export default function ServiceFeaturesGrid({ children }: { children: React.ReactNode }) {
  const { reduceMotion } = useMotionState();

  if (reduceMotion) {
    return <div className="sp-features__grid">{children}</div>;
  }

  return (
    <m.div
      className="sp-features__grid"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
      }}
    >
      {children}
    </m.div>
  );
}
