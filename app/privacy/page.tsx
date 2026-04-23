import { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { legalContent } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Linkon handles identity, access, and operational records across connected services.",
};

export default function PrivacyPage() {
  return <LegalPage {...legalContent.privacy} />;
}
