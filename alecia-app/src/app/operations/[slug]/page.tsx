import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components/layout";
import { RoleBadge } from "@/components/features";
import { mockDeals, teamMembers } from "@/lib/data";
import { ArrowLeft, Building2, MapPin, Calendar, Tag, Users, Clock, TrendingUp, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Enhanced deal data with case study content (mock until DB migration in Phase 3)
const enhancedDeals = mockDeals.map((deal) => ({
  ...deal,
  context: `Dans un contexte de consolidation sectorielle, les actionnaires de ${deal.clientName} ont souhaité explorer les options stratégiques pour leur entreprise, leader régional dans son segment.`,
  intervention: `alecia a accompagné les dirigeants tout au long du processus : structuration de l'opération, valorisation, identification et approche des contreparties, négociation et coordination des due diligences jusqu'au closing.`,
  result: `L'opération a été conclue dans des conditions optimales, permettant aux actionnaires de réaliser leur projet dans le respect de leurs objectifs financiers et de pérennité de l'entreprise.`,
  testimonialText: deal.isPriorExperience ? null : "L'équipe alecia nous a accompagnés avec professionnalisme et réactivité. Leur connaissance du marché et leur réseau nous ont permis de trouver le partenaire idéal.",
  testimonialAuthor: deal.isPriorExperience ? null : "Dirigeant, " + deal.clientName,
  roleType: deal.mandateType === "Cession" ? "Conseil vendeur" : deal.mandateType === "Acquisition" ? "Conseil acquéreur" : "Conseil levée",
  keyMetrics: {
    duration: deal.year >= 2023 ? "6 mois" : "8 mois",
    approachedBuyers: deal.mandateType === "Cession" ? Math.floor(Math.random() * 20) + 10 : null,
  },
}));

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const deal = enhancedDeals.find((d) => d.slug === slug);
  
  if (!deal) return { title: "Opération non trouvée" };

  return {
    title: `${deal.clientName} - ${deal.mandateType} | Étude de cas | alecia`,
    description: `Étude de cas : ${deal.mandateType} de ${deal.clientName} (${deal.sector}). Découvrez comment alecia a accompagné cette opération.`,
  };
}

export async function generateStaticParams() {
  return mockDeals.map((deal) => ({
    slug: deal.slug,
  }));
}

export default async function OperationDetail({ params }: PageProps) {
  const { slug } = await params;
  const deal = enhancedDeals.find((d) => d.slug === slug);

  if (!deal) {
    notFound();
  }

  // Get related deals in same sector
  const relatedDeals = enhancedDeals
    .filter((d) => d.sector === deal.sector && d.id !== deal.id)
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-[var(--accent)] text-[var(--foreground-muted)]">
            <Link href="/operations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux opérations
            </Link>
          </Button>

          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <RoleBadge roleType={deal.roleType as "Conseil vendeur" | "Conseil acquéreur" | "Conseil levée"} />
                <span className="text-[var(--foreground-muted)]">•</span>
                <span className="text-[var(--foreground-muted)]">{deal.year}</span>
                {deal.isPriorExperience && (
                  <>
                    <span className="text-[var(--foreground-muted)]">•</span>
                    <Badge variant="outline" className="bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border-[var(--border)]">
                      Expérience antérieure *
                    </Badge>
                  </>
                )}
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
                {deal.clientName}
              </h1>
              {deal.acquirerName && (
                <p className="text-xl text-[var(--foreground-muted)]">
                  → {deal.acquirerName}
                </p>
              )}
            </div>

            {/* Logos Section */}
            <div className="flex items-center gap-6 py-6">
              {/* Client Logo */}
              <div className="w-24 h-24 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                {deal.clientLogo ? (
                  <Image
                    src={deal.clientLogo}
                    alt={deal.clientName}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-3xl font-bold text-[var(--foreground-muted)]">
                    {deal.clientName.charAt(0)}
                  </span>
                )}
              </div>

              {deal.acquirerName && (
                <>
                  <div className="text-3xl text-[var(--foreground-faint)]">→</div>
                  {/* Acquirer Logo */}
                  <div className="w-24 h-24 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                    {deal.acquirerLogo ? (
                      <Image
                        src={deal.acquirerLogo}
                        alt={deal.acquirerName}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-[var(--foreground-muted)]">
                        {deal.acquirerName.charAt(0)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-1">
                  <Building2 className="w-4 h-4" />
                  Secteur
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.sector}</p>
              </div>
              <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  Région
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.region}</p>
              </div>
              <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Durée
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.keyMetrics?.duration || "N/A"}</p>
              </div>
              {deal.keyMetrics?.approachedBuyers && (
                <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Acquéreurs approchés
                  </div>
                  <p className="font-medium text-[var(--foreground)]">{deal.keyMetrics.approachedBuyers}+</p>
                </div>
              )}
            </div>

            {/* Case Study Content */}
            <div className="space-y-8 pt-4">
              {/* Context */}
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                  Contexte de l&apos;opération
                </h2>
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                  {deal.context}
                </p>
              </section>

              {/* Intervention */}
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                  Notre intervention
                </h2>
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                  {deal.intervention}
                </p>
              </section>

              {/* Result */}
              <section>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                  Résultats obtenus
                </h2>
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                  {deal.result}
                </p>
              </section>

              {/* Testimonial */}
              {deal.testimonialText && (
                <section className="p-6 bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-xl border border-[var(--accent)]/20">
                  <Quote className="w-8 h-8 text-[var(--accent)] mb-4" />
                  <blockquote className="text-lg text-[var(--foreground)] italic mb-4">
                    &ldquo;{deal.testimonialText}&rdquo;
                  </blockquote>
                  <p className="text-[var(--foreground-muted)] font-medium">
                    — {deal.testimonialAuthor}
                  </p>
                </section>
              )}
            </div>

            {/* Related Deals */}
            {relatedDeals.length > 0 && (
              <section className="pt-8 border-t border-[var(--border)]">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-6 text-[var(--foreground)]">
                  Autres opérations dans ce secteur
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedDeals.map((relatedDeal) => (
                    <Link 
                      key={relatedDeal.id}
                      href={`/operations/${relatedDeal.slug}`}
                      className="p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                            {relatedDeal.clientName}
                          </p>
                          <p className="text-sm text-[var(--foreground-muted)]">
                            {relatedDeal.mandateType} • {relatedDeal.year}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="pt-8">
              <Card className="bg-[var(--background-secondary)] border-[var(--border)]">
                <CardContent className="p-6 text-center">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-2 text-[var(--foreground)]">
                    Vous avez un projet similaire ?
                  </h3>
                  <p className="text-[var(--foreground-muted)] mb-4">
                    Discutons de votre situation lors d&apos;un premier échange confidentiel.
                  </p>
                  <Button asChild className="btn-gold">
                    <Link href="/contact">
                      Nous contacter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
