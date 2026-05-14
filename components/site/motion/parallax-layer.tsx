"use client";

import { useRef, type ReactNode } from "react";
import { m, useTransform } from "motion/react";
import { useMotionState } from "./motion-provider";
import { useScrollProgress } from "./use-scroll-progress";

type ParallaxLayerProps = {
  /** y 변위 (px) 범위. [start, end]. */
  y?: [number, number];
  /** scale 범위. */
  scale?: [number, number];
  /** opacity 범위. */
  opacity?: [number, number];
  className?: string;
  children: ReactNode;
  /** 진행도 측정 기준 offset (선택). */
  offset?: ["start end", "end start"] | ["start start", "end end"];
  /** 자식을 일반 div 가 아닌 다른 요소로 렌더할지. */
  as?: "div" | "section" | "aside";
};

/**
 * 스크롤 진행도에 따라 자식에 translate/scale/opacity 를 적용하는 패럴럭스 레이어.
 * reduced-motion 환경에서는 정적 자식을 렌더.
 */
export default function ParallaxLayer({
  y,
  scale,
  opacity,
  className,
  children,
  offset = ["start end", "end start"],
  as = "div",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useMotionState();
  const progress = useScrollProgress(ref, offset);

  const yValue = useTransform(progress, [0, 1], y ?? [0, 0]);
  const scaleValue = useTransform(progress, [0, 1], scale ?? [1, 1]);
  const opacityValue = useTransform(progress, [0, 1], opacity ?? [1, 1]);

  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }

  if (as === "section") {
    return (
      <m.section
        ref={ref}
        className={className}
        style={{ y: yValue, scale: scaleValue, opacity: opacityValue, willChange: "transform" }}
      >
        {children}
      </m.section>
    );
  }
  if (as === "aside") {
    return (
      <m.aside
        ref={ref}
        className={className}
        style={{ y: yValue, scale: scaleValue, opacity: opacityValue, willChange: "transform" }}
      >
        {children}
      </m.aside>
    );
  }
  return (
    <m.div
      ref={ref}
      className={className}
      style={{ y: yValue, scale: scaleValue, opacity: opacityValue, willChange: "transform" }}
    >
      {children}
    </m.div>
  );
}
