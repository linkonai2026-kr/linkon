"use client";

import dynamic from "next/dynamic";
import { useMotionState } from "./motion-provider";

const NeuralOrbCanvas = dynamic(() => import("./neural-orb-canvas"), {
  ssr: false,
  loading: () => <div className="neural-orb__placeholder" aria-hidden="true" />,
});

type NeuralOrbProps = {
  accent?: string;
  glow?: string;
  maxNodes?: number;
  mode?: "scatter" | "branch" | "merge";
  className?: string;
};

/**
 * NeuralOrb 진입점.
 *
 * - reduced-motion 이거나 모바일에서는 캔버스 대신 정적 그라데이션 원만 렌더.
 *   첫 페인트 LCP 부담을 줄이고 캔버스 청크 자체를 로드하지 않는다.
 * - 데스크톱 + 모션 허용 환경에서만 dynamic import 로 캔버스 마운트.
 */
export default function NeuralOrb(props: NeuralOrbProps) {
  const { reduceMotion, isDesktop } = useMotionState();
  const accent = props.accent ?? "#7B61FF";
  const glow = props.glow ?? "rgba(123, 97, 255, 0.32)";

  if (reduceMotion || !isDesktop) {
    return (
      <div
        className={props.className ? `neural-orb__static ${props.className}` : "neural-orb__static"}
        aria-hidden="true"
        style={
          {
            "--orb-accent": accent,
            "--orb-glow": glow,
          } as React.CSSProperties
        }
      />
    );
  }

  return <NeuralOrbCanvas {...props} accent={accent} glow={glow} />;
}
