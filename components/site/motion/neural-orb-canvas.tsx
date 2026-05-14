"use client";

import { useEffect, useRef } from "react";
import { useMotionState } from "./motion-provider";

type NeuralOrbProps = {
  /** 노드 광선 색 (CSS color). 기본 Linkon 보라. */
  accent?: string;
  /** 외곽 글로우 색 (CSS color). */
  glow?: string;
  /** 노드 수 상한 (반응형으로 자동 축소). */
  maxNodes?: number;
  /** "병합" 모드: 노드가 중심으로 수렴해 단일 광원처럼 보이게. */
  mode?: "scatter" | "branch" | "merge";
  className?: string;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number; // 0~1 — 색 변형 (mode=branch 일 때 3색 분기)
};

const PALETTE = {
  vion: { r: 0, g: 201, b: 177 },
  rion: { r: 0, g: 86, b: 160 },
  taxon: { r: 220, g: 20, b: 60 },
};

function parseAccent(value: string): { r: number; g: number; b: number } {
  if (value.startsWith("#")) {
    const v = value.slice(1);
    const hex = v.length === 3 ? v[0] + v[0] + v[1] + v[1] + v[2] + v[2] : v;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return { r: parts[0] ?? 123, g: parts[1] ?? 97, b: parts[2] ?? 255 };
  }
  return { r: 123, g: 97, b: 255 };
}

/**
 * Canvas 2D 기반 신경망 오브.
 *
 * 성능 가드:
 *  - DPR 캡 1.5
 *  - 60fps 미달 3프레임 연속 시 노드 수 50% 감소
 *  - document.hidden 시 일시정지
 *
 * 접근성:
 *  - aria-hidden + role="presentation"
 *  - reduced-motion 이면 컴포넌트 자체가 렌더 안 됨 (dynamic wrapper 에서 분기).
 */
export default function NeuralOrbCanvas({
  accent = "#7B61FF",
  glow = "rgba(123, 97, 255, 0.28)",
  maxNodes = 56,
  mode = "scatter",
  className,
}: NeuralOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDesktop } = useMotionState();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const accentRgb = parseAccent(accent);

    let nodeCount = isDesktop ? maxNodes : Math.round(maxNodes * 0.5);
    nodeCount = Math.max(18, Math.min(nodeCount, maxNodes));

    const nodes: Node[] = [];
    const linkDistance = 140;

    function resize() {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx?.scale(dpr, dpr);
    }

    function seedNodes() {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(width, height) * 0.4;
        nodes.push({
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: 1.5 + Math.random() * 2.5,
          hue: Math.random(),
        });
      }
    }

    resize();
    seedNodes();

    const pointer = { x: width / 2, y: height / 2, active: false };

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const ro = new ResizeObserver(() => {
      resize();
      seedNodes();
    });
    ro.observe(canvas);

    let raf = 0;
    let slowFrames = 0;
    let lastT = performance.now();
    let degraded = false;

    function tick(now: number) {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        lastT = now;
        return;
      }
      const dt = Math.min(48, now - lastT);
      lastT = now;
      if (dt > 22) slowFrames += 1;
      else slowFrames = Math.max(0, slowFrames - 1);

      if (!degraded && slowFrames > 24) {
        degraded = true;
        nodeCount = Math.max(14, Math.round(nodeCount * 0.5));
        seedNodes();
      }

      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // 외곽 글로우
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.05,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.6,
      );
      gradient.addColorStop(0, glow);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 노드 업데이트 + 그리기
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (mode === "merge") {
          // 중심으로 약하게 끌림
          const dx = width / 2 - n.x;
          const dy = height / 2 - n.y;
          n.vx += dx * 0.0009;
          n.vy += dy * 0.0009;
        } else if (mode === "branch") {
          // 3개 클러스터 중심으로 분기
          const targetIdx = Math.floor(n.hue * 3);
          const angle = (targetIdx / 3) * Math.PI * 2;
          const cx = width / 2 + Math.cos(angle) * width * 0.18;
          const cy = height / 2 + Math.sin(angle) * height * 0.18;
          n.vx += (cx - n.x) * 0.0006;
          n.vy += (cy - n.y) * 0.0006;
        }

        if (pointer.active) {
          const pdx = pointer.x - n.x;
          const pdy = pointer.y - n.y;
          const pd2 = pdx * pdx + pdy * pdy;
          if (pd2 < 22500) {
            n.vx += pdx * 0.00008;
            n.vy += pdy * 0.00008;
          }
        }

        n.vx *= 0.96;
        n.vy *= 0.96;
        n.x += n.vx * (dt / 16);
        n.y += n.vy * (dt / 16);

        // 경계 반사
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        // 노드 색
        let r = accentRgb.r;
        let g = accentRgb.g;
        let b = accentRgb.b;
        if (mode === "branch") {
          const targetIdx = Math.floor(n.hue * 3);
          const palette = [PALETTE.vion, PALETTE.rion, PALETTE.taxon][targetIdx];
          r = palette.r;
          g = palette.g;
          b = palette.b;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 노드 연결선
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistance * linkDistance) {
            const alpha = (1 - Math.sqrt(d2) / linkDistance) * 0.45;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      ro.disconnect();
    };
  }, [accent, glow, maxNodes, mode, isDesktop]);

  return (
    <canvas
      ref={canvasRef}
      className={className ? `neural-orb__canvas ${className}` : "neural-orb__canvas"}
      aria-hidden="true"
      role="presentation"
    />
  );
}
