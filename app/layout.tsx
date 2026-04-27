import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://linkon-xi.vercel.app"),
  icons: {
    icon: "/assets/linkon.png",
    shortcut: "/assets/linkon.png",
    apple: "/assets/linkon.png",
  },
  title: {
    default: "LinkON | 일상에 필요한 AI 서비스를 연결하는 브랜드",
    template: "%s | Linkon",
  },
  description:
    "LinkON은 Vion, Rion, Taxon을 통해 일상 케어, 법률 이해, 세무 관리를 더 쉽게 시작할 수 있도록 돕는 AI 서비스 브랜드입니다.",
  openGraph: {
    title: "LinkON | 일상에 필요한 AI 서비스를 연결하는 브랜드",
    description:
      "LinkON은 일상 케어, 법률 이해, 세무 관리처럼 누구에게나 필요한 AI 서비스를 더 쉽고 편안하게 만날 수 있도록 연결합니다.",
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
    title: "LinkON | 일상에 필요한 AI 서비스를 연결하는 브랜드",
    description: "Vion, Rion, Taxon으로 일상 케어, 법률 이해, 세무 관리를 더 쉽게 시작하세요.",
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
