import { Metadata } from "next";
import LegalPage from "@/components/site/legal-page";
import { legalContent } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing Linkon, its connected services, and centralized admin controls.",
};

export default function TermsPage() {
  return <LegalPage {...legalContent.terms} />;
}
