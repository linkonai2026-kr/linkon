import { Metadata } from "next";
import { PlanTier, ServiceName } from "@/lib/linkon/types";

export interface FeatureItem {
  title: string;
  description: string;
  icon: "spark" | "shield" | "pulse" | "document" | "chart" | "people";
}

export interface WhoCard {
  emoji: string;
  label: string;
  desc: string;
}

export interface ServicePageContent {
  slug: ServiceName;
  name: string;
  title: string;
  description: string;
  tagline: string;
  status: "live" | "soon";
  heroDescription: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  heroPrimaryHref: string;
  navLabel: string;
  accentClass: "vion" | "rion" | "taxon";
  overlayColor: string;
  backgroundImage: string;
  logo: string;
  logoMark: string;
  expertBadge?: string;
  introLabel: string;
  introTitle: string;
  introBody: string[];
  whoCards: WhoCard[];
  featuresLabel: string;
  featuresTitle: string;
  features: FeatureItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
}

export const servicePageContent: Record<ServiceName, ServicePageContent> = {
  vion: {
    slug: "vion",
    name: "Vion",
    title: "Vion | 케어 AI",
    description: "심리 케어와 일상 체크인을 돕는 Linkon의 AI 서비스입니다. 지금 바로 시작할 수 있습니다.",
    tagline: "마음이 힘들 때, 혼자 감당하지 않아도 됩니다",
    status: "live",
    heroDescription:
      "심리 상담을 받고 싶지만 예약 대기와 비용이 부담된다면 — Vion이 오늘 당신의 상태를 확인하고 다음 행동을 함께 찾아드립니다.",
    heroPrimaryLabel: "Vion 시작하기",
    heroSecondaryLabel: "기능 살펴보기",
    heroPrimaryHref: "/api/auth/token?service=vion",
    navLabel: "Vion 시작하기",
    accentClass: "vion",
    overlayColor: "rgba(0, 36, 32, 0.82)",
    backgroundImage: "/assets/vion-mockup.png",
    logo: "/assets/vion-no.png",
    logoMark: "/assets/vion-noback.png",
    expertBadge: "🩺 임상심리사 자문 기반",
    introLabel: "이런 분께 맞습니다",
    introTitle: "마음이 힘들 때, 혼자 감당하지 않아도 됩니다",
    introBody: [
      "심리 상담을 받고 싶어도 예약 대기·비용 부담이 현실입니다. Vion은 언제든 내 상태를 이야기할 수 있는 AI 심리 케어 공간입니다.",
      "임상 기반 기법으로 설계된 Vion이 오늘 당신의 상태를 확인하고, 다음에 필요한 행동을 함께 찾아드립니다.",
    ],
    whoCards: [
      { emoji: "😮‍💨", label: "혼자 감당 중인 직장인", desc: "번아웃이 왔지만 어디서부터 털어야 할지 모르는 분" },
      { emoji: "👨‍👩‍👧", label: "가족 케어가 필요한 분", desc: "고령 부모님의 일상을 조용히 확인하고 싶은 분" },
      { emoji: "💸", label: "상담 비용이 부담스러운 분", desc: "전문 상담 전 가볍게 내 상태부터 파악하고 싶은 분" },
    ],
    featuresLabel: "핵심 기능",
    featuresTitle: "Vion이 당신의 일상에서 하는 일",
    features: [
      {
        title: "매일 체크인",
        description: "하루 5분, 오늘 내 감정 상태를 기록하고 케어 방향을 잡습니다.",
        icon: "pulse",
      },
      {
        title: "언제든 다시 열기",
        description: "생각날 때마다 Vion을 찾으세요. 계정만 있으면 즉시 시작됩니다.",
        icon: "spark",
      },
      {
        title: "가족 케어 흐름",
        description: "고령 부모님이나 가족의 일상을 확인하는 반복 케어 흐름을 지원합니다.",
        icon: "people",
      },
      {
        title: "내 기록은 안전하게",
        description: "케어 기록은 Vion 안에서만 보관됩니다. 외부로 공유되지 않습니다.",
        icon: "shield",
      },
      {
        title: "Linkon 계정 하나로",
        description: "별도 회원가입 없이 Linkon 계정으로 바로 Vion을 시작할 수 있습니다.",
        icon: "chart",
      },
      {
        title: "전문가 연결 안내",
        description: "AI 케어 이후 전문 상담사 연결이 필요하다면 다음 단계를 안내받을 수 있습니다.",
        icon: "document",
      },
    ],
    ctaTitle: "오늘, 내 상태를 확인하는 것부터 시작하세요",
    ctaDescription: "Linkon 계정만 있으면 지금 바로 Vion을 시작할 수 있습니다. 무료로 경험해보세요.",
    ctaPrimaryLabel: "Vion 시작하기",
    ctaPrimaryHref: "/api/auth/token?service=vion",
    ctaSecondaryLabel: "Linkon 홈으로",
  },
  rion: {
    slug: "rion",
    name: "Rion",
    title: "Rion | 법률 비서 AI",
    description: "계약서 위험 조항과 법률 절차를 쉽게 이해할 수 있도록 정리하는 출시 예정 법률 비서 AI입니다.",
    tagline: "계약서 한 줄이 불안한 분들을 위해",
    status: "soon",
    heroDescription:
      "변호사 상담은 부담스럽고, 계약서는 혼자 읽기엔 너무 복잡합니다. Rion이 위험 조항과 핵심 내용을 먼저 짚어드립니다.",
    heroPrimaryLabel: "출시 알림 받기",
    heroSecondaryLabel: "기능 살펴보기",
    heroPrimaryHref: "#notify",
    navLabel: "출시 알림",
    accentClass: "rion",
    overlayColor: "rgba(0, 20, 50, 0.86)",
    backgroundImage: "/assets/rion-mockup.png",
    logo: "/assets/rion-no.png",
    logoMark: "/assets/rion-noback.png",
    expertBadge: "⚖️ 현직 변호사 자료 기반",
    introLabel: "이런 분께 맞습니다",
    introTitle: "계약서 한 줄이 불안한 분들을 위해",
    introBody: [
      "변호사 상담은 부담스럽고, 혼자 읽기엔 계약서가 너무 복잡합니다. Rion은 위험 조항과 핵심 내용을 이해하기 쉬운 언어로 먼저 정리합니다.",
      "현직 변호사 자료를 기반으로 준비 중인 Rion. 출시 알림을 신청하면 가장 먼저 만날 수 있습니다.",
    ],
    whoCards: [
      { emoji: "📝", label: "첫 계약서 받은 프리랜서", desc: "조항이 불리한지 아닌지 판단이 어려운 분" },
      { emoji: "🏠", label: "임대차 계약 앞둔 분", desc: "전세·월세 계약서의 특약 조항이 걱정되는 분" },
      { emoji: "🚀", label: "창업 초기 대표", desc: "파트너십·외주 계약서를 처음 검토해야 하는 분" },
    ],
    featuresLabel: "준비 중인 기능",
    featuresTitle: "Rion이 제공할 경험",
    features: [
      {
        title: "위험 조항 먼저",
        description: "긴 계약서에서 반드시 확인해야 할 조항과 위험 신호를 먼저 짚어드립니다.",
        icon: "document",
      },
      {
        title: "쉬운 말로 설명",
        description: "법률 전문 용어를 누구나 이해할 수 있는 문장으로 바꿔드립니다.",
        icon: "spark",
      },
      {
        title: "절차 단계별 안내",
        description: "지금 상황에서 어떤 순서로 움직여야 하는지 단계별로 정리합니다.",
        icon: "shield",
      },
      {
        title: "내 상황 맞춤 분석",
        description: "계약 유형과 맥락에 맞게 검토 포인트를 다르게 제시합니다.",
        icon: "people",
      },
      {
        title: "전문가 연결 안내",
        description: "AI 검토 이후 실제 변호사 확인이 필요하다면 다음 단계를 안내합니다.",
        icon: "chart",
      },
      {
        title: "Linkon 계정으로 연결",
        description: "출시 후 별도 가입 없이 Linkon 계정으로 바로 Rion을 이용할 수 있습니다.",
        icon: "pulse",
      },
    ],
    ctaTitle: "계약서, 이제 혼자 읽지 않아도 됩니다",
    ctaDescription: "출시 알림을 신청하면 Rion 공개 시점과 초기 이용 안내를 이메일로 가장 먼저 받아볼 수 있습니다.",
    ctaPrimaryLabel: "출시 알림 받기",
    ctaPrimaryHref: "/register?service=rion",
    ctaSecondaryLabel: "다른 서비스 보기",
  },
  taxon: {
    slug: "taxon",
    name: "Taxon",
    title: "Taxon | 세무 관리 AI",
    description: "세금 신고 준비부터 절세 타이밍까지, 사업자의 세무 흐름을 정리하는 출시 예정 AI입니다.",
    tagline: "세금 신고 시즌, 더 이상 막막하지 않게",
    status: "soon",
    heroDescription:
      "무엇부터 준비해야 하는지, 기한은 언제인지 매년 반복되는 고민 — Taxon이 사업자의 세무 흐름을 선명하게 정리합니다.",
    heroPrimaryLabel: "출시 알림 받기",
    heroSecondaryLabel: "기능 살펴보기",
    heroPrimaryHref: "#notify",
    navLabel: "출시 알림",
    accentClass: "taxon",
    overlayColor: "rgba(48, 0, 10, 0.86)",
    backgroundImage: "/assets/taxon-mockup.png",
    logo: "/assets/taxon-no.png",
    logoMark: "/assets/taxon-noback.png",
    expertBadge: "📊 세무사 검토 기반",
    introLabel: "이런 분께 맞습니다",
    introTitle: "세금 신고 시즌, 더 이상 막막하지 않게",
    introBody: [
      "무엇부터 준비해야 하는지, 기한은 언제인지, 서류는 어떻게 챙겨야 하는지 — 매년 반복되는 고민을 Taxon이 정리합니다.",
      "사업자의 세무 흐름을 선명하게 만드는 Taxon. 출시 알림을 신청하면 가장 먼저 만날 수 있습니다.",
    ],
    whoCards: [
      { emoji: "💼", label: "종합소득세가 처음인 N잡러", desc: "신고 항목이 여러 개라 어디서부터 시작할지 막막한 분" },
      { emoji: "📈", label: "매출이 늘어난 1인 사업자", desc: "세금 부담은 느는데 세무사 선임까지는 아직 이른 분" },
      { emoji: "🏢", label: "창업 초기 소규모 팀", desc: "반복되는 세무 업무를 체계적으로 관리하고 싶은 분" },
    ],
    featuresLabel: "준비 중인 기능",
    featuresTitle: "Taxon이 제공할 경험",
    features: [
      {
        title: "세무 일정 알림",
        description: "신고 기한이 다가오기 전, 먼저 확인해야 할 항목을 알려드립니다.",
        icon: "spark",
      },
      {
        title: "사업 현황 요약",
        description: "흩어진 숫자보다 지금 당장 확인해야 할 신호를 한눈에 보여드립니다.",
        icon: "chart",
      },
      {
        title: "문서 준비 안내",
        description: "반복 제출 서류와 검토 자료를 순서대로 준비할 수 있도록 안내합니다.",
        icon: "document",
      },
      {
        title: "반복 업무 흐름화",
        description: "매번 새로 처리하던 세무 업무를 예측 가능한 흐름으로 바꿔드립니다.",
        icon: "pulse",
      },
      {
        title: "절세 타이밍 안내",
        description: "놓치기 쉬운 공제 항목과 절세 포인트를 시기에 맞게 안내합니다.",
        icon: "shield",
      },
      {
        title: "Linkon 계정으로 연결",
        description: "출시 후 별도 가입 없이 Linkon 계정으로 바로 Taxon을 이용할 수 있습니다.",
        icon: "people",
      },
    ],
    ctaTitle: "세금 걱정, 이제 혼자 하지 않아도 됩니다",
    ctaDescription: "Taxon 공개 시점과 초기 이용 안내를 이메일로 가장 먼저 받아볼 수 있습니다.",
    ctaPrimaryLabel: "출시 알림 받기",
    ctaPrimaryHref: "/register?service=taxon",
    ctaSecondaryLabel: "다른 서비스 보기",
  },
};

