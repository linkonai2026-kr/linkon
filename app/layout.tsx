import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Linkon — AI 기반 전문 서비스",
    template: "%s | Linkon",
  },
  description: "Linkon — 심리 케어, 법률, 재무를 아우르는 AI 서비스 플랫폼",
  openGraph: {
    title: "Linkon — AI 기반 전문 서비스 플랫폼",
    description: "심리 케어, 법률 자문, 재무 관리를 하나의 AI 플랫폼에서. Linkon이 삶의 중요한 순간마다 곁에 있습니다.",
    type: "website",
    url: "https://linkon.io",
    images: [
      {
        url: "/assets/og-thumbnail.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkon — AI 기반 전문 서비스 플랫폼",
    description: "심리 케어, 법률 자문, 재무 관리를 하나의 AI 플랫폼에서.",
    images: ["/assets/og-thumbnail.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F8FC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
