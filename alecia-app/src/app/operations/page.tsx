import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import { DealCard, DealFilter } from "@/components/features";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opérations | Nos transactions",
  description:
    "Découvrez les opérations de fusion-acquisition accompagnées par alecia. Cessions, acquisitions, levées de fonds pour PME et ETI.",
};

// Mock data - Replace with actual DB queries when Neon is connected
const mockDeals = [
  {
    id: "1",
    slug: "hmr-leclerc",
    clientName: "HMR",
    clientLogo: null,
    acquirerName: "Leclerc - franchisé",
    acquirerLogo: null,
    sector: "Distribution & services B2C",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2022,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  {
    id: "2",
    slug: "safe-group",
    clientName: "Safe Group",
    clientLogo: null,
    acquirerName: "DOGS Security",
    acquirerLogo: null,
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2024,
    mandateType: "Acquisition",
    isPriorExperience: false,
  },
  {
    id: "3",
    slug: "signes",
    clientName: "Signes",
    clientLogo: null,
    acquirerName: "La/Ba Architectes",
    acquirerLogo: null,
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2024,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  {
    id: "4",
    slug: "xrl-consulting",
    clientName: "XRL Consulting",
    clientLogo: null,
    acquirerName: "Banque Populaire et Caisse d'Epargne",
    acquirerLogo: null,
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2023,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  {
    id: "5",
    slug: "kanope",
    clientName: "Kanopé",
    clientLogo: null,
    acquirerName: "Metagram",
    acquirerLogo: null,
    sector: "Services financiers & assurance",
    region: "Occitanie",
    year: 2023,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  {
    id: "6",
    slug: "keller-williams",
    clientName: "Keller Williams",
    clientLogo: null,
    acquirerName: "Entrepreneur Invest",
    acquirerLogo: null,
    sector: "Immobilier & construction",
    region: "Île-de-France",
    year: 2022,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  {
    id: "7",
    slug: "wyz-group",
    clientName: "Wyz Group",
    clientLogo: null,
    acquirerName: "Generis Capital Partners",
    acquirerLogo: null,
    sector: "Technologies & logiciels",
    region: "Hauts-de-France",
    year: 2021,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  {
    id: "8",
    slug: "finaxy",
    clientName: "Finaxy",
    clientLogo: null,
    acquirerName: "Ardian",
    acquirerLogo: null,
    sector: "Services financiers & assurance",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: true,
  },
];

// Get unique years for filter
const years = [...new Set(mockDeals.map((d) => d.year))].sort((a, b) => b - a);

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
  
  // Filter deals based on search params
  let filteredDeals = mockDeals;

  if (params.sector) {
    filteredDeals = filteredDeals.filter((d) => d.sector === params.sector);
  }
  if (params.region) {
    filteredDeals = filteredDeals.filter((d) => d.region === params.region);
  }
  if (params.year) {
    filteredDeals = filteredDeals.filter((d) => d.year === parseInt(params.year!));
  }
  if (params.type) {
    filteredDeals = filteredDeals.filter((d) => d.mandateType === params.type);
  }

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
