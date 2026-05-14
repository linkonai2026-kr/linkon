"use client";

import { m } from "motion/react";
import ScrollColorStage from "./motion/scroll-color-stage";

/**
 * 서비스 카드 그리드를 감싸는 색 전환 + 카드 모션 래퍼.
 *
 * 자식은 서버에서 렌더된 services-grid 마크업을 그대로 받아 외곽에만 효과를 입힌다.
 * 카드 자체의 모션은 CSS hover 와 brand-shimmer 로 처리해 RSC 호환성을 유지.
 */
export default function HomeServicesStage({ children }: { children: React.ReactNode }) {
  return (
    <ScrollColorStage sequence={["vion", "rion", "taxon"]} className="lp-services-stage">
      <div className="stage-tint" aria-hidden="true" />
      <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {children}
      </m.div>
    </ScrollColorStage>
  );
}
