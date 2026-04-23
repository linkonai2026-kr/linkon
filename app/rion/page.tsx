import ServicePage from "@/components/site/service-page";
import { getServiceMetadata, servicePageContent } from "@/lib/site/content";

export const metadata = getServiceMetadata("rion");

export default function RionPage() {
  return <ServicePage content={servicePageContent.rion} />;
}
