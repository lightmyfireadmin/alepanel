import { Suspense } from "react";
import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import { FlipCard_3 } from "@/components/transactions_3/FlipCard_3";
import { DealFilter_3 } from "@/components/transactions_3/DealFilter_3";
import type { Metadata } from "next";
import { getTransactions, getTransactionFilters } from "@/lib/actions/convex-marketing";

export const metadata: Metadata = {
  title: "Transactions | Alecia",
  description: "Découvrez les opérations de fusion-acquisition accompagnées par alecia.",
};

interface OperationsPageProps {
  searchParams: Promise<{
    sector?: string;
    region?: string;
    year?: string;
    type?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: OperationsPageProps) {
  const params = await searchParams;
  
  // Get filter options from Convex
  const filterOptions = await getTransactionFilters();
  const { sectors: availableSectors, regions: availableRegions, years, mandateTypes: availableTypes } = filterOptions;
  
  // Get filtered transactions from Convex
  const filteredDeals = await getTransactions({
    sector: params.sector,
    year: params.year ? parseInt(params.year) : undefined,
    mandateType: params.type,
  });

  // Map Convex transaction format to component expected format
  const deals = filteredDeals.map(t => ({
    id: t._id,
    slug: t.slug,
    clientName: t.clientName,
    clientLogo: t.clientLogo,
    acquirerName: t.acquirerName,
    acquirerLogo: t.acquirerLogo,
    sector: t.sector,
    region: t.region,
    year: t.year,
    mandateType: t.mandateType,
    isPriorExperience: t.isPriorExperience,
  }));

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Transactions Conseillées
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg mb-8">
              Une expertise reconnue dans l'accompagnement d'opérations stratégiques pour les PME et ETI.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="px-6 pb-8 sticky top-20 z-30 bg-[var(--background)]/95 backdrop-blur py-4 border-b border-[var(--border)] mb-8">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<div className="h-12 bg-[var(--background-secondary)] rounded animate-pulse" />}>
              <DealFilter_3
                currentSector={params.sector}
                currentRegion={params.region}
                currentYear={params.year}
                currentType={params.type}
                years={years}
                availableSectors={availableSectors}
                availableRegions={availableRegions}
                availableTypes={availableTypes}
              />
            </Suspense>
          </div>
        </section>

        {/* Deal Grid */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            {deals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {deals.map((deal) => (
                  <FlipCard_3
                    key={deal.id}
                    slug={deal.slug}
                    clientName={deal.clientName}
                    clientLogo={deal.clientLogo}
                    acquirerName={deal.acquirerName}
                    acquirerLogo={deal.acquirerLogo}
                    sector={deal.sector}
                    region={deal.region}
                    year={deal.year}
                    mandateType={deal.mandateType}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[var(--foreground-muted)] text-lg">
                  Aucune opération ne correspond à vos critères.
                </p>
              </div>
            )}

            {/* Results count */}
            <p className="text-center text-sm text-[var(--foreground-muted)] mt-12">
              {deals.length} opération{deals.length > 1 ? "s" : ""} affichée{deals.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>
      </main>

      <Footer_3 />
    </>
  );
}
