import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components/layout";
import { DealCard, RoleBadge } from "@/components/features";
import { mockSectors, mockDeals, teamMembers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Linkedin, Cpu, Building2, ShoppingBag, HeartPulse, Home, Factory, PiggyBank, Wheat, Leaf, ChevronDown } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Icon mapping for sector types
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  technology: Cpu,
  building: Building2,
  shopping: ShoppingBag,
  health: HeartPulse,
  construction: Home,
  industry: Factory,
  finance: PiggyBank,
  food: Wheat,
  energy: Leaf,
};

// Map sector slug to actual sector name in deals
const sectorNameMap: Record<string, string> = {
  "technologies-logiciels": "Technologies & logiciels",
  "distribution-services-b2b": "Distribution & services B2B",
  "distribution-services-b2c": "Distribution & services B2C",
  "sante": "Santé",
  "immobilier-construction": "Immobilier & construction",
  "industries": "Industries",
  "services-financiers-assurance": "Services financiers & assurance",
  "agroalimentaire": "Agroalimentaire",
  "energie-environnement": "Énergie & environnement",
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const sector = mockSectors.find((s) => s.slug === slug);
  
  if (!sector) return { title: "Secteur non trouvé" };

  return {
    title: `${sector.nameFr} | Expertise sectorielle | alecia`,
    description: sector.descriptionFr,
  };
}

export async function generateStaticParams() {
  return mockSectors.map((sector) => ({
    slug: sector.slug,
  }));
}

export default async function SectorPage({ params }: PageProps) {
  const { slug } = await params;
  const sector = mockSectors.find((s) => s.slug === slug);

  if (!sector) {
    notFound();
  }

  // Get referent partner
  const referentPartner = teamMembers.find((m) => m.slug === sector.referentPartner);
  
  // Get sector deals
  const sectorName = sectorNameMap[slug];
  const sectorDeals = mockDeals.filter((d) => d.sector === sectorName);
  
  // Get icon
  const IconComponent = iconMap[sector.iconType] || Building2;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-[var(--accent)] text-[var(--foreground-muted)]">
            <Link href="/secteurs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux secteurs
            </Link>
          </Button>

          {/* Header */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-12 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                    Expertise sectorielle
                  </p>
                  <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--foreground)]">
                    {sector.nameFr}
                  </h1>
                </div>
              </div>
              <p className="text-xl text-[var(--foreground-muted)] leading-relaxed">
                {sector.descriptionFr}
              </p>
            </div>

            {/* Referent Partner Card */}
            {referentPartner && (
              <Card className="bg-[var(--card)] border-[var(--border)] h-fit">
                <CardHeader className="pb-3">
                  <p className="text-sm text-[var(--foreground-muted)]">Associé référent</p>
                </CardHeader>
                <CardContent>
                  <Link href={`/equipe/${referentPartner.slug}`} className="flex items-center gap-4 group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--background-tertiary)]">
                      {referentPartner.photo ? (
                        <Image
                          src={referentPartner.photo}
                          alt={referentPartner.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-bold text-[var(--foreground-faint)]">
                            {referentPartner.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                        {referentPartner.name}
                      </p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {referentPartner.role}
                      </p>
                    </div>
                  </Link>
                  {referentPartner.linkedinUrl && (
                    <a
                      href={referentPartner.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-4 text-sm text-[var(--foreground-muted)] hover:text-[#0077b5] transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Investment Thesis */}
          <section className="mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-6 text-[var(--foreground)]">
              Notre thèse d&apos;investissement
            </h2>
            <div className="p-6 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
              <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                {sector.investmentThesisFr}
              </p>
            </div>
          </section>

          {/* Sector Deals */}
          {sectorDeals.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--foreground)]">
                  Opérations dans ce secteur
                </h2>
                <Link 
                  href={`/operations?sector=${encodeURIComponent(sectorName)}`}
                  className="text-[var(--accent)] hover:underline text-sm flex items-center gap-1"
                >
                  Voir toutes
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectorDeals.slice(0, 3).map((deal) => (
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
            </section>
          )}

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-6 text-[var(--foreground)]">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              <details className="group p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-[var(--foreground)]">
                    Quels sont les multiples de valorisation dans ce secteur ?
                  </span>
                  <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-[var(--foreground-muted)]">
                  Les multiples varient selon la taille, la rentabilité et les perspectives de croissance de l&apos;entreprise. 
                  Contactez-nous pour une analyse personnalisée de votre situation.
                </p>
              </details>
              <details className="group p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-[var(--foreground)]">
                    Quelle est la durée moyenne d&apos;une opération de cession ?
                  </span>
                  <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-[var(--foreground-muted)]">
                  Une opération de cession prend généralement entre 6 et 12 mois, selon la complexité du dossier 
                  et les conditions de marché.
                </p>
              </details>
              <details className="group p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-[var(--foreground)]">
                    Accompagnez-vous également les acquisitions ?
                  </span>
                  <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-[var(--foreground-muted)]">
                  Oui, nous accompagnons aussi bien les cédants que les acquéreurs dans leurs projets de croissance externe, 
                  que ce soit pour des acquisitions unitaires ou des stratégies de build-up.
                </p>
              </details>
            </div>
          </section>

          {/* Dual CTA */}
          <section className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-[var(--accent)]/10 to-transparent border-[var(--accent)]/30">
              <CardContent className="p-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-2 text-[var(--foreground)]">
                  Vous souhaitez céder ?
                </h3>
                <p className="text-[var(--foreground-muted)] mb-4">
                  Nous vous accompagnons dans la valorisation et la transmission de votre entreprise.
                </p>
                <Button asChild className="btn-gold">
                  <Link href="/contact?type=cedant">
                    Être contacté
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-[var(--card)] border-[var(--border)]">
              <CardContent className="p-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-2 text-[var(--foreground)]">
                  Vous souhaitez acquérir ?
                </h3>
                <p className="text-[var(--foreground-muted)] mb-4">
                  Recevez nos opportunités d&apos;investissement correspondant à vos critères.
                </p>
                <Button asChild variant="outline" className="border-[var(--border)] hover:border-[var(--accent)]">
                  <Link href="/contact?type=acquereur">
                    S&apos;inscrire
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
