import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://linkon-xi.vercel.app"),
  icons: {
    icon: "/assets/linkon.png",
    shortcut: "/assets/linkon.png",
    apple: "/assets/linkon.png",
  },
  title: {
    default: "Linkon | 통합 AI 서비스 관제 플랫폼",
    template: "%s | Linkon",
  },
  description:
    "Vion, Rion, Taxon을 하나의 통합 계정과 권한 체계로 연결하는 Linkon 공식 플랫폼입니다.",
  openGraph: {
    title: "Linkon | 통합 AI 서비스 관제 플랫폼",
    description:
      "통합 로그인, 서비스 접근 권한, 요금제, 관리자 권한을 하나의 기준으로 관리합니다.",
    type: "website",
    url: "https://linkon-xi.vercel.app",
    images: [
      {
        url: "/assets/linkon.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkon | 통합 AI 서비스 관제 플랫폼",
    description: "Vion, Rion, Taxon을 위한 통합 계정과 서비스 접근 관리.",
    images: ["/assets/linkon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F3EA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
