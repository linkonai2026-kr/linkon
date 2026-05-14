"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useTransform } from "motion/react";
import { useMotionState } from "./motion-provider";
import { useScrollProgress } from "./use-scroll-progress";

type StageColor = {
  /** 강조 색 (서비스 컬러 등). CSS color 문자열. */
  accent: string;
  /** 글로우/배경 광원 색. CSS color 문자열. */
  glow: string;
};

const VION: StageColor = { accent: "#00C9B1", glow: "rgba(0, 201, 177, 0.32)" };
const RION: StageColor = { accent: "#0056A0", glow: "rgba(0, 86, 160, 0.32)" };
const TAXON: StageColor = { accent: "#DC143C", glow: "rgba(220, 20, 60, 0.32)" };
const LINKON: StageColor = { accent: "#7B61FF", glow: "rgba(123, 97, 255, 0.28)" };

const PRESETS: Record<string, StageColor> = {
  vion: VION,
  rion: RION,
  taxon: TAXON,
  linkon: LINKON,
};

type ScrollColorStageProps = {
  /** 시퀀스로 거쳐 갈 프리셋 이름 (혹은 커스텀 색). 최소 2개. */
  sequence?: Array<keyof typeof PRESETS | StageColor>;
  /** CSS 변수가 적용될 대상이 되는 컨테이너 클래스. */
  className?: string;
  children: React.ReactNode;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function parseColor(value: string): { r: number; g: number; b: number; a: number } {
  const hex = value.trim();
  if (hex.startsWith("#")) {
    const v = hex.slice(1);
    const r = parseInt(v.length === 3 ? v[0] + v[0] : v.slice(0, 2), 16);
    const g = parseInt(v.length === 3 ? v[1] + v[1] : v.slice(2, 4), 16);
    const b = parseInt(v.length === 3 ? v[2] + v[2] : v.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }
  const match = hex.match(/rgba?\(([^)]+)\)/i);
  if (match) {
    const parts = match[1].split(",").map((p) => parseFloat(p.trim()));
    return { r: parts[0] ?? 0, g: parts[1] ?? 0, b: parts[2] ?? 0, a: parts[3] ?? 1 };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function interpolateColor(from: string, to: string, t: number) {
  const a = parseColor(from);
  const b = parseColor(to);
  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));
  const al = Number(lerp(a.a, b.a, t).toFixed(3));
  return `rgba(${r}, ${g}, ${bl}, ${al})`;
}

/**
 * 스크롤 진행도에 따라 자식 영역에 `--stage-accent`, `--stage-glow` CSS 변수를
 * 단계별로 보간해 주입한다. 자식 컴포넌트에서 `var(--stage-accent)` 만 참조하면
 * 자연스럽게 색이 따라온다.
 */
export default function ScrollColorStage({
  sequence = ["vion", "rion", "taxon"],
  className,
  children,
}: ScrollColorStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useMotionState();
  const progress = useScrollProgress(ref, ["start end", "end start"]);

  const resolved: StageColor[] = sequence.map((entry) =>
    typeof entry === "string" ? PRESETS[entry] ?? LINKON : entry,
  );

  // 진행도를 sequence 구간으로 매핑.
  const segmentCount = Math.max(resolved.length - 1, 1);

  const accent = useTransform(progress, (value) => {
    if (resolved.length === 0) return LINKON.accent;
    if (reduceMotion) return resolved[0].accent;
    const scaled = Math.min(0.999, Math.max(0, value)) * segmentCount;
    const i = Math.floor(scaled);
    const t = scaled - i;
    const from = resolved[i] ?? resolved[resolved.length - 1];
    const to = resolved[Math.min(i + 1, resolved.length - 1)];
    return interpolateColor(from.accent, to.accent, t);
  });

  const glow = useTransform(progress, (value) => {
    if (resolved.length === 0) return LINKON.glow;
    if (reduceMotion) return resolved[0].glow;
    const scaled = Math.min(0.999, Math.max(0, value)) * segmentCount;
    const i = Math.floor(scaled);
    const t = scaled - i;
    const from = resolved[i] ?? resolved[resolved.length - 1];
    const to = resolved[Math.min(i + 1, resolved.length - 1)];
    return interpolateColor(from.glow, to.glow, t);
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // 초기값을 즉시 주입해 첫 페인트가 깜빡이지 않게.
    node.style.setProperty("--stage-accent", resolved[0]?.accent ?? LINKON.accent);
    node.style.setProperty("--stage-glow", resolved[0]?.glow ?? LINKON.glow);
  }, [resolved]);

  useMotionValueEvent(accent, "change", (value) => {
    ref.current?.style.setProperty("--stage-accent", value);
  });
  useMotionValueEvent(glow, "change", (value) => {
    ref.current?.style.setProperty("--stage-glow", value);
  });

  return (
    <div ref={ref} className={className ? `scroll-color-stage ${className}` : "scroll-color-stage"}>
      {children}
    </div>
  );
}
