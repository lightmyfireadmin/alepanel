import { getAllDeals } from "@/lib/actions/deals";
import DealsClient from "./deals-client";

export const dynamic = "force-dynamic";

export default async function DealsAdminPage() {
  const deals = await getAllDeals();

  // Map DB deals to the interface expected by DealsClient
  // We need to ensure nulls are handled or passed correctly.
  // The client interface allows nulls for optional fields.
  // Drizzle select returns match the schema exactly.
  // We just cast it or let it be inferred, but explicit mapping is safer if types diverge slightly.

  const mappedDeals = deals.map(deal => ({
    id: deal.id,
    slug: deal.slug,
    clientName: deal.clientName,
    clientLogo: deal.clientLogo,
    acquirerName: deal.acquirerName,
    acquirerLogo: deal.acquirerLogo,
    sector: deal.sector,
    region: deal.region,
    year: deal.year,
    mandateType: deal.mandateType,
    isConfidential: deal.isConfidential || false,
    isPriorExperience: deal.isPriorExperience || false,
    context: deal.context,
    intervention: deal.intervention,
    result: deal.result,
    testimonialText: deal.testimonialText,
    testimonialAuthor: deal.testimonialAuthor,
    dealSize: deal.dealSize,
  }));

  return <DealsClient initialDeals={mappedDeals} />;
}
