import ServicePage from "@/components/site/service-page";
import { getServiceMetadata, servicePageContent } from "@/lib/site/content";

export const metadata = getServiceMetadata("vion");

export default function VionPage() {
  return <ServicePage content={servicePageContent.vion} />;
}
