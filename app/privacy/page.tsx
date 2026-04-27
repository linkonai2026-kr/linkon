import { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { legalContent } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "Linkon의 개인정보 수집, 이용, 보관, 서비스 연동 기준을 안내합니다.",
};

export default function PrivacyPage() {
  return <LegalPage {...legalContent.privacy} />;
}
