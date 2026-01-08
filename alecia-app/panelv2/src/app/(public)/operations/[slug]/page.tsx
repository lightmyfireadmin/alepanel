import { notFound } from "next/navigation";
import Link from "next/link";


import { RoleBadge, DealDetailLogo } from "@/components/features";
import { getTransactionBySlug, getTransactions } from "@/lib/actions/convex-marketing";
import { ArrowLeft, Building2, MapPin, Clock, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const deal = await getTransactionBySlug(slug);
  
  if (!deal) return { title: "Opération non trouvée" };

  return {
    title: `${deal.clientName} - ${deal.mandateType} | Étude de cas | alecia`,
    description: `Étude de cas : ${deal.mandateType} de ${deal.clientName} (${deal.sector}). Découvrez comment alecia a accompagné cette opération.`,
  };
}

export default async function OperationDetail({ params }: PageProps) {
  const { slug } = await params;
  const deal = await getTransactionBySlug(slug);

  if (!deal) {
    notFound();
  }

  // Get related deals in same sector
  const allDeals = await getTransactions({ sector: deal.sector, limit: 5 });
  const relatedDeals = allDeals
    .filter((d) => d.slug !== deal.slug)
    .slice(0, 2);

  // Map role type for RoleBadge
  const roleType = deal.mandateType === "Cession" 
    ? "Conseil vendeur" 
    : deal.mandateType === "Acquisition" 
      ? "Conseil acquéreur" 
      : "Conseil levée";

  return (
    <>
      
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
                <RoleBadge roleType={roleType as "Conseil vendeur" | "Conseil acquéreur" | "Conseil levée"} />
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
              <DealDetailLogo
                name={deal.clientName}
                logoUrl={deal.clientLogo}
                size={64}
                className="w-24 h-24"
              />

              {deal.acquirerName && (
                <>
                  <div className="text-3xl text-[var(--foreground-faint)]">→</div>
                  <DealDetailLogo
                    name={deal.acquirerName}
                    logoUrl={deal.acquirerLogo}
                    size={64}
                    className="w-24 h-24"
                  />
                </>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <p className="font-medium text-[var(--foreground)]">{deal.region || "France"}</p>
              </div>
              <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Type
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.mandateType}</p>
              </div>
            </div>

            {/* Case Study Content */}
            <div className="space-y-8 pt-4">
              {/* Context */}
              {deal.context && (
                <section>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                    Contexte de l&apos;opération
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                    {deal.context}
                  </p>
                </section>
              )}

              {/* Intervention */}
              {deal.intervention && (
                <section>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                    Notre intervention
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                    {deal.intervention}
                  </p>
                </section>
              )}

              {/* Result */}
              {deal.result && (
                <section>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                    Résultats obtenus
                  </h2>
                  <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                    {deal.result}
                  </p>
                </section>
              )}

              {/* Testimonial */}
              {deal.testimonialText && (
                <section className="p-6 bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-xl border border-[var(--accent)]/20">
                  <Quote className="w-8 h-8 text-[var(--accent)] mb-4" />
                  <blockquote className="text-lg text-[var(--foreground)] italic mb-4">
                    &ldquo;{deal.testimonialText}&rdquo;
                  </blockquote>
                  {deal.testimonialAuthor && (
                    <p className="text-[var(--foreground-muted)] font-medium">
                      — {deal.testimonialAuthor}
                    </p>
                  )}
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
                      key={relatedDeal._id}
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
      
    </>
  );
}
