"use client";

import { Children, isValidElement, useMemo, useRef } from "react";
import { m, useTransform } from "motion/react";
import { useMotionState } from "./motion-provider";
import { useScrollProgress } from "./use-scroll-progress";
import PinnedStoryStep from "./pinned-story-step";

type PinnedStoryProps = {
  /**
   * 단계 수. 자식의 PinnedStoryStep 개수와 일치해야 한다.
   * progress 0→1 구간을 (1/steps) 씩 분할해 각 step 의 활성 구간을 정한다.
   */
  steps: number;
  /** sticky 가 머무는 길이를 viewport 기준으로 배수 지정 (default 2 = 200vh). */
  viewportLength?: number;
  className?: string;
  /** 핀 섹션 내부에서 자식 위에 떠 있을 데코 레이어 (오브 등). */
  decoration?: React.ReactNode;
  /** 기본 sticky 안쪽 컨테이너 클래스 (레이아웃 미세조정용). */
  innerClassName?: string;
  children: React.ReactNode;
  /** progress 값을 외부로 전달하고 싶을 때 (예: 색 전환과 동기화). */
  onProgress?: (progress: number) => void;
};

/**
 * 핀 고정 스토리텔링 컨테이너.
 *
 * - 데스크톱 + 충분한 viewport 높이 + reduced-motion 비활성에서만 sticky 작동.
 * - 그 외(모바일/짧은 창/접근성 모드)에서는 일반 세로 흐름으로 모든 단계를 그대로 렌더.
 *   → 의미가 손실되지 않고 SEO/스크린리더에도 동등하게 노출.
 */
export default function PinnedStory({
  steps,
  viewportLength = 2,
  className,
  decoration,
  innerClassName,
  children,
}: PinnedStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { reduceMotion, isDesktop, isTallEnough } = useMotionState();
  const pinActive = isDesktop && isTallEnough && !reduceMotion;

  const progress = useScrollProgress(sectionRef, ["start start", "end end"]);

  const validChildren = useMemo(() => {
    return Children.toArray(children).filter((child) => {
      if (!isValidElement(child)) return false;
      return child.type === PinnedStoryStep;
    });
  }, [children]);

  if (!pinActive) {
    // 폴백: 모든 step 을 순차로 렌더, 인라인 force-static prop 전달.
    return (
      <section ref={sectionRef} className={className}>
        {decoration}
        <div className={innerClassName}>
          {Children.map(children, (child) => {
            if (isValidElement(child) && child.type === PinnedStoryStep) {
              return <m.div className="pinned-story__step pinned-story__step--static">{child}</m.div>;
            }
            return child;
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{ minHeight: `${viewportLength * 100}vh`, position: "relative" }}
    >
      <div className="pinned-story__sticky">
        {decoration}
        <div className={innerClassName ? `pinned-story__inner ${innerClassName}` : "pinned-story__inner"}>
          {validChildren.map((child, index) => (
            <PinnedStoryFrame
              key={index}
              progress={progress}
              index={index}
              total={validChildren.length}
            >
              {child}
            </PinnedStoryFrame>
          ))}
        </div>
      </div>
    </section>
  );
}

function PinnedStoryFrame({
  progress,
  index,
  total,
  children,
}: {
  progress: ReturnType<typeof useScrollProgress>;
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  // 각 step 의 활성 구간: [index / total, (index+1) / total].
  // 그 구간을 중심으로 ±0.08 만큼 페이드 인/아웃.
  const segment = 1 / Math.max(total, 1);
  const center = segment * index + segment / 2;
  const fadeWidth = Math.min(0.12, segment * 0.45);

  const opacity = useTransform(
    progress,
    [
      Math.max(0, center - segment / 2 - fadeWidth),
      Math.max(0, center - segment / 2 + fadeWidth * 0.2),
      Math.min(1, center + segment / 2 - fadeWidth * 0.2),
      Math.min(1, center + segment / 2 + fadeWidth),
    ],
    [0, 1, 1, 0],
  );

  const y = useTransform(
    progress,
    [
      Math.max(0, center - segment / 2 - fadeWidth),
      center,
      Math.min(1, center + segment / 2 + fadeWidth),
    ],
    [24, 0, -24],
  );

  return (
    <m.div className="pinned-story__step" style={{ opacity, y }}>
      {children}
    </m.div>
  );
}
