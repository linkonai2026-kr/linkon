import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 기존 정적 HTML 파일을 public에서 제공하지 않도록 설정
  // assets은 public/assets/으로 이동됨
  images: {
    domains: [],
  },
  // 환경변수 타입 안전성
  env: {
    NEXT_PUBLIC_VION_URL: process.env.NEXT_PUBLIC_VION_URL ?? "",
    NEXT_PUBLIC_RION_URL: process.env.NEXT_PUBLIC_RION_URL ?? "",
    NEXT_PUBLIC_TAXON_URL: process.env.NEXT_PUBLIC_TAXON_URL ?? "",
  },
};

export default nextConfig;
