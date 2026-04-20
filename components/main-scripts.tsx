"use client";

import { useEffect } from "react";

/**
 * 기존 정적 JS 파일들을 Next.js 클라이언트 환경에서 로드
 * (animations.js, main.js, i18n.js)
 *
 * 기존 HTML에서 사용하던 스크립트를 최소한의 수정으로 재사용
 */
export default function MainScripts() {
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        // 이미 로드된 경우 스킵
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.body.appendChild(script);
      });
    };

    // 순서 중요: i18n → animations → main
    loadScript("/js/i18n.js")
      .then(() => loadScript("/js/animations.js"))
      .then(() => loadScript("/js/main.js"))
      .catch((err) => console.warn("[linkon] 스크립트 로드 오류:", err));
  }, []);

  return null;
}
