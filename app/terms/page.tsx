import { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { legalContent } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "이용약관",
  description:
    "Linkon 통합 계정과 연결 서비스 이용 조건을 안내합니다.",
};

export default function TermsPage() {
  return <LegalPage {...legalContent.terms} />;
}
