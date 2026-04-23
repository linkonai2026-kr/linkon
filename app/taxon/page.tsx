import ServicePage from "@/components/site/service-page";
import { getServiceMetadata, servicePageContent } from "@/lib/site/content";

export const metadata = getServiceMetadata("taxon");

export default function TaxonPage() {
  return <ServicePage content={servicePageContent.taxon} />;
}
