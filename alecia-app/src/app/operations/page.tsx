import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import { DealCard, DealFilter } from "@/components/features";
import type { Metadata } from "next";
import { getFilteredDeals, getDealFilterOptions } from "@/lib/actions/deals";

export const metadata: Metadata = {
  title: "Opérations | Nos transactions",
  description:
    "Découvrez les opérations de fusion-acquisition accompagnées par alecia. Cessions, acquisitions, levées de fonds pour PME et ETI.",
};

interface OperationsPageProps {
  searchParams: Promise<{
    sector?: string;
    region?: string;
    year?: string;
    type?: string;
  }>;
}

export default async function OperationsPage({ searchParams }: OperationsPageProps) {
  const params = await searchParams;
  
  // Get filter options from database
  const filterOptions = await getDealFilterOptions({
    sector: params.sector,
    region: params.region,
    year: params.year ? parseInt(params.year) : undefined,
    mandateType: params.type,
  });
  const { sectors: availableSectors, regions: availableRegions, years, mandateTypes: availableTypes } = filterOptions;
  
  // Filter deals based on search params
  const filteredDeals = await getFilteredDeals({
    sector: params.sector,
    region: params.region,
    year: params.year ? parseInt(params.year) : undefined,
    mandateType: params.type,
  });

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold text-center mb-4">
              Opérations
            </h1>
            <p className="text-[var(--foreground-muted)] text-center max-w-2xl mx-auto text-lg">
              Découvrez un extrait des opérations accompagnées par nos associés et directeurs
            </p>
            <p className="text-[var(--foreground-faint)] text-center mt-2 text-sm">
              * : opérations menées par nos associés dans le cadre de leurs expériences antérieures
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<div className="h-12 bg-[var(--background-secondary)] rounded animate-pulse" />}>
              <DealFilter
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
            {filteredDeals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
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
                    isPriorExperience={deal.isPriorExperience}
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
            <p className="text-center text-sm text-[var(--foreground-muted)] mt-8">
              {filteredDeals.length} opération{filteredDeals.length > 1 ? "s" : ""} affichée{filteredDeals.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