export function getServiceMetadata(service: ServiceName): Metadata {
  const content = servicePageContent[service];

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      images: [{ url: content.logo }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [content.logo],
    },
  };
}

export const legalContent = {
  privacy: {
    title: "개인정보처리방침",
    description:
      "Linkon 운영팀은 통합 계정, 서비스 접근 권한, 출시 알림 신청을 제공하기 위해 필요한 최소한의 개인정보만 처리합니다.",
    updatedAt: "2026년 4월 24일",
    sections: [
      {
        heading: "1. 수집하는 개인정보",
        body: [
          "회원가입 및 서비스 이용 과정에서 이메일, 이름, 비밀번호 인증 정보, 선택한 관심 서비스, 약관 동의 기록, 서비스 연결 상태, 관리자 조치 기록을 수집할 수 있습니다.",
          "Rion 및 Taxon 출시 알림 신청 시 이메일 주소, 신청 서비스, 신청 시각을 수집합니다.",
        ],
      },
      {
        heading: "2. 개인정보 이용 목적",
        body: [
          "수집한 정보는 통합 계정 생성, 로그인, 서비스 자동 연결, 이용 권한 관리, 고객 문의 대응, 보안 및 부정 이용 방지, 출시 알림 발송을 위해 사용합니다.",
          "관리자 조치에 따른 계정 상태, 요금제, 서비스 접근 권한 변경을 일관되게 반영하기 위해 필요한 기록을 남깁니다.",
        ],
      },
      {
        heading: "3. 보관 및 파기",
        body: [
          "회원 정보는 서비스 제공 기간 동안 보관하며, 계정 삭제 요청 또는 보관 목적 달성 후 관련 법령과 운영상 필요한 범위 내에서 파기하거나 비활성화합니다.",
          "출시 알림 신청 정보는 알림 발송 목적 달성 후 또는 사용자의 삭제 요청 시 파기합니다.",
        ],
      },
      {
        heading: "4. 제3자 제공 및 처리 위탁",
        body: [
          "Linkon은 Vion, Rion, Taxon 서비스 접근을 위해 필요한 최소한의 계정 상태 정보를 각 연결 서비스와 동기화할 수 있습니다.",
          "인프라 운영을 위해 Supabase, Vercel 등 클라우드 서비스가 사용될 수 있으며, 각 서비스는 계정 인증과 데이터 저장을 위한 기술적 처리 환경을 제공합니다.",
        ],
      },
      {
        heading: "5. 이용자의 권리",
        body: [
          "이용자는 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.",
          "개인정보 관련 문의는 linkon.ai2026@gmail.com 으로 접수할 수 있습니다.",
        ],
      },
      {
        heading: "6. 고지",
        body: [
          "본 방침은 MVP 출시를 위한 기본 방침이며, 회사 정보와 법률 검토가 완료되면 필요한 항목을 보완할 예정입니다.",
        ],
      },
    ],
  },
  terms: {
    title: "이용약관",
    description:
      "본 약관은 Linkon 통합 계정과 Vion, Rion, Taxon 연결 서비스 이용에 필요한 기본 조건을 정합니다.",
    updatedAt: "2026년 4월 24일",
    sections: [
      {
        heading: "1. 목적",
        body: [
          "본 약관은 Linkon 운영팀이 제공하는 통합 계정, 서비스 연결, 출시 알림, 관리자 기반 계정 관리 기능의 이용 조건과 절차를 정합니다.",
          "Linkon은 Vion, Rion, Taxon 등 AI 기반 전문 서비스를 하나의 계정으로 연결하는 플랫폼입니다.",
        ],
      },
      {
        heading: "2. 계정 생성 및 관리",
        body: [
          "이용자는 정확한 이메일과 필요한 정보를 입력하여 Linkon 계정을 생성해야 합니다.",
          "계정 보안에 대한 책임은 이용자에게 있으며, 비정상 이용이 확인될 경우 Linkon은 계정 이용을 제한할 수 있습니다.",
        ],
      },
      {
        heading: "3. 서비스 이용",
        body: [
          "Vion은 현재 이용 가능하며, Rion과 Taxon은 출시 예정 서비스로 제공 범위와 일정은 변경될 수 있습니다.",
          "각 서비스가 제공하는 AI 안내는 참고용이며 의료, 법률, 세무 전문가의 최종 판단을 대체하지 않습니다.",
        ],
      },
      {
        heading: "4. 이용 제한",
        body: [
          "Linkon은 보안 위험, 부정 사용, 타인의 권리 침해, 서비스 운영 방해가 발생한 경우 계정을 정지하거나 삭제 처리할 수 있습니다.",
          "관리자 조치에 따른 권한, 요금제, 이용 정지, 삭제 상태는 연결 서비스에도 반영될 수 있습니다.",
        ],
      },
      {
        heading: "5. 책임의 제한",
        body: [
          "Linkon은 MVP 단계에서 안정적인 서비스를 제공하기 위해 노력하지만, 일부 기능은 테스트 또는 제한 공개 상태일 수 있습니다.",
          "AI가 제공하는 정보는 참고용이며, 중요한 의사결정에는 반드시 관련 전문가의 검토가 필요합니다.",
        ],
      },
      {
        heading: "6. 문의",
        body: ["서비스 이용, 계정, 약관 관련 문의는 linkon.ai2026@gmail.com 으로 접수할 수 있습니다."],
      },
    ],
  },
} as const;

export const planLabels: Record<PlanTier, string> = {
  free: "무료",
  standard: "스탠다드",
  premium: "프리미엄",
  enterprise: "엔터프라이즈",
};
