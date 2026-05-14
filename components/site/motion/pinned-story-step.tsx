"use client";

type PinnedStoryStepProps = {
  /** 단계 인덱스 (0-based). 디버깅과 데이터 정렬용. */
  index?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * PinnedStory 의 자식 슬롯. 별도 동작은 없고 PinnedStory 가
 * Children.toArray 로 필터링해 단계별로 페이드 인/아웃 처리한다.
 */
export default function PinnedStoryStep({ className, children }: PinnedStoryStepProps) {
  return (
    <div className={className ? `pinned-story-step ${className}` : "pinned-story-step"}>
      {children}
    </div>
  );
}
