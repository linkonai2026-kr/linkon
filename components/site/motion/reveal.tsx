"use client";

import { m } from "motion/react";
import { useMotionState } from "./motion-provider";

type RevealProps = {
  /** 진입 시 자식의 시작 y 변위 (px). default 24. */
  y?: number;
  /** 트랜지션 지속 시간. default 0.5s. */
  duration?: number;
  /** 지연. default 0. */
  delay?: number;
  /** viewport 진입 마진 (rootMargin). */
  amount?: number;
  /** once: true 면 한 번만 트리거. default true. */
  once?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "section" | "li" | "p" | "h2" | "h3" | "span";
};

/**
 * `data-animate="fade-up"` 의 motion 버전. 기존 IO 스크립트와 공존 가능하며,
 * motion 트리 안의 요소에 더 정밀한 stagger/타이밍 제어가 필요할 때 사용.
 *
 * reduced-motion 환경에서는 즉시 최종 상태로 정적 렌더.
 */
export default function Reveal({
  y = 24,
  duration = 0.5,
  delay = 0,
  amount = 0.18,
  once = true,
  className,
  children,
  as = "div",
}: RevealProps) {
  const { reduceMotion } = useMotionState();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = (m as unknown as Record<string, typeof m.div>)[as] ?? m.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
