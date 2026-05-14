"use client";

import { type RefObject } from "react";
import { type MotionValue, useScroll, useTransform } from "motion/react";

type Offset = Parameters<typeof useScroll>[0] extends infer P
  ? P extends { offset?: infer O }
    ? O
    : never
  : never;

/**
 * 섹션 ref 에 대한 스크롤 진행도(0→1)를 반환.
 *
 * 기본 offset: `start end → end start`
 *  - 섹션 상단이 뷰포트 하단에 닿을 때 0
 *  - 섹션 하단이 뷰포트 상단에 닿을 때 1
 *
 * 핀 섹션의 경우 보통 offset `start start → end end` 가 더 자연스럽다.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: Offset = ["start end", "end start"] as Offset,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset });
  return scrollYProgress;
}

/** 진행도를 [0..1] 범위로 안전하게 클램핑한 MotionValue 반환. */
export function useClampedProgress(progress: MotionValue<number>): MotionValue<number> {
  return useTransform(progress, (value) => Math.min(1, Math.max(0, value)));
}
