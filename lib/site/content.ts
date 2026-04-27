import { Metadata } from "next";
import { PlanTier, ServiceName } from "@/lib/linkon/types";

export interface FeatureItem {
  title: string;
  description: string;
  icon: "spark" | "shield" | "pulse" | "document" | "chart" | "people";
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
  introLabel: string;
  introTitle: string;
  introBody: string[];
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
    description: "심리 케어와 일상 체크인을 돕는 Linkon의 운영 중 AI 서비스입니다.",
    tagline: "마음과 일상을 부드럽게 연결하는 케어 AI",
    status: "live",
    heroDescription:
      "Vion은 사용자의 상태를 차분하게 확인하고, 필요한 다음 행동을 제안하는 케어 AI입니다. Linkon 통합 계정으로 바로 시작할 수 있습니다.",
    heroPrimaryLabel: "Vion 시작하기",
    heroSecondaryLabel: "기능 살펴보기",
    heroPrimaryHref: "/api/auth/token?service=vion",
    navLabel: "Vion 시작하기",
    accentClass: "vion",
    overlayColor: "rgba(0, 36, 32, 0.82)",
    backgroundImage: "/assets/vion-mockup.png",
    logo: "/assets/vion-no.png",
    logoMark: "/assets/vion-noback.png",
    introLabel: "서비스 소개",
    introTitle: "케어 흐름은 Vion에, 계정과 권한은 Linkon에",
    introBody: [
      "Vion은 상담과 케어에 필요한 전문 데이터를 자체 서비스에서 관리합니다. Linkon은 계정 상태와 접근 권한만 확인해 안전하게 연결합니다.",
      "사용자는 하나의 Linkon 계정으로 Vion에 진입하고, 운영자는 Linkon에서 계정 정지, 요금제, 서비스 접근 권한을 통합 관리합니다.",
    ],
    featuresLabel: "핵심 기능",
    featuresTitle: "Vion MVP에서 제공하는 경험",
    features: [
      {
        title: "상태 체크인",
        description: "사용자의 현재 상태를 확인하고 다음에 필요한 케어 흐름을 안내합니다.",
        icon: "pulse",
      },
      {
        title: "언제든 다시 접근",
        description: "Linkon 계정 상태가 정상이라면 필요한 순간 다시 Vion을 열 수 있습니다.",
        icon: "spark",
      },
      {
        title: "가족 친화 흐름",
        description: "일상 확인과 반복 안내처럼 케어 상황에서 필요한 흐름을 고려합니다.",
        icon: "people",
      },
      {
        title: "요약 중심 관리",
        description: "전문 데이터 원문은 Vion에 두고 Linkon에는 이용 요약만 남깁니다.",
        icon: "chart",
      },
      {
        title: "통합 권한 반영",
        description: "계정 정지, 삭제, 요금제 변경이 서비스 접근 정책에 반영됩니다.",
        icon: "shield",
      },
      {
        title: "운영 기록 연결",
        description: "관리자 조치와 서비스 동기화 상태를 Linkon 감사 로그에 남깁니다.",
        icon: "document",
      },
    ],
    ctaTitle: "Vion은 지금 바로 이용할 수 있습니다",
    ctaDescription: "Linkon 통합 계정으로 Vion에 연결하고 같은 기준으로 계정과 권한을 관리하세요.",
    ctaPrimaryLabel: "Vion 열기",
    ctaPrimaryHref: "/api/auth/token?service=vion",
    ctaSecondaryLabel: "Linkon 홈으로",
  },
  rion: {
    slug: "rion",
    name: "Rion",
    title: "Rion | 법률 비서 AI",
    description: "계약서와 법률 절차를 이해하기 쉬운 안내로 정리하는 출시 예정 서비스입니다.",
    tagline: "복잡한 법률 절차를 이해하기 쉬운 다음 행동으로",
    status: "soon",
    heroDescription:
      "Rion은 법률 문서, 계약서 검토, 절차 안내를 사용자가 이해할 수 있는 흐름으로 정리하는 법률 비서 AI로 준비 중입니다.",
    heroPrimaryLabel: "출시 알림 받기",
    heroSecondaryLabel: "기능 살펴보기",
    heroPrimaryHref: "#notify",
    navLabel: "출시 알림",
    accentClass: "rion",
    overlayColor: "rgba(0, 20, 50, 0.86)",
    backgroundImage: "/assets/rion-mockup.png",
    logo: "/assets/rion-no.png",
    logoMark: "/assets/rion-noback.png",
    introLabel: "서비스 소개",
    introTitle: "법률 문서 원문은 Rion에, 접근 권한은 Linkon에",
    introBody: [
      "Rion의 문서 분석 기록과 법률 검토 흐름은 Rion 서비스 서버에서 관리합니다. Linkon은 사용자가 Rion에 접근할 수 있는지와 서비스 관리자 권한만 관리합니다.",
      "출시 전에는 Linkon의 출시 알림을 통해 관심 사용자를 모으고, 출시 후에는 통합 계정으로 자연스럽게 Rion 계정을 연결합니다.",
    ],
    featuresLabel: "준비 중인 기능",
    featuresTitle: "Rion에서 우선 제공할 기능",
    features: [
      {
        title: "계약서 요약",
        description: "긴 문서에서 먼저 확인해야 할 조항과 위험 신호를 이해하기 쉽게 정리합니다.",
        icon: "document",
      },
      {
        title: "절차 안내",
        description: "현재 상황에서 어떤 순서로 움직이면 좋을지 단계별로 안내합니다.",
        icon: "shield",
      },
      {
        title: "쉬운 표현",
        description: "전문 용어를 가능한 쉬운 문장으로 바꿔 의사결정 속도를 높입니다.",
        icon: "spark",
      },
      {
        title: "전문가 연결 기반",
        description: "필요 시 외부 검토나 운영자 확인으로 이어질 수 있는 구조를 고려합니다.",
        icon: "people",
      },
      {
        title: "서비스 이용 요약",
        description: "Linkon에는 접근 여부와 사용 요약만 남기고 문서 원문은 Rion에 둡니다.",
        icon: "chart",
      },
      {
        title: "권한 기반 접근",
        description: "Linkon의 계정 상태와 서비스별 권한이 Rion 접근에 반영됩니다.",
        icon: "pulse",
      },
    ],
    ctaTitle: "Rion 출시 소식을 먼저 받아보세요",
    ctaDescription: "출시 알림을 신청하면 Rion 공개 시점과 초기 이용 안내를 이메일로 보내드립니다.",
    ctaPrimaryLabel: "출시 알림 받기",
    ctaPrimaryHref: "/register?service=rion",
    ctaSecondaryLabel: "다른 서비스 보기",
  },
  taxon: {
    slug: "taxon",
    name: "Taxon",
    title: "Taxon | 세무 관리 AI",
    description: "사업자의 세무 상태와 신고 준비 흐름을 정리하는 출시 예정 서비스입니다.",
    tagline: "사업 숫자를 더 선명하게 보는 세무 AI",
    status: "soon",
    heroDescription:
      "Taxon은 반복되는 세무 업무, 제출 문서, 재무 상태 요약을 더 읽기 쉬운 운영 흐름으로 정리하는 세무 관리 AI로 준비 중입니다.",
    heroPrimaryLabel: "출시 알림 받기",
    heroSecondaryLabel: "기능 살펴보기",
    heroPrimaryHref: "#notify",
    navLabel: "출시 알림",
    accentClass: "taxon",
    overlayColor: "rgba(48, 0, 10, 0.86)",
    backgroundImage: "/assets/taxon-mockup.png",
    logo: "/assets/taxon-no.png",
    logoMark: "/assets/taxon-noback.png",
    introLabel: "서비스 소개",
    introTitle: "세무 자료는 Taxon에, 계정 기준은 Linkon에",
    introBody: [
      "Taxon의 재무 데이터, 세무 리포트, 제출 문서 원문은 Taxon 서비스 서버에서 관리합니다. Linkon은 요금제와 접근 권한, 이용 요약만 관리합니다.",
      "이 구조는 민감한 전문 데이터를 한곳에 과도하게 모으지 않으면서도, 사용자에게는 하나의 계정 경험을 제공합니다.",
    ],
    featuresLabel: "준비 중인 기능",
    featuresTitle: "Taxon에서 우선 제공할 기능",
    features: [
      {
        title: "사업 상태 요약",
        description: "흩어진 숫자보다 지금 먼저 확인해야 할 신호를 보여줍니다.",
        icon: "chart",
      },
      {
        title: "세무 준비 알림",
        description: "기한이 가까워지기 전에 확인해야 할 항목과 준비 흐름을 안내합니다.",
        icon: "spark",
      },
      {
        title: "문서 흐름 정리",
        description: "반복 제출 문서와 검토 자료를 안정적으로 준비할 수 있도록 돕습니다.",
        icon: "document",
      },
      {
        title: "반복 업무 구조화",
        description: "매번 새로 처리하던 세무 업무를 더 예측 가능한 흐름으로 바꿉니다.",
        icon: "pulse",
      },
      {
        title: "통합 권한 관리",
        description: "Linkon의 계정 상태와 요금제가 Taxon 접근 권한의 기준이 됩니다.",
        icon: "shield",
      },
      {
        title: "운영 계정 연결",
        description: "서비스별 계정을 따로 관리하지 않고 Linkon 계정 기준으로 연결합니다.",
        icon: "people",
      },
    ],
    ctaTitle: "Taxon 출시 알림을 신청하세요",
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
