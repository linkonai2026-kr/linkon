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
    default: "Linkon | AI Professional Service Platform",
    template: "%s | Linkon",
  },
  description:
    "Linkon brings mental wellness, legal guidance, and tax operations into one AI-powered control plane.",
  openGraph: {
    title: "Linkon | AI Professional Service Platform",
    description:
      "A launch-ready AI platform for unified identity, service access, and operational control across Vion, Rion, and Taxon.",
    type: "website",
    url: "https://linkon.io",
    images: [
      {
        url: "/assets/linkon.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkon | AI Professional Service Platform",
    description:
      "Unified identity, service launch, and admin control for the Linkon ecosystem.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
