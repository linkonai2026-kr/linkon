"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";

type MotionContextValue = {
  /** prefers-reduced-motion 가 활성이거나, 마운트 전이면 true. */
  reduceMotion: boolean;
  /** 화면 너비가 데스크톱 임계값(900px) 이상인지. */
  isDesktop: boolean;
  /** viewport 높이가 600px 이상인지 (가로 모드/짧은 창에서 핀 해제). */
  isTallEnough: boolean;
};

const MotionStateContext = createContext<MotionContextValue>({
  reduceMotion: true,
  isDesktop: false,
  isTallEnough: false,
});

export function useMotionState() {
  return useContext(MotionStateContext);
}

/**
 * 앱 전역 모션 컨텍스트.
 *
 * - LazyMotion + domAnimation 으로 motion 패키지를 ~12KB 청크로 유지.
 * - useReducedMotion 결과를 Context 로 공유해 모든 모션 컴포넌트가 동일한 신호 구독.
 * - 데스크톱/모바일 분기를 한 곳에서 판정해 핀 섹션·오브 렌더 여부를 통일.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotionPref = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTallEnough, setIsTallEnough] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined" || !window.matchMedia) return;

    const widthMql = window.matchMedia("(min-width: 900px)");
    const heightMql = window.matchMedia("(min-height: 600px)");

    const updateWidth = () => setIsDesktop(widthMql.matches);
    const updateHeight = () => setIsTallEnough(heightMql.matches);

    updateWidth();
    updateHeight();

    widthMql.addEventListener("change", updateWidth);
    heightMql.addEventListener("change", updateHeight);

    return () => {
      widthMql.removeEventListener("change", updateWidth);
      heightMql.removeEventListener("change", updateHeight);
    };
  }, []);

  // 하이드레이션 전에는 모션 비활성으로 시작 → SSR/CSR 마크업 일치 + 첫 페인트 안정.
  const reduceMotion = !mounted || reduceMotionPref;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion={reduceMotionPref ? "always" : "never"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <MotionStateContext.Provider value={{ reduceMotion, isDesktop, isTallEnough }}>
          {children}
        </MotionStateContext.Provider>
      </MotionConfig>
    </LazyMotion>
  );
}
