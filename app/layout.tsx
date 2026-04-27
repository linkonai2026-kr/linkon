import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://linkon.io"),
  icons: {
    icon: "/assets/linkon.png",
    shortcut: "/assets/linkon.png",
    apple: "/assets/linkon.png",
  },
  title: {
    default: "Linkon | 통합 AI 서비스 플랫폼",
    template: "%s | Linkon",
  },
  description:
    "심리 케어, 법률 안내, 재무 관리를 하나의 통합 계정으로 연결하는 AI 서비스 플랫폼입니다.",
  openGraph: {
    title: "Linkon | 통합 AI 서비스 플랫폼",
    description:
      "Vion, Rion, Taxon을 하나의 계정과 운영 기준으로 연결하는 Linkon 플랫폼입니다.",
    type: "website",
    url: "https://linkon.io",
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
    title: "Linkon | 통합 AI 서비스 플랫폼",
    description:
      "Linkon 생태계를 위한 통합 계정, 서비스 진입, 관리자 제어.",
    images: ["/assets/linkon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F8FC",
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
