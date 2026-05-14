"use client";

import PinnedStory from "./motion/pinned-story";
import PinnedStoryStep from "./motion/pinned-story-step";
import NeuralOrb from "./motion/neural-orb";

const STEPS = [
  {
    label: "01",
    title: "Linkon 계정 만들기",
    desc: "이메일과 비밀번호만으로 통합 계정을 생성합니다. 가입 한 번이면 충분합니다.",
    accent: "#7B61FF",
    glow: "rgba(123, 97, 255, 0.32)",
    mode: "merge" as const,
  },
  {
    label: "02",
    title: "서비스 선택하기",
    desc: "Vion을 바로 이용하거나 Rion·Taxon 출시 알림을 신청합니다.",
    accent: "#00C9B1",
    glow: "rgba(0, 201, 177, 0.28)",
    mode: "branch" as const,
  },
  {
    label: "03",
    title: "필요할 때 다시 연결",
    desc: "같은 계정으로 서비스 간 이동과 재접근을 더 쉽게 이어갑니다.",
    accent: "#D4AF37",
    glow: "rgba(212, 175, 55, 0.32)",
    mode: "scatter" as const,
  },
];

export default function HomeTrustStory() {
  return (
    <PinnedStory
      steps={3}
      viewportLength={2.2}
      className="lp-trust-section section section--alt"
      innerClassName="container lp-trust-cinema"
      decoration={
        <>
          <div className="stage-tint" aria-hidden="true" />
        </>
      }
    >
      {STEPS.map((step, index) => (
        <PinnedStoryStep key={step.label} index={index}>
          <div className="lp-trust-cinema__grid">
            <div className="lp-trust-cinema__copy">
              <p className="section-label">이용 방법</p>
              <span className="lp-trust-cinema__index">{step.label}</span>
              <h2 className="section-title">{step.title}</h2>
              <p className="about-body">{step.desc}</p>
            </div>
            <div className="lp-trust-cinema__orb" aria-hidden="true">
              <NeuralOrb
                accent={step.accent}
                glow={step.glow}
                maxNodes={42}
                mode={step.mode}
              />
            </div>
          </div>
        </PinnedStoryStep>
      ))}
    </PinnedStory>
  );
}
